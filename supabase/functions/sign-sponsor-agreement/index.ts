import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { z } from "https://esm.sh/zod@3.23.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-csrf-token",
};

const TIERS: Record<string, { name: string; annualCents: number }> = {
  founding_sponsor: { name: "Founding Sponsor", annualCents: 2100000 },
  bronze: { name: "Bronze Partner", annualCents: 6000000 },
  silver: { name: "Silver Partner", annualCents: 18000000 },
  gold: { name: "Gold Partner", annualCents: 30000000 },
  platinum: { name: "Platinum Partner", annualCents: 60000000 },
};

const DIVISOR: Record<string, number> = { annual: 1, quarterly: 4, monthly: 12 };

const BodySchema = z.object({
  tier_key: z.enum(["founding_sponsor", "bronze", "silver", "gold", "platinum"]),
  payment_schedule: z.enum(["annual", "quarterly", "monthly"]),
  company_name: z.string().trim().min(1).max(200),
  company_website: z.string().trim().max(300).optional().nullable(),
  billing_address: z.string().trim().min(5).max(500),
  contact_name: z.string().trim().min(1).max(150),
  contact_title: z.string().trim().max(150).optional().nullable(),
  contact_email: z.string().trim().email().max(255),
  contact_phone: z.string().trim().max(50).optional().nullable(),
  po_number: z.string().trim().max(100).optional().nullable(),
  category_exclusivity: z.boolean().default(false),
  signer_name: z.string().trim().min(1).max(150),
  signer_title: z.string().trim().max(150).optional().nullable(),
  signature_typed_name: z.string().trim().min(2).max(150),
  agreed_terms: z.literal(true),
  agreement_version: z.string().trim().min(1).max(50),
});

