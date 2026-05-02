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

    const { business_id, action } = await req.json();
    if (!business_id) throw new Error("business_id required");

    // AUTH: Require business owner or admin
    const authResult = await requireBusinessOwner(req, business_id, corsHeaders);
    if (!authResult.authenticated) {
      return authErrorResponse(authResult, corsHeaders);
    }


    if (action === "analyze") {
      // Get existing inventory
      const { data: items } = await supabase
        .from("kayla_inventory_items")
        .select("*")
        .eq("business_id", business_id)
        .eq("status", "active");

      // Get business info for context
      const { data: business } = await supabase
        .from("businesses")
        .select("business_name, category")
        .eq("id", business_id)
        .single();

      const lowStock = (items || []).filter((i: any) => i.current_stock <= i.min_stock_level);

      // Generate vendor recommendations using AI
      const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
      let vendorRecs: any[] = [];

      if (LOVABLE_API_KEY && business) {
        const prompt = `You are a supply chain advisor for a ${business.category || "small"} business called "${business.business_name}". 
        
Current inventory items: ${JSON.stringify(items?.map((i: any) => ({ name: i.item_name, category: i.category, stock: i.current_stock, cost: i.unit_cost })) || [])}

Low stock items needing reorder: ${JSON.stringify(lowStock.map((i: any) => i.item_name))}

Provide 3 vendor recommendations as a JSON array with fields: vendor_name, vendor_type, estimated_savings (number), recommendation_reason. Focus on cost savings and reliability for Black-owned business suppliers when possible.`;

        const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "google/gemini-3-flash-preview",
            messages: [{ role: "user", content: prompt }],
            tools: [{
              type: "function",
              function: {
                name: "vendor_recommendations",
                description: "Return vendor recommendations",
                parameters: {
                  type: "object",
                  properties: {
                    vendors: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          vendor_name: { type: "string" },
                          vendor_type: { type: "string" },
                          estimated_savings: { type: "number" },
                          recommendation_reason: { type: "string" }
                        },
                        required: ["vendor_name", "vendor_type", "estimated_savings", "recommendation_reason"]
                      }
                    }
                  },
                  required: ["vendors"]
                }
              }
            }],
            tool_choice: { type: "function", function: { name: "vendor_recommendations" } }
          }),
        });

        if (aiResp.ok) {
          const aiData = await aiResp.json();
          const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
          if (toolCall) {
            const parsed = JSON.parse(toolCall.function.arguments);
            vendorRecs = parsed.vendors || [];

            // Save vendor recommendations
            for (const v of vendorRecs) {
              await supabase.from("kayla_vendor_recommendations").insert({
                business_id,
                vendor_name: v.vendor_name,
                vendor_type: v.vendor_type,
                estimated_savings: v.estimated_savings,
                recommendation_reason: v.recommendation_reason,
                confidence_score: 0.85,
              });
            }
          }
        }
      }

      // Mark low stock items
      for (const item of lowStock) {
        await supabase.from("kayla_inventory_items")
          .update({ reorder_recommended: true, ai_notes: `Stock (${item.current_stock}) is at or below minimum (${item.min_stock_level}). Reorder recommended.` })
          .eq("id", item.id);
      }

      try {
        await supabase.from("ai_agent_feedback").insert({
          agent_name: "kayla-inventory-manager",
          business_id,
          decision_type: "inventory_analysis",
          decision_payload: {
            total_items: items?.length || 0,
            low_stock_count: lowStock.length,
            vendor_recommendations_count: vendorRecs.length,
          },
          outcome: "auto",
        });
      } catch {}

      return new Response(JSON.stringify({
        total_items: items?.length || 0,
        low_stock_count: lowStock.length,
        low_stock_items: lowStock,
        vendor_recommendations: vendorRecs,
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
