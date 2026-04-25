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
    const { businessId, action, triggerType } = await req.json();
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

    if (action === "generate_campaign") {
      const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
      if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

      const trigger = triggerType || "repeat_visit";

      const triggerDescriptions: Record<string, string> = {
        first_visit: "Customer just visited for the first time",
        repeat_visit: "Customer has visited multiple times",
        no_visit_30d: "Customer hasn't visited in 30+ days",
        high_spender: "Customer is a high-value spender",
        new_review: "Customer just left a review",
        birthday: "It's the customer's birthday",
        abandoned_booking: "Customer started but didn't complete a booking",
      };

      const prompt = `Create a behavior-triggered email campaign for a Black-owned business.

Business: ${business.business_name}
Category: ${business.category || "General"}
Trigger: ${triggerDescriptions[trigger] || trigger}

Generate:
- campaign_name: catchy name for this campaign
- subject_line: compelling email subject (< 60 chars)
- email_body: full email in HTML format, warm & professional, culturally authentic. Include a CTA button. Use {customer_name} and {business_name} as placeholders.`;

      const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: "You are an email marketing AI specialist for small businesses." },
            { role: "user", content: prompt },
          ],
          tools: [{
            type: "function",
            function: {
              name: "return_campaign",
              description: "Return generated campaign",
              parameters: {
                type: "object",
                properties: {
                  campaign_name: { type: "string" },
                  subject_line: { type: "string" },
                  email_body: { type: "string" },
                },
                required: ["campaign_name", "subject_line", "email_body"],
              },
            },
          }],
          tool_choice: { type: "function", function: { name: "return_campaign" } },
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
      const campaign = JSON.parse(toolCall?.function?.arguments || "{}");

      const { data: inserted } = await supabase.from("kayla_email_campaigns").insert({
        business_id: businessId,
        campaign_name: campaign.campaign_name || `${trigger} Campaign`,
        trigger_type: trigger,
        subject_line: campaign.subject_line || "",
        email_body: campaign.email_body || "",
        is_active: false,
      }).select().single();

      return new Response(JSON.stringify({ success: true, campaign: inserted }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "list_campaigns") {
      const { data: campaigns } = await supabase
        .from("kayla_email_campaigns")
        .select("*")
        .eq("business_id", businessId)
        .order("created_at", { ascending: false });

      return new Response(JSON.stringify({ campaigns: campaigns || [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Email campaign error:", error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
