import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
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
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing authorization header");
    const token = authHeader.replace("Bearer ", "");

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const supabaseUser = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const { data: { user }, error: userErr } = await supabaseUser.auth.getUser(token);
    if (userErr || !user) throw new Error("Not authenticated");

    // Verify admin
    const { data: roleRow } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleRow) throw new Error("Admin access required");

    const { sponsorId } = await req.json();
    if (!sponsorId) throw new Error("Missing sponsorId");

    const { data: sub, error: subErr } = await supabaseAdmin
      .from("corporate_subscriptions")
      .select("stripe_customer_id, stripe_subscription_id")
      .eq("id", sponsorId)
      .single();

    if (subErr || !sub) throw new Error("Sponsor not found");

    if (!sub.stripe_customer_id) {
      return new Response(
        JSON.stringify({
          hasStripe: false,
          invoices: [],
          subscription: null,
          totalPaid: 0,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    const [invoicesRes, subscription] = await Promise.all([
      stripe.invoices.list({ customer: sub.stripe_customer_id, limit: 24 }),
      sub.stripe_subscription_id
        ? stripe.subscriptions.retrieve(sub.stripe_subscription_id).catch(() => null)
        : Promise.resolve(null),
    ]);

    const invoices = invoicesRes.data.map((inv) => ({
      id: inv.id,
      number: inv.number,
      status: inv.status,
      amount_paid: inv.amount_paid,
      amount_due: inv.amount_due,
      currency: inv.currency,
      created: inv.created,
      paid_at: inv.status_transitions?.paid_at ?? null,
      period_start: inv.period_start,
      period_end: inv.period_end,
      hosted_invoice_url: inv.hosted_invoice_url,
      invoice_pdf: inv.invoice_pdf,
    }));

    const totalPaid = invoices
      .filter((i) => i.status === "paid")
      .reduce((sum, i) => sum + (i.amount_paid || 0), 0);

    const subData = subscription
      ? {
          id: subscription.id,
          status: subscription.status,
          current_period_start: subscription.current_period_start,
          current_period_end: subscription.current_period_end,
          cancel_at_period_end: subscription.cancel_at_period_end,
          canceled_at: subscription.canceled_at,
        }
      : null;

    return new Response(
      JSON.stringify({
        hasStripe: true,
        invoices,
        subscription: subData,
        totalPaid,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("get-sponsor-billing error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? (error as Error).message : "Unknown error" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
