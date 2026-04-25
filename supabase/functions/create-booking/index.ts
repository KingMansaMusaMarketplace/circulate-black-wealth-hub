import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const COMMISSION_RATE = 7.5; // 7.5% platform commission

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    const {
      businessId,
      serviceId,
      bookingDate,
      customerName,
      customerEmail,
      customerPhone,
      notes,
    } = await req.json();

    console.log("Creating booking:", {
      businessId,
      serviceId,
      bookingDate,
      customerEmail,
    });

    // Get service details
    const { data: service, error: serviceError } = await supabase
      .from("business_services")
      .select("*")
      .eq("id", serviceId)
      .single();

    if (serviceError || !service) {
      console.error("Service error:", serviceError);
      throw new Error("Service not found");
    }

    // Calculate fees with 7.5% commission
    const amount = Math.round(service.price * 100); // Convert to cents
    const commission = Math.round(amount * (COMMISSION_RATE / 100));
    const businessAmount = amount - commission;

    // Check if business has Stripe payment account
    const { data: paymentAccount } = await supabase
      .from("business_payment_accounts")
      .select("stripe_account_id, charges_enabled")
      .eq("business_id", businessId)
      .maybeSingle();

    const hasStripe = paymentAccount?.stripe_account_id && paymentAccount?.charges_enabled;
    
    let paymentIntent = null;
    let checkoutUrl = null;

    if (hasStripe) {
      // Initialize Stripe and create payment
      const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
        apiVersion: "2023-10-16",
      });

      // Create Stripe Checkout session for payment
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        customer_email: customerEmail,
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: service.name,
                description: `Booking with ${customerName} on ${new Date(bookingDate).toLocaleDateString()}`,
              },
              unit_amount: amount,
            },
            quantity: 1,
          },
        ],
        payment_intent_data: {
          application_fee_amount: commission,
          transfer_data: {
            destination: paymentAccount.stripe_account_id,
          },
          metadata: {
            businessId,
            serviceId,
            bookingDate,
            customerId: user.id,
            commissionRate: COMMISSION_RATE.toString(),
          },
        },
        success_url: `${req.headers.get("origin")}/customer/bookings?payment=success`,
        cancel_url: `${req.headers.get("origin")}/customer/bookings?payment=cancelled`,
      });

      checkoutUrl = session.url;
      paymentIntent = { id: session.payment_intent as string };
    }

    // Create booking record
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        business_id: businessId,
        customer_id: user.id,
        service_id: serviceId,
        booking_date: bookingDate,
        duration_minutes: service.duration_minutes,
        amount: service.price,
        platform_fee: commission / 100,
        business_amount: businessAmount / 100,
        status: hasStripe ? "pending" : "confirmed",
        payment_intent_id: paymentIntent?.id || null,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        notes,
      })
      .select()
      .single();

    if (bookingError) {
      console.error("Booking creation error:", bookingError);
      throw bookingError;
    }

    console.log("Booking created successfully:", booking.id, hasStripe ? "with Stripe" : "without Stripe (pay at location)");

    // Record commission transaction
    try {
      const { error: commissionError } = await supabase.rpc('record_commission', {
        p_transaction_id: null,
        p_booking_id: booking.id,
        p_business_id: businessId,
        p_amount: service.price,
        p_transaction_type: 'booking'
      });

      if (commissionError) {
        console.error("Commission recording error:", commissionError);
      } else {
        console.log("Commission recorded for booking:", booking.id);
      }
    } catch (commError) {
      console.error("Failed to record commission:", commError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        booking,
        checkoutUrl,
        hasStripe,
        paymentIntentId: paymentIntent?.id || null,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error creating booking:", error);
    const errorMessage = error instanceof Error ? (error as Error).message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
