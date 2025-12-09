import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

// CORS configuration with origin validation
const getAllowedOrigins = (): string[] => {
  const origins = Deno.env.get('ALLOWED_ORIGINS');
  if (origins) {
    return origins.split(',').map(o => o.trim());
  }
  return [
    'https://agoclnqfyinwjxdmjnns.lovableproject.com',
    'https://lovable.dev',
    'http://localhost:5173',
    'http://localhost:3000'
  ];
};

const getCorsHeaders = (req: Request): Record<string, string> => {
  const origin = req.headers.get('origin') || '';
  const allowedOrigins = getAllowedOrigins();
  const isAllowed = allowedOrigins.includes(origin) || allowedOrigins.includes('*');
  
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : allowedOrigins[0],
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
};

// Platform fee percentage (adjustable per business tier)
const DEFAULT_PLATFORM_FEE_PERCENTAGE = 2.50; // 2.5%

// Input validation schema
const paymentIntentSchema = z.object({
  businessId: z.string().uuid(),
  amount: z.number().positive().max(999999.99),
  description: z.string().max(500).optional().default("Payment"),
  customerEmail: z.string().email().max(255).optional(),
  customerName: z.string().max(100).optional(),
  metadata: z.record(z.string()).optional().default({}),
});

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !user) {
      throw new Error("User not authenticated");
    }

    // Parse and validate input
    const rawBody = await req.json();
    const parseResult = paymentIntentSchema.safeParse(rawBody);
    
    if (!parseResult.success) {
      console.error("Validation failed:", parseResult.error.errors);
      return new Response(
        JSON.stringify({ error: "Invalid request data", details: parseResult.error.errors }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const { businessId, amount, description, customerEmail, customerName, metadata } = parseResult.data;

    // Get business Stripe account
    const { data: paymentAccount, error: accountError } = await supabaseClient
      .from("business_payment_accounts")
      .select("stripe_account_id, account_status, charges_enabled")
      .eq("business_id", businessId)
      .single();

    if (accountError || !paymentAccount) {
      throw new Error("Business payment account not found. Please set up Stripe Connect first.");
    }

    if (paymentAccount.account_status !== "active" || !paymentAccount.charges_enabled) {
      throw new Error("Business account is not ready to accept payments");
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Calculate platform fee
    const amountInCents = Math.round(amount * 100);
    const platformFeeInCents = Math.round(amountInCents * (DEFAULT_PLATFORM_FEE_PERCENTAGE / 100));
    const businessAmountInCents = amountInCents - platformFeeInCents;

    // Create payment intent with application fee (platform fee)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      application_fee_amount: platformFeeInCents,
      transfer_data: {
        destination: paymentAccount.stripe_account_id,
      },
      description,
      metadata: {
        business_id: businessId,
        customer_id: user.id,
        ...metadata,
      },
      receipt_email: customerEmail,
    });

    // Record transaction in database
    await supabaseClient
      .from("platform_transactions")
      .insert({
        business_id: businessId,
        customer_id: user.id,
        stripe_payment_intent_id: paymentIntent.id,
        amount_total: amount,
        amount_business: businessAmountInCents / 100,
        amount_platform_fee: platformFeeInCents / 100,
        platform_fee_percentage: DEFAULT_PLATFORM_FEE_PERCENTAGE,
        status: "pending",
        description,
        customer_email: customerEmail || user.email,
        customer_name: customerName,
        metadata: metadata,
      });

    return new Response(
      JSON.stringify({ 
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: amount,
        platformFee: platformFeeInCents / 100,
        businessAmount: businessAmountInCents / 100,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Create payment intent error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
