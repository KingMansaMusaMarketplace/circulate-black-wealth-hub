import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version, x-csrf-token, x-cron-secret",
};

// Businesses scoring at or above this are treated as confirmed Black-owned.
const CONFIRM_THRESHOLD = 0.7;
// Default number of live businesses re-checked per run.
const DEFAULT_BATCH = 25;
const MAX_BATCH = 100;

type Verdict = {
  black_owned_confidence: number;
  black_owned_evidence: string;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const perplexityKey = Deno.env.get("PERPLEXITY_API_KEY");
  const cronSecret = Deno.env.get("CRON_SECRET");

  const supabase = createClient(supabaseUrl, serviceKey);

  try {
    // ---- Authorization: admin JWT, or the scheduled-job secret ----
    const providedCronSecret = req.headers.get("x-cron-secret");
    const isCron = !!cronSecret && providedCronSecret === cronSecret;

    if (!isCron) {
      const authHeader = req.headers.get("Authorization") || "";
      const token = authHeader.replace("Bearer ", "").trim();
      console.log(`[verify-ownership] auth header present: ${!!authHeader}, token length: ${token.length}`);
      if (!token) {
        return json({ error: "Unauthorized", reason: "no_token" }, 401);
      }
      const { data: userData, error: userErr } = await supabase.auth.getUser(token);
      if (userErr || !userData?.user) {
        console.log(`[verify-ownership] getUser failed: ${userErr?.message}`);
        return json({ error: "Unauthorized", reason: "invalid_token" }, 401);
      }

      const { data: isAdmin } = await supabase.rpc("has_role", {
        _user_id: userData.user.id,
        _role: "admin",
      });
      if (!isAdmin) {
        return json({ error: "Admin access required" }, 403);
      }
    }

    if (!perplexityKey) {
      return json({ error: "PERPLEXITY_API_KEY is not configured" }, 500);
    }

    let body: any = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }
    const limit = Math.min(Math.max(Number(body.limit) || DEFAULT_BATCH, 1), MAX_BATCH);
    // recheck=true re-runs businesses that were already reviewed (oldest first).
    const recheck = body.recheck === true;

    // ---- Pick the next batch of live businesses to re-verify ----
    let query = supabase
      .from("businesses")
      .select("id,name,business_name,city,state,website,address,category")
      .eq("listing_status", "live")
      .order("ownership_reviewed_at", { ascending: true, nullsFirst: true })
      .limit(limit);

    if (!recheck) {
      query = query.is("ownership_reviewed_at", null);
    }

    const { data: businesses, error: fetchErr } = await query;
    if (fetchErr) throw fetchErr;

    if (!businesses || businesses.length === 0) {
      return json({
        success: true,
        checked: 0,
        confirmed: 0,
        flagged: 0,
        message: "No live businesses awaiting ownership verification.",
      });
    }

    let confirmed = 0;
    let flagged = 0;
    let errors = 0;
    const flaggedNames: string[] = [];

    // Verify in small parallel waves so we don't hammer the Perplexity API.
    const WAVE = 5;
    for (let i = 0; i < businesses.length; i += WAVE) {
      const wave = businesses.slice(i, i + WAVE);
      await Promise.all(
        wave.map(async (biz: any) => {
          const displayName = biz.business_name || biz.name;
          try {
            const verdict = await verifyOwnership(perplexityKey, {
              name: displayName,
              city: biz.city,
              state: biz.state,
              website: biz.website,
              address: biz.address,
              category: biz.category,
            });

            const evidence = (verdict.black_owned_evidence || "").trim();
            const score = Number.isFinite(verdict.black_owned_confidence)
              ? Math.max(0, Math.min(1, verdict.black_owned_confidence))
              : 0;
            const isConfirmed = score >= CONFIRM_THRESHOLD && evidence.length >= 10;

            const { error: updErr } = await supabase
              .from("businesses")
              .update({
                black_owned_confidence: score,
                black_owned_evidence: evidence || null,
                ownership_reviewed_at: new Date().toISOString(),
                ownership_flagged: !isConfirmed,
              })
              .eq("id", biz.id);
            if (updErr) throw updErr;

            if (isConfirmed) {
              confirmed++;
            } else {
              flagged++;
              flaggedNames.push(`${displayName} (${biz.city || "?"}, ${biz.state || "?"})`);
            }
          } catch (e) {
            errors++;
            console.error(`[verify-ownership] ${displayName}:`, e instanceof Error ? e.message : e);
          }
        }),
      );
    }

    const summary =
      `Ownership re-verification: ${businesses.length} live businesses checked. ` +
      `Confirmed Black-owned: ${confirmed}. Flagged for human review: ${flagged}. Errors: ${errors}.`;

    console.log(`[verify-ownership] ${summary}`);

    // Log the run so admins can see history alongside other Kayla reports.
    await supabase.from("kayla_agent_reports").insert({
      report_type: "verify_ownership",
      status: "completed",
      summary,
      details: {
        checked: businesses.length,
        confirmed,
        flagged,
        errors,
        flagged_names: flaggedNames.slice(0, 50),
        confirm_threshold: CONFIRM_THRESHOLD,
        recheck,
      },
    } as any);

    return json({
      success: true,
      checked: businesses.length,
      confirmed,
      flagged,
      errors,
      flagged_names: flaggedNames,
      summary,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("[verify-ownership] fatal:", message);
    return json({ error: message }, 500);
  }
});

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function verifyOwnership(
  apiKey: string,
  biz: {
    name: string;
    city: string | null;
    state: string | null;
    website: string | null;
    address: string | null;
    category: string | null;
  },
): Promise<Verdict> {
  const locator = [biz.address, biz.city, biz.state].filter(Boolean).join(", ");

  const res = await fetch("https://api.perplexity.ai/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "sonar",
      messages: [
        {
          role: "system",
          content:
            "You verify whether a specific named business is Black-owned. You judge ONLY on evidence you can actually find and cite: " +
            "a Black-owned business directory listing, an owner bio or About page identifying the owner as Black, a minority business (MBE/NMSDC) certification, " +
            "press coverage naming it as Black-owned, or the business describing itself as Black-owned. " +
            "NEVER infer ownership from the owner's name, the neighborhood, the ZIP code, the business type, or the clientele. " +
            "If you find no citable evidence, say so honestly with a low score and an empty evidence string. " +
            "Being unsure is the correct answer when the evidence is not there.",
        },
        {
          role: "user",
          content:
            `Is this business Black-owned?\n\n` +
            `Name: ${biz.name}\n` +
            `Location: ${locator || "unknown"}\n` +
            `Website: ${biz.website || "unknown"}\n` +
            `Category: ${biz.category || "unknown"}\n\n` +
            `Return black_owned_confidence (0 to 1) and black_owned_evidence (one short sentence naming the source). ` +
            `If you cannot cite a real source, return a confidence below 0.5 and an empty evidence string.`,
        },
      ],
      temperature: 0.1,
      max_tokens: 400,
      response_format: {
        type: "json_schema",
        json_schema: {
          schema: {
            type: "object",
            properties: {
              black_owned_confidence: {
                type: "number",
                description: "0-1 confidence this business is Black-owned, based only on cited evidence",
              },
              black_owned_evidence: {
                type: "string",
                description: "Short cited source confirming Black ownership; empty string if none found",
              },
            },
            required: ["black_owned_confidence", "black_owned_evidence"],
            additionalProperties: false,
          },
        },
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`Perplexity ${res.status}: ${(await res.text()).slice(0, 200)}`);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content ?? "{}";
  const parsed = typeof content === "string" ? JSON.parse(content) : content;

  return {
    black_owned_confidence: Number(parsed.black_owned_confidence ?? 0),
    black_owned_evidence: String(parsed.black_owned_evidence ?? ""),
  };
}
