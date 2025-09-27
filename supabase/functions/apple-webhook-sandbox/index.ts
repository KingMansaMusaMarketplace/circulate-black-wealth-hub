
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper logging function
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[APPLE-WEBHOOK-SANDBOX] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Apple sandbox webhook received", { method: req.method });

    // Create Supabase client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const payload = await req.json();
    logStep("Sandbox webhook payload received", { 
      notificationType: payload.notificationType,
      subtype: payload.subtype,
      environment: "Sandbox"
    });

    // Extract notification data
    const notificationType = payload.notificationType;
    const subtype = payload.subtype;

    // Process the same way as production but mark as sandbox
    await processSandboxNotification(supabaseAdmin, payload);

    // Log the notification for audit purposes
    await supabaseAdmin.from("subscription_notifications").insert({
      notification_type: notificationType,
      subtype: subtype,
      payload: payload,
      processed_at: new Date().toISOString(),
      source: "apple_sandbox",
      environment: "sandbox"
    });

    return new Response(JSON.stringify({ 
      received: true, 
      environment: "sandbox",
      message: "Sandbox notification processed successfully" 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    logStep("ERROR processing Apple sandbox webhook", { error: error?.message || error });
    return new Response(JSON.stringify({ error: error?.message || 'Unknown error' }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

async function processSandboxNotification(supabase: any, payload: any) {
  const notificationType = payload.notificationType;
  const originalTransactionId = payload.data?.originalTransactionId;
  const appAccountToken = payload.data?.appAccountToken;

  logStep("Processing sandbox notification", { 
    notificationType, 
    originalTransactionId,
    hasAppAccountToken: !!appAccountToken 
  });

  // Handle sandbox notifications similarly to production
  // but with additional logging and test data handling
  switch (notificationType) {
    case "SUBSCRIBED":
      if (appAccountToken) {
        await supabase.from("subscribers").upsert({
          user_id: appAccountToken,
          subscribed: true,
          subscription_tier: "premium",
          apple_original_transaction_id: originalTransactionId,
          subscription_source: "apple_sandbox",
          is_sandbox: true,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });
      }
      break;
      
    case "EXPIRED":
      await supabase
        .from("subscribers")
        .update({
          subscribed: false,
          subscription_end: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("apple_original_transaction_id", originalTransactionId);
      break;
      
    default:
      logStep("Sandbox notification type handled", { notificationType });
  }
}