const usd = (cents: number) =>
  `$${(cents / 100).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

const esc = (s: string) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: parsed.error.flatten().fieldErrors }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    const b = parsed.data;

    const tier = TIERS[b.tier_key];
    const annualCents = tier.annualCents;
    const installmentCents = Math.round(annualCents / DIVISOR[b.payment_schedule]);

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("cf-connecting-ip") ??
      null;
    const ua = req.headers.get("user-agent")?.slice(0, 500) ?? null;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } },
    );

    const { data: row, error: insertError } = await supabase
      .from("sponsor_agreements")
      .insert({
        tier_key: b.tier_key,
        tier_name: tier.name,
        annual_amount_cents: annualCents,
        payment_schedule: b.payment_schedule,
        installment_amount_cents: installmentCents,
        company_name: b.company_name,
        company_website: b.company_website || null,
        billing_address: b.billing_address,
        contact_name: b.contact_name,
        contact_title: b.contact_title || null,
        contact_email: b.contact_email,
        contact_phone: b.contact_phone || null,
        po_number: b.po_number || null,
        category_exclusivity: b.category_exclusivity,
        signer_name: b.signer_name,
        signer_title: b.signer_title || null,
        signature_typed_name: b.signature_typed_name,
        agreed_terms: true,
        agreement_version: b.agreement_version,
        ip_address: ip,
        user_agent: ua,
        status: "signed",
      })
      .select()
      .single();

    if (insertError) {
      console.error("[sign-sponsor-agreement] insert failed:", insertError.message);
      throw new Error(insertError.message);
    }

    // --- Create a DRAFT Stripe invoice (never auto-sent) -------------------
    let invoiceInfo: Record<string, unknown> = {};
    try {
      const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
      if (stripeKey) {
        const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

        const existing = await stripe.customers.list({ email: b.contact_email, limit: 1 });
        const customer = existing.data[0] ??
          (await stripe.customers.create({
            email: b.contact_email,
            name: b.company_name,
            metadata: { sponsor_agreement_id: row.id },
          }));

        const invoice = await stripe.invoices.create({
          customer: customer.id,
          collection_method: "send_invoice",
          days_until_due: 30,
          auto_advance: false,
          description: `1325.AI ${tier.name} sponsorship — ${b.payment_schedule} installment`,
          metadata: { sponsor_agreement_id: row.id, tier: b.tier_key },
          ...(b.po_number ? { custom_fields: [{ name: "PO Number", value: b.po_number.slice(0, 30) }] } : {}),
        });

        await stripe.invoiceItems.create({
          customer: customer.id,
          invoice: invoice.id,
          currency: "usd",
          amount: installmentCents,
          description: `${tier.name} sponsorship — ${b.payment_schedule} installment (annual value ${usd(annualCents)})`,
        });

        invoiceInfo = {
          stripe_customer_id: customer.id,
          stripe_invoice_id: invoice.id,
          stripe_invoice_number: invoice.number ?? null,
          status: "invoice_draft",
        };

        await supabase.from("sponsor_agreements").update(invoiceInfo).eq("id", row.id);
      }
    } catch (stripeErr) {
      console.error("[sign-sponsor-agreement] stripe draft failed:", stripeErr);
      await supabase
        .from("sponsor_agreements")
        .update({ admin_notes: `Stripe draft invoice failed: ${String(stripeErr)}` })
        .eq("id", row.id);
    }

    // --- Emails ------------------------------------------------------------
    try {
      const resendKey = Deno.env.get("RESEND_API_KEY");
      if (resendKey) {
        const resend = new Resend(resendKey);
        const signedAt = new Date(row.signed_at ?? Date.now()).toUTCString();

        const record = `
          <table style="border-collapse:collapse;font-size:14px;color:#111">
            <tr><td style="padding:4px 12px 4px 0"><b>Sponsorship tier</b></td><td>${esc(tier.name)}</td></tr>
            <tr><td style="padding:4px 12px 4px 0"><b>Annual investment</b></td><td>${usd(annualCents)}</td></tr>
            <tr><td style="padding:4px 12px 4px 0"><b>Payment schedule</b></td><td>${esc(b.payment_schedule)} — ${usd(installmentCents)} per installment</td></tr>
            <tr><td style="padding:4px 12px 4px 0"><b>Organization</b></td><td>${esc(b.company_name)}</td></tr>
            <tr><td style="padding:4px 12px 4px 0"><b>Billing address</b></td><td>${esc(b.billing_address)}</td></tr>
            <tr><td style="padding:4px 12px 4px 0"><b>Contact</b></td><td>${esc(b.contact_name)}${b.contact_title ? ", " + esc(b.contact_title) : ""} &lt;${esc(b.contact_email)}&gt;</td></tr>
            <tr><td style="padding:4px 12px 4px 0"><b>PO number</b></td><td>${esc(b.po_number || "—")}</td></tr>
            <tr><td style="padding:4px 12px 4px 0"><b>Category exclusivity</b></td><td>${b.category_exclusivity ? "Requested" : "Not requested"}</td></tr>
            <tr><td style="padding:4px 12px 4px 0"><b>Electronic signature</b></td><td>${esc(b.signature_typed_name)}${b.signer_title ? ", " + esc(b.signer_title) : ""}</td></tr>
            <tr><td style="padding:4px 12px 4px 0"><b>Signed at (UTC)</b></td><td>${esc(signedAt)}</td></tr>
            <tr><td style="padding:4px 12px 4px 0"><b>Agreement version</b></td><td>${esc(b.agreement_version)}</td></tr>
            <tr><td style="padding:4px 12px 4px 0"><b>IP address</b></td><td>${esc(ip || "unavailable")}</td></tr>
            <tr><td style="padding:4px 12px 4px 0"><b>Record ID</b></td><td>${esc(row.id)}</td></tr>
          </table>`;

        await resend.emails.send({
          from: "1325.AI Partnerships <partnerships@1325.ai>",
          to: [b.contact_email],
          subject: `Signed: 1325.AI ${tier.name} Sponsorship Agreement`,
          html: `
            <div style="font-family:Helvetica,Arial,sans-serif;max-width:640px;margin:auto">
              <h2 style="color:#003366;margin-bottom:4px">Thank you, ${esc(b.company_name)}</h2>
              <p style="color:#333">Your 1325.AI Corporate Sponsorship Agreement has been signed electronically. Below is your signature record. Please keep this email for your files.</p>
              ${record}
              <p style="color:#333;margin-top:20px">An invoice for ${usd(installmentCents)} with net-30 terms will follow shortly from our partnerships team. Reply to this email with any billing instructions or vendor onboarding requirements.</p>
              <p style="color:#666;font-size:12px;margin-top:24px">1325.AI — a Mansa Musa Marketplace company. This email confirms an electronic signature under the U.S. ESIGN Act.</p>
            </div>`,
        });

        const adminTo = Deno.env.get("SPONSORSHIP_NOTIFY_EMAIL") || "partnerships@1325.ai";
        await resend.emails.send({
          from: "1325.AI Platform <partnerships@1325.ai>",
          to: [adminTo],
          subject: `New sponsorship signed — ${b.company_name} (${tier.name}, ${usd(annualCents)}/yr)`,
          html: `
            <div style="font-family:Helvetica,Arial,sans-serif;max-width:640px;margin:auto">
              <h2 style="color:#003366">New signed sponsorship agreement</h2>
              ${record}
              <p style="margin-top:16px"><b>Next step:</b> review and send the draft invoice from the admin sponsorship agreements page.</p>
            </div>`,
        });
      }
    } catch (emailErr) {
      console.error("[sign-sponsor-agreement] email failed:", emailErr);
    }

    return new Response(
      JSON.stringify({
        success: true,
        id: row.id,
        tier_name: tier.name,
        installment_amount_cents: installmentCents,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[sign-sponsor-agreement] ERROR:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
