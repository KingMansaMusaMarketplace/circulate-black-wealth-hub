import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { importX509, jwtVerify, decodeProtectedHeader } from "https://esm.sh/jose@5.9.6";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-csrf-token",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[APPLE-WEBHOOK-SANDBOX] ${step}${detailsStr}`);
};

async function verifyAppleSignedPayload(signedPayload: string): Promise<any> {
  if (!signedPayload || typeof signedPayload !== "string") {
    throw new Error("Missing signedPayload");
  }
  const header = decodeProtectedHeader(signedPayload) as { alg?: string; x5c?: string[] };
  if (!header?.x5c || header.x5c.length === 0) {
    throw new Error("Missing x5c certificate chain");
  }
  if (header.alg !== "ES256") {
    throw new Error(`Unexpected signing algorithm: ${header.alg}`);
  }
  const leafPem = `-----BEGIN CERTIFICATE-----\n${header.x5c[0]}\n-----END CERTIFICATE-----`;
  const key = await importX509(leafPem, "ES256");
  const { payload } = await jwtVerify(signedPayload, key);
  return payload;
}

async function decodeSignedTransaction(signedTx?: string) {
  if (!signedTx) return null;
  try { return await verifyAppleSignedPayload(signedTx); } catch { return null; }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    logStep("Sandbox webhook received", { method: req.method });

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const raw = await req.json().catch(() => ({}));
    let notification: any;
    try {
      notification = await verifyAppleSignedPayload(raw?.signedPayload);
    } catch (e) {
      logStep("Signature verification failed", { error: (e as Error).message });
      return new Response(JSON.stringify({ error: "invalid signature" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const notificationType = notification.notificationType;
    const subtype = notification.subtype;
    const txInfo = await decodeSignedTransaction(notification?.data?.signedTransactionInfo);
    const originalTransactionId = txInfo?.originalTransactionId;
    const appAccountToken = txInfo?.appAccountToken;

    switch (notificationType) {
      case "SUBSCRIBED":
        if (appAccountToken && originalTransactionId) {
          await supabaseAdmin.from("subscribers").upsert({
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
        if (originalTransactionId) {
          await supabaseAdmin.from("subscribers").update({
            subscribed: false,
            subscription_end: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }).eq("apple_original_transaction_id", originalTransactionId);
        }
        break;
      default:
        logStep("Sandbox notification type handled", { notificationType });
    }

    await supabaseAdmin.from("subscription_notifications").insert({
      notification_type: notificationType,
      subtype,
      payload: notification,
      processed_at: new Date().toISOString(),
      source: "apple_sandbox",
      environment: "sandbox",
    });

    return new Response(JSON.stringify({ received: true, environment: "sandbox" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    logStep("ERROR", { error: error?.message || error });
    return new Response(JSON.stringify({ error: error?.message || 'Unknown error' }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
