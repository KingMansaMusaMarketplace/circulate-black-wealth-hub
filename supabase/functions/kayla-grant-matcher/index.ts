import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { businessId } = await req.json();
    if (!businessId) throw new Error("businessId is required");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Fetch business profile
    const { data: business } = await supabase
      .from("businesses")
      .select("business_name, category, city, state, description, is_verified")
      .eq("id", businessId)
      .single();

    if (!business) throw new Error("Business not found");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const prompt = `You are a grant and funding research specialist for Black-owned businesses. Given this business profile, identify 5 relevant grants, loans, or funding opportunities they could apply for.

Business: ${business.business_name}
Category: ${business.category || "General"}
Location: ${business.city || ""}, ${business.state || ""}
Description: ${business.description || "N/A"}
Verified: ${business.is_verified ? "Yes" : "No"}

Return a JSON array of grant objects. Each should have:
- grant_name: string
- grant_provider: string (organization offering it)
- grant_url: string (real URL if possible, otherwise "#")
- amount_min: number
- amount_max: number
- deadline: string (YYYY-MM-DD or null if rolling)
- eligibility_summary: string (2-3 sentences)
- match_score: number (0-100, how well this matches the business)
- match_reasons: string[] (why this is a good fit)
- ai_application_tips: string (specific tips for applying)

Focus on REAL programs for minority/Black-owned businesses, SBA programs, state grants, NMSDC certifications, and community development financial institutions (CDFIs).`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are a grant research AI. Return only valid JSON arrays." },
          { role: "user", content: prompt },
        ],
        tools: [{
          type: "function",
          function: {
            name: "return_grants",
            description: "Return grant matches",
            parameters: {
              type: "object",
              properties: {
                grants: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      grant_name: { type: "string" },
                      grant_provider: { type: "string" },
                      grant_url: { type: "string" },
                      amount_min: { type: "number" },
                      amount_max: { type: "number" },
                      deadline: { type: "string" },
                      eligibility_summary: { type: "string" },
                      match_score: { type: "number" },
                      match_reasons: { type: "array", items: { type: "string" } },
                      ai_application_tips: { type: "string" },
                    },
                    required: ["grant_name", "grant_provider", "match_score"],
                  },
                },
              },
              required: ["grants"],
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "return_grants" } },
      }),
    });

    if (!aiResponse.ok) {
      const status = aiResponse.status;
      if (status === 429) return new Response(JSON.stringify({ error: "Rate limited, try again later" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      throw new Error(`AI gateway error: ${status}`);
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    const grants = JSON.parse(toolCall?.function?.arguments || "{}").grants || [];

    // Store grants
    for (const grant of grants) {
      await supabase.from("kayla_grant_matches").insert({
        business_id: businessId,
        grant_name: grant.grant_name,
        grant_provider: grant.grant_provider,
        grant_url: grant.grant_url || null,
        amount_min: grant.amount_min || null,
        amount_max: grant.amount_max || null,
        deadline: grant.deadline || null,
        eligibility_summary: grant.eligibility_summary || null,
        match_score: grant.match_score || 0,
        match_reasons: grant.match_reasons || [],
        ai_application_tips: grant.ai_application_tips || null,
      });
    }

    // Log insight
    await supabase.from("kayla_business_insights").insert({
      business_id: businessId,
      insight_type: "content_suggestion",
      title: `Found ${grants.length} Grant Opportunities`,
      content: `Kayla identified ${grants.length} funding opportunities matching your business profile. Top match: ${grants[0]?.grant_name || "N/A"} (${grants[0]?.match_score || 0}% match).`,
      status: "pending",
      metadata: { source: "grant_matcher", count: grants.length },
    });

    return new Response(JSON.stringify({ success: true, grants }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Grant matcher error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
