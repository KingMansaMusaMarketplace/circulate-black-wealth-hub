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

    const { business_id, tax_year } = await req.json();
    if (!business_id) throw new Error("business_id required");

    // AUTH: Require business owner or admin
    const authResult = await requireBusinessOwner(req, business_id, corsHeaders);
    if (!authResult.authenticated) {
      return authErrorResponse(authResult, corsHeaders);
    }


    const year = tax_year || new Date().getFullYear();

    // Get business data
    const { data: business } = await supabase
      .from("businesses")
      .select("business_name, category, state, city")
      .eq("id", business_id)
      .single();

    // Get expenses for the year
    const { data: expenses } = await supabase
      .from("business_expenses")
      .select("amount, category, expense_date")
      .eq("business_id", business_id)
      .gte("expense_date", `${year}-01-01`)
      .lte("expense_date", `${year}-12-31`);

    // Get invoices for revenue
    const { data: invoices } = await supabase
      .from("business_invoices")
      .select("total_amount, status")
      .eq("business_id", business_id)
      .eq("status", "paid");

    const totalRevenue = invoices?.reduce((s: number, i: any) => s + (i.total_amount || 0), 0) || 0;
    const totalExpenses = expenses?.reduce((s: number, e: any) => s + (e.amount || 0), 0) || 0;

    let aiSummary = "";
    let deductions: any[] = [];
    let quarterlyEstimates: any[] = [];

    if (LOVABLE_API_KEY && business) {
      const prompt = `You are a tax preparation assistant for a ${business.category || "small"} business called "${business.business_name}" located in ${business.city || ""}, ${business.state || "US"}.

Tax Year: ${year}
Revenue: $${totalRevenue.toFixed(2)}
Total Expenses: $${totalExpenses.toFixed(2)}
Expense Categories: ${JSON.stringify(expenses?.reduce((acc: any, e: any) => { acc[e.category] = (acc[e.category] || 0) + e.amount; return acc; }, {}) || {})}

Provide tax preparation guidance including potential deductions and quarterly estimate recommendations.`;

      const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [{ role: "user", content: prompt }],
          tools: [{
            type: "function",
            function: {
              name: "tax_analysis",
              description: "Return tax prep analysis",
              parameters: {
                type: "object",
                properties: {
                  ai_summary: { type: "string" },
                  estimated_tax_liability: { type: "number" },
                  deductions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        amount: { type: "number" },
                        description: { type: "string" }
                      },
                      required: ["name", "amount", "description"]
                    }
                  },
                  quarterly_estimates: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        quarter: { type: "string" },
                        amount: { type: "number" },
                        due_date: { type: "string" }
                      },
                      required: ["quarter", "amount", "due_date"]
                    }
                  }
                },
                required: ["ai_summary", "estimated_tax_liability", "deductions", "quarterly_estimates"]
              }
            }
          }],
          tool_choice: { type: "function", function: { name: "tax_analysis" } }
        }),
      });

      if (aiResp.ok) {
        const aiData = await aiResp.json();
        const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
        if (toolCall) {
          const parsed = JSON.parse(toolCall.function.arguments);
          aiSummary = parsed.ai_summary;
          deductions = parsed.deductions || [];
          quarterlyEstimates = parsed.quarterly_estimates || [];

          // Save tax prep record
          await supabase.from("kayla_tax_prep").upsert({
            business_id,
            tax_year: year,
            estimated_revenue: totalRevenue,
            estimated_expenses: totalExpenses,
            estimated_tax_liability: parsed.estimated_tax_liability,
            deductions_found: deductions,
            quarterly_estimates: quarterlyEstimates,
            filing_deadline: `${year + 1}-04-15`,
            prep_status: "in_progress",
            ai_summary: aiSummary,
            updated_at: new Date().toISOString(),
          }, { onConflict: "business_id,tax_year", ignoreDuplicates: false });
        }
      }
    }

    return new Response(JSON.stringify({
      tax_year: year,
      revenue: totalRevenue,
      expenses: totalExpenses,
      net_income: totalRevenue - totalExpenses,
      deductions,
      quarterly_estimates: quarterlyEstimates,
      ai_summary: aiSummary,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
