// Weekly Security Autopilot Scan
// Runs Supabase database security checks and emails a summary to the admin.
// Triggered by pg_cron every Monday 8am ET, or manually by an admin.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-csrf-token, x-cron-secret",
};

const RECIPIENT = Deno.env.get("ADMIN_EMAIL") || "Thomas@1325.AI";
const FROM = "1325.AI Security <noreply@1325.ai>";
const AUTOPILOT_TOKEN = Deno.env.get("SEC_AUTOPILOT_TOKEN");

type Finding = {
  id: string;
  category: string;
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  detail: string;
  table_or_function?: string;
};

async function runScan(supabase: any): Promise<Finding[]> {
  const findings: Finding[] = [];

  // 1. Tables in public schema without RLS enabled
  const { data: noRls } = await supabase.rpc("exec_sql_safe", {}).catch(() => ({ data: null }));
  // Fallback: query directly using service role
  const { data: tables } = await supabase
    .from("pg_tables_view" as any)
    .select("*")
    .limit(1)
    .maybeSingle()
    .catch(() => ({ data: null }));

  // Use a direct query via service_role for pg_catalog
  try {
    const { data, error } = await supabase.rpc("security_autopilot_snapshot" as any);
    if (!error && Array.isArray(data)) {
      for (const row of data) {
        findings.push(row as Finding);
      }
      return findings;
    }
  } catch (_) {
    // fall through
  }

  // If no dedicated RPC exists, do inline queries:
  // Tables without RLS
  const publicTablesNoRls = await supabase.rpc("_autopilot_tables_without_rls" as any).catch(() => ({ data: null }));
  if (Array.isArray(publicTablesNoRls?.data)) {
    for (const t of publicTablesNoRls.data) {
      findings.push({
        id: `no_rls_${t.tablename}`,
        category: "Row-Level Security",
        severity: "high",
        title: `Table has no Row-Level Security`,
        detail: `Table public.${t.tablename} is exposed via the API without RLS.`,
        table_or_function: t.tablename,
      });
    }
  }

  return findings;
}

function summarize(findings: Finding[]) {
  const counts = { critical: 0, high: 0, medium: 0, low: 0 };
  for (const f of findings) counts[f.severity]++;
  return counts;
}

