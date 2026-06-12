import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version, x-csrf-token",
};

const GATEWAY = "https://connector-gateway.lovable.dev/semrush";

const ALLOWED_DOMAINS = new Set(["1325.ai", "mansamusamarketplace.com"]);

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

type SemrushResponse = {
  data?: { columnNames?: string[]; rows?: unknown[][] };
  status?: number;
  error?: string;
};

async function semrushGet(
  path: string,
  params: Record<string, string>,
  apiKey: string,
  lovableKey: string,
): Promise<SemrushResponse> {
  const url = new URL(`${GATEWAY}${path}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": apiKey,
    },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    return { error: `Semrush ${path} HTTP ${res.status}: ${JSON.stringify(body)}` };
  }
  return body as SemrushResponse;
}

function toRows(r: SemrushResponse): Record<string, string>[] {
  const cols = r.data?.columnNames ?? [];
  const rows = r.data?.rows ?? [];
  return rows.map((row) => {
    const obj: Record<string, string> = {};
    cols.forEach((c, i) => {
      obj[c] = String((row as unknown[])[i] ?? "");
    });
    return obj;
  });
}

function num(v: string | undefined): number | null {
  if (v === undefined || v === "" || v === null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function dateOrNull(v: string | undefined): string | null {
  if (!v) return null;
  // Semrush sometimes returns YYYY-MM-DD or unix timestamps
  if (/^\d{4}-\d{2}-\d{2}/.test(v)) return v.slice(0, 10);
  const n = Number(v);
  if (Number.isFinite(n) && n > 0) {
    const d = new Date(n * 1000);
    if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  }
  return null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SEMRUSH_API_KEY = Deno.env.get("SEMRUSH_API_KEY");
    if (!LOVABLE_API_KEY) return json({ error: "LOVABLE_API_KEY missing" }, 500);
    if (!SEMRUSH_API_KEY) return json({ error: "SEMRUSH_API_KEY missing" }, 500);

    const body = await req.json().catch(() => ({}));
    const domain: string = String(body.domain ?? "").toLowerCase().trim();
    const cronSecret: string | undefined = body.cron_secret;

    if (!ALLOWED_DOMAINS.has(domain)) {
      return json({ error: "Invalid domain" }, 400);
    }

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Auth: either valid admin user, or matching cron secret
    let createdBy: string | null = null;
    const expectedCron = Deno.env.get("BACKLINKS_CRON_SECRET");
    if (cronSecret && expectedCron && cronSecret === expectedCron) {
      // cron path
    } else {
      const token = (req.headers.get("Authorization") ?? "").replace("Bearer ", "").trim();
      if (!token) return json({ error: "Unauthorized" }, 401);
      const userClient = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_ANON_KEY")!,
        { global: { headers: { Authorization: `Bearer ${token}` } } },
      );
      const { data: userData } = await userClient.auth.getUser();
      if (!userData?.user) return json({ error: "Unauthorized" }, 401);
      const { data: isAdmin } = await admin.rpc("has_role", {
        _user_id: userData.user.id,
        _role: "admin",
      });
      if (!isAdmin) return json({ error: "Admin access required" }, 403);
      createdBy = userData.user.id;
    }

    // 1. Overview: total backlinks, referring domains, follow/nofollow, text/image
    const overview = await semrushGet(
      "/backlinks/backlinks_overview",
      {
        target: domain,
        target_type: "root_domain",
        export_columns: "ascore,total,domains_num,urls_num,ips_num,follows_num,nofollows_num,texts_num,images_num,forms_num,frames_num",
      },
      SEMRUSH_API_KEY,
      LOVABLE_API_KEY,
    );
    if (overview.error) return json({ error: overview.error }, 502);
    const ov = toRows(overview)[0] ?? {};

    // 2. Referring domains (top 100)
    const refDomains = await semrushGet(
      "/backlinks/backlinks_refdomains",
      {
        target: domain,
        target_type: "root_domain",
        export_columns: "domain_ascore,domain,backlinks_num,ip_addresses_num,country,first_seen,last_seen",
        display_limit: "100",
      },
      SEMRUSH_API_KEY,
      LOVABLE_API_KEY,
    );
    if (refDomains.error) return json({ error: refDomains.error }, 502);

    // 3. Anchor texts (top 50)
    const anchors = await semrushGet(
      "/backlinks/backlinks_anchors",
      {
        target: domain,
        target_type: "root_domain",
        export_columns: "anchor,backlinks_num,domains_num,first_seen,last_seen",
        display_limit: "50",
      },
      SEMRUSH_API_KEY,
      LOVABLE_API_KEY,
    );
    if (anchors.error) return json({ error: anchors.error }, 502);

    // Insert snapshot
    const { data: snap, error: snapErr } = await admin
      .from("backlink_snapshots")
      .insert({
        domain,
        authority_score: num(ov.ascore),
        total_backlinks: num(ov.total),
        referring_domains: num(ov.domains_num),
        referring_ips: num(ov.ips_num),
        follow_backlinks: num(ov.follows_num),
        nofollow_backlinks: num(ov.nofollows_num),
        text_backlinks: num(ov.texts_num),
        image_backlinks: num(ov.images_num),
        source: "semrush",
        raw: ov,
        created_by: createdBy,
      })
      .select("id")
      .single();
    if (snapErr) return json({ error: snapErr.message }, 500);
    const snapshotId = snap.id;

    const refRows = toRows(refDomains).map((r, i) => ({
      snapshot_id: snapshotId,
      domain,
      referring_domain: r.domain ?? "",
      ascore: num(r.domain_ascore),
      backlinks_num: num(r.backlinks_num),
      ip_addresses_num: num(r.ip_addresses_num),
      country: r.country || null,
      first_seen: dateOrNull(r.first_seen),
      last_seen: dateOrNull(r.last_seen),
      rank: i + 1,
    })).filter((r) => r.referring_domain);

    if (refRows.length > 0) {
      const { error } = await admin.from("backlink_referring_domains").insert(refRows);
      if (error) console.error("ref domains insert:", error.message);
    }

    const anchorRows = toRows(anchors).map((r) => ({
      snapshot_id: snapshotId,
      domain,
      anchor: r.anchor ?? "",
      backlinks_num: num(r.backlinks_num),
      referring_domains_num: num(r.domains_num),
      first_seen: dateOrNull(r.first_seen),
      last_seen: dateOrNull(r.last_seen),
    })).filter((r) => r.anchor);

    if (anchorRows.length > 0) {
      const { error } = await admin.from("backlink_anchors").insert(anchorRows);
      if (error) console.error("anchors insert:", error.message);
    }

    return json({
      ok: true,
      snapshot_id: snapshotId,
      counts: {
        referring_domains: refRows.length,
        anchors: anchorRows.length,
      },
    });
  } catch (e) {
    console.error("refresh-backlinks error:", e);
    return json({ error: e instanceof Error ? e.message : String(e) }, 500);
  }
});
