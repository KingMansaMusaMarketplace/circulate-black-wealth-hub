import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { customer_id, business_id, base_points, description } = await req.json();

    // Validate inputs
    if (!customer_id || !business_id || !base_points) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if business is a coalition member
    const { data: member, error: memberError } = await supabase
      .from("coalition_members")
      .select("id, is_active")
      .eq("business_id", business_id)
      .single();

    if (memberError || !member?.is_active) {
      return new Response(
        JSON.stringify({ error: "Business is not an active coalition member" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Use the database function to award points
    const { data, error } = await supabase.rpc("award_coalition_points", {
      p_customer_id: customer_id,
      p_business_id: business_id,
      p_base_points: base_points,
      p_description: description || "Points earned",
    });

    if (error) {
      console.error("Error awarding coalition points:", error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Coalition points awarded:", data);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Coalition earn points error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
