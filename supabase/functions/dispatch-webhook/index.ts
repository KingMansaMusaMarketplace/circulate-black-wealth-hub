// dispatch-webhook — admin sends event payload to all matching active webhooks with HMAC-SHA256 signature.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-csrf-token",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const sign = async (secret: string, body: string) => {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(body));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

    const auth = req.headers.get("Authorization") ?? "";
    if (!auth.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Missing auth" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: auth } },
    });
    const { data: u } = await userClient.auth.getUser();
    if (!u.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);
    const { data: roleRow } = await admin
      .from("user_roles").select("role")
      .eq("user_id", u.user.id).eq("role", "admin").maybeSingle();
    if (!roleRow) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const event_type: string | undefined = body.event_type;
    const payload = body.payload ?? {};
    const target_webhook_id: string | undefined = body.webhook_id; // for "test ping"

    if (!event_type || typeof event_type !== "string") {
      return new Response(JSON.stringify({ error: "event_type required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let q = admin.from("admin_webhooks").select("*").eq("is_active", true);
    if (target_webhook_id) q = q.eq("id", target_webhook_id);
    const { data: hooks } = await q;
    const matched = (hooks || []).filter((h: any) =>
      target_webhook_id || h.event_types.includes(event_type) || h.event_types.includes("*"),
    );

    const results = [];
    for (const h of matched) {
      const bodyStr = JSON.stringify({
        event_type, payload, delivered_at: new Date().toISOString(), webhook_id: h.id,
      });
      const signature = await sign(h.signing_secret, bodyStr);
      const start = Date.now();
      let status: number | null = null;
      let respText = "";
      let errMsg: string | null = null;
      try {
        const resp = await fetch(h.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Webhook-Signature": `sha256=${signature}`,
            "X-Webhook-Event": event_type,
          },
          body: bodyStr,
          signal: AbortSignal.timeout(10000),
        });
        status = resp.status;
        respText = (await resp.text()).slice(0, 2000);
      } catch (e) {
        errMsg = (e as Error).message;
      }
      const latency = Date.now() - start;
      const ok = status !== null && status >= 200 && status < 300;

      await admin.from("admin_webhook_deliveries").insert({
        webhook_id: h.id, event_type, payload,
        response_status: status, response_body: respText,
        latency_ms: latency, error_message: errMsg,
      });
      await admin.from("admin_webhooks").update({
        last_delivery_at: new Date().toISOString(),
        last_delivery_status: status,
        failure_count: ok ? 0 : (h.failure_count || 0) + 1,
      }).eq("id", h.id);

      results.push({ webhook_id: h.id, status, ok, latency_ms: latency });
    }

    return new Response(JSON.stringify({ delivered: results.length, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("dispatch-webhook error", e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
