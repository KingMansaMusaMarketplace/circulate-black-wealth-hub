
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userType, email, name = '', businessName = '', tier = null, message = '' } = await req.json();

    // Create Supabase client with anon key for authentication
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Check if this email already has a customer record
    let customerId;
    const customers = await stripe.customers.list({ email, limit: 1 });
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
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
    }

    // Set price based on user type and tier
    let priceId;
    
    if (userType === 'corporate' && tier) {
      // Set price based on corporate sponsorship tier
      switch(tier) {
        case 'silver':
          priceId = Deno.env.get("STRIPE_SILVER_PRICE_ID");
          break;
        case 'gold':
          priceId = Deno.env.get("STRIPE_GOLD_PRICE_ID");
          break;
        case 'platinum':
          priceId = Deno.env.get("STRIPE_PLATINUM_PRICE_ID");
          break;
        default:
          priceId = Deno.env.get("STRIPE_SILVER_PRICE_ID");
      }
    } else {
      // Default pricing for regular business and customer accounts
      priceId = userType === 'business' 
        ? Deno.env.get("STRIPE_BUSINESS_PRICE_ID") 
        : Deno.env.get("STRIPE_CUSTOMER_PRICE_ID");
    }
    
    if (!priceId) {
      throw new Error(`Price ID for ${userType} ${tier || ''} not configured`);
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
        trial_period_days: userType === 'business' ? 30 : 0, // 30-day trial for business accounts
      },
    });

    return new Response(JSON.stringify({ url: session.url, sessionId: session.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
