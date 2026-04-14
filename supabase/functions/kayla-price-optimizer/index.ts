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
    const { businessId, products } = await req.json();
    if (!businessId) throw new Error("businessId is required");

    // AUTH: Require business owner or admin
    const authResult = await requireBusinessOwner(req, businessId, corsHeaders);
    if (!authResult.authenticated) {
      return authErrorResponse(authResult, corsHeaders);
    }


    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: business } = await supabase
      .from("businesses")
      .select("business_name, category, city, state")
      .eq("id", businessId)
      .single();

    if (!business) throw new Error("Business not found");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const productList = products && products.length > 0
      ? products.map((p: any) => `${p.name}: $${p.price}`).join("\n")
      : "No specific products provided — suggest general pricing strategy for this category.";

    const prompt = `You are a pricing strategist for small businesses. Analyze and suggest optimal pricing.

Business: ${business.business_name}
Category: ${business.category || "General"}
Location: ${business.city}, ${business.state}

Products/Services:
${productList}

For each product/service, provide:
- product_or_service: name
- current_price: current price
- recommended_price: your suggested price
- price_change_percent: percentage change
- reasoning: 2-3 sentences why
- competitor_range: estimated market range (e.g. "$15-$35")
- confidence_score: 0-100

If no products given, suggest 5 common products/services for this business category with recommended pricing.`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are a pricing optimization AI." },
          { role: "user", content: prompt },
        ],
        tools: [{
          type: "function",
          function: {
            name: "return_recommendations",
            description: "Return price recommendations",
            parameters: {
              type: "object",
              properties: {
                recommendations: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      product_or_service: { type: "string" },
                      current_price: { type: "number" },
                      recommended_price: { type: "number" },
                      price_change_percent: { type: "number" },
                      reasoning: { type: "string" },
                      competitor_range: { type: "string" },
                      confidence_score: { type: "number" },
                    },
                    required: ["product_or_service", "recommended_price"],
                  },
                },
              },
              required: ["recommendations"],
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "return_recommendations" } },
      }),
    });

    if (!aiResponse.ok) {
      const status = aiResponse.status;
      if (status === 429) return new Response(JSON.stringify({ error: "Rate limited" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      throw new Error(`AI error: ${status}`);
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    const recommendations = JSON.parse(toolCall?.function?.arguments || "{}").recommendations || [];

    for (const rec of recommendations) {
      await supabase.from("kayla_price_recommendations").insert({
        business_id: businessId,
        product_or_service: rec.product_or_service,
        current_price: rec.current_price || null,
        recommended_price: rec.recommended_price,
        price_change_percent: rec.price_change_percent || null,
        reasoning: rec.reasoning || null,
        market_data: {},
        competitor_range: rec.competitor_range || null,
        confidence_score: rec.confidence_score || 50,
      });
    }

    return new Response(JSON.stringify({ success: true, recommendations }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Price optimizer error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
