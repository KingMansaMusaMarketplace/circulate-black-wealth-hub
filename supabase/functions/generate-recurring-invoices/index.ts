import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("[GENERATE-RECURRING] Function started");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get all active recurring invoices that are due
    const today = new Date().toISOString().split('T')[0];
    const { data: dueInvoices, error: fetchError } = await supabaseClient
      .from('recurring_invoices')
      .select('*')
      .eq('is_active', true)
      .lte('next_invoice_date', today);

    if (fetchError) throw fetchError;

    console.log(`[GENERATE-RECURRING] Found ${dueInvoices?.length || 0} due invoices`);

    let generated = 0;
    let errors = 0;

    for (const recurring of dueInvoices || []) {
      try {
        // Generate invoice number
        const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        // Create the invoice
        const { error: insertError } = await supabaseClient
          .from('invoices')
          .insert({
            business_id: recurring.business_id,
            invoice_number: invoiceNumber,
            customer_name: recurring.customer_name,
            customer_email: recurring.customer_email,
            issue_date: today,
            due_date: calculateDueDate(today, 30), // 30 days from today
            subtotal: recurring.subtotal,
            tax_rate: recurring.tax_rate,
            tax_amount: recurring.tax_amount,
            total_amount: recurring.total_amount,
            status: 'pending',
            line_items: recurring.line_items,
            notes: recurring.notes
          });

        if (insertError) throw insertError;

        // Update recurring invoice
        const nextDate = calculateNextDate(today, recurring.frequency);
        const { error: updateError } = await supabaseClient
          .from('recurring_invoices')
          .update({
            last_generated_at: new Date().toISOString(),
            next_invoice_date: nextDate
          })
          .eq('id', recurring.id);

        if (updateError) throw updateError;

        console.log(`[GENERATE-RECURRING] Generated invoice for ${recurring.customer_name}`);
        generated++;
      } catch (error) {
        console.error(`[GENERATE-RECURRING] Error generating invoice for ${recurring.customer_name}:`, error);
        errors++;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        generated,
        errors,
        message: `Generated ${generated} invoice(s) with ${errors} error(s)`
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("[GENERATE-RECURRING] Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

function calculateDueDate(startDate: string, daysToAdd: number): string {
  const date = new Date(startDate);
  date.setDate(date.getDate() + daysToAdd);
  return date.toISOString().split('T')[0];
}

function calculateNextDate(currentDate: string, frequency: string): string {
  const date = new Date(currentDate);
  
  switch (frequency) {
    case 'weekly':
      date.setDate(date.getDate() + 7);
      break;
    case 'monthly':
      date.setMonth(date.getMonth() + 1);
      break;
    case 'quarterly':
      date.setMonth(date.getMonth() + 3);
      break;
    case 'yearly':
      date.setFullYear(date.getFullYear() + 1);
      break;
  }
  
  return date.toISOString().split('T')[0];
}
