import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-csrf-token",
};

const DIGEST_RECIPIENT = "contact@mansamusamarketplace.com";
const FROM_ADDRESS = "Kayla Ops <ops@notify.1325.ai>";

async function gatherDbMetrics(supabase: any) {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const [
    newUsers,
    newBusinesses,
    newBookings,
    newReviews,
    qrScans,
    kaylaRuns,
  ] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }).gte("created_at", since),
    supabase.from("businesses").select("id", { count: "exact", head: true }).gte("created_at", since),
    supabase.from("bookings").select("id", { count: "exact", head: true }).gte("created_at", since),
    supabase.from("reviews").select("id", { count: "exact", head: true }).gte("created_at", since),
    supabase.from("qr_scan_events").select("id", { count: "exact", head: true }).gte("created_at", since).then((r: any) => r).catch(() => ({ count: null })),
    supabase.from("kayla_run_log").select("id", { count: "exact", head: true }).gte("created_at", since).then((r: any) => r).catch(() => ({ count: null })),
  ]);

  return {
    window_hours: 24,
    new_users: newUsers.count ?? 0,
    new_businesses: newBusinesses.count ?? 0,
    new_bookings: newBookings.count ?? 0,
    new_reviews: newReviews.count ?? 0,
    qr_scans: qrScans?.count ?? null,
    kayla_runs: kaylaRuns?.count ?? null,
  };
}

async function fetchSentry() {
  const token = Deno.env.get("SENTRY_AUTH_TOKEN");
  const org = Deno.env.get("SENTRY_ORG_SLUG");
  const project = Deno.env.get("SENTRY_PROJECT_SLUG");
  if (!token || !org || !project) {
    return { enabled: false, note: "Add SENTRY_AUTH_TOKEN, SENTRY_ORG_SLUG, SENTRY_PROJECT_SLUG to enable." };
  }
  try {
    const url = `https://sentry.io/api/0/projects/${org}/${project}/issues/?statsPeriod=24h&sort=freq&limit=5`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) return { enabled: true, error: `Sentry ${res.status}` };
    const data = await res.json();
    return {
      enabled: true,
      top_issues: (data || []).slice(0, 5).map((i: any) => ({
        title: i.title,
        count: i.count,
        users: i.userCount,
        permalink: i.permalink,
        level: i.level,
      })),
    };
  } catch (e) {
    return { enabled: true, error: (e as Error).message };
  }
}

async function fetchPostHog() {
  const key = Deno.env.get("POSTHOG_PERSONAL_API_KEY");
  const projectId = Deno.env.get("POSTHOG_PROJECT_ID");
  const host = Deno.env.get("POSTHOG_HOST") || "https://us.posthog.com";
  if (!key || !projectId) {
    return { enabled: false, note: "Add POSTHOG_PERSONAL_API_KEY and POSTHOG_PROJECT_ID to enable." };
  }
  try {
    const q = {
      query: {
        kind: "HogQLQuery",
        query: "SELECT event, count() AS c FROM events WHERE timestamp > now() - INTERVAL 1 DAY GROUP BY event ORDER BY c DESC LIMIT 10",
      },
    };
    const res = await fetch(`${host}/api/projects/${projectId}/query/`, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify(q),
    });
    if (!res.ok) return { enabled: true, error: `PostHog ${res.status}` };
    const data = await res.json();
    return {
      enabled: true,
      top_events: (data.results || []).map((r: any) => ({ event: r[0], count: r[1] })),
    };
  } catch (e) {
    return { enabled: true, error: (e as Error).message };
  }
}

