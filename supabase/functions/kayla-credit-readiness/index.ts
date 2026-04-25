import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

import { requireBusinessOwner, authErrorResponse } from "../_shared/auth-guard.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey) as any;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const { business_id, action } = await req.json();
    if (!business_id) throw new Error("business_id required");

    // AUTH: Require business owner or admin
    const authResult = await requireBusinessOwner(req, business_id, corsHeaders);
    if (!authResult.authenticated) {
      return authErrorResponse(authResult, corsHeaders);
    }


    // ── FETCH: Get the report history ──
    if (action === "get_reports") {
      const { data } = await supabase
        .from("credit_readiness_reports")
        .select("*")
        .eq("business_id", business_id)
        .order("created_at", { ascending: false })
        .limit(10);
      return new Response(JSON.stringify({ reports: data || [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── GENERATE: Build a new lender-ready package ──

    // 1. Fetch business profile
    const { data: business } = await supabase
      .from("businesses")
      .select("*")
      .eq("id", business_id)
      .single();
    if (!business) throw new Error("Business not found");

    // 2. Aggregate financial data (Service #9 overlap)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString();
    const ninetyDaysAgo = new Date(Date.now() - 90 * 86400000).toISOString();

    const [
      expensesRes,
      invoicesRes,
      reviewsRes,
      bookingsRes,
      documentsRes,
      scansRes,
    ] = await Promise.all([
      supabase.from("business_expenses").select("amount, category, expense_date").eq("business_id", business_id),
      supabase.from("business_invoices").select("total_amount, status, created_at").eq("business_id", business_id),
      supabase.from("reviews").select("rating").eq("business_id", business_id),
      supabase.from("bookings").select("id", { count: "exact", head: true }).eq("business_id", business_id).gte("created_at", thirtyDaysAgo),
      supabase.from("document_records").select("id, document_type, file_name, extracted_fields, status").eq("business_id", business_id).eq("status", "processed"),
      supabase.from("qr_scans").select("id", { count: "exact", head: true }).eq("business_id", business_id).gte("scanned_at", ninetyDaysAgo),
    ]);

    const paidInvoices = invoicesRes.data?.filter((i: any) => i.status === "paid") || [];
    const totalRevenue = paidInvoices.reduce((s: number, i: any) => s + (i.total_amount || 0), 0);
    const totalExpenses = expensesRes.data?.reduce((s: number, e: any) => s + (e.amount || 0), 0) || 0;
    const avgRating = reviewsRes.data?.length
      ? (reviewsRes.data.reduce((s: number, r: any) => s + r.rating, 0) / reviewsRes.data.length).toFixed(1)
      : "N/A";

    const monthlyRevenue = totalRevenue / Math.max(1, 3); // approximate from available data
    const monthlyExpenses = totalExpenses / Math.max(1, 3);
    const profitMargin = totalRevenue > 0 ? ((totalRevenue - totalExpenses) / totalRevenue * 100).toFixed(1) : "0";
    const dti = monthlyRevenue > 0 ? (monthlyExpenses / monthlyRevenue * 100).toFixed(1) : "100";

    // Calculate months in business
    const createdAt = new Date(business.created_at);
    const monthsInBusiness = Math.floor((Date.now() - createdAt.getTime()) / (30 * 86400000));

    // Documentation score based on records vault
    const docCount = documentsRes.data?.length || 0;
    const docTypes = new Set((documentsRes.data || []).map((d: any) => d.document_type));

    // Create initial report record
    const { data: report, error: insertErr } = await supabase
      .from("credit_readiness_reports")
      .insert({
        business_id,
        status: "generating",
        monthly_revenue: monthlyRevenue,
        monthly_expenses: monthlyExpenses,
        debt_to_income_ratio: parseFloat(dti),
        profit_margin: parseFloat(profitMargin as string),
        months_in_business: monthsInBusiness,
        documents_included: (documentsRes.data || []).map((d: any) => ({
          id: d.id,
          type: d.document_type,
          name: d.file_name,
        })),
      })
      .select()
      .single();

    if (insertErr) throw insertErr;

    // 3. Call AI to generate lender-ready analysis
    const prompt = `You are an expert Small Business Lending Advisor specializing in helping Black-owned businesses prepare successful loan applications. Analyze this business data and generate a comprehensive lender-ready assessment.

BUSINESS PROFILE:
- Name: ${business.business_name}
- Category: ${business.category || "Not specified"}
- Location: ${business.city || ""}, ${business.state || ""}
- Months in operation: ${monthsInBusiness}

FINANCIAL DATA (last 90 days):
- Total Revenue: $${totalRevenue.toFixed(2)}
- Total Expenses: $${totalExpenses.toFixed(2)}
- Monthly Revenue (avg): $${monthlyRevenue.toFixed(2)}
- Monthly Expenses (avg): $${monthlyExpenses.toFixed(2)}
- Profit Margin: ${profitMargin}%
- Debt-to-Income Ratio: ${dti}%
- Paid Invoices: ${paidInvoices.length}

BUSINESS SIGNALS:
- Average Rating: ${avgRating}/5
- Recent Bookings (30d): ${bookingsRes.count || 0}
- QR Scans (90d): ${scansRes.count || 0}
- Documents in Vault: ${docCount}
- Document Types: ${Array.from(docTypes).join(", ") || "None"}

Generate your assessment using the following tool.`;

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are an expert lending advisor. Always respond using the provided tool." },
          { role: "user", content: prompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_credit_assessment",
              description: "Generate a structured credit readiness assessment for a small business loan application.",
              parameters: {
                type: "object",
                properties: {
                  overall_score: { type: "integer", description: "Overall credit readiness score 0-100" },
                  financial_health_score: { type: "integer", description: "Financial health score 0-100" },
                  documentation_score: { type: "integer", description: "Documentation completeness score 0-100" },
                  credit_profile_score: { type: "integer", description: "Credit profile strength score 0-100" },
                  executive_summary: { type: "string", description: "2-3 paragraph executive summary for the lender package" },
                  strengths: {
                    type: "array",
                    items: { type: "object", properties: { title: { type: "string" }, detail: { type: "string" } }, required: ["title", "detail"] },
                  },
                  weaknesses: {
                    type: "array",
                    items: { type: "object", properties: { title: { type: "string" }, detail: { type: "string" }, fix: { type: "string" } }, required: ["title", "detail", "fix"] },
                  },
                  recommendations: {
                    type: "array",
                    items: { type: "object", properties: { action: { type: "string" }, priority: { type: "string", enum: ["high", "medium", "low"] }, timeline: { type: "string" } }, required: ["action", "priority", "timeline"] },
                  },
                  loan_types_qualified: {
                    type: "array",
                    items: { type: "object", properties: { type: { type: "string" }, likelihood: { type: "string", enum: ["strong", "moderate", "unlikely"] }, notes: { type: "string" } }, required: ["type", "likelihood"] },
                  },
                  estimated_borrowing_range: {
                    type: "object",
                    properties: { min: { type: "number" }, max: { type: "number" }, confidence: { type: "string" } },
                    required: ["min", "max", "confidence"],
                  },
                },
                required: ["overall_score", "financial_health_score", "documentation_score", "credit_profile_score", "executive_summary", "strengths", "weaknesses", "recommendations", "loan_types_qualified", "estimated_borrowing_range"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "generate_credit_assessment" } },
      }),
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      console.error("AI gateway error:", aiRes.status, errText);
      
      if (aiRes.status === 429) {
        await supabase.from("credit_readiness_reports").update({ status: "error", error_message: "Rate limited, try again shortly" }).eq("id", report.id);
        return new Response(JSON.stringify({ error: "Rate limited, please try again later." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (aiRes.status === 402) {
        await supabase.from("credit_readiness_reports").update({ status: "error", error_message: "AI credits exhausted" }).eq("id", report.id);
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      throw new Error(`AI error: ${aiRes.status}`);
    }

    const aiData = await aiRes.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("AI did not return structured assessment");

    const assessment = JSON.parse(toolCall.function.arguments);

    // 4. Update report with AI results
    const { error: updateErr } = await supabase
      .from("credit_readiness_reports")
      .update({
        status: "complete",
        overall_score: assessment.overall_score,
        financial_health_score: assessment.financial_health_score,
        documentation_score: assessment.documentation_score,
        credit_profile_score: assessment.credit_profile_score,
        executive_summary: assessment.executive_summary,
        strengths: assessment.strengths,
        weaknesses: assessment.weaknesses,
        recommendations: assessment.recommendations,
        loan_types_qualified: assessment.loan_types_qualified,
        estimated_borrowing_range: assessment.estimated_borrowing_range,
        updated_at: new Date().toISOString(),
      })
      .eq("id", report.id);

    if (updateErr) throw updateErr;

    // 5. Log event to kayla_event_queue
    await supabase.from("kayla_event_queue").insert({
      event_type: "credit_readiness_generated",
      business_id,
      payload: {
        report_id: report.id,
        overall_score: assessment.overall_score,
        estimated_range: assessment.estimated_borrowing_range,
      },
      status: "completed",
      processed_at: new Date().toISOString(),
    });

    return new Response(
      JSON.stringify({ report_id: report.id, ...assessment }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("kayla-credit-readiness error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? (error as Error).message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
