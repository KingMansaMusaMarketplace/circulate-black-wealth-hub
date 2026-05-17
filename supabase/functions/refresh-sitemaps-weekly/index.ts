// Weekly sitemap refresh — runs via pg_cron every Monday 6am Chicago time.
// 1. Warms the live sitemap edge functions (confirms healthy + caches fresh data)
// 2. Pings IndexNow (Bing/Yandex/DuckDuckGo/Naver) with sitemap URLs
// 3. Logs the run to sitemap_refresh_log for admin visibility.
// Google: no ping API anymore — Google auto-recrawls submitted sitemaps every few days.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const SITE_URL = "https://1325.ai";
const INDEXNOW_KEY = "c583cef06a2040428e892d8d8f766627";
const SITEMAPS = [
  "businesses-sitemap.xml",
  "landing-sitemap.xml",
  "images-sitemap.xml",
  "sitemap.xml",
];

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-csrf-token",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const startedAt = Date.now();
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const result: Record<string, unknown> = {
    sitemaps_warmed: {} as Record<string, number>,
    indexnow_status: null as number | null,
    indexnow_response: "",
    status: "ok",
    error: null as string | null,
  };

  try {
    // 1. Warm each sitemap URL
    for (const path of SITEMAPS) {
      try {
        const res = await fetch(`${SITE_URL}/${path}`, { method: "GET" });
        (result.sitemaps_warmed as Record<string, number>)[path] = res.status;
      } catch (e) {
        (result.sitemaps_warmed as Record<string, number>)[path] = -1;
      }
    }

    // 2. Ping IndexNow with all sitemap URLs
    const indexNowBody = {
      host: "1325.ai",
      key: INDEXNOW_KEY,
      keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
      urlList: SITEMAPS.map((p) => `${SITE_URL}/${p}`),
    };

    const inRes = await fetch("https://api.indexnow.org/IndexNow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(indexNowBody),
    });
    result.indexnow_status = inRes.status;
    result.indexnow_response = (await inRes.text()).slice(0, 500);

    // IndexNow returns 200 or 202 on success
    if (inRes.status !== 200 && inRes.status !== 202) {
      result.status = "partial";
    }
  } catch (e) {
    result.status = "error";
    result.error = e instanceof Error ? e.message : String(e);
  }

  const duration_ms = Date.now() - startedAt;

  await supabase.from("sitemap_refresh_log").insert({
    status: result.status,
    sitemaps_warmed: result.sitemaps_warmed,
    indexnow_status: result.indexnow_status,
    indexnow_response: result.indexnow_response,
    error: result.error,
    duration_ms,
  });

  return new Response(
    JSON.stringify({ ...result, duration_ms }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 },
  );
});