function renderHtml(date: string, metrics: any, sentry: any, posthog: any) {
  const sentrySection = sentry.enabled
    ? sentry.top_issues?.length
      ? `<ul>${sentry.top_issues.map((i: any) => `<li><a href="${i.permalink}">${i.title}</a> — ${i.count} events, ${i.users} users (${i.level})</li>`).join("")}</ul>`
      : `<p style="color:#888">No errors in the last 24h. 🎉</p>`
    : `<p style="color:#888">${sentry.note || "Sentry not configured."}</p>`;

  const phSection = posthog.enabled
    ? posthog.top_events?.length
      ? `<ul>${posthog.top_events.map((e: any) => `<li><strong>${e.event}</strong> — ${e.count.toLocaleString()}</li>`).join("")}</ul>`
      : `<p style="color:#888">No events tracked.</p>`
    : `<p style="color:#888">${posthog.note || "PostHog not configured."}</p>`;

  return `<!doctype html><html><body style="font-family:-apple-system,system-ui,sans-serif;background:#0a0a0a;color:#fff;padding:24px;max-width:640px;margin:auto">
  <h1 style="color:#FFB300;margin:0 0 8px">🛡️ Daily Ops Digest</h1>
  <p style="color:#888;margin:0 0 24px">${date} · 1325.AI</p>

  <h2 style="color:#FFB300;font-size:18px;border-bottom:1px solid #333;padding-bottom:6px">📊 Last 24h</h2>
  <table style="width:100%;border-collapse:collapse">
    <tr><td>New users</td><td style="text-align:right"><strong>${metrics.new_users}</strong></td></tr>
    <tr><td>New businesses</td><td style="text-align:right"><strong>${metrics.new_businesses}</strong></td></tr>
    <tr><td>New bookings</td><td style="text-align:right"><strong>${metrics.new_bookings}</strong></td></tr>
    <tr><td>New reviews</td><td style="text-align:right"><strong>${metrics.new_reviews}</strong></td></tr>
    ${metrics.qr_scans !== null ? `<tr><td>QR scans</td><td style="text-align:right"><strong>${metrics.qr_scans}</strong></td></tr>` : ""}
    ${metrics.kayla_runs !== null ? `<tr><td>Kayla agent runs</td><td style="text-align:right"><strong>${metrics.kayla_runs}</strong></td></tr>` : ""}
  </table>

  <h2 style="color:#FFB300;font-size:18px;border-bottom:1px solid #333;padding-bottom:6px;margin-top:24px">🐞 Sentry — Top Errors</h2>
  ${sentrySection}

  <h2 style="color:#FFB300;font-size:18px;border-bottom:1px solid #333;padding-bottom:6px;margin-top:24px">📈 PostHog — Top Events</h2>
  ${phSection}

  <p style="color:#555;font-size:12px;margin-top:32px">Sent by Kayla Ops · 1325.AI</p>
  </body></html>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    const today = new Date().toISOString().split("T")[0];
    const [metrics, sentry, posthog] = await Promise.all([
      gatherDbMetrics(supabase),
      fetchSentry(),
      fetchPostHog(),
    ]);

    const html = renderHtml(today, metrics, sentry, posthog);

    let emailStatus = "skipped";
    let emailError: string | null = null;
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (resendKey) {
      try {
        const resend = new Resend(resendKey);
        const { error } = await resend.emails.send({
          from: FROM_ADDRESS,
          to: [DIGEST_RECIPIENT],
          subject: `🛡️ 1325.AI Daily Ops Digest — ${today}`,
          html,
        });
        emailStatus = error ? "failed" : "sent";
        if (error) emailError = JSON.stringify(error);
      } catch (e) {
        emailStatus = "failed";
        emailError = (e as Error).message;
      }
    } else {
      emailError = "RESEND_API_KEY not configured";
    }

    await supabase.from("daily_ops_digests").upsert({
      digest_date: today,
      metrics,
      sentry_summary: sentry,
      posthog_summary: posthog,
      email_sent_to: DIGEST_RECIPIENT,
      email_status: emailStatus,
    }, { onConflict: "digest_date" });

    return new Response(
      JSON.stringify({ ok: true, date: today, metrics, sentry, posthog, emailStatus, emailError }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("daily-ops-digest error:", e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
