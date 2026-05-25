import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-csrf-token",
};

const DIGEST_RECIPIENT = Deno.env.get("DIGEST_EMAIL") || "Thomas@1325.ai";
const FROM_ADDRESS = "Kayla Ops <noreply@1325.ai>";

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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    const today = new Date().toISOString().split("T")[0];
    const [metricsRaw, sentry, posthog] = await Promise.all([
      gatherDbMetrics(supabase),
      fetchSentry(),
      fetchPostHog(),
    ]);

    const metrics = [
      { label: "New users", value: metricsRaw.new_users },
      { label: "New businesses", value: metricsRaw.new_businesses },
      { label: "New bookings", value: metricsRaw.new_bookings },
      { label: "New reviews", value: metricsRaw.new_reviews },
      ...(metricsRaw.qr_scans !== null ? [{ label: "QR scans", value: metricsRaw.qr_scans }] : []),
      ...(metricsRaw.kayla_runs !== null ? [{ label: "Kayla agent runs", value: metricsRaw.kayla_runs }] : []),
    ];

    // Render simple HTML inline (Resend send)
    const metricsHtml = metrics.map(m => `<tr><td>${m.label}</td><td style="text-align:right"><strong>${m.value}</strong></td></tr>`).join("");
    const sentryHtml = sentry.enabled
      ? (sentry.top_issues?.length ? `<ul>${sentry.top_issues.map((i: any) => `<li><a href="${i.permalink}">${i.title}</a> — ${i.count} events</li>`).join("")}</ul>` : `<p style="color:#888">No errors. 🎉</p>`)
      : `<p style="color:#888">${sentry.note}</p>`;
    const phHtml = posthog.enabled
      ? (posthog.top_events?.length ? `<ul>${posthog.top_events.map((e: any) => `<li><strong>${e.event}</strong> — ${e.count.toLocaleString()}</li>`).join("")}</ul>` : `<p style="color:#888">No events.</p>`)
      : `<p style="color:#888">${posthog.note}</p>`;
    const html = `<!doctype html><html><body style="font-family:-apple-system,sans-serif;background:#fff;color:#111;padding:24px;max-width:640px;margin:auto">
      <h1 style="color:#003366">🛡️ Daily Ops Digest</h1>
      <p style="color:#888">${today} · 1325.AI</p>
      <h2 style="color:#003366;font-size:18px">📊 Last 24h</h2>
      <table style="width:100%;border-collapse:collapse">${metricsHtml}</table>
      <h2 style="color:#003366;font-size:18px;margin-top:24px">🐞 Sentry — Top Errors</h2>${sentryHtml}
      <h2 style="color:#003366;font-size:18px;margin-top:24px">📈 PostHog — Top Events</h2>${phHtml}
      <p style="color:#aaa;font-size:11px;margin-top:32px;text-align:center">Sent by Kayla Ops · 1325.AI</p>
    </body></html>`;

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
      metrics: metricsRaw,
      sentry_summary: sentry,
      posthog_summary: posthog,
      email_sent_to: DIGEST_RECIPIENT,
      email_status: emailStatus,
    }, { onConflict: "digest_date" });

    return new Response(
      JSON.stringify({ ok: true, date: today, metrics: metricsRaw, sentry, posthog, emailStatus, emailError }),
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
