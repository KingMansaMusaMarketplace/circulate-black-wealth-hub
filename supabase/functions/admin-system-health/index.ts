// admin-system-health — aggregates platform vitals from existing tables (no new tables).
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-csrf-token",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
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

    const dayAgo = new Date(Date.now() - 86400000).toISOString();
    const fiveMinAgo = new Date(Date.now() - 5 * 60000).toISOString();

    const safeCount = async (table: string, build?: (q: any) => any) => {
      try {
        let q = admin.from(table).select("*", { count: "exact", head: true });
        if (build) q = build(q);
        const { count, error } = await q;
        if (error) return { count: null, error: error.message };
        return { count: count ?? 0, error: null };
      } catch (e) { return { count: null, error: (e as Error).message }; }
    };

    const [
      profilesTotal, businessesTotal, listingsTotal, scansTotal,
      subsActive, securityErrors24h, qrErrors24h, recentLogins5m,
      webhooksActive, deliveriesFailed24h, broadcastsActive, tokensActive,
    ] = await Promise.all([
      safeCount("profiles"),
      safeCount("businesses"),
      safeCount("business_listings"),
      safeCount("qr_scans"),
      safeCount("subscriptions", (q) => q.eq("status", "active")),
      safeCount("security_audit_log", (q) => q.gte("created_at", dayAgo).eq("severity", "error")),
      safeCount("qr_scans", (q) => q.gte("created_at", dayAgo).not("error_code", "is", null)),
      safeCount("profiles", (q) => q.gte("last_sign_in_at", fiveMinAgo)),
      safeCount("admin_webhooks", (q) => q.eq("is_active", true)),
      safeCount("admin_webhook_deliveries", (q) => q.gte("delivered_at", dayAgo).or("response_status.lt.200,response_status.gte.300,error_message.not.is.null")),
      safeCount("broadcast_announcements", (q) => q.eq("is_active", true)),
      safeCount("admin_api_tokens", (q) => q.is("revoked_at", null)),
    ]);

    // Subsystem status heuristics
    const status = (errCount: number | null) => {
      if (errCount === null) return "unknown";
      if (errCount === 0) return "green";
      if (errCount < 10) return "yellow";
      return "red";
    };

    const subsystems = [
      { name: "Database", status: profilesTotal.error ? "red" : "green", note: profilesTotal.error || "responsive" },
      { name: "Edge Functions", status: status(securityErrors24h.count), note: `${securityErrors24h.count ?? "?"} errors / 24h` },
      { name: "QR Loyalty", status: status(qrErrors24h.count), note: `${qrErrors24h.count ?? "?"} failed scans / 24h` },
      { name: "Webhooks", status: status(deliveriesFailed24h.count), note: `${deliveriesFailed24h.count ?? "?"} failed deliveries / 24h` },
      { name: "Subscriptions", status: subsActive.error ? "red" : "green", note: `${subsActive.count ?? "?"} active` },
    ];

    return new Response(JSON.stringify({
      generated_at: new Date().toISOString(),
      kpis: {
        profiles: profilesTotal.count,
        businesses: businessesTotal.count,
        listings: listingsTotal.count,
        qr_scans_total: scansTotal.count,
        active_subscriptions: subsActive.count,
        active_users_5m: recentLogins5m.count,
        active_webhooks: webhooksActive.count,
        active_broadcasts: broadcastsActive.count,
        active_api_tokens: tokensActive.count,
        security_errors_24h: securityErrors24h.count,
        qr_errors_24h: qrErrors24h.count,
        failed_deliveries_24h: deliveriesFailed24h.count,
      },
      subsystems,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("admin-system-health error", e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
