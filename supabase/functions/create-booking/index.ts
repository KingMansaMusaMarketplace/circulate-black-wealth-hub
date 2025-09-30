import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const PLATFORM_FEE_PERCENTAGE = 2.5; // 2.5% platform fee

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
      .select("*, businesses:business_id(stripe_account_id)")
      .eq("id", serviceId)
      .single();

    if (serviceError || !service) {
      throw new Error("Service not found");
    }

    // Get business payment account
    const { data: paymentAccount, error: accountError } = await supabase
      .from("business_payment_accounts")
      .select("stripe_account_id, charges_enabled")
      .eq("business_id", businessId)
      .single();

    if (accountError || !paymentAccount) {
      throw new Error("Business payment account not found");
    }

    if (!paymentAccount.charges_enabled) {
      throw new Error("Business cannot accept payments yet");
    }

    // Calculate fees
    const amount = Math.round(service.price * 100); // Convert to cents
    const platformFee = Math.round(amount * (PLATFORM_FEE_PERCENTAGE / 100));
    const businessAmount = amount - platformFee;

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      application_fee_amount: platformFee,
      transfer_data: {
        destination: paymentAccount.stripe_account_id,
      },
      metadata: {
        businessId,
        serviceId,
        bookingDate,
        customerId: user.id,
      },
      description: `Booking: ${service.name}`,
      receipt_email: customerEmail,
    });

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
        platform_fee: platformFee / 100,
        business_amount: businessAmount / 100,
        status: "pending",
        payment_intent_id: paymentIntent.id,
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

    console.log("Booking created successfully:", booking.id);

    return new Response(
      JSON.stringify({
        success: true,
        booking,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error creating booking:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
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
