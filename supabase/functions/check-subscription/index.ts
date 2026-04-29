
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-csrf-token, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

// Authoritative price-id → tier map (must mirror create-checkout)
const PRICE_ID_TO_TIER: Record<string, string> = {
  // Kayla AI tiers
  'price_1TJ9yKAsptTW1mCmr8SJRK2g': 'kayla_essentials',          // $19/mo
  'price_1TJ9yjAsptTW1mCmJ8pWHUqs': 'kayla_essentials_annual',  // $190/yr
  'price_1TNLRpAsptTW1mCm5QvipN9l': 'kayla_starter',             // $79/mo
  'price_1TNLWEAsptTW1mCm2jha0NfY': 'kayla_starter_annual',     // $790/yr
  'price_1TNLSUAsptTW1mCmMW1G6Jfv': 'kayla_pro',                 // $299/mo
  'price_1TNLXeAsptTW1mCmb6dsvL2y': 'kayla_pro_annual',          // $2,990/yr
  'price_1TGzewAsptTW1mCmYKjYk0Fn': 'kayla_pro_founders',        // $149/mo Founders' Lock
  'price_1TNLTCAsptTW1mCmVEccEd1D': 'kayla_enterprise',          // $899/mo
  // Business tiers
  'price_1TNLRBAsptTW1mCmCpwvkqrV': 'business_pro',              // $39/mo
  'price_1TNLVlAsptTW1mCmedqECEFO': 'business_pro_annual',       // $390/yr
  // Sponsorship
  'price_1TNLUlAsptTW1mCm7rLwOuCq': 'sponsor_founding',          // $1,750/mo
};

// Helper function to determine subscription tier from price ID
const getTierFromPriceId = async (stripe: Stripe, priceId: string): Promise<string> => {
  // 1. Direct lookup against the canonical Stripe price-id map
  if (PRICE_ID_TO_TIER[priceId]) {
    console.log(`[CHECK-SUBSCRIPTION] Direct match for price ${priceId} -> ${PRICE_ID_TO_TIER[priceId]}`);
    return PRICE_ID_TO_TIER[priceId];
  }

  try {
    console.log(`[CHECK-SUBSCRIPTION] No direct match, retrieving price metadata for: ${priceId}`);
    const price = await stripe.prices.retrieve(priceId);

    // Corporate tier env-based fallback
    const silverPriceId = Deno.env.get("STRIPE_SILVER_PRICE_ID");
    const goldPriceId = Deno.env.get("STRIPE_GOLD_PRICE_ID");
    const platinumPriceId = Deno.env.get("STRIPE_PLATINUM_PRICE_ID");

    if (priceId === platinumPriceId) return "platinum";
    if (priceId === goldPriceId) return "gold";
    if (priceId === silverPriceId) return "silver";

    // Final fallback: amount-based bucketing for legacy/unknown prices
    const amount = price.unit_amount || 0;
    if (amount >= 1000000) return "platinum";
    if (amount >= 500000) return "gold";
    if (amount >= 200000) return "silver";
    if (amount <= 1999) return "kayla_essentials"; // $0–$19 → Essentials
    if (amount <= 3999) return "business_pro";     // $20–$39 → Business Pro
    if (amount <= 9999) return "kayla_starter";    // $40–$99 → Starter
    if (amount <= 29999) return "kayla_pro";       // $100–$299 → Pro
    return "kayla_enterprise";
  } catch (error) {
    console.error("Error retrieving price:", error);
    return "unknown";
  }
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("[CHECK-SUBSCRIPTION] Function started");
    // Get auth token from request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }
    
    const token = authHeader.replace("Bearer ", "");
    
    // Create Supabase client with service role key to bypass RLS
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );
    
    // Get user from auth token
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    if (userError || !user) {
      throw new Error("Error getting user or user not found");
    }

    console.log(`[CHECK-SUBSCRIPTION] User authenticated: ${user.email}`);

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Find customer by email
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1,
    });

    // If no customer found, user is not subscribed
    if (customers.data.length === 0) {
      console.log(`[CHECK-SUBSCRIPTION] No Stripe customer found for email: ${user.email}`);
      await supabaseAdmin.from("subscribers").upsert({
        email: user.email,
        user_id: user.id,
        stripe_customer_id: null,
        subscribed: false,
        subscription_tier: null,
        subscription_end: null,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'email' });
      
      return new Response(JSON.stringify({ 
        subscribed: false,
        subscription_tier: null,
        subscription_end: null
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    console.log(`[CHECK-SUBSCRIPTION] Customer found: ${customerId}`);
    
    // Check for active OR trialing subscriptions (Essentials/Starter ship with a 30-day trial)
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "all",
      limit: 10,
    });

    const activeOrTrialing = subscriptions.data.find(
      (s) => s.status === "active" || s.status === "trialing"
    );
    const hasActiveSub = !!activeOrTrialing;
    let subscriptionTier = null;
    let subscriptionEnd = null;
    let trialEnd: string | null = null;
    let status: string | null = null;

    if (hasActiveSub && activeOrTrialing) {
      const endTs = activeOrTrialing.current_period_end || activeOrTrialing.trial_end;
      subscriptionEnd = endTs ? new Date(endTs * 1000).toISOString() : null;
      trialEnd = activeOrTrialing.trial_end ? new Date(activeOrTrialing.trial_end * 1000).toISOString() : null;
      status = activeOrTrialing.status;

      const priceId = activeOrTrialing.items.data[0].price.id;
      console.log(`[CHECK-SUBSCRIPTION] ${activeOrTrialing.status} subscription found with price ID: ${priceId}`);
      subscriptionTier = await getTierFromPriceId(stripe, priceId);
      console.log(`[CHECK-SUBSCRIPTION] Determined tier: ${subscriptionTier}`);
    } else {
      // Surface payment-failure / cancellation states even when not "active"
      const problem = subscriptions.data.find(
        (s) => s.status === "past_due" || s.status === "unpaid" || s.status === "incomplete"
      );
      const canceled = subscriptions.data.find((s) => s.status === "canceled");
      const surfaced = problem || canceled;
      if (surfaced) {
        status = surfaced.status;
        const endTs = surfaced.current_period_end;
        subscriptionEnd = endTs ? new Date(endTs * 1000).toISOString() : null;
        try {
          subscriptionTier = await getTierFromPriceId(stripe, surfaced.items.data[0].price.id);
        } catch (_e) { /* ignore */ }
      }
      console.log(`[CHECK-SUBSCRIPTION] No active subscription. Surfaced status: ${status}`);
    }

    await supabaseAdmin.from("subscribers").upsert({
      email: user.email,
      user_id: user.id,
      stripe_customer_id: customerId,
      subscribed: hasActiveSub,
      subscription_tier: subscriptionTier,
      subscription_end: subscriptionEnd,
      status,
      trial_end: trialEnd,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'email' });

    console.log(`[CHECK-SUBSCRIPTION] Updated subscriber record: ${user.email}, tier: ${subscriptionTier}, subscribed: ${hasActiveSub}, status: ${status}`);

    return new Response(JSON.stringify({
      subscribed: hasActiveSub,
      subscription_tier: subscriptionTier,
      subscription_end: subscriptionEnd,
      status,
      trial_end: trialEnd,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("Subscription check error:", error);
    return new Response(JSON.stringify({ error: error?.message || 'Unknown error' }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
