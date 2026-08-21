import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-csrf-token, x-admin-secret",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // AuthN/AuthZ: admin JWT or cron secret
    const adminSecret = req.headers.get("x-admin-secret");
    let authorized = !!adminSecret && adminSecret === Deno.env.get("CRON_SECRET");

    if (!authorized) {
      const jwt = (req.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
      if (jwt) {
        const { data: userData } = await supabase.auth.getUser(jwt);
        if (userData?.user) {
          const { data: isAdmin } = await supabase.rpc("has_role", {
            _user_id: userData.user.id,
            _role: "admin",
          });
          if (isAdmin) authorized = true;
        }
      }
    }

    if (!authorized) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not configured");
    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    let days = 90;
    try {
      const body = await req.json();
      if (body && typeof body.days === "number" && body.days > 0 && body.days <= 365) {
        days = Math.floor(body.days);
      }
    } catch {
      // no body — use defaults
    }

    const since = Math.floor(Date.now() / 1000) - days * 86400;

    type Row = {
      id: string;
      created: number;
      status: string;
      payment_status: string;
      mode: string;
      amount: number;
      currency: string;
      email: string | null;
      name: string | null;
      phone: string | null;
      customer_id: string | null;
      recovery_url: string | null;
    };

    const abandoned: Row[] = [];
    let completedCount = 0;
    let totalCount = 0;
    let startingAfter: string | undefined = undefined;

    // Page through sessions (cap pages so we never run away)
    for (let page = 0; page < 20; page++) {
      const res = await stripe.checkout.sessions.list({
        limit: 100,
        created: { gte: since },
        ...(startingAfter ? { starting_after: startingAfter } : {}),
      });

      for (const s of res.data) {
        totalCount++;
        if (s.payment_status === "paid" || s.status === "complete") {
          completedCount++;
          continue;
        }
        const d = s.customer_details;
        abandoned.push({
          id: s.id,
          created: s.created,
          status: s.status ?? "unknown",
          payment_status: s.payment_status ?? "unpaid",
          mode: s.mode ?? "payment",
          amount: (s.amount_total ?? 0) / 100,
          currency: (s.currency ?? "usd").toUpperCase(),
          email: d?.email ?? s.customer_email ?? null,
          name: d?.name ?? null,
          phone: d?.phone ?? null,
          customer_id: typeof s.customer === "string" ? s.customer : null,
          recovery_url: (s as unknown as { after_expiration?: { recovery?: { url?: string } } })
            .after_expiration?.recovery?.url ?? null,
        });
      }

      if (!res.has_more || res.data.length === 0) break;
      startingAfter = res.data[res.data.length - 1].id;
    }

    abandoned.sort((a, b) => b.created - a.created);

    const withContact = abandoned.filter((r) => r.email).length;
    const potentialValue = abandoned.reduce((sum, r) => sum + r.amount, 0);

    return new Response(
      JSON.stringify({
        days,
        summary: {
          total_sessions: totalCount,
          completed: completedCount,
          abandoned: abandoned.length,
          with_contact: withContact,
          conversion_rate: totalCount ? Math.round((completedCount / totalCount) * 1000) / 10 : 0,
          potential_value: Math.round(potentialValue * 100) / 100,
        },
        rows: abandoned,
      }),
      { headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[admin-abandoned-checkouts]", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
