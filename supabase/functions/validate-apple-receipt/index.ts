import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[VALIDATE-APPLE-RECEIPT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");
    
    logStep("User authenticated", { userId: user.id });

    const { receiptData, productId } = await req.json();
    if (!receiptData) throw new Error("Receipt data is required");

    logStep("Validating receipt with Apple");

    // Validate receipt with Apple's servers
    // Try production first, then sandbox if that fails
    let verificationResponse;
    try {
      verificationResponse = await verifyWithApple(receiptData, false);
      if (verificationResponse.status === 21007) {
        // Receipt is from sandbox, retry with sandbox URL
        logStep("Receipt is from sandbox, retrying");
        verificationResponse = await verifyWithApple(receiptData, true);
      }
    } catch (error) {
      logStep("Apple verification failed", { error: error.message });
      throw new Error(`Receipt verification failed: ${error.message}`);
    }

    if (verificationResponse.status !== 0) {
      throw new Error(`Invalid receipt status: ${verificationResponse.status}`);
    }

    logStep("Receipt validated successfully", { status: verificationResponse.status });

    // Extract latest subscription info from receipt
    const latestReceipt = verificationResponse.latest_receipt_info?.[0];
    if (!latestReceipt) {
      throw new Error("No subscription info found in receipt");
    }

    const expiresDate = new Date(parseInt(latestReceipt.expires_date_ms));
    const purchaseDate = new Date(parseInt(latestReceipt.purchase_date_ms));
    const isActive = expiresDate > new Date();

    // Store/update subscription in database
    const { data: existingSubscription } = await supabaseClient
      .from('apple_subscriptions')
      .select('id')
      .eq('transaction_id', latestReceipt.transaction_id)
      .single();

    if (existingSubscription) {
      // Update existing subscription
      const { error: updateError } = await supabaseClient
        .from('apple_subscriptions')
        .update({
          expires_date: expiresDate.toISOString(),
          status: isActive ? 'active' : 'expired',
          receipt_data: receiptData,
          auto_renew_status: verificationResponse.auto_renew_status === 1,
          updated_at: new Date().toISOString()
        })
        .eq('transaction_id', latestReceipt.transaction_id);

      if (updateError) throw updateError;
      logStep("Subscription updated", { transactionId: latestReceipt.transaction_id });
    } else {
      // Create new subscription
      const { error: insertError } = await supabaseClient
        .from('apple_subscriptions')
        .insert({
          user_id: user.id,
          product_id: latestReceipt.product_id,
          transaction_id: latestReceipt.transaction_id,
          original_transaction_id: latestReceipt.original_transaction_id,
          purchase_date: purchaseDate.toISOString(),
          expires_date: expiresDate.toISOString(),
          is_trial_period: latestReceipt.is_trial_period === 'true',
          is_in_intro_offer_period: latestReceipt.is_in_intro_offer_period === 'true',
          receipt_data: receiptData,
          environment: verificationResponse.environment,
          status: isActive ? 'active' : 'expired',
          auto_renew_status: verificationResponse.auto_renew_status === 1
        });

      if (insertError) throw insertError;
      logStep("New subscription created", { transactionId: latestReceipt.transaction_id });
    }

    return new Response(JSON.stringify({
      success: true,
      subscribed: isActive,
      productId: latestReceipt.product_id,
      expiresDate: expiresDate.toISOString()
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error: any) {
    logStep("ERROR", { message: error.message });
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

async function verifyWithApple(receiptData: string, sandbox: boolean) {
  const url = sandbox
    ? "https://sandbox.itunes.apple.com/verifyReceipt"
    : "https://buy.itunes.apple.com/verifyReceipt";

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ "receipt-data": receiptData, "password": Deno.env.get("APPLE_SHARED_SECRET") || "" }),
  });

  if (!response.ok) {
    throw new Error(`Apple API returned ${response.status}`);
  }

  return await response.json();
}
