/**
 * Data & Insights API
 *
 * Public, key-authenticated endpoint for institutional partners
 * (banks, foundations, CRA-compliant orgs) to query anonymized
 * circulation, demographic, and business density data.
 *
 * Auth: Authorization: Bearer <api_key>  (matches sha256 hash in api_keys table)
 * Quota: enforced via developer_accounts.monthly_cmal_limit (or default 1000/mo)
 */
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-csrf-token",
};

async function sha256Hex(input: string) {
  const buf = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, "0")).join("");
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const t0 = Date.now();
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  const url = new URL(req.url);
  // path looks like /data-insights-api/circulation
  const segments = url.pathname.split("/").filter(Boolean);
  const endpoint = segments[segments.length - 1] || "";

  let clientId: string | null = null;
  let status = 200;
  let payload: any = {};

  try {
    const auth = req.headers.get("Authorization") || "";
    const apiKey = auth.replace(/^Bearer\s+/i, "").trim();
    if (!apiKey) {
      status = 401;
      throw new Error("Missing API key");
    }

    const keyHash = await sha256Hex(apiKey);
    const { data: keyRow } = await supabase
      .from("api_keys")
      .select("id, developer_id, revoked_at")
      .eq("key_hash", keyHash)
      .maybeSingle();

    if (!keyRow || keyRow.revoked_at) {
      status = 401;
      throw new Error("Invalid or revoked API key");
    }
    clientId = keyRow.developer_id;

    // Quota check
    const { data: dev } = await supabase
      .from("developer_accounts")
      .select("status, monthly_cmal_limit")
      .eq("id", clientId)
      .maybeSingle();
    if (!dev || dev.status !== "active") {
      status = 403;
      throw new Error("Account inactive");
    }
    const quota = dev.monthly_cmal_limit ?? 1000;
    const monthStart = new Date();
    monthStart.setUTCDate(1);
    monthStart.setUTCHours(0, 0, 0, 0);
    const { count: usedThisMonth } = await supabase
      .from("api_usage_logs")
      .select("*", { count: "exact", head: true })
      .eq("developer_id", clientId)
      .gte("request_timestamp", monthStart.toISOString());

    if ((usedThisMonth ?? 0) >= quota) {
      status = 429;
      throw new Error("Monthly quota exceeded");
    }

    // Endpoints
    if (endpoint === "circulation") {
      const city = url.searchParams.get("city");
      let q = supabase.from("transactions").select("amount, business_id");
      if (city) {
        const { data: bizs } = await supabase.from("businesses").select("id").eq("city", city);
        const ids = (bizs ?? []).map(b => b.id);
        if (ids.length) q = q.in("business_id", ids);
      }
      const { data: txs } = await q.limit(10000);
      const total = (txs ?? []).reduce((s, t: any) => s + Number(t.amount || 0), 0);
      payload = {
        endpoint: "circulation",
        city: city || "all",
        transaction_count: txs?.length ?? 0,
        dollar_circulation: Number(total.toFixed(2)),
        currency: "USD",
      };
    } else if (endpoint === "business-density") {
      const { data: rows } = await supabase
        .from("businesses")
        .select("city, category")
        .eq("is_verified", true)
        .limit(10000);
      const byCity: Record<string, number> = {};
      const byCategory: Record<string, number> = {};
      (rows ?? []).forEach((r: any) => {
        if (r.city) byCity[r.city] = (byCity[r.city] || 0) + 1;
        if (r.category) byCategory[r.category] = (byCategory[r.category] || 0) + 1;
      });
      payload = {
        endpoint: "business-density",
        verified_business_count: rows?.length ?? 0,
        by_city: byCity,
        by_category: byCategory,
      };
    } else if (endpoint === "demographics") {
      const { count: customerCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });
      payload = {
        endpoint: "demographics",
        registered_users: customerCount ?? 0,
        note: "Aggregated counts only — no PII returned.",
      };
    } else {
      status = 404;
      throw new Error(`Unknown endpoint: ${endpoint}. Available: circulation, business-density, demographics`);
    }

    // Update last_used
    await supabase.from("api_keys").update({ last_used_at: new Date().toISOString() }).eq("id", keyRow.id);

    return new Response(JSON.stringify({ success: true, data: payload }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } finally {
    if (clientId) {
      try {
        await supabase.from("api_usage_logs").insert({
          developer_id: clientId,
          endpoint: `/${endpoint}`,
          method: req.method,
          response_status: status,
          latency_ms: Date.now() - t0,
        });
      } catch {/* ignore */}
    }
  }
});
