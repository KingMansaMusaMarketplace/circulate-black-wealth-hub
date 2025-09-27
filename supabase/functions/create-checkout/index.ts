
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper logging function to trace execution steps
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

// Calculate trial days until January 1, 2026
const calculateTrialDays = () => {
  const now = new Date();
  const jan1_2026 = new Date('2026-01-01T00:00:00Z');
  const diffTime = jan1_2026.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Ensure minimum 1 day, maximum 365 days for Stripe limits
  return Math.max(1, Math.min(365, diffDays));
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userType, email, name = '', businessName = '', tier = null, message = '' } = await req.json();
    logStep("Request received", { userType, email, tier });

    // Create Supabase client with anon key for authentication
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });
    logStep("Stripe initialized");

    // Check if this email already has a customer record
    let customerId;
    const customers = await stripe.customers.list({ email, limit: 1 });
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Existing customer found", { customerId });
    } else {
      // Create a new customer in Stripe
      const customer = await stripe.customers.create({
        email,
        name: userType === 'business' || userType === 'corporate' ? businessName : name,
        metadata: { 
          userType,
          message: message || ''
        },
      });
      customerId = customer.id;
      logStep("New customer created", { customerId });
    }

    // Set price based on user type and tier
    let priceId;
    
    if (userType === 'corporate' && tier) {
      // Set price based on corporate sponsorship tier
      switch(tier) {
        case 'silver':
          priceId = Deno.env.get("STRIPE_SILVER_PRICE_ID");
          logStep("Using Silver tier price", { priceId });
          break;
        case 'gold':
          priceId = Deno.env.get("STRIPE_GOLD_PRICE_ID");
          logStep("Using Gold tier price", { priceId });
          break;
        case 'platinum':
          priceId = Deno.env.get("STRIPE_PLATINUM_PRICE_ID");
          logStep("Using Platinum tier price", { priceId });
          break;
        default:
          priceId = Deno.env.get("STRIPE_SILVER_PRICE_ID");
          logStep("Using default Silver tier price", { priceId });
      }
    } else {
      // Default pricing for regular business and customer accounts
      priceId = userType === 'business' 
        ? Deno.env.get("STRIPE_BUSINESS_PRICE_ID") 
        : Deno.env.get("STRIPE_CUSTOMER_PRICE_ID");
      logStep("Using standard price", { userType, priceId });
    }
    
    if (!priceId) {
      const errorMsg = `Price ID for ${userType} ${tier || ''} not configured`;
      logStep("ERROR: Missing price ID", { userType, tier });
      throw new Error(errorMsg);
    }

    // Create subscription checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/signup/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/signup`,
      metadata: {
        userType,
        email,
        tier: tier || '',
        message: message || ''
      },
      subscription_data: {
        // Calculate days until January 1, 2026
        trial_period_days: calculateTrialDays(),
      },
    });
    
    logStep("Checkout session created", { 
      sessionId: session.id,
      url: session.url?.substring(0, 30) + '...' // Log truncated URL for privacy
    });

    return new Response(JSON.stringify({ url: session.url, sessionId: session.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("Stripe checkout error:", errorMsg);
    return new Response(JSON.stringify({ error: errorMsg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
