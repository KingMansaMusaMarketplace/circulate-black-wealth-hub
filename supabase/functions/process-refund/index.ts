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
  console.log(`[process-refund] ${s}${d ? " " + JSON.stringify(d) : ""}`);

type RecordType = "vacation_booking" | "noir_ride";

interface Body {
  record_type: RecordType;
  record_id: string;
  amount?: number; // dollars; omit for full refund
  reason?: "duplicate" | "fraudulent" | "requested_by_customer";
  notes?: string;
}

const TABLE: Record<RecordType, string> = {
  vacation_booking: "vacation_bookings",
  noir_ride: "noir_rides",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY not configured");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const token = authHeader.replace("Bearer ", "");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } }
    );

    const { data: userData, error: userErr } = await supabase.auth.getUser(token);
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const user = userData.user;

    // Admin role check
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id);
    const isAdmin = (roles ?? []).some((r: any) => r.role === "admin");
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden: admin only" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = (await req.json()) as Body;
    if (!body?.record_type || !body?.record_id) {
      return new Response(JSON.stringify({ error: "record_type and record_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const table = TABLE[body.record_type];
    if (!table) {
      return new Response(JSON.stringify({ error: "Invalid record_type" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    log("loading record", { table, id: body.record_id });
    const { data: record, error: recErr } = await supabase
      .from(table)
      .select("*")
      .eq("id", body.record_id)
      .single();
    if (recErr || !record) throw new Error("Record not found");

    const paymentIntentId: string | null =
      record.payment_intent_id ?? null;
    if (!paymentIntentId) {
      return new Response(
        JSON.stringify({ error: "No Stripe payment_intent_id on this record" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    const refundParams: Stripe.RefundCreateParams = {
      payment_intent: paymentIntentId,
    };
    if (body.amount && body.amount > 0) {
      refundParams.amount = Math.round(body.amount * 100);
    }
    if (body.reason) refundParams.reason = body.reason;

    log("creating Stripe refund", refundParams);
    const refund = await stripe.refunds.create(refundParams);
    log("refund created", { id: refund.id, status: refund.status });

    const refundedDollars = (refund.amount ?? 0) / 100;
    const update: Record<string, unknown> = {
      refund_amount: refundedDollars,
      refund_status: refund.status === "succeeded" ? "refunded" : refund.status,
      refund_id: refund.id,
      refunded_at: new Date().toISOString(),
    };
    if (body.record_type === "noir_ride") {
      update.refund_reason = body.notes ?? body.reason ?? null;
    } else if (body.notes) {
      const prefix = record.admin_notes ? `${record.admin_notes}\n` : "";
      update.admin_notes = `${prefix}[Refund ${new Date().toLocaleDateString()}] ${body.notes}`;
    }

    const { error: updErr } = await supabase
      .from(table)
      .update(update)
      .eq("id", body.record_id);
    if (updErr) throw new Error("DB update failed: " + updErr.message);

    // Audit log
    await supabase.from("security_audit_log").insert({
      action: "admin_stripe_refund",
      table_name: table,
      record_id: body.record_id,
      user_id: user.id,
      user_agent: `refund_id=${refund.id} amount=$${refundedDollars} reason=${body.reason ?? "n/a"}`,
    });

    return new Response(
      JSON.stringify({
        success: true,
        refund_id: refund.id,
        status: refund.status,
        amount: refundedDollars,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    log("ERROR", { msg });
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
