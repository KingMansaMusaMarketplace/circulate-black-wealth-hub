// Public widget search endpoint — powers the embeddable "Powered by 1325.AI" search
// on partner directory sites. No user auth required (widget is embedded on 3rd-party sites),
// but requires a valid partner embed_token issued from directory_partners.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-csrf-token",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const token: string | undefined = body.token;
    const query: string = (body.query || "").toString().trim().slice(0, 200);
    const referrer: string | undefined = body.referrer;

    if (!token) {
      return new Response(JSON.stringify({ error: "Missing partner token" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Validate partner + token + enabled
    const { data: partner, error: partnerErr } = await supabase
      .from("directory_partners")
      .select("id, directory_name, referral_code, embed_enabled, status")
      .eq("embed_token", token)
      .maybeSingle();

    if (partnerErr || !partner) {
      return new Response(JSON.stringify({ error: "Invalid partner token" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!partner.embed_enabled || partner.status !== "active") {
      return new Response(JSON.stringify({ error: "Widget disabled for this partner" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Log embed view/search event (best-effort, don't block)
    supabase
      .from("partner_embed_views")
      .insert({
        partner_id: partner.id,
        embed_token: token,
        referrer_url: referrer || req.headers.get("referer") || null,
      })
      .then(() => {});

    // Run search
    let results: any[] = [];
    if (query.length > 0) {
      const { data, error } = await supabase.rpc("search_public_businesses", {
        p_search_term: query,
        p_limit: 8,
        p_offset: 0,
      });
      if (!error && Array.isArray(data)) {
        results = data.map((b: any) => ({
          id: b.id,
          name: b.business_name,
          category: b.category,
          city: b.city,
          state: b.state,
          logo_url: b.logo_url,
          rating: b.average_rating,
          review_count: b.review_count,
          is_verified: b.is_verified,
          url: `https://1325.ai/business/${b.id}?ref=${partner.referral_code || "partner"}`,
        }));
      }
    }

    return new Response(
      JSON.stringify({
        partner_name: partner.directory_name,
        referral_code: partner.referral_code,
        results,
        more_url: `https://1325.ai/directory?q=${encodeURIComponent(query)}&ref=${partner.referral_code || "partner"}`,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("widget-search error", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
