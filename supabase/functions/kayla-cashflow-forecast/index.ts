import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-csrf-token",
};

import { requireBusinessOwner, authErrorResponse } from "../_shared/auth-guard.ts";
import { getBusinessContext, contextAsPromptFragment, appendDecision, logLearning, buildReasoning } from "../_shared/kayla-coordination.ts";
import { runDeepJsonReport, reviewJsonReport } from "../_shared/kayla-deep.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { businessId } = await req.json();
    if (!businessId) throw new Error("businessId is required");

    // AUTH: Require business owner or admin
    const authResult = await requireBusinessOwner(req, businessId, corsHeaders);
    if (!authResult.authenticated) {
      return authErrorResponse(authResult, corsHeaders);
    }


    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") as any,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: business } = await supabase
      .from("businesses")
      .select("business_name, category, city, state")
      .eq("id", businessId)
      .single();

    if (!business) throw new Error("Business not found");

    // Gather financial signals
    const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString();
    const sixtyDaysAgo = new Date(Date.now() - 60 * 86400000).toISOString();

    const [scansRecent, scansPrior, reviewsRecent, bookingsRecent] = await Promise.all([
      supabase.from("qr_scans").select("id", { count: "exact", head: true }).eq("business_id", businessId).gte("scanned_at", thirtyDaysAgo),
      supabase.from("qr_scans").select("id", { count: "exact", head: true }).eq("business_id", businessId).gte("scanned_at", sixtyDaysAgo).lt("scanned_at", thirtyDaysAgo),
      supabase.from("reviews").select("id, rating", { count: "exact" }).eq("business_id", businessId).gte("created_at", thirtyDaysAgo),
      supabase.from("bookings").select("id", { count: "exact", head: true }).eq("business_id", businessId).gte("created_at", thirtyDaysAgo),
    ]);

    const dataPoints = {
      scans_30d: scansRecent.count || 0,
      scans_prior_30d: scansPrior.count || 0,
      reviews_30d: reviewsRecent.count || 0,
      bookings_30d: bookingsRecent.count || 0,
      avg_rating: reviewsRecent.data?.length ? (reviewsRecent.data.reduce((s: number, r: any) => s + r.rating, 0) / reviewsRecent.data.length).toFixed(1) : "N/A",
    };

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    // SHARED BRAIN: read what the rest of the team already knows
    const sharedCtx = await getBusinessContext(supabase, businessId);
    const ctxFragment = contextAsPromptFragment(sharedCtx);

    const prompt = `You are a financial analyst AI for small businesses. Based on this data, generate a 3-month cash flow forecast.

Business: ${business.business_name} (${business.category || "General"})
Location: ${business.city}, ${business.state}

Activity Data (last 30 days vs prior 30 days):
- QR Scans: ${dataPoints.scans_30d} (prior: ${dataPoints.scans_prior_30d})
- Reviews: ${dataPoints.reviews_30d}
- Bookings: ${dataPoints.bookings_30d}
- Avg Rating: ${dataPoints.avg_rating}
${ctxFragment}

Return forecasts for the next 3 months. Each forecast should include:
- forecast_period: "Month 1", "Month 2", "Month 3"
- projected_revenue: estimated revenue in dollars
- projected_expenses: estimated expenses
- projected_net: net income
- confidence_level: 0-100
- risk_factors: array of risks
- opportunities: array of growth opportunities
- ai_summary: 2-3 sentence analysis`;

    const forecastSchema = {
      type: "object",
      additionalProperties: false,
      properties: {
        forecasts: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              forecast_period: { type: "string" },
              projected_revenue: { type: "number" },
              projected_expenses: { type: "number" },
              projected_net: { type: "number" },
              confidence_level: { type: "number" },
              risk_factors: { type: "array", items: { type: "string" } },
              opportunities: { type: "array", items: { type: "string" } },
              ai_summary: { type: "string" },
            },
            required: [
              "forecast_period", "projected_revenue", "projected_expenses", "projected_net",
              "confidence_level", "risk_factors", "opportunities", "ai_summary",
            ],
          },
        },
      },
      required: ["forecasts"],
    };

    // PREMIUM REASONING + SELF-REVIEW: owners make real spending decisions on
    // these numbers, so the forecast runs on the best model and is then
    // re-checked against the underlying activity data.
    const deep = await runDeepJsonReport<{ forecasts: any[] }>({
      prompt,
      schema: forecastSchema,
      schemaName: "return_forecasts",
      lovableApiKey: LOVABLE_API_KEY,
      effort: "medium",
      label: "cashflow-forecast",
    });

    if (!deep.result) {
      return new Response(JSON.stringify({ error: "Could not generate a forecast right now. Please try again." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const reviewed = await reviewJsonReport<{ forecasts: any[] }>({
      sourcePrompt: prompt,
      draft: deep.result,
      schema: forecastSchema,
      schemaName: "return_forecasts",
      lovableApiKey: LOVABLE_API_KEY,
      label: "cashflow-review",
    });

    const forecasts = reviewed.result?.forecasts || [];
    console.log(`[cashflow-forecast] model=${deep.modelUsed} corrections=${reviewed.corrections.length}`);

    for (const forecast of forecasts) {
      const reasoning = buildReasoning(
        [
          { label: "QR scans (30d)", value: dataPoints.scans_30d },
          { label: "Prior 30d scans", value: dataPoints.scans_prior_30d },
          { label: "Bookings (30d)", value: dataPoints.bookings_30d },
          { label: "Avg rating", value: dataPoints.avg_rating },
        ],
        forecast.ai_summary || `Projected from recent activity trend; confidence ${forecast.confidence_level || 50}%.`,
      );
      await supabase.from("kayla_cashflow_forecasts").insert({
        business_id: businessId,
        forecast_period: forecast.forecast_period,
        projected_revenue: forecast.projected_revenue || 0,
        projected_expenses: forecast.projected_expenses || 0,
        projected_net: forecast.projected_net || 0,
        confidence_level: forecast.confidence_level || 50,
        risk_factors: forecast.risk_factors || [],
        opportunities: forecast.opportunities || [],
        ai_summary: forecast.ai_summary || "",
        data_points: dataPoints,
        reasoning,
      });
    }

    // SHARED BRAIN: tell the team what we just decided
    const top = forecasts[0];
    if (top) {
      await appendDecision(
        supabase,
        businessId,
        "Cash-Flow Analyst",
        `Forecasted ${top.forecast_period}: net ${top.projected_net >= 0 ? "+" : "-"}$${Math.abs(top.projected_net || 0).toLocaleString()} (confidence ${top.confidence_level || 50}%).`,
        { last_cashflow_net: top.projected_net || 0, last_cashflow_confidence: top.confidence_level || 50 },
      );
      await logLearning(
        supabase,
        businessId,
        "Cash-Flow Analyst",
        `Forecast generated using ${dataPoints.scans_30d} recent scans + ${dataPoints.bookings_30d} bookings as signal.`,
        "agent_run",
        0.65,
      );
    }

    // Decision feedback log (existing learning loop)
    try {
      await supabase.from("ai_agent_feedback").insert({
        agent_name: "kayla-cashflow-forecast",
        business_id: businessId,
        decision_type: "cashflow_forecast",
        decision_payload: { forecasts },
        outcome: "auto",
      });
    } catch {}

    return new Response(JSON.stringify({ success: true, forecasts }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Cash flow forecast error:", error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
