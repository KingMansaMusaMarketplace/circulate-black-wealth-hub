import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { z } from "https://esm.sh/zod@3.23.8";
import { requireAdmin } from "../_shared/auth-guard.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-csrf-token",
};

const BodySchema = z.object({
  agreement_id: z.string().uuid(),
  action: z.enum(["send", "sync"]).default("send"),
});

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const auth = await requireAdmin(req, corsHeaders);
    if (!auth.authenticated) {
      return json({ error: auth.error || "Unauthorized" }, auth.status || 401);
    }

    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return json({ error: parsed.error.flatten().fieldErrors }, 400);
    }
    const { agreement_id, action } = parsed.data;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } },
    );

    const { data: row, error } = await supabase
      .from("sponsor_agreements")
      .select("*")
      .eq("id", agreement_id)
      .single();

    if (error || !row) return json({ error: "Agreement not found" }, 404);

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) return json({ error: "Stripe is not configured" }, 500);
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // --- Ensure a customer + draft invoice exists (recovery path) ----------
    let invoiceId: string | null = row.stripe_invoice_id;
    let customerId: string | null = row.stripe_customer_id;

    if (!invoiceId && action === "send") {
      const existing = await stripe.customers.list({ email: row.contact_email, limit: 1 });
      const customer = existing.data[0] ??
        (await stripe.customers.create({
          email: row.contact_email,
          name: row.company_name,
          metadata: { sponsor_agreement_id: row.id },
        }));
      customerId = customer.id;

      const draft = await stripe.invoices.create({
        customer: customer.id,
        collection_method: "send_invoice",
        days_until_due: 30,
        auto_advance: false,
        description: `1325.AI ${row.tier_name} sponsorship — ${row.payment_schedule} installment`,
        metadata: { sponsor_agreement_id: row.id, tier: row.tier_key },
        ...(row.po_number ? { custom_fields: [{ name: "PO Number", value: String(row.po_number).slice(0, 30) }] } : {}),
      });
      await stripe.invoiceItems.create({
        customer: customer.id,
        invoice: draft.id,
        currency: "usd",
        amount: row.installment_amount_cents,
        description: `${row.tier_name} sponsorship — ${row.payment_schedule} installment`,
      });
      invoiceId = draft.id;
    }

    if (!invoiceId) return json({ error: "No invoice exists for this agreement yet" }, 400);

    let invoice = await stripe.invoices.retrieve(invoiceId);

    if (action === "send" && invoice.status === "draft") {
      invoice = await stripe.invoices.sendInvoice(invoiceId);
    }

    const isPaid = invoice.status === "paid";
    const update: Record<string, unknown> = {
      stripe_customer_id: customerId ?? row.stripe_customer_id,
      stripe_invoice_id: invoice.id,
      stripe_invoice_number: invoice.number ?? null,
      stripe_invoice_url: invoice.hosted_invoice_url ?? null,
      status: isPaid
        ? "paid"
        : invoice.status === "draft"
          ? "invoice_draft"
          : invoice.status === "void"
            ? "cancelled"
            : "invoice_sent",
    };
    if (isPaid && !row.paid_at) {
      update.paid_at = invoice.status_transitions?.paid_at
        ? new Date(invoice.status_transitions.paid_at * 1000).toISOString()
        : new Date().toISOString();
    }
    if (action === "send" && !row.invoice_sent_at && invoice.status !== "draft") {
      update.invoice_sent_at = new Date().toISOString();
    }

    const { error: updErr } = await supabase
      .from("sponsor_agreements")
      .update(update)
      .eq("id", row.id);
    if (updErr) console.error("[send-sponsor-invoice] update failed:", updErr.message);

    return json({
      success: true,
      status: update.status,
      invoice_url: invoice.hosted_invoice_url ?? null,
      invoice_number: invoice.number ?? null,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[send-sponsor-invoice] ERROR:", message);
    return json({ error: message }, 500);
  }
});
