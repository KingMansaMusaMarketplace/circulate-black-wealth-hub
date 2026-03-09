import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    if (body.secret !== "update-placeholders-2026") {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get the published URL base
    const baseUrl = "https://circulate-black-wealth-hub.lovable.app";
    const logoUrl = `${baseUrl}/images/placeholders/restaurant-logo.png`;
    const bannerUrl = `${baseUrl}/images/placeholders/restaurant-banner.jpg`;

    const { data, error } = await supabase
      .from("businesses")
      .update({
        logo_url: logoUrl,
        banner_url: bannerUrl,
        updated_at: new Date().toISOString()
      })
      .or("logo_url.is.null,logo_url.eq.")
      .or("banner_url.is.null,banner_url.eq.")
      .eq("category", "Restaurant")
      .select("id, name");

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      updated: data?.length || 0,
      logoUrl,
      bannerUrl 
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
