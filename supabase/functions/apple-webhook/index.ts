
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper logging function
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[APPLE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Apple webhook received", { method: req.method });

    // Create Supabase client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const payload = await req.json();
    logStep("Webhook payload received", { 
      notificationType: payload.notificationType,
      subtype: payload.subtype 
    });

    // Extract notification data
    const notificationType = payload.notificationType;
    const subtype = payload.subtype;
    const transactionInfo = payload.data?.signedTransactionInfo;
    const renewalInfo = payload.data?.signedRenewalInfo;

    // Process different notification types
    switch (notificationType) {
      case "SUBSCRIBED":
        logStep("Processing SUBSCRIBED notification");
        await handleSubscriptionStart(supabaseAdmin, payload);
        break;
        
      case "DID_RENEW":
        logStep("Processing DID_RENEW notification");
        await handleSubscriptionRenewal(supabaseAdmin, payload);
        break;
        
      case "EXPIRED":
        logStep("Processing EXPIRED notification");
        await handleSubscriptionExpired(supabaseAdmin, payload);
        break;
        
      case "DID_CHANGE_RENEWAL_STATUS":
        logStep("Processing DID_CHANGE_RENEWAL_STATUS notification");
        await handleRenewalStatusChange(supabaseAdmin, payload);
        break;
        
      case "GRACE_PERIOD_EXPIRED":
        logStep("Processing GRACE_PERIOD_EXPIRED notification");
        await handleGracePeriodExpired(supabaseAdmin, payload);
        break;
        
      case "REFUND":
        logStep("Processing REFUND notification");
        await handleRefund(supabaseAdmin, payload);
        break;
        
      default:
        logStep("Unknown notification type", { notificationType });
    }

    // Log the notification for audit purposes
    await supabaseAdmin.from("subscription_notifications").insert({
      notification_type: notificationType,
      subtype: subtype,
      payload: payload,
      processed_at: new Date().toISOString(),
      source: "apple"
    });

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    logStep("ERROR processing Apple webhook", { error: error?.message || error });
    return new Response(JSON.stringify({ error: error?.message || 'Unknown error' }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

async function handleSubscriptionStart(supabase: any, payload: any) {
  // Extract user info and update subscription status
  const originalTransactionId = payload.data?.originalTransactionId;
  const appAccountToken = payload.data?.appAccountToken; // This should contain user ID
  
  if (appAccountToken) {
    await supabase.from("subscribers").upsert({
      user_id: appAccountToken,
      subscribed: true,
      subscription_tier: "premium",
      apple_original_transaction_id: originalTransactionId,
      subscription_source: "apple",
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });
  }
}

async function handleSubscriptionRenewal(supabase: any, payload: any) {
  const originalTransactionId = payload.data?.originalTransactionId;
  
  await supabase
    .from("subscribers")
    .update({
      subscribed: true,
      updated_at: new Date().toISOString(),
    })
    .eq("apple_original_transaction_id", originalTransactionId);
}

async function handleSubscriptionExpired(supabase: any, payload: any) {
  const originalTransactionId = payload.data?.originalTransactionId;
  
  await supabase
    .from("subscribers")
    .update({
      subscribed: false,
      subscription_end: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("apple_original_transaction_id", originalTransactionId);
}

async function handleRenewalStatusChange(supabase: any, payload: any) {
  const originalTransactionId = payload.data?.originalTransactionId;
  const autoRenewStatus = payload.data?.autoRenewStatus;
  
  await supabase
    .from("subscribers")
    .update({
      auto_renew_enabled: autoRenewStatus === 1,
      updated_at: new Date().toISOString(),
    })
    .eq("apple_original_transaction_id", originalTransactionId);
}

async function handleGracePeriodExpired(supabase: any, payload: any) {
  const originalTransactionId = payload.data?.originalTransactionId;
  
  await supabase
    .from("subscribers")
    .update({
      subscribed: false,
      subscription_end: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("apple_original_transaction_id", originalTransactionId);
}

async function handleRefund(supabase: any, payload: any) {
  const originalTransactionId = payload.data?.originalTransactionId;
  
  await supabase
    .from("subscribers")
    .update({
      subscribed: false,
      refunded: true,
      updated_at: new Date().toISOString(),
    })
    .eq("apple_original_transaction_id", originalTransactionId);
}
