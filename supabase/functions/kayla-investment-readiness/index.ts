import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

import { requireBusinessOwner, authErrorResponse } from "../_shared/auth-guard.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey) as any;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    const { business_id } = await req.json();
    if (!business_id) throw new Error("business_id required");

    // AUTH: Require business owner or admin
    const authResult = await requireBusinessOwner(req, business_id, corsHeaders);
    if (!authResult.authenticated) {
      return authErrorResponse(authResult, corsHeaders);
    }


    const { data: business } = await supabase
      .from("businesses")
      .select("*")
      .eq("id", business_id)
      .single();

    // Get financial data
    const { data: expenses } = await supabase
      .from("business_expenses")
      .select("amount")
      .eq("business_id", business_id);

    const { data: invoices } = await supabase
      .from("business_invoices")
      .select("total_amount, status")
      .eq("business_id", business_id);

    const { data: reviews } = await supabase
      .from("reviews")
      .select("rating")
      .eq("business_id", business_id);

    const totalRevenue = invoices?.filter((i: any) => i.status === "paid").reduce((s: number, i: any) => s + (i.total_amount || 0), 0) || 0;
    const totalExpenses = expenses?.reduce((s: number, e: any) => s + (e.amount || 0), 0) || 0;
    const avgRating = reviews?.length ? reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length : 0;

    if (!LOVABLE_API_KEY) throw new Error("AI not configured");

    const prompt = `You are an investment readiness advisor. Assess this business for investor appeal:

Business: ${business?.business_name}
Category: ${business?.category}
Location: ${business?.city}, ${business?.state}
Revenue: $${totalRevenue}
Expenses: $${totalExpenses}
Reviews: ${reviews?.length || 0} reviews, avg ${avgRating.toFixed(1)} stars
Has website: ${!!business?.website}
Has description: ${!!business?.description}
Verified: ${business?.is_verified}

Score each dimension 0-100 and provide strengths, weaknesses, and recommendations.`;

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "user", content: prompt }],
        tools: [{
          type: "function",
          function: {
            name: "investment_assessment",
            description: "Return investment readiness assessment",
            parameters: {
              type: "object",
              properties: {
                overall_score: { type: "integer" },
                financial_health_score: { type: "integer" },
                market_position_score: { type: "integer" },
                team_readiness_score: { type: "integer" },
                documentation_score: { type: "integer" },
                growth_trajectory_score: { type: "integer" },
                strengths: { type: "array", items: { type: "string" } },
                weaknesses: { type: "array", items: { type: "string" } },
                recommendations: { type: "array", items: { type: "string" } },
                investor_type_fit: { type: "array", items: { type: "string" } },
                ai_assessment: { type: "string" }
              },
              required: ["overall_score", "financial_health_score", "market_position_score", "team_readiness_score", "documentation_score", "growth_trajectory_score", "strengths", "weaknesses", "recommendations", "investor_type_fit", "ai_assessment"]
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "investment_assessment" } }
      }),
    });

    if (!aiResp.ok) throw new Error("AI assessment failed");

    const aiData = await aiResp.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No assessment generated");

    const result = JSON.parse(toolCall.function.arguments);

    // Save to database
    await supabase.from("kayla_investment_readiness").insert({
      business_id,
      ...result,
      assessed_at: new Date().toISOString(),
    });

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
