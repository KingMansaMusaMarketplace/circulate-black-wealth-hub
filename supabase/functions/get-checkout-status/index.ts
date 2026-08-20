import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-csrf-token",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const log = (step: string, details?: unknown) =>
  console.log(
    `[GET-CHECKOUT-STATUS] ${step}${details ? ` - ${JSON.stringify(details)}` : ""}`,
  );

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
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not configured");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "NOT_AUTHENTICATED" }, 401);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } },
    );
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData.user) return json({ error: "NOT_AUTHENTICATED" }, 401);
    const user = userData.user;

    const body = await req.json().catch(() => ({}));
    const sessionId = typeof body?.session_id === "string" ? body.session_id : "";
    if (!sessionId || !/^cs_[A-Za-z0-9_]+$/.test(sessionId)) {
      return json({ error: "INVALID_SESSION_ID" }, 400);
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Ownership check: the session must belong to this signed-in user
    const sessionEmail =
      session.customer_details?.email ||
      (session.metadata?.email as string | undefined) ||
      null;
    const ownsByEmail =
      !!sessionEmail && !!user.email &&
      sessionEmail.toLowerCase() === user.email.toLowerCase();
    const ownsByMetadata = session.metadata?.user_id === user.id;
    if (!ownsByEmail && !ownsByMetadata) {
      log("Ownership check failed", { sessionId, userId: user.id });
      return json({ error: "NOT_YOUR_SESSION" }, 403);
    }

    let subscriptionStatus: string | null = null;
    let currentPeriodEnd: string | null = null;
    let trialEnd: string | null = null;
    let interval: string | null = null;
    let recurringAmount: number | null = null;
    const subscriptionId =
      typeof session.subscription === "string"
        ? session.subscription
        : session.subscription?.id;

    if (subscriptionId) {
      const sub = await stripe.subscriptions.retrieve(subscriptionId);
      subscriptionStatus = sub.status;
      currentPeriodEnd = sub.current_period_end
        ? new Date(sub.current_period_end * 1000).toISOString()
        : null;
      trialEnd = sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null;
      interval = sub.items.data[0]?.price?.recurring?.interval ?? null;
      recurringAmount = sub.items.data.reduce((total, item) => {
        const unit = item.price?.unit_amount ?? 0;
        return total + unit * (item.quantity ?? 1);
      }, 0) / 100;
    }

    // Fall back to the session line items when the subscription is not readable yet
    if (recurringAmount === null || recurringAmount === 0) {
      try {
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 20 });
        const fromLines = lineItems.data.reduce((total, li) => {
          const unit = li.price?.unit_amount ?? 0;
          return total + unit * (li.quantity ?? 1);
        }, 0) / 100;
        if (fromLines > 0) recurringAmount = fromLines;
        if (!interval) interval = lineItems.data[0]?.price?.recurring?.interval ?? null;
      } catch (_e) {
        // non-fatal
      }
    }


    // Has our own database recorded them as subscribed yet?
    let accessUnlocked = false;
    if (user.email) {
      const { data: subscriber } = await supabase
        .from("subscribers")
        .select("subscribed, subscription_tier")
        .eq("email", user.email)
        .maybeSingle();
      accessUnlocked = !!subscriber?.subscribed;
    }

    const paid = session.payment_status === "paid" || session.payment_status === "no_payment_required";

    return json({
      session_id: session.id,
      payment_status: session.payment_status,
      paid,
      amount_total: (session.amount_total ?? 0) / 100,
      amount_due_now: (session.amount_total ?? 0) / 100,
      currency: (session.currency ?? "usd").toUpperCase(),
      mode: session.mode,
      interval,
      tier: (session.metadata?.tier as string | undefined) ?? null,
      subscription_status: subscriptionStatus,
      current_period_end: currentPeriodEnd,
      trial_end: trialEnd,
      access_unlocked: accessUnlocked,
      customer_email: sessionEmail,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    log("ERROR", { message });
    return json({ error: message }, 500);
  }
});
