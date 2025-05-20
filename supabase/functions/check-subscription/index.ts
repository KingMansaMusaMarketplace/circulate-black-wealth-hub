
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper function to determine subscription tier from price ID
const getTierFromPriceId = async (stripe: Stripe, priceId: string): Promise<string> => {
  try {
    console.log(`[CHECK-SUBSCRIPTION] Getting tier for price: ${priceId}`);
    const price = await stripe.prices.retrieve(priceId);
    
    // Get price ID for corporate tiers for direct comparison
    const silverPriceId = Deno.env.get("STRIPE_SILVER_PRICE_ID");
    const goldPriceId = Deno.env.get("STRIPE_GOLD_PRICE_ID");
    const platinumPriceId = Deno.env.get("STRIPE_PLATINUM_PRICE_ID");
    
    console.log(`[CHECK-SUBSCRIPTION] Comparing to corporate tiers: silver=${silverPriceId}, gold=${goldPriceId}, platinum=${platinumPriceId}`);
    
    // Check for exact match with corporate tier price IDs first
    if (priceId === platinumPriceId) {
      return "platinum";
    } else if (priceId === goldPriceId) {
      return "gold";
    } else if (priceId === silverPriceId) {
      return "silver";
    }
    
    // If no direct match, fall back to checking price amount
    const amount = price.unit_amount || 0;
    console.log(`[CHECK-SUBSCRIPTION] No direct match, checking amount: ${amount}`);
    
    // Corporate tier pricing - fallback based on price amounts
    if (amount >= 1000000) { // $10,000 (platinum)
      return "platinum";
    } else if (amount >= 500000) { // $5,000 (gold)
      return "gold";
    } else if (amount >= 200000) { // $2,000 (silver)
      return "silver";
    }
    
    // Regular subscription tiers
    if (amount <= 999) {
      return "basic";
    } else if (amount <= 1999) {
      return "premium";
    } else {
      return "enterprise";
    }
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
    
    // Check for active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });
    
    // Set subscription details
    const hasActiveSub = subscriptions.data.length > 0;
    let subscriptionTier = null;
    let subscriptionEnd = null;

    if (hasActiveSub) {
      const subscription = subscriptions.data[0];
      
      // Get subscription end date
      subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
      
      // Determine tier from price
      const priceId = subscription.items.data[0].price.id;
      console.log(`[CHECK-SUBSCRIPTION] Active subscription found with price ID: ${priceId}`);
      subscriptionTier = await getTierFromPriceId(stripe, priceId);
      console.log(`[CHECK-SUBSCRIPTION] Determined tier: ${subscriptionTier}`);
    } else {
      console.log(`[CHECK-SUBSCRIPTION] No active subscription found for customer: ${customerId}`);
    }

    // Update subscribers table with current status
    await supabaseAdmin.from("subscribers").upsert({
      email: user.email,
      user_id: user.id,
      stripe_customer_id: customerId,
      subscribed: hasActiveSub,
      subscription_tier: subscriptionTier,
      subscription_end: subscriptionEnd,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'email' });
    
    console.log(`[CHECK-SUBSCRIPTION] Updated subscriber record: ${user.email}, tier: ${subscriptionTier}, subscribed: ${hasActiveSub}`);
    
    return new Response(JSON.stringify({
      subscribed: hasActiveSub,
      subscription_tier: subscriptionTier,
      subscription_end: subscriptionEnd
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Subscription check error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
