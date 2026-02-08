import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PLATFORM_FEE_PERCENT = 7.5; // 7.5% platform commission

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-VACATION-BOOKING] ${step}${detailsStr}`);
};

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
    logStep("User authenticated", { userId: user.id, email: user.email });

    const {
      propertyId,
      checkInDate,
      checkOutDate,
      numGuests,
      numPets = 0,
      guestName,
      guestEmail,
      guestPhone,
      specialRequests,
    } = await req.json();

    logStep("Request parsed", { propertyId, checkInDate, checkOutDate, numGuests, numPets });

    // Get property details
    const { data: property, error: propertyError } = await supabase
      .from("vacation_properties")
      .select("*")
      .eq("id", propertyId)
      .eq("is_active", true)
      .single();

    if (propertyError || !property) {
      logStep("Property error", { error: propertyError?.message });
      throw new Error("Property not found or not available");
    }
    logStep("Property fetched", { title: property.title, hostId: property.host_id });

    // Check availability for the date range
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

    if (nights < property.min_nights) {
      throw new Error(`Minimum stay is ${property.min_nights} nights`);
    }

    if (property.max_nights && nights > property.max_nights) {
      throw new Error(`Maximum stay is ${property.max_nights} nights`);
    }

    // Check for existing bookings in date range
    const { data: conflicts } = await supabase
      .from("property_availability")
      .select("date")
      .eq("property_id", propertyId)
      .eq("is_available", false)
      .gte("date", checkInDate)
      .lt("date", checkOutDate);

    if (conflicts && conflicts.length > 0) {
      throw new Error("Some dates are no longer available. Please select different dates.");
    }

    // Also check vacation_bookings for confirmed bookings
    const { data: existingBookings } = await supabase
      .from("vacation_bookings")
      .select("id")
      .eq("property_id", propertyId)
      .in("status", ["confirmed", "pending"])
      .or(`check_in_date.lt.${checkOutDate},check_out_date.gt.${checkInDate}`);

    if (existingBookings && existingBookings.length > 0) {
      throw new Error("Property already booked for selected dates");
    }
    logStep("Availability confirmed");

    // Calculate pricing
    const nightlyRate = parseFloat(property.base_nightly_rate);
    const cleaningFee = parseFloat(property.cleaning_fee || 0);
    const petFee = property.pets_allowed && numPets > 0 
      ? parseFloat(property.pet_fee || 0) * numPets 
      : 0;

    const subtotal = nights * nightlyRate;
    const totalBeforeFee = subtotal + cleaningFee + petFee;
    const platformFee = totalBeforeFee * (PLATFORM_FEE_PERCENT / 100);
    const total = totalBeforeFee + platformFee;
    const hostPayout = totalBeforeFee; // Host gets full amount minus platform fee

    logStep("Pricing calculated", { nights, subtotal, cleaningFee, petFee, platformFee, total, hostPayout });

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Check/create Stripe customer
    const customers = await stripe.customers.list({ email: user.email!, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    } else {
      const customer = await stripe.customers.create({
        email: user.email!,
        name: guestName || user.user_metadata?.full_name,
        metadata: { user_id: user.id }
      });
      customerId = customer.id;
    }
    logStep("Stripe customer ready", { customerId });

    // Create booking record first
    const { data: booking, error: bookingError } = await supabase
      .from("vacation_bookings")
      .insert({
        property_id: propertyId,
        guest_id: user.id,
        host_id: property.host_id,
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
        num_guests: numGuests,
        num_pets: numPets,
        nightly_rate: nightlyRate,
        cleaning_fee: cleaningFee,
        pet_fee: petFee,
        service_fee: platformFee,
        total_price: total,
        host_payout: hostPayout,
        guest_name: guestName || user.user_metadata?.full_name,
        guest_email: guestEmail || user.email,
        guest_phone: guestPhone,
        special_requests: specialRequests,
        status: "pending",
        payment_status: "pending",
      })
      .select()
      .single();

    if (bookingError) {
      logStep("Booking creation error", { error: bookingError.message });
      throw new Error(`Failed to create booking: ${bookingError.message}`);
    }
    logStep("Booking created", { bookingId: booking.id });

    // Build line items for Stripe Checkout
    const origin = req.headers.get("origin") || "https://circulate-black-wealth-hub.lovable.app";
    
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price_data: {
          currency: "usd",
          unit_amount: Math.round(subtotal * 100),
          product_data: {
            name: `${property.title} - ${nights} night${nights > 1 ? 's' : ''}`,
            description: `${checkInDate} to ${checkOutDate}`,
            images: property.photos?.length > 0 ? [property.photos[0]] : [],
          },
        },
        quantity: 1,
      },
    ];

    if (cleaningFee > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          unit_amount: Math.round(cleaningFee * 100),
          product_data: { name: "Cleaning Fee" },
        },
        quantity: 1,
      });
    }

    if (petFee > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          unit_amount: Math.round(petFee * 100),
          product_data: { name: `Pet Fee (${numPets} pet${numPets > 1 ? 's' : ''})` },
        },
        quantity: 1,
      });
    }

    lineItems.push({
      price_data: {
        currency: "usd",
        unit_amount: Math.round(platformFee * 100),
        product_data: { 
          name: "Service Fee",
          description: "Platform booking fee (7.5%)"
        },
      },
      quantity: 1,
    });

    // Create checkout session
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      customer: customerId,
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/stays/booking-confirmation?booking_id=${booking.id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/stays/property/${propertyId}?booking_cancelled=true`,
      metadata: {
        booking_id: booking.id,
        property_id: propertyId,
        host_id: property.host_id,
        platform_fee: platformFee.toFixed(2),
        host_payout: hostPayout.toFixed(2),
      },
      payment_intent_data: {
        metadata: {
          booking_id: booking.id,
          property_id: propertyId,
          host_id: property.host_id,
        },
      },
    };

    // If host has Stripe Connect, add transfer
    if (property.host_stripe_account_id) {
      sessionParams.payment_intent_data!.transfer_data = {
        destination: property.host_stripe_account_id,
        amount: Math.round(hostPayout * 100),
      };
      logStep("Stripe Connect transfer configured", { 
        hostAccountId: property.host_stripe_account_id,
        transferAmount: hostPayout 
      });
    }

    const session = await stripe.checkout.sessions.create(sessionParams);
    logStep("Checkout session created", { sessionId: session.id });

    // Update booking with session ID
    await supabase
      .from("vacation_bookings")
      .update({ 
        stripe_payment_intent_id: session.payment_intent as string,
      })
      .eq("id", booking.id);

    return new Response(
      JSON.stringify({
        success: true,
        booking: {
          id: booking.id,
          checkInDate: booking.check_in_date,
          checkOutDate: booking.check_out_date,
          nights,
          total,
          status: booking.status,
        },
        url: session.url,
        clientSecret: session.client_secret,
        paymentIntentId: session.payment_intent,
        pricing: {
          nightlyRate,
          nights,
          subtotal,
          cleaningFee,
          petFee,
          platformFee,
          total,
          hostPayout,
        },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    logStep("ERROR", { message: errorMessage });
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
