import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[VACATION-BOOKING-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    logStep("Webhook received");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    if (!webhookSecret) throw new Error("STRIPE_WEBHOOK_SECRET is not set");

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const signature = req.headers.get("stripe-signature");
    if (!signature) throw new Error("No Stripe signature found");

    const body = await req.text();
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    logStep("Event verified", { type: event.type, id: event.id });

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const bookingId = session.metadata?.booking_id;
        
        if (!bookingId) {
          logStep("No booking_id in metadata, skipping");
          break;
        }

        logStep("Processing completed checkout", { bookingId, paymentStatus: session.payment_status });

        if (session.payment_status === "paid") {
          // Update booking status
          const { error } = await supabaseClient
            .from("vacation_bookings")
            .update({
              status: "confirmed",
              payment_status: "paid",
              paid_at: new Date().toISOString(),
            })
            .eq("id", bookingId);

          if (error) {
            logStep("Error updating booking", { error: error.message });
            throw error;
          }

          // Block dates in availability
          const { data: booking } = await supabaseClient
            .from("vacation_bookings")
            .select("property_id, check_in_date, check_out_date")
            .eq("id", bookingId)
            .single();

          if (booking) {
            const checkIn = new Date(booking.check_in_date);
            const checkOut = new Date(booking.check_out_date);
            const dates: { property_id: string; date: string; is_available: boolean; booking_id: string }[] = [];

            for (let d = new Date(checkIn); d < checkOut; d.setDate(d.getDate() + 1)) {
              dates.push({
                property_id: booking.property_id,
                date: d.toISOString().split('T')[0],
                is_available: false,
                booking_id: bookingId,
              });
            }

            // Upsert availability
            await supabaseClient
              .from("property_availability")
              .upsert(dates, { onConflict: "property_id,date" });

            logStep("Blocked dates for booking", { dates: dates.length });
          }

          // Create host payout record
          const hostPayout = parseFloat(session.metadata?.host_payout || "0");
          if (hostPayout > 0) {
            await supabaseClient
              .from("stays_host_payouts")
              .insert({
                host_id: session.metadata?.host_id,
                booking_id: bookingId,
                amount: hostPayout,
                platform_fee: parseFloat(session.metadata?.platform_fee || "0"),
                net_amount: hostPayout,
                status: "pending",
                payout_method: "stripe_connect",
              });
            logStep("Created payout record", { hostPayout });
          }

          logStep("Booking confirmed successfully", { bookingId });
        }
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const bookingId = paymentIntent.metadata?.booking_id;
        
        if (bookingId) {
          await supabaseClient
            .from("vacation_bookings")
            .update({
              payment_status: "paid",
              stripe_payment_intent_id: paymentIntent.id,
            })
            .eq("id", bookingId);
          logStep("Payment intent succeeded", { bookingId, paymentIntentId: paymentIntent.id });
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const bookingId = paymentIntent.metadata?.booking_id;
        
        if (bookingId) {
          await supabaseClient
            .from("vacation_bookings")
            .update({
              payment_status: "failed",
              status: "cancelled",
            })
            .eq("id", bookingId);
          logStep("Payment failed, booking cancelled", { bookingId });
        }
        break;
      }

      case "account.updated": {
        // Handle Stripe Connect account updates
        const account = event.data.object as Stripe.Account;
        
        if (account.metadata?.user_id) {
          const status = account.charges_enabled && account.payouts_enabled ? "active" : "pending";
          
          await supabaseClient
            .from("profiles")
            .update({ stripe_connect_status: status })
            .eq("id", account.metadata.user_id);

          // Update all properties for this host
          if (status === "active") {
            await supabaseClient
              .from("vacation_properties")
              .update({ host_stripe_account_id: account.id })
              .eq("host_id", account.metadata.user_id);
          }

          logStep("Updated Connect account status", { userId: account.metadata.user_id, status });
        }
        break;
      }

      default:
        logStep("Unhandled event type", { type: event.type });
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
