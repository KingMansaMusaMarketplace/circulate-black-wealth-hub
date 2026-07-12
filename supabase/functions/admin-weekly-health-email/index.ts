import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-csrf-token",
};

const RECIPIENT = Deno.env.get("ADMIN_EMAIL") || "Thomas@1325.AI";
const FROM = "1325.AI Admin <noreply@1325.ai>";

async function count(supabase: any, table: string, since: string, col = "created_at") {
  try {
    const r = await supabase.from(table).select("id", { count: "exact", head: true }).gte(col, since);
    return r.count ?? 0;
  } catch {
    return 0;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  // Allow either CRON_SECRET (scheduled) or an authenticated admin call
  const cronSecret = Deno.env.get("CRON_SECRET");
  const auth = req.headers.get("authorization") || "";
  const providedCron = req.headers.get("x-cron-secret");
  const isCron = cronSecret && providedCron === cronSecret;

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  if (!isCron) {
    // Verify caller is admin
    const token = auth.replace("Bearer ", "");
    const { data: userRes } = await supabase.auth.getUser(token);
    if (!userRes?.user) {
      return new Response(JSON.stringify({ error: "unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: userRes.user.id,
      _role: "admin",
    });
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  }

  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [
    newUsers,
    newBusinesses,
    newBookings,
    newReviews,
    fraudEvents,
    verifications,
    nuclearActions,
    failedLogins,
  ] = await Promise.all([
    count(supabase, "profiles", since),
    count(supabase, "businesses", since),
    count(supabase, "bookings", since),
    count(supabase, "reviews", since),
    count(supabase, "fraud_prevention_actions", since),
    count(supabase, "business_verifications", since),
    (async () => {
      try {
        const r = await supabase
          .from("activity_log")
          .select("id", { count: "exact", head: true })
          .gte("created_at", since)
          .like("activity_type", "nuclear_%");
        return r.count ?? 0;
      } catch {
        return 0;
      }
    })(),
    (async () => {
      try {
        const r = await supabase
          .from("auth_rate_limit_events")
          .select("id", { count: "exact", head: true })
          .gte("created_at", since)
          .eq("event_type", "failed_login");
        return r.count ?? 0;
      } catch {
        return 0;
      }
    })(),
  ]);

  // Recent nuclear actions (top 10)
  let recentNuclear: any[] = [];
  try {
    const { data } = await supabase
      .from("activity_log")
      .select("activity_type, details, created_at, user_id")
      .gte("created_at", since)
      .like("activity_type", "nuclear_%")
      .order("created_at", { ascending: false })
      .limit(10);
    recentNuclear = data || [];
  } catch {}

  const week = new Date().toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });

  const stat = (label: string, val: number | string, hint = "") => `
    <tr>
      <td style="padding:12px 16px;border-bottom:1px solid #eee;font-size:14px;color:#333;">${label}${hint ? `<div style="font-size:11px;color:#888;">${hint}</div>` : ""}</td>
      <td style="padding:12px 16px;border-bottom:1px solid #eee;font-size:20px;font-weight:700;color:#003366;text-align:right;">${val}</td>
    </tr>`;

  const nuclearRows = recentNuclear.length
    ? recentNuclear.map((n) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;font-size:12px;color:#555;">
          <code style="background:#fff3cd;padding:2px 6px;border-radius:3px;color:#856404;">${n.activity_type}</code>
        </td>
        <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;font-size:12px;color:#888;">
          ${new Date(n.created_at).toLocaleString("en-US", { timeZone: "America/Chicago" })}
        </td>
      </tr>`).join("")
    : `<tr><td colspan="2" style="padding:16px;text-align:center;color:#28a745;font-size:13px;">✓ No nuclear actions this week</td></tr>`;

  const html = `
  <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:640px;margin:0 auto;background:#fff;">
    <div style="background:#003366;padding:24px;text-align:center;">
      <div style="color:#FFB300;font-size:12px;font-weight:700;letter-spacing:0.15em;">1325.AI ADMIN</div>
      <div style="color:#fff;font-size:24px;font-weight:700;margin-top:6px;">Weekly Health Report</div>
      <div style="color:rgba(255,255,255,0.7);font-size:13px;margin-top:4px;">Week ending ${week}</div>
    </div>

    <div style="padding:24px;">
      <h2 style="color:#003366;font-size:16px;margin:0 0 12px 0;">Platform activity (last 7 days)</h2>
      <table style="width:100%;border-collapse:collapse;background:#fafafa;border-radius:8px;overflow:hidden;">
        ${stat("New users", newUsers)}
        ${stat("New businesses", newBusinesses)}
        ${stat("New bookings", newBookings)}
        ${stat("New reviews", newReviews)}
        ${stat("Business verifications processed", verifications)}
      </table>

      <h2 style="color:#003366;font-size:16px;margin:28px 0 12px 0;">Safety &amp; security</h2>
      <table style="width:100%;border-collapse:collapse;background:#fafafa;border-radius:8px;overflow:hidden;">
        ${stat("Fraud prevention actions", fraudEvents, "Reviews, blocks, reversals")}
        ${stat("Failed login attempts", failedLogins, "May indicate brute-force attempts")}
        ${stat("Nuclear actions (solo mode)", nuclearActions, "Grants, deletes, fraud reversals")}
      </table>

      <h2 style="color:#003366;font-size:16px;margin:28px 0 12px 0;">Recent nuclear actions</h2>
      <table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid #eee;border-radius:8px;overflow:hidden;">
        ${nuclearRows}
      </table>

      <div style="margin-top:32px;padding:16px;background:#f8f9fa;border-left:3px solid #FFB300;font-size:12px;color:#555;">
        <strong>Sole-operator mode is active.</strong> Every destructive action is logged here.
        When you hire a second admin, we'll switch on the two-person approval rule automatically.
      </div>

      <div style="text-align:center;margin-top:28px;">
        <a href="https://1325.ai/admin" style="display:inline-block;background:#003366;color:#fff;text-decoration:none;padding:12px 28px;border-radius:6px;font-size:14px;font-weight:600;">Open Admin Dashboard</a>
      </div>
    </div>

    <div style="padding:16px;text-align:center;font-size:11px;color:#999;border-top:1px solid #eee;">
      1325.AI — Confidential. Sent to admin operators only.
    </div>
  </div>`;

  const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
  const { data, error } = await resend.emails.send({
    from: FROM,
    to: [RECIPIENT],
    subject: `1325.AI Weekly Health — ${week}`,
    html,
  });

  if (error) {
    console.error("[weekly-health] send failed", error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(
    JSON.stringify({
      ok: true,
      sent_to: RECIPIENT,
      stats: { newUsers, newBusinesses, newBookings, newReviews, fraudEvents, verifications, nuclearActions, failedLogins },
      resend_id: (data as any)?.id ?? null,
    }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
