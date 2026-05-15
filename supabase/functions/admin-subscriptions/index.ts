import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-csrf-token",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const log = (s: string, d?: unknown) =>
  console.log(`[admin-subscriptions] ${s}${d ? " " + JSON.stringify(d) : ""}`);

interface Body {
  action:
    | "lookup"
    | "list_prices"
    | "change_tier"
    | "comp_month"
    | "issue_credit"
    | "cancel";
  email?: string;
  subscription_id?: string;
  customer_id?: string;
  new_price_id?: string;
  amount_cents?: number; // for credit (positive number)
  reason?: string;
  cancel_immediately?: boolean;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY not configured");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return json({ error: "Unauthorized" }, 401);
    }
    const token = authHeader.replace("Bearer ", "");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } }
    );

    const { data: userData, error: userErr } = await supabase.auth.getUser(token);
    if (userErr || !userData.user) return json({ error: "Unauthorized" }, 401);
    const user = userData.user;

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id);
    const isAdmin = (roles ?? []).some((r: any) => r.role === "admin");
    if (!isAdmin) return json({ error: "Forbidden: admin only" }, 403);

    const body = (await req.json()) as Body;
    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    const audit = async (action: string, recordId?: string, note?: string) => {
      await supabase.from("security_audit_log").insert({
        action: `admin_${action}`,
        table_name: "stripe.subscriptions",
        record_id: recordId ?? null,
        user_id: user.id,
        user_agent: note ?? null,
      });
    };

    log("action", body.action);

    switch (body.action) {
      case "list_prices": {
        const prices = await stripe.prices.list({ active: true, limit: 100, expand: ["data.product"] });
        return json({
          prices: prices.data.map((p) => ({
            id: p.id,
            nickname: p.nickname,
            unit_amount: p.unit_amount,
            currency: p.currency,
            recurring: p.recurring,
            product_name: typeof p.product === "object" && p.product && "name" in p.product ? (p.product as any).name : null,
          })),
        });
      }

      case "lookup": {
        if (!body.email) return json({ error: "email required" }, 400);
        const customers = await stripe.customers.list({ email: body.email, limit: 5 });
        if (customers.data.length === 0) return json({ found: false });
        const customer = customers.data[0];
        const subs = await stripe.subscriptions.list({
          customer: customer.id,
          status: "all",
          limit: 10,
          expand: ["data.items.data.price.product"],
        });
        const invoices = await stripe.invoices.list({ customer: customer.id, limit: 5 });
        return json({
          found: true,
          customer: {
            id: customer.id,
            email: customer.email,
            name: customer.name,
            balance: customer.balance,
            created: customer.created,
          },
          subscriptions: subs.data.map((s) => ({
            id: s.id,
            status: s.status,
            current_period_end: s.current_period_end,
            cancel_at_period_end: s.cancel_at_period_end,
            items: s.items.data.map((it) => ({
              id: it.id,
              price_id: it.price.id,
              nickname: it.price.nickname,
              unit_amount: it.price.unit_amount,
              currency: it.price.currency,
              interval: it.price.recurring?.interval,
              product_name: typeof it.price.product === "object" && it.price.product && "name" in it.price.product ? (it.price.product as any).name : null,
            })),
          })),
          invoices: invoices.data.map((i) => ({
            id: i.id,
            number: i.number,
            amount_paid: i.amount_paid,
            status: i.status,
            created: i.created,
            hosted_invoice_url: i.hosted_invoice_url,
          })),
        });
      }

      case "change_tier": {
        if (!body.subscription_id || !body.new_price_id) return json({ error: "subscription_id and new_price_id required" }, 400);
        const sub = await stripe.subscriptions.retrieve(body.subscription_id);
        const itemId = sub.items.data[0].id;
        const updated = await stripe.subscriptions.update(body.subscription_id, {
          items: [{ id: itemId, price: body.new_price_id }],
          proration_behavior: "create_prorations",
        });
        await audit("subscription_change_tier", body.subscription_id, `new_price=${body.new_price_id}`);
        return json({ success: true, subscription: { id: updated.id, status: updated.status } });
      }

      case "comp_month": {
        if (!body.subscription_id) return json({ error: "subscription_id required" }, 400);
        // Create a 100% off, once coupon and apply to the subscription
        const coupon = await stripe.coupons.create({
          percent_off: 100,
          duration: "once",
          name: `Comp by admin ${new Date().toISOString().slice(0, 10)}`,
        });
        const updated = await stripe.subscriptions.update(body.subscription_id, {
          discounts: [{ coupon: coupon.id }],
        } as any);
        await audit("subscription_comp_month", body.subscription_id, `coupon=${coupon.id} reason=${body.reason ?? ""}`);
        return json({ success: true, coupon_id: coupon.id, subscription_id: updated.id });
      }

      case "issue_credit": {
        if (!body.customer_id || !body.amount_cents || body.amount_cents <= 0) {
          return json({ error: "customer_id and positive amount_cents required" }, 400);
        }
        // Stripe customer balance: negative = credit (customer owes less)
        const customer = await stripe.customers.retrieve(body.customer_id);
        const currentBalance = (customer as Stripe.Customer).balance ?? 0;
        const newBalance = currentBalance - body.amount_cents;
        const updated = await stripe.customers.update(body.customer_id, { balance: newBalance });
        await audit("subscription_issue_credit", body.customer_id, `amount_cents=${body.amount_cents} reason=${body.reason ?? ""}`);
        return json({ success: true, new_balance: updated.balance });
      }

      case "cancel": {
        if (!body.subscription_id) return json({ error: "subscription_id required" }, 400);
        let sub: Stripe.Subscription;
        if (body.cancel_immediately) {
          sub = await stripe.subscriptions.cancel(body.subscription_id);
        } else {
          sub = await stripe.subscriptions.update(body.subscription_id, { cancel_at_period_end: true });
        }
        await audit("subscription_cancel", body.subscription_id, body.cancel_immediately ? "immediate" : "at_period_end");
        return json({ success: true, status: sub.status, cancel_at_period_end: sub.cancel_at_period_end });
      }

      default:
        return json({ error: "Unknown action" }, 400);
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    log("ERROR", { msg });
    return json({ error: msg }, 500);
  }
});

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
