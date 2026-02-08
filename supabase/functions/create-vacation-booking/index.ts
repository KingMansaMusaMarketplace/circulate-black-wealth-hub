import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PLATFORM_FEE_PERCENT = 7.5; // 7.5% platform commission

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
      propertyId,
      checkInDate,
      checkOutDate,
      numGuests,
      numPets,
      guestName,
      guestEmail,
      guestPhone,
      specialRequests,
    } = await req.json();

    console.log("Creating vacation booking:", {
      propertyId,
      checkInDate,
      checkOutDate,
      guestEmail,
    });

    // Get property details
    const { data: property, error: propertyError } = await supabase
      .from("vacation_properties")
      .select("*, host_id")
      .eq("id", propertyId)
      .eq("is_active", true)
      .single();

    if (propertyError || !property) {
      console.error("Property error:", propertyError);
      throw new Error("Property not found or not available");
    }

    // Check if host has Stripe Connect set up
    // First check business_payment_accounts for the host
    const { data: paymentAccount, error: accountError } = await supabase
      .from("business_payment_accounts")
      .select("stripe_account_id, charges_enabled")
      .eq("user_id", property.host_id)
      .single();

    if (accountError || !paymentAccount) {
      console.error("Payment account error:", accountError);
      throw new Error("This host hasn't set up payment processing yet. Please contact the host directly.");
    }

    if (!paymentAccount.charges_enabled) {
      throw new Error("This host cannot accept payments yet. Payment setup is pending.");
    }

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
    const { data: conflicts, error: conflictError } = await supabase
      .from("property_availability")
      .select("date")
      .eq("property_id", propertyId)
      .eq("is_available", false)
      .gte("date", checkInDate)
      .lt("date", checkOutDate);

    if (conflictError) {
      console.error("Conflict check error:", conflictError);
      throw conflictError;
    }

    if (conflicts && conflicts.length > 0) {
      throw new Error("Some dates are no longer available. Please select different dates.");
    }

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

    // Convert to cents for Stripe
    const amountInCents = Math.round(total * 100);
    const platformFeeInCents = Math.round(platformFee * 100);

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Create payment intent with platform fee going to us
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      application_fee_amount: platformFeeInCents,
      transfer_data: {
        destination: paymentAccount.stripe_account_id,
      },
      metadata: {
        propertyId,
        checkInDate,
        checkOutDate,
        guestId: user.id,
        nights: nights.toString(),
        platformFeePercent: PLATFORM_FEE_PERCENT.toString(),
        type: "vacation_rental",
      },
      description: `Mansa Stays: ${property.title} - ${nights} nights`,
      receipt_email: guestEmail || user.email,
    });

    // Create booking record
    const { data: booking, error: bookingError } = await supabase
      .from("vacation_bookings")
      .insert({
        property_id: propertyId,
        guest_id: user.id,
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
        num_guests: numGuests,
        num_nights: nights,
        nightly_rate: nightlyRate,
        cleaning_fee: cleaningFee,
        pet_fee: petFee,
        subtotal: subtotal,
        platform_fee: platformFee,
        host_payout: hostPayout,
        total_amount: total,
        status: "pending",
        payment_intent_id: paymentIntent.id,
        guest_name: guestName || user.user_metadata?.full_name,
        guest_email: guestEmail || user.email,
        guest_phone: guestPhone,
        special_requests: specialRequests,
      })
      .select()
      .single();

    if (bookingError) {
      console.error("Booking creation error:", bookingError);
      throw bookingError;
    }

    console.log("Vacation booking created successfully:", booking.id);

    // Block the dates in availability calendar
    const datesToBlock: { property_id: string; date: string; is_available: boolean; booking_id: string }[] = [];
    const currentDate = new Date(checkInDate);
    const endDate = new Date(checkOutDate);

    while (currentDate < endDate) {
      datesToBlock.push({
        property_id: propertyId,
        date: currentDate.toISOString().split('T')[0],
        is_available: false,
        booking_id: booking.id,
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const { error: availabilityError } = await supabase
      .from("property_availability")
      .upsert(datesToBlock, { 
        onConflict: 'property_id,date',
        ignoreDuplicates: false 
      });

    if (availabilityError) {
      console.error("Availability update error:", availabilityError);
      // Don't fail the booking, just log the error
    }

    return new Response(
      JSON.stringify({
        success: true,
        booking: {
          id: booking.id,
          checkInDate: booking.check_in_date,
          checkOutDate: booking.check_out_date,
          nights,
          total: total,
          status: booking.status,
        },
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
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
    console.error("Error creating vacation booking:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
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
