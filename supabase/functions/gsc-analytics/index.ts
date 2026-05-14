import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version, x-csrf-token",
};

const GATEWAY = "https://connector-gateway.lovable.dev/google_search_console";
const ALLOWED_SITES = new Set([
  "https://1325.ai/",
  "https://mansamusamarketplace.com/",
  "sc-domain:1325.ai",
  "sc-domain:mansamusamarketplace.com",
]);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const GSC_KEY = Deno.env.get("GOOGLE_SEARCH_CONSOLE_API_KEY");
    if (!LOVABLE_API_KEY) return json({ error: "LOVABLE_API_KEY missing" }, 500);
    if (!GSC_KEY) return json({ error: "GOOGLE_SEARCH_CONSOLE_API_KEY missing" }, 500);

    const token = (req.headers.get("Authorization") ?? "").replace("Bearer ", "").trim();
    if (!token) return json({ error: "Unauthorized" }, 401);

    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: `Bearer ${token}` } } },
    );
    const { data: userData } = await userClient.auth.getUser();
    if (!userData?.user) return json({ error: "Unauthorized" }, 401);

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { data: isAdmin } = await admin.rpc("has_role", {
      _user_id: userData.user.id,
      _role: "admin",
    });
    if (!isAdmin) return json({ error: "Admin access required" }, 403);

    const body = await req.json().catch(() => ({}));
    const action: string = body.action ?? "search";
    const siteUrl: string = body.siteUrl;

    if (!siteUrl || !ALLOWED_SITES.has(siteUrl)) {
      return json({ error: "Invalid siteUrl" }, 400);
    }

    const gwHeaders = {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "X-Connection-Api-Key": GSC_KEY,
      "Content-Type": "application/json",
    };

    const encSite = encodeURIComponent(siteUrl);

    if (action === "sitemaps") {
      const r = await fetch(`${GATEWAY}/webmasters/v3/sites/${encSite}/sitemaps`, { headers: gwHeaders });
      const data = await r.json();
      if (!r.ok) return json({ error: `GSC sitemaps [${r.status}]`, details: data }, r.status);
      return json(data);
    }

    if (action === "sites") {
      const r = await fetch(`${GATEWAY}/webmasters/v3/sites`, { headers: gwHeaders });
      const data = await r.json();
      if (!r.ok) return json({ error: `GSC sites [${r.status}]`, details: data }, r.status);
      return json(data);
    }

    // Default: searchAnalytics query
    const startDate: string = body.startDate;
    const endDate: string = body.endDate;
    const dimensions: string[] = body.dimensions ?? ["query"];
    const rowLimit: number = Math.min(body.rowLimit ?? 25, 1000);
    if (!startDate || !endDate) return json({ error: "startDate and endDate required" }, 400);

    const r = await fetch(`${GATEWAY}/webmasters/v3/sites/${encSite}/searchAnalytics/query`, {
      method: "POST",
      headers: gwHeaders,
      body: JSON.stringify({ startDate, endDate, dimensions, rowLimit }),
    });
    const data = await r.json();
    if (!r.ok) return json({ error: `GSC query [${r.status}]`, details: data }, r.status);
    return json(data);
  } catch (e) {
    console.error("gsc-analytics error", e);
    return json({ error: e instanceof Error ? e.message : "Server error" }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
