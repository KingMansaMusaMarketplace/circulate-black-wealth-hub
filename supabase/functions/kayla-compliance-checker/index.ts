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
    if (!business_id) throw new Error("business_id is required");

    // AUTH: Require business owner or admin
    const authResult = await requireBusinessOwner(req, business_id, corsHeaders);
    if (!authResult.authenticated) {
      return authErrorResponse(authResult, corsHeaders);
    }

    if (!business_id) throw new Error("business_id required");

    const { data: business } = await supabase
      .from("businesses")
      .select("business_name, category, state, city")
      .eq("id", business_id)
      .single();

    if (!LOVABLE_API_KEY || !business) throw new Error("Cannot generate compliance reminders");

    const prompt = `You are a business compliance advisor. Generate compliance reminders for:

Business: ${business.business_name}
Category: ${business.category}
Location: ${business.city}, ${business.state}
Current Date: ${new Date().toISOString().split("T")[0]}

Generate 5-8 compliance reminders relevant to this business type and location. Include tax deadlines, license renewals, insurance reviews, regulatory filings, etc.`;

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "user", content: prompt }],
        tools: [{
          type: "function",
          function: {
            name: "compliance_reminders",
            description: "Return compliance reminders",
            parameters: {
              type: "object",
              properties: {
                reminders: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      reminder_type: { type: "string" },
                      title: { type: "string" },
                      description: { type: "string" },
                      due_date: { type: "string" },
                      category: { type: "string", enum: ["tax", "license", "insurance", "regulatory", "employment", "general"] },
                      urgency: { type: "string", enum: ["low", "normal", "high", "critical"] }
                    },
                    required: ["reminder_type", "title", "description", "due_date", "category", "urgency"]
                  }
                }
              },
              required: ["reminders"]
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "compliance_reminders" } }
      }),
    });

    if (!aiResp.ok) throw new Error("AI generation failed");

    const aiData = await aiResp.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No reminders generated");

    const { reminders } = JSON.parse(toolCall.function.arguments);

    // Save reminders
    for (const r of reminders) {
      await supabase.from("kayla_compliance_reminders").insert({
        business_id,
        reminder_type: r.reminder_type,
        title: r.title,
        description: r.description,
        due_date: r.due_date,
        state: business.state,
        category: r.category,
        urgency: r.urgency,
      });
    }

    try {
      await supabase.from("ai_agent_feedback").insert({
        agent_name: "kayla-compliance-checker",
        business_id,
        decision_type: "compliance_reminders",
        decision_payload: { count: reminders.length, state: business.state },
        outcome: "auto",
      });
    } catch {}

    return new Response(JSON.stringify({ reminders }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
