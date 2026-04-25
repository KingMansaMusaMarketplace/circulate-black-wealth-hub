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

    const { business_id, template_type } = await req.json();
    if (!business_id || !template_type) throw new Error("business_id and template_type required");

    // AUTH: Require business owner or admin
    const authResult = await requireBusinessOwner(req, business_id, corsHeaders);
    if (!authResult.authenticated) {
      return authErrorResponse(authResult, corsHeaders);
    }


    const { data: business } = await supabase
      .from("businesses")
      .select("business_name, category, state, city, owner_id")
      .eq("id", business_id)
      .single();

    if (!LOVABLE_API_KEY || !business) throw new Error("Cannot generate template");

    const templateTypes: Record<string, string> = {
      nda: "Non-Disclosure Agreement (NDA)",
      service_agreement: "Service Agreement / Contract",
      privacy_policy: "Privacy Policy",
      terms_of_service: "Terms of Service",
      independent_contractor: "Independent Contractor Agreement",
      refund_policy: "Refund & Cancellation Policy",
      partnership_agreement: "Partnership Agreement",
      employee_handbook: "Employee Handbook Summary",
    };

    const templateName = templateTypes[template_type] || template_type;

    const prompt = `Generate a professional ${templateName} for:

Business Name: ${business.business_name}
Business Type: ${business.category}
Location: ${business.city}, ${business.state}

Create a complete, legally-informed template with placeholders in [BRACKETS] for customizable fields. Include standard legal language appropriate for a small business. Add a disclaimer that this is a template and should be reviewed by legal counsel.`;

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "user", content: prompt }],
        tools: [{
          type: "function",
          function: {
            name: "legal_template",
            description: "Return generated legal template",
            parameters: {
              type: "object",
              properties: {
                template_name: { type: "string" },
                content: { type: "string" },
                variables: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      description: { type: "string" },
                      default_value: { type: "string" }
                    },
                    required: ["name", "description"]
                  }
                }
              },
              required: ["template_name", "content", "variables"]
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "legal_template" } }
      }),
    });

    if (!aiResp.ok) throw new Error("AI generation failed");

    const aiData = await aiResp.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No template generated");

    const result = JSON.parse(toolCall.function.arguments);

    // Mark any existing templates of this type as outdated
    await supabase.from("kayla_legal_templates")
      .update({ status: "outdated" })
      .eq("business_id", business_id)
      .eq("template_type", template_type)
      .eq("status", "active");

    // Save new template with version tracking
    const { data: existingCount } = await supabase.from("kayla_legal_templates")
      .select("id", { count: "exact", head: true })
      .eq("business_id", business_id)
      .eq("template_type", template_type);

    const version = (existingCount as any)?.length ? (existingCount as any).length + 1 : 1;

    const { data: saved } = await supabase.from("kayla_legal_templates").insert({
      business_id,
      template_type,
      template_name: result.template_name,
      content: result.content,
      variables: result.variables,
      status: "active",
      version,
      jurisdiction: `${business.state}, US`,
      generated_at: new Date().toISOString(),
    }).select().single();

    return new Response(JSON.stringify({ ...result, id: saved?.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
