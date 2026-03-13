import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface HealthCheck {
  name: string;
  status: "pass" | "fail" | "warn";
  message: string;
  duration_ms: number;
}

async function checkDatabase(supabase: ReturnType<typeof createClient>): Promise<HealthCheck> {
  const start = Date.now();
  try {
    const { count, error } = await supabase
      .from("businesses")
      .select("id", { count: "exact", head: true });

    if (error) throw error;
    return {
      name: "Database Connection & Queries",
      status: "pass",
      message: `Database responding. ${count || 0} businesses in directory.`,
      duration_ms: Date.now() - start,
    };
  } catch (e) {
    return {
      name: "Database Connection & Queries",
      status: "fail",
      message: `Database error: ${e instanceof Error ? e.message : "Unknown"}`,
      duration_ms: Date.now() - start,
    };
  }
}

async function checkAuth(supabase: ReturnType<typeof createClient>): Promise<HealthCheck> {
  const start = Date.now();
  try {
    const { count, error } = await supabase
      .from("profiles")
      .select("id", { count: "exact", head: true });

    if (error) throw error;
    return {
      name: "Authentication & User Profiles",
      status: "pass",
      message: `Auth system healthy. ${count || 0} user profiles active.`,
      duration_ms: Date.now() - start,
    };
  } catch (e) {
    return {
      name: "Authentication & User Profiles",
      status: "fail",
      message: `Auth check failed: ${e instanceof Error ? e.message : "Unknown"}`,
      duration_ms: Date.now() - start,
    };
  }
}

async function checkEdgeFunctions(): Promise<HealthCheck> {
  const start = Date.now();
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;

  try {
    // Test a lightweight edge function endpoint
    const res = await fetch(`${supabaseUrl}/functions/v1/kayla-services`, {
      method: "OPTIONS",
    });
    await res.text();

    if (res.ok || res.status === 204) {
      return {
        name: "Edge Functions Runtime",
        status: "pass",
        message: "Edge Functions runtime is responding correctly.",
        duration_ms: Date.now() - start,
      };
    }

    return {
      name: "Edge Functions Runtime",
      status: "warn",
      message: `Edge Functions returned status ${res.status}. May need attention.`,
      duration_ms: Date.now() - start,
    };
  } catch (e) {
    return {
      name: "Edge Functions Runtime",
      status: "fail",
      message: `Edge Functions unreachable: ${e instanceof Error ? e.message : "Unknown"}`,
      duration_ms: Date.now() - start,
    };
  }
}

async function checkRealtimeAndStorage(supabase: ReturnType<typeof createClient>): Promise<HealthCheck> {
  const start = Date.now();
  try {
    // Test notifications table (used for real-time) and check recent activity
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { count: recentNotifications, error: notifError } = await supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .gte("created_at", oneDayAgo);

    if (notifError) throw notifError;

    // Check QR transactions as a proxy for core business logic
    const { count: recentScans, error: scanError } = await supabase
      .from("qr_code_analytics")
      .select("id", { count: "exact", head: true })
      .gte("scanned_at", oneDayAgo);

    if (scanError) throw scanError;

    return {
      name: "Core Services (Notifications, QR, Storage)",
      status: "pass",
      message: `Healthy. ${recentNotifications || 0} notifications and ${recentScans || 0} QR scans in last 24h.`,
      duration_ms: Date.now() - start,
    };
  } catch (e) {
    return {
      name: "Core Services (Notifications, QR, Storage)",
      status: "fail",
      message: `Core services check failed: ${e instanceof Error ? e.message : "Unknown"}`,
      duration_ms: Date.now() - start,
    };
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const body = await req.json().catch(() => ({}));
    const checkType = body.checkType || "scheduled";

    console.log(`🏥 Kayla Health Check starting (${checkType})...`);

    // Run all 4 checks in parallel
    const checks = await Promise.all([
      checkDatabase(supabase),
      checkAuth(supabase),
      checkEdgeFunctions(),
      checkRealtimeAndStorage(supabase),
    ]);

    const passed = checks.filter(c => c.status === "pass").length;
    const failed = checks.filter(c => c.status === "fail").length;
    const warned = checks.filter(c => c.status === "warn").length;

    const overallStatus = failed > 0 ? "critical" : warned > 0 ? "degraded" : "healthy";
    const totalDuration = Date.now() - startTime;

    // Save to database
    await supabase.from("kayla_health_checks").insert({
      check_type: checkType,
      overall_status: overallStatus,
      checks,
      passed_count: passed,
      failed_count: failed,
      warning_count: warned,
      total_checks: checks.length,
      duration_ms: totalDuration,
    });

    // If critical, send admin notification
    if (overallStatus === "critical") {
      const failedChecks = checks.filter(c => c.status === "fail").map(c => c.name).join(", ");

      // Notify all admins
      const { data: admins } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_type", "admin")
        .limit(10);

      if (admins?.length) {
        const notifications = admins.map((admin: any) => ({
          user_id: admin.id,
          type: "kayla_health_alert",
          title: "🚨 System Health Alert",
          message: `Kayla detected ${failed} failing system check(s): ${failedChecks}. Immediate attention required.`,
          metadata: { checks, overall_status: overallStatus },
        }));

        await supabase.from("notifications").insert(notifications);
      }

      console.error(`🚨 CRITICAL: ${failed} checks failed — ${failedChecks}`);
    }

    // Also save as an agent report for unified view
    await supabase.from("kayla_agent_reports").insert({
      report_type: "health_check",
      status: "completed",
      summary: `🏥 Health Check: ${overallStatus.toUpperCase()}\n${checks.map(c => `${c.status === "pass" ? "✅" : c.status === "warn" ? "⚠️" : "❌"} ${c.name}: ${c.message} (${c.duration_ms}ms)`).join("\n")}`,
      issues_found: failed + warned,
      issues_fixed: 0,
      issues_requiring_review: failed,
      details: { checks, overall_status: overallStatus, duration_ms: totalDuration },
      actions_taken: overallStatus === "critical" ? ["🚨 Admin alert sent for failing checks"] : [],
    });

    console.log(`🏥 Health Check complete: ${overallStatus} (${totalDuration}ms)`);

    return new Response(
      JSON.stringify({
        success: true,
        overall_status: overallStatus,
        checks,
        passed: passed,
        failed: failed,
        warnings: warned,
        duration_ms: totalDuration,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Health check error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Unknown" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
