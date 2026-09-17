import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-csrf-token",
};

import { requireBusinessOwner, authErrorResponse } from "../_shared/auth-guard.ts";
import { getBusinessContext, contextAsPromptFragment, appendDecision, logLearning } from "../_shared/kayla-coordination.ts";
import { runDeepJsonReport, reviewJsonReport } from "../_shared/kayla-deep.ts";

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

    const sharedCtx = await getBusinessContext(supabase, business_id);
    const ctxFragment = contextAsPromptFragment(sharedCtx);

    const prompt = `You are an investment readiness advisor. Assess this business for investor appeal:
${ctxFragment}

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

    const assessmentSchema = {
      type: "object",
      additionalProperties: false,
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
        ai_assessment: { type: "string" },
      },
      required: [
        "overall_score", "financial_health_score", "market_position_score",
        "team_readiness_score", "documentation_score", "growth_trajectory_score",
        "strengths", "weaknesses", "recommendations", "investor_type_fit", "ai_assessment",
      ],
    };

    // Premium reasoning model with automatic fallback, then a second pair of
    // eyes that re-checks every claim against the source data.
    const deep = await runDeepJsonReport<any>({
      prompt,
      schema: assessmentSchema,
      schemaName: "investment_assessment",
      lovableApiKey: LOVABLE_API_KEY,
      effort: "high",
      label: "investment-readiness",
    });

    if (!deep.result) throw new Error("No assessment generated");

    const reviewed = await reviewJsonReport<any>({
      sourcePrompt: prompt,
      draft: deep.result,
      schema: assessmentSchema,
      schemaName: "investment_assessment",
      lovableApiKey: LOVABLE_API_KEY,
      label: "investment-readiness-review",
    });

    const result: any = reviewed.result;
    console.log(`[investment-readiness] model=${deep.modelUsed} corrections=${reviewed.corrections.length}`);

    // Save to database
    await supabase.from("kayla_investment_readiness").insert({
      business_id,
      ...result,
      assessed_at: new Date().toISOString(),
    });

    await appendDecision(
      supabase,
      business_id,
      "Investment Readiness",
      `Overall investor score ${result.overall_score}/100; best fit: ${(result.investor_type_fit || []).slice(0, 2).join(", ") || "n/a"}`,
      { investor_readiness_score: result.overall_score },
    );
    await logLearning(
      supabase,
      business_id,
      "kayla-investment-readiness",
      `Investor readiness ${result.overall_score}/100. Top weakness: ${(result.weaknesses || [])[0] || "none flagged"}.`,
      "investor_assessment",
      0.75,
    );


    try {
      await supabase.from("ai_agent_feedback").insert({
        agent_name: "kayla-investment-readiness",
        business_id,
        decision_type: "investment_readiness_assessment",
        decision_payload: result,
        outcome: "auto",
      });
    } catch {}

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
