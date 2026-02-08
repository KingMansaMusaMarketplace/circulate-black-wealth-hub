import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-HOST-CONNECT-STATUS] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    logStep("Function started");

    // Get authenticated user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");
    logStep("User authenticated", { userId: user.id });

    // Get profile with Stripe Connect info
    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("stripe_connect_account_id, stripe_connect_status")
      .eq("id", user.id)
      .single();

    if (!profile?.stripe_connect_account_id) {
      return new Response(JSON.stringify({ 
        connected: false,
        status: "not_created",
        message: "No Stripe Connect account found",
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Initialize Stripe
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Get account details from Stripe
    const account = await stripe.accounts.retrieve(profile.stripe_connect_account_id);
    logStep("Retrieved Stripe account", { 
      accountId: account.id,
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
    });

    // Determine status
    let status: "pending" | "active" | "restricted" | "not_created" = "pending";
    let message = "";

    if (account.charges_enabled && account.payouts_enabled) {
      status = "active";
      message = "Your account is fully set up and ready to receive payments";
    } else if (account.requirements?.currently_due?.length) {
      status = "restricted";
      message = `Additional information required: ${account.requirements.currently_due.join(", ")}`;
    } else if (account.requirements?.pending_verification?.length) {
      status = "pending";
      message = "Your account is pending verification";
    }

    // Update profile with current status
    if (profile.stripe_connect_status !== status) {
      await supabaseClient
        .from("profiles")
        .update({ stripe_connect_status: status })
        .eq("id", user.id);

      // Also update all host properties with the account ID
      if (status === "active") {
        await supabaseClient
          .from("vacation_properties")
          .update({ host_stripe_account_id: profile.stripe_connect_account_id })
          .eq("host_id", user.id);
        logStep("Updated properties with Stripe account ID");
      }
    }

    return new Response(JSON.stringify({ 
      connected: status === "active",
      status,
      message,
      accountId: profile.stripe_connect_account_id,
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
      requirements: account.requirements?.currently_due || [],
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ 
      connected: false, 
      status: "error",
      error: errorMessage 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
