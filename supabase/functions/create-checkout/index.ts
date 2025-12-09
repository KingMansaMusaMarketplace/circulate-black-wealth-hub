
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
  // Default allowed origins for MansaMusa platform
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

// Input validation schema
const checkoutRequestSchema = z.object({
  userType: z.enum(['business', 'corporate']),
  email: z.string().email().max(255),
  name: z.string().max(100).optional().default(''),
  businessName: z.string().max(200).optional().default(''),
  tier: z.string().max(50).nullable().optional(),
  message: z.string().max(1000).optional().default(''),
});

// Rate limiting map (in-memory, resets on function restart)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX = 5; // 5 requests per minute per IP

const checkRateLimit = (ip: string): boolean => {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }
  
  record.count++;
  return true;
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
  const corsHeaders = getCorsHeaders(req);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting check
    const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                     req.headers.get("x-real-ip") || 
                     "unknown";
    
    if (!checkRateLimit(clientIP)) {
      logStep("Rate limit exceeded", { ip: clientIP });
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse and validate input
    const rawBody = await req.json();
    const parseResult = checkoutRequestSchema.safeParse(rawBody);
    
    if (!parseResult.success) {
      logStep("Validation failed", { errors: parseResult.error.errors });
      return new Response(
        JSON.stringify({ error: "Invalid request data", details: parseResult.error.errors }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const { userType, email, name, businessName, tier, message } = parseResult.data;
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
        case 'corporate_bronze':
        case 'bronze':
          priceId = Deno.env.get("STRIPE_CORPORATE_BRONZE_PRICE_ID");
          logStep("Using Corporate Bronze tier price", { priceId });
          break;
        case 'corporate_gold':
        case 'gold':
          priceId = Deno.env.get("STRIPE_CORPORATE_GOLD_PRICE_ID");
          logStep("Using Corporate Gold tier price", { priceId });
          break;
        default:
          priceId = Deno.env.get("STRIPE_CORPORATE_BRONZE_PRICE_ID");
          logStep("Using default Corporate Bronze tier price", { priceId });
      }
    } else if (userType === 'business' && tier) {
      // Business tier-based pricing
      switch(tier) {
        case 'business_starter':
          priceId = Deno.env.get("STRIPE_BUSINESS_STARTER_MONTHLY_PRICE_ID");
          logStep("Using Business Starter monthly price", { priceId });
          break;
        case 'business_starter_annual':
          priceId = Deno.env.get("STRIPE_BUSINESS_STARTER_ANNUAL_PRICE_ID");
          logStep("Using Business Starter annual price", { priceId });
          break;
        case 'business':
        case 'business_professional':
          priceId = Deno.env.get("STRIPE_BUSINESS_PROFESSIONAL_MONTHLY_PRICE_ID");
          logStep("Using Business Professional monthly price", { priceId });
          break;
        case 'business_annual':
        case 'business_professional_annual':
          priceId = Deno.env.get("STRIPE_BUSINESS_PROFESSIONAL_ANNUAL_PRICE_ID");
          logStep("Using Business Professional annual price", { priceId });
          break;
        case 'business_multi_location':
          priceId = Deno.env.get("STRIPE_BUSINESS_MULTI_LOCATION_MONTHLY_PRICE_ID");
          logStep("Using Multi-Location monthly price", { priceId });
          break;
        case 'business_multi_location_annual':
          priceId = Deno.env.get("STRIPE_BUSINESS_MULTI_LOCATION_ANNUAL_PRICE_ID");
          logStep("Using Multi-Location annual price", { priceId });
          break;
        case 'enterprise':
          priceId = Deno.env.get("STRIPE_ENTERPRISE_MONTHLY_PRICE_ID");
          logStep("Using Enterprise monthly price", { priceId });
          break;
        default:
          priceId = Deno.env.get("STRIPE_BUSINESS_STARTER_MONTHLY_PRICE_ID");
          logStep("Using default Business Starter price", { priceId });
      }
    } else {
      // Customers don't pay - this shouldn't be called for customers
      logStep("ERROR: Customer accounts are free, no checkout needed", { userType });
      throw new Error('Customer accounts are free and do not require payment');
    }
    
    if (!priceId) {
      const errorMsg = `Price ID for ${userType} ${tier || ''} not configured`;
      logStep("ERROR: Missing price ID", { userType, tier });
      throw new Error(errorMsg);
    }

    // Determine trial period based on subscription type
    const getTrialPeriod = () => {
      // Business plans get 30-day trial
      if (userType === 'business') {
        return 30;
      }
      // Corporate sponsorships get no trial
      return 0;
    };

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
      success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}&user_type=${userType}`,
      cancel_url: `${req.headers.get("origin")}/${userType === 'corporate' ? 'corporate-sponsorship' : 'signup'}`,
      metadata: {
        userType,
        email,
        tier: tier || '',
        message: message || ''
      },
      subscription_data: {
        trial_period_days: getTrialPeriod(),
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
      headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
      status: 500,
    });
  }
});
