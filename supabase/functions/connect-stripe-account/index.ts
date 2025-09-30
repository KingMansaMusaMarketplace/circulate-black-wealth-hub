import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
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

    const { businessId, refreshUrl, returnUrl } = await req.json();

    if (!businessId) {
      throw new Error("Business ID is required");
    }

    // Check if user owns this business
    const { data: business, error: businessError } = await supabaseClient
      .from("businesses")
      .select("owner_id")
      .eq("id", businessId)
      .single();

    if (businessError || !business || business.owner_id !== user.id) {
      throw new Error("Unauthorized: You don't own this business");
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Check if account already exists
    const { data: existingAccount } = await supabaseClient
      .from("business_payment_accounts")
      .select("stripe_account_id")
      .eq("business_id", businessId)
      .single();

    let accountId = existingAccount?.stripe_account_id;

    // Create Stripe Connect account if it doesn't exist
    if (!accountId) {
      const account = await stripe.accounts.create({
        type: "express",
        country: "US",
        email: user.email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_type: "individual",
      });

      accountId = account.id;

      // Save to database
      await supabaseClient
        .from("business_payment_accounts")
        .insert({
          business_id: businessId,
          stripe_account_id: accountId,
          account_status: "pending",
        });
    }

    // Create account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: refreshUrl || `${req.headers.get("origin")}/business/dashboard`,
      return_url: returnUrl || `${req.headers.get("origin")}/business/dashboard?setup=complete`,
      type: "account_onboarding",
    });

    return new Response(
      JSON.stringify({ 
        url: accountLink.url,
        accountId: accountId 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Connect Stripe account error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
