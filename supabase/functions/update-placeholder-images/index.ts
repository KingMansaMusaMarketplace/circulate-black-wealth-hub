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

    // First get the IDs of businesses that need updating
    const { data: toUpdate, error: fetchError } = await supabase
      .from("businesses")
      .select("id")
      .eq("category", "Restaurant")
      .or("logo_url.is.null,logo_url.eq.,banner_url.is.null,banner_url.eq.");

    if (fetchError) {
      return new Response(JSON.stringify({ error: fetchError.message }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const ids = toUpdate?.map(b => b.id) || [];
    
    if (ids.length === 0) {
      return new Response(JSON.stringify({ success: true, updated: 0, message: "No businesses need updating" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const { data, error } = await supabase
      .from("businesses")
      .update({
        logo_url: logoUrl,
        banner_url: bannerUrl,
        updated_at: new Date().toISOString()
      })
      .in("id", ids)
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
