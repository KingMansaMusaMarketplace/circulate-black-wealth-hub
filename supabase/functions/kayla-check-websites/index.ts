import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version, x-csrf-token, x-cron-secret",
};

const DEFAULT_BATCH = 50;
const MAX_BATCH = 200;
const REQUEST_TIMEOUT_MS = 12000;
// A listing is only called "dead" after this many failed checks (on separate runs).
const DEAD_AFTER_FAILURES = 2;

type CheckResult = {
  status: "live" | "dead" | "blocked";
  code: number | null;
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function normalizeUrl(raw: string): string | null {
  const trimmed = (raw || "").trim();
  if (!trimmed) return null;
  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const u = new URL(withScheme);
    // Block internal/loopback targets (SSRF guard).
    const host = u.hostname.toLowerCase();
    if (
      host === "localhost" ||
      host.endsWith(".local") ||
      host.endsWith(".internal") ||
      /^(127\.|10\.|192\.168\.|169\.254\.|0\.)/.test(host) ||
      /^172\.(1[6-9]|2\d|3[01])\./.test(host) ||
      host === "[::1]" ||
      !host.includes(".")
    ) {
      return null;
    }
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    return u.toString();
  } catch {
    return null;
  }
}

async function checkOnce(url: string, method: "HEAD" | "GET"): Promise<Response | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, {
      method,
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; 1325AI-LinkCheck/1.0; +https://1325.ai)",
        Accept: "text/html,application/xhtml+xml,*/*",
      },
    });
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function checkWebsite(rawUrl: string): Promise<CheckResult> {
  const url = normalizeUrl(rawUrl);
  if (!url) return { status: "dead", code: null };

  // Try HEAD first (cheap), fall back to GET — many sites reject HEAD.
  let res = await checkOnce(url, "HEAD");
  if (!res || res.status === 405 || res.status === 501 || res.status >= 400) {
    const getRes = await checkOnce(url, "GET");
    if (getRes) res = getRes;
  }

  if (!res) {
    // DNS failure / connection refused / timeout => "This site can't be reached".
    return { status: "dead", code: null };
  }

  const code = res.status;
  if (code >= 200 && code < 400) return { status: "live", code };
  // Bot-protection / rate-limit responses are not proof the site is gone.
  if (code === 401 || code === 403 || code === 405 || code === 429) {
    return { status: "blocked", code };
  }
  if (code >= 500) return { status: "blocked", code };
  // 404, 410, 400 etc. — page really isn't there.
  return { status: "dead", code };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const cronSecret = Deno.env.get("CRON_SECRET");
  const supabase = createClient(supabaseUrl, serviceKey);

  try {
    // ---- Authorization: admin JWT, or the scheduled-job secret ----
    const isCron = !!cronSecret && req.headers.get("x-cron-secret") === cronSecret;
    if (!isCron) {
      const token = (req.headers.get("Authorization") || "").replace("Bearer ", "").trim();
      if (!token) return json({ error: "Unauthorized", reason: "no_token" }, 401);
      const { data: userData, error: userErr } = await supabase.auth.getUser(token);
      if (userErr || !userData?.user) {
        return json({ error: "Unauthorized", reason: "invalid_token" }, 401);
      }
      const { data: isAdmin } = await supabase.rpc("has_role", {
        _user_id: userData.user.id,
        _role: "admin",
      });
      if (!isAdmin) return json({ error: "Admin access required" }, 403);
    }

    let body: Record<string, unknown> = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }
    const limit = Math.min(
      Math.max(Number(body.limit) || DEFAULT_BATCH, 1),
      MAX_BATCH,
    );
    // Which listing states to check. Defaults to published listings, but the
    // review queue (draft / pending_review) can be checked before approval.
    const statuses = Array.isArray(body.statuses) && body.statuses.length > 0
      ? (body.statuses as string[]).filter((s) =>
        ["live", "draft", "pending_review", "approved", "rejected"].includes(s)
      )
      : ["live"];

    // Pick the listings least-recently checked (never-checked first).
    const { data: rows, error: fetchErr } = await supabase
      .from("businesses")
      .select("id, business_name, name, website, website_fail_count")
      .in("listing_status", statuses.length ? statuses : ["live"])
      .not("website", "is", null)
      .neq("website", "")
      .order("website_checked_at", { ascending: true, nullsFirst: true })
      .limit(limit);

    if (fetchErr) throw fetchErr;
    if (!rows || rows.length === 0) {
      return json({ checked: 0, live: 0, dead: 0, blocked: 0, message: "Nothing left to check." });
    }

    const now = new Date().toISOString();
    let liveCount = 0;
    let deadCount = 0;
    let blockedCount = 0;

    // Check in small parallel groups so one slow site doesn't stall the batch.
    const CONCURRENCY = 10;
    for (let i = 0; i < rows.length; i += CONCURRENCY) {
      const slice = rows.slice(i, i + CONCURRENCY);
      const results = await Promise.all(
        slice.map(async (r: any) => ({ row: r, result: await checkWebsite(r.website) })),
      );

      await Promise.all(
        results.map(async ({ row, result }) => {
          const prevFails = Number(row.website_fail_count) || 0;
          let failCount = prevFails;
          let status = result.status;

          if (result.status === "dead") {
            failCount = prevFails + 1;
            // Needs repeat failures before we call it truly dead.
            if (failCount < DEAD_AFTER_FAILURES) status = "blocked";
          } else if (result.status === "live") {
            failCount = 0;
          }

          if (status === "live") liveCount++;
          else if (status === "dead") deadCount++;
          else blockedCount++;

          await supabase
            .from("businesses")
            .update({
              website_status: status,
              website_status_code: result.code,
              website_fail_count: failCount,
              website_checked_at: now,
            })
            .eq("id", row.id);
        }),
      );
    }

    return json({
      checked: rows.length,
      live: liveCount,
      dead: deadCount,
      blocked: blockedCount,
    });
  } catch (e) {
    console.error("[check-websites] error", e);
    return json({ error: (e as Error).message || "Website check failed" }, 500);
  }
});