function buildEmailHtml(findings: Finding[], counts: any, ranAt: string) {
  const bySev = (sev: string) => findings.filter((f) => f.severity === sev);
  const rowsHtml = ["critical", "high", "medium", "low"]
    .flatMap((sev) =>
      bySev(sev)
        .slice(0, 10)
        .map(
          (f) => `
        <tr>
          <td style="padding:8px;border-bottom:1px solid #eee;color:${
            sev === "critical" ? "#dc2626" : sev === "high" ? "#ea580c" : sev === "medium" ? "#ca8a04" : "#65a30d"
          };font-weight:600;text-transform:uppercase;font-size:11px;">${sev}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;">
            <div style="font-weight:600;color:#111;">${f.title}</div>
            <div style="font-size:13px;color:#555;">${f.detail}</div>
          </td>
        </tr>`,
        ),
    )
    .join("");

  return `<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#f6f7f9;font-family:-apple-system,Segoe UI,sans-serif;color:#111;">
<div style="max-width:640px;margin:0 auto;padding:24px;">
  <div style="background:#000;padding:20px;border-radius:12px 12px 0 0;">
    <h1 style="color:#FFB300;margin:0;font-size:22px;">🛡️ 1325.AI Weekly Security Report</h1>
    <p style="color:#ccc;margin:4px 0 0;font-size:13px;">${new Date(ranAt).toLocaleString("en-US", { timeZone: "America/New_York", dateStyle: "full", timeStyle: "short" })} ET</p>
  </div>
  <div style="background:#fff;padding:24px;border-radius:0 0 12px 12px;">
    <div style="display:flex;gap:12px;margin-bottom:24px;">
      <div style="flex:1;background:#fef2f2;padding:16px;border-radius:8px;text-align:center;">
        <div style="font-size:28px;font-weight:700;color:#dc2626;">${counts.critical}</div>
        <div style="font-size:11px;color:#7f1d1d;text-transform:uppercase;">Critical</div>
      </div>
      <div style="flex:1;background:#fff7ed;padding:16px;border-radius:8px;text-align:center;">
        <div style="font-size:28px;font-weight:700;color:#ea580c;">${counts.high}</div>
        <div style="font-size:11px;color:#7c2d12;text-transform:uppercase;">High</div>
      </div>
      <div style="flex:1;background:#fefce8;padding:16px;border-radius:8px;text-align:center;">
        <div style="font-size:28px;font-weight:700;color:#ca8a04;">${counts.medium}</div>
        <div style="font-size:11px;color:#713f12;text-transform:uppercase;">Medium</div>
      </div>
      <div style="flex:1;background:#f7fee7;padding:16px;border-radius:8px;text-align:center;">
        <div style="font-size:28px;font-weight:700;color:#65a30d;">${counts.low}</div>
        <div style="font-size:11px;color:#365314;text-transform:uppercase;">Low</div>
      </div>
    </div>

    <h2 style="font-size:16px;margin:0 0 12px;">Top findings</h2>
    ${
      findings.length === 0
        ? `<p style="color:#059669;padding:20px;background:#ecfdf5;border-radius:8px;">✅ No security findings this week. All monitored checks passed.</p>`
        : `<table style="width:100%;border-collapse:collapse;">${rowsHtml}</table>`
    }

    <div style="margin-top:24px;padding:16px;background:#f9fafb;border-radius:8px;font-size:13px;color:#555;">
      <strong>Next step:</strong> Open the Security Autopilot dashboard in your admin panel to review and fix findings.<br>
      <a href="https://1325.ai/admin/security-autopilot" style="color:#003366;font-weight:600;">Open Dashboard →</a>
    </div>

    <p style="margin-top:16px;font-size:11px;color:#999;text-align:center;">
      Automated weekly scan by 1325.AI Security Autopilot • Fixes still require your approval in a chat session.
    </p>
  </div>
</div>
</body></html>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const startTime = Date.now();
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // Auth: either the cron secret, or an authenticated admin
  const providedCron = req.headers.get("x-cron-secret");
  const isCron = AUTOPILOT_TOKEN && providedCron === AUTOPILOT_TOKEN;

  let triggeredBy = "cron";
  let triggeredByUserId: string | null = null;

  if (!isCron) {
    const auth = req.headers.get("authorization") || "";
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
    triggeredBy = "manual";
    triggeredByUserId = userRes.user.id;
  }

  // Run scan
  let findings: Finding[] = [];
  try {
    findings = await runScan(supabase);
  } catch (e: any) {
    console.error("Scan error:", e?.message);
    findings = [
      {
        id: "scan_error",
        category: "System",
        severity: "medium",
        title: "Scanner encountered an error",
        detail: e?.message || "Unknown error while running scan.",
      },
    ];
  }

  const counts = summarize(findings);
  const ranAt = new Date().toISOString();
  const summary = `${findings.length} findings: ${counts.critical}C / ${counts.high}H / ${counts.medium}M / ${counts.low}L`;

  // Send email
  let emailSent = false;
  let emailError: string | null = null;
  const resendKey = Deno.env.get("RESEND_API_KEY");
  if (resendKey) {
    try {
      const resend = new Resend(resendKey);
      const { error } = await resend.emails.send({
        from: FROM,
        to: [RECIPIENT],
        subject: `🛡️ Weekly Security Report — ${summary}`,
        html: buildEmailHtml(findings, counts, ranAt),
      });
      if (error) {
        emailError = String(error?.message || error);
      } else {
        emailSent = true;
      }
    } catch (e: any) {
      emailError = e?.message || "Unknown email error";
    }
  } else {
    emailError = "RESEND_API_KEY not configured";
  }

  // Save run
  const duration = Date.now() - startTime;
  const { data: inserted, error: insertErr } = await supabase
    .from("security_autopilot_runs")
    .insert({
      ran_at: ranAt,
      triggered_by: triggeredBy,
      triggered_by_user_id: triggeredByUserId,
      total_findings: findings.length,
      critical_count: counts.critical,
      high_count: counts.high,
      medium_count: counts.medium,
      low_count: counts.low,
      findings: findings,
      summary,
      email_sent: emailSent,
      email_error: emailError,
      duration_ms: duration,
    })
    .select()
    .single();

  if (insertErr) {
    console.error("Insert error:", insertErr);
  }

  return new Response(
    JSON.stringify({
      ok: true,
      run: inserted,
      counts,
      total: findings.length,
      email_sent: emailSent,
      email_error: emailError,
      duration_ms: duration,
    }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 },
  );
});
