import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { importX509, jwtVerify, decodeProtectedHeader } from "https://esm.sh/jose@5.9.6";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-csrf-token",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[APPLE-WEBHOOK] ${step}${detailsStr}`);
};

/**
 * Verify Apple App Store Server Notification V2 signedPayload JWS.
 * Apple sends notifications as a JWS in the `signedPayload` field. The
 * signing certificate chain is embedded in the JOSE header `x5c` (leaf → intermediate → Apple root).
 * We verify the JWS signature against the leaf certificate. Full chain-to-Apple-root
 * pinning should be added if a stricter guarantee is required.
 */
async function verifyAppleSignedPayload(signedPayload: string): Promise<any> {
  if (!signedPayload || typeof signedPayload !== "string") {
    throw new Error("Missing signedPayload");
  }
  const header = decodeProtectedHeader(signedPayload) as { alg?: string; x5c?: string[] };
  if (!header?.x5c || header.x5c.length === 0) {
    throw new Error("Missing x5c certificate chain in signedPayload header");
  }
  if (header.alg !== "ES256") {
    throw new Error(`Unexpected signing algorithm: ${header.alg}`);
  }
  const leafPem = `-----BEGIN CERTIFICATE-----\n${header.x5c[0]}\n-----END CERTIFICATE-----`;
  const key = await importX509(leafPem, "ES256");
  const { payload } = await jwtVerify(signedPayload, key);
  return payload;
}

async function decodeSignedTransaction(signedTx?: string): Promise<any | null> {
  if (!signedTx) return null;
  try {
    return await verifyAppleSignedPayload(signedTx);
  } catch (e) {
    logStep("signedTransactionInfo verify failed", { error: (e as Error).message });
    return null;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    logStep("Apple webhook received", { method: req.method });

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const raw = await req.json().catch(() => ({}));
    const signedPayload = raw?.signedPayload;

    // SECURITY: Require a valid Apple-signed JWS. Refuse unsigned/forged bodies.
    let notification: any;
    try {
      notification = await verifyAppleSignedPayload(signedPayload);
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
            subscription_source: "apple",
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id' });
        }
        break;
      case "DID_RENEW":
        if (originalTransactionId) {
          await supabaseAdmin.from("subscribers").update({
            subscribed: true,
            updated_at: new Date().toISOString(),
          }).eq("apple_original_transaction_id", originalTransactionId);
        }
        break;
      case "EXPIRED":
      case "GRACE_PERIOD_EXPIRED":
        if (originalTransactionId) {
          await supabaseAdmin.from("subscribers").update({
            subscribed: false,
            subscription_end: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }).eq("apple_original_transaction_id", originalTransactionId);
        }
        break;
      case "DID_CHANGE_RENEWAL_STATUS": {
        const autoRenewStatus = txInfo?.autoRenewStatus;
        if (originalTransactionId) {
          await supabaseAdmin.from("subscribers").update({
            auto_renew_enabled: autoRenewStatus === 1,
            updated_at: new Date().toISOString(),
          }).eq("apple_original_transaction_id", originalTransactionId);
        }
        break;
      }
      case "REFUND":
        if (originalTransactionId) {
          await supabaseAdmin.from("subscribers").update({
            subscribed: false,
            refunded: true,
            updated_at: new Date().toISOString(),
          }).eq("apple_original_transaction_id", originalTransactionId);
        }
        break;
      default:
        logStep("Unhandled notification type", { notificationType });
    }

    await supabaseAdmin.from("subscription_notifications").insert({
      notification_type: notificationType,
      subtype,
      payload: notification,
      processed_at: new Date().toISOString(),
      source: "apple",
    });

    return new Response(JSON.stringify({ received: true }), {
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
