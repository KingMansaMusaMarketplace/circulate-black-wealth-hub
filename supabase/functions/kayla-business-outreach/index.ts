import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

  try {
    const body = await req.json().catch(() => ({}));
    const batchSize = body.batch_size || 25;

    // Find businesses without an existing upgrade_pitch insight
    const { data: businesses, error: bizError } = await supabase
      .from("businesses")
      .select("id, business_name, category, city, state, description")
      .not("id", "in", `(SELECT DISTINCT business_id FROM kayla_business_insights WHERE insight_type = 'upgrade_pitch')`)
      .limit(batchSize);

    if (bizError) {
      console.error("[Kayla Outreach] Query error:", bizError.message);
      // Fallback: just get businesses
      const { data: fallbackBiz } = await supabase
        .from("businesses")
        .select("id, business_name, category, city, state, description")
        .limit(batchSize);

      if (!fallbackBiz?.length) {
        return jsonResponse({ success: true, message: "No businesses to process", generated: 0 });
      }
    }

    const targetBusinesses = businesses || [];
    if (!targetBusinesses.length) {
      return jsonResponse({ success: true, message: "All businesses already have pitches", generated: 0 });
    }

    let generated = 0;

    for (const biz of targetBusinesses) {
      let pitchContent: string;

      if (LOVABLE_API_KEY) {
        const prompt = `Write a short, compelling pitch (under 150 words) for "${biz.business_name}" (${biz.category || "business"} in ${biz.city || "their city"}, ${biz.state || ""}) explaining how Kayla AI can automate their reviews, find B2B partners, predict churn, and generate content. Include a specific ROI mention. Be warm and direct.`;

        try {
          const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${LOVABLE_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "google/gemini-3-flash-preview",
              messages: [
                { role: "system", content: "You are Kayla, an AI business concierge for 1325.AI — a platform for Black-owned businesses. Write personalized outreach pitches that are warm, professional, and data-driven." },
                { role: "user", content: prompt },
              ],
            }),
          });

          if (aiRes.ok) {
            const aiData = await aiRes.json();
            pitchContent = aiData.choices?.[0]?.message?.content?.trim() || getDefaultPitch(biz.business_name);
          } else {
            pitchContent = getDefaultPitch(biz.business_name);
          }
        } catch {
          pitchContent = getDefaultPitch(biz.business_name);
        }
      } else {
        pitchContent = getDefaultPitch(biz.business_name);
      }

      // Store as insight
      await supabase.from("kayla_business_insights").insert({
        business_id: biz.id,
        insight_type: "upgrade_pitch",
        title: `${biz.business_name}, your free AI Employee is ready`,
        content: pitchContent,
        status: "pending",
        metadata: {
          category: biz.category,
          city: biz.city,
          state: biz.state,
        },
      });

      generated++;
    }

    console.log(`[Kayla Outreach] Generated ${generated} pitches`);
    return jsonResponse({ success: true, generated, total_eligible: targetBusinesses.length });
  } catch (error) {
    console.error("[Kayla Outreach] Error:", error);
    return jsonResponse({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, 500);
  }
});

function getDefaultPitch(businessName: string): string {
  return `Hi ${businessName} team,\n\nI'm Kayla, your AI concierge on 1325.AI. I've been analyzing your listing and I'm ready to help you grow:\n\n• Auto-respond to every review in seconds — professionally, on-brand\n• Match you with B2B partners in your area for supply chain savings\n• Predict customer churn before it happens — retain 30% more customers\n• Generate social content and promotions on autopilot\n\nBusinesses on 1325.AI see an average 7x ROI from the platform. Activate me for just $100/mo — cancel anytime.\n\nLet's grow together,\nKayla`;
}

function jsonResponse(data: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}
