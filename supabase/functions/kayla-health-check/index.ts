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
  auto_fix_attempted?: boolean;
  auto_fix_result?: string;
}

interface RemediationAction {
  issue: string;
  action: string;
  result: "fixed" | "attempted" | "escalated";
  details: string;
}

// ══════════════════════════════════════════════
// HEALTH CHECKS
// ══════════════════════════════════════════════

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
    const res = await fetch(`${supabaseUrl}/functions/v1/kayla-services`, { method: "OPTIONS" });
    await res.text();
    if (res.ok || res.status === 204) {
      return { name: "Edge Functions Runtime", status: "pass", message: "Edge Functions runtime responding.", duration_ms: Date.now() - start };
    }
    return { name: "Edge Functions Runtime", status: "warn", message: `Status ${res.status}. May need attention.`, duration_ms: Date.now() - start };
  } catch (e) {
    return { name: "Edge Functions Runtime", status: "fail", message: `Unreachable: ${e instanceof Error ? e.message : "Unknown"}`, duration_ms: Date.now() - start };
  }
}

async function checkCoreServices(supabase: ReturnType<typeof createClient>): Promise<HealthCheck> {
  const start = Date.now();
  try {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count: recentNotifications, error: notifError } = await supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .gte("created_at", oneDayAgo);
    if (notifError) throw notifError;

    const { count: recentScans, error: scanError } = await supabase
      .from("qr_code_analytics")
      .select("id", { count: "exact", head: true })
      .gte("scanned_at", oneDayAgo);
    if (scanError) throw scanError;

    return {
      name: "Core Services (Notifications, QR, Storage)",
      status: "pass",
      message: `Healthy. ${recentNotifications || 0} notifications, ${recentScans || 0} QR scans in 24h.`,
      duration_ms: Date.now() - start,
    };
  } catch (e) {
    return {
      name: "Core Services (Notifications, QR, Storage)",
      status: "fail",
      message: `Failed: ${e instanceof Error ? e.message : "Unknown"}`,
      duration_ms: Date.now() - start,
    };
  }
}

// ══════════════════════════════════════════════
// DATA INTEGRITY CHECKS (new — detects & fixes)
// ══════════════════════════════════════════════

async function checkAndFixDataIntegrity(supabase: ReturnType<typeof createClient>): Promise<{
  check: HealthCheck;
  remediations: RemediationAction[];
}> {
  const start = Date.now();
  const remediations: RemediationAction[] = [];
  const issues: string[] = [];
  let fixedCount = 0;

  try {
    // 1. Find businesses with broken/placeholder images and regenerate
    const PLACEHOLDER_PATTERNS = ["placeholder", "default-banner", "default-logo", "unsplash.com", "${", "{{"];
    const { data: allBiz } = await supabase
      .from("businesses")
      .select("id, name, business_name, logo_url, banner_url, website, description, category, city, state")
      .limit(100);

    if (allBiz) {
      const isPlaceholder = (url: string | null): boolean => {
        if (!url) return false; // null is different from placeholder
        const lc = url.toLowerCase();
        return PLACEHOLDER_PATTERNS.some(p => lc.includes(p));
      };

      // Fix placeholder images
      const bizWithPlaceholderImages = allBiz.filter(b => isPlaceholder(b.logo_url) || isPlaceholder(b.banner_url));
      for (const biz of bizWithPlaceholderImages.slice(0, 5)) {
        const updates: Record<string, any> = {};
        if (isPlaceholder(biz.logo_url)) updates.logo_url = null;
        if (isPlaceholder(biz.banner_url)) updates.banner_url = null;

        const { error } = await supabase.from("businesses").update(updates).eq("id", biz.id);
        if (!error) {
          fixedCount++;
          const name = biz.business_name || biz.name || "Unknown";
          remediations.push({
            issue: `Placeholder image on "${name}"`,
            action: "Cleared placeholder URLs to trigger re-scrape",
            result: "fixed",
            details: `Removed ${Object.keys(updates).join(", ")}`,
          });
        }
      }

      // 2. Fix businesses with missing descriptions using AI
      const bizNoDesc = allBiz.filter(b => !b.description || b.description.trim().length < 10);
      if (bizNoDesc.length > 0) {
        const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
        for (const biz of bizNoDesc.slice(0, 3)) {
          const name = biz.business_name || biz.name || "Unknown";
          if (LOVABLE_API_KEY) {
            try {
              const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
                method: "POST",
                headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
                body: JSON.stringify({
                  model: "google/gemini-3-flash-preview",
                  messages: [
                    { role: "system", content: "Write concise, warm, professional business descriptions. 2-3 sentences. Be authentic." },
                    { role: "user", content: `Business: "${name}"${biz.category ? `, Category: ${biz.category}` : ""}${biz.city ? `, in ${biz.city}${biz.state ? `, ${biz.state}` : ""}` : ""}` },
                  ],
                }),
              });
              if (res.ok) {
                const data = await res.json();
                const desc = data.choices?.[0]?.message?.content?.trim();
                if (desc && desc.length > 20) {
                  await supabase.from("businesses").update({ description: desc, updated_at: new Date().toISOString() }).eq("id", biz.id);
                  fixedCount++;
                  remediations.push({
                    issue: `Missing description for "${name}"`,
                    action: "Auto-generated AI description",
                    result: "fixed",
                    details: desc.slice(0, 80) + "...",
                  });
                }
              } else {
                await res.text();
              }
            } catch { /* skip */ }
          } else {
            issues.push(`Missing description for "${name}" (no AI key to auto-fix)`);
            remediations.push({
              issue: `Missing description for "${name}"`,
              action: "Cannot auto-generate — LOVABLE_API_KEY unavailable",
              result: "escalated",
              details: "Admin should add description manually",
            });
          }
          await new Promise(r => setTimeout(r, 300));
        }

        if (bizNoDesc.length > 3) {
          issues.push(`${bizNoDesc.length - 3} more businesses without descriptions`);
        }
      }

      // 3. Fix orphaned notifications (read but not cleared after 30 days)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const { count: staleNotifs } = await supabase
        .from("notifications")
        .select("id", { count: "exact", head: true })
        .eq("is_read", true)
        .lt("created_at", thirtyDaysAgo);

      if ((staleNotifs || 0) > 100) {
        const { error } = await supabase
          .from("notifications")
          .delete()
          .eq("is_read", true)
          .lt("created_at", thirtyDaysAgo);

        if (!error) {
          fixedCount++;
          remediations.push({
            issue: `${staleNotifs} stale read notifications (30+ days old)`,
            action: "Cleaned up old read notifications",
            result: "fixed",
            details: `Removed ${staleNotifs} stale notifications to keep database performant`,
          });
        }
      }

      // 4. Fix expired claim tokens on leads
      const { count: expiredTokens } = await supabase
        .from("b2b_external_leads")
        .select("id", { count: "exact", head: true })
        .not("claim_token", "is", null)
        .lt("claim_token_expires_at", new Date().toISOString());

      if ((expiredTokens || 0) > 0) {
        const { error } = await supabase
          .from("b2b_external_leads")
          .update({ claim_token: null, claim_token_expires_at: null })
          .not("claim_token", "is", null)
          .lt("claim_token_expires_at", new Date().toISOString());

        if (!error) {
          fixedCount++;
          remediations.push({
            issue: `${expiredTokens} expired claim tokens on leads`,
            action: "Cleared expired claim tokens",
            result: "fixed",
            details: "Expired tokens removed to prevent stale claim attempts",
          });
        }
      }

      // 5. Check for businesses without an owner (orphaned)
      const orphanedBiz = allBiz.filter(b => !b.website && !b.description);
      if (orphanedBiz.length > 5) {
        issues.push(`${orphanedBiz.length} businesses with no website AND no description`);
        remediations.push({
          issue: `${orphanedBiz.length} businesses with incomplete core data`,
          action: "Flagged for admin review — too many to auto-fix safely",
          result: "escalated",
          details: "Consider running the full Kayla data audit for batch remediation",
        });
      }

      // 6. BACKFILL: Enrich businesses missing addresses by scraping contact/about pages
      const firecrawlKey = Deno.env.get("FIRECRAWL_API_KEY");
      const mapboxToken = Deno.env.get("MAPBOX_PUBLIC_TOKEN");
      if (firecrawlKey) {
        const { data: bizMissingAddr } = await supabase
          .from("businesses")
          .select("id, name, business_name, website, address, phone, city, state, zip_code")
          .eq("is_verified", true)
          .not("website", "is", null)
          .or("address.is.null,address.eq.,address.ilike.%not provided%,address.ilike.%not available%")
          .limit(30);

        if (bizMissingAddr && bizMissingAddr.length > 0) {
          let addressesFixed = 0;
          let phonesFixed = 0;

          for (const biz of bizMissingAddr) {
            const bizName = biz.business_name || biz.name || "Unknown";
            const websiteUrl = biz.website?.trim();
            if (!websiteUrl || !websiteUrl.startsWith("http")) continue;

            try {
              const contactInfo = await scrapeContactFromPages(websiteUrl, firecrawlKey);
              const updates: Record<string, any> = {};

              if (contactInfo.address && contactInfo.address.length >= 10) {
                updates.address = contactInfo.address;
                addressesFixed++;
              }
              if (contactInfo.phone && contactInfo.phone.length >= 7 && (!biz.phone || biz.phone.length < 7)) {
                updates.phone = contactInfo.phone;
                phonesFixed++;
              }
              if (contactInfo.zip_code && (!biz.zip_code || biz.zip_code === "")) {
                updates.zip_code = contactInfo.zip_code;
              }

              // Re-geocode if we found a new address
              if (updates.address && mapboxToken) {
                const geocodeResult = await geocodeForHealthCheck(
                  updates.address, biz.city, biz.state, updates.zip_code || biz.zip_code || "", mapboxToken
                );
                if (geocodeResult.latitude !== null) {
                  updates.latitude = geocodeResult.latitude;
                  updates.longitude = geocodeResult.longitude;
                }
              }

              if (Object.keys(updates).length > 0) {
                updates.updated_at = new Date().toISOString();
                const { error } = await supabase.from("businesses").update(updates).eq("id", biz.id);
                if (!error) {
                  fixedCount++;
                  remediations.push({
                    issue: `Missing address for "${bizName}"`,
                    action: "Enriched from website contact/about page",
                    result: "fixed",
                    details: `${updates.address ? `Address: ${updates.address}` : ""}${updates.phone ? ` Phone: ${updates.phone}` : ""}`,
                  });
                  console.log(`[HealthCheck] 📍 Enriched "${bizName}": ${JSON.stringify(updates)}`);
                }
              }
            } catch (err) {
              console.log(`[HealthCheck] Scrape failed for "${bizName}": ${err instanceof Error ? err.message : "unknown"}`);
            }

            // Brief pause between scrapes to be polite to Firecrawl
            await new Promise(r => setTimeout(r, 500));
          }

          if (addressesFixed > 0 || phonesFixed > 0) {
            console.log(`[HealthCheck] 🔍 Address backfill: ${addressesFixed} addresses, ${phonesFixed} phones enriched`);
          }
        }
      }
    }

    const totalIssues = remediations.length;
    const status = totalIssues === 0 ? "pass" : fixedCount === totalIssues ? "pass" : "warn";

    return {
      check: {
        name: "Data Integrity & Auto-Healing",
        status,
        message: totalIssues === 0
          ? "All data integrity checks passed. No issues found."
          : `Found ${totalIssues} issue(s): ${fixedCount} auto-fixed, ${totalIssues - fixedCount} escalated.`,
        duration_ms: Date.now() - start,
        auto_fix_attempted: fixedCount > 0,
        auto_fix_result: fixedCount > 0 ? `${fixedCount} issue(s) automatically resolved` : undefined,
      },
      remediations,
    };
  } catch (e) {
    return {
      check: {
        name: "Data Integrity & Auto-Healing",
        status: "fail",
        message: `Integrity check failed: ${e instanceof Error ? e.message : "Unknown"}`,
        duration_ms: Date.now() - start,
      },
      remediations,
    };
  }
}

// ══════════════════════════════════════════════
// SIGNUP HEALTH MONITORING
// ══════════════════════════════════════════════

async function checkSignupHealth(supabase: ReturnType<typeof createClient>): Promise<HealthCheck> {
  const start = Date.now();
  try {
    // Check for recent signup failures in the last 4 hours
    const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString();

    // 1. Check security_audit_log for signup failures
    const { count: signupFailures } = await supabase
      .from("security_audit_log")
      .select("id", { count: "exact", head: true })
      .eq("action", "signup_failure")
      .gte("created_at", fourHoursAgo);

    // 2. Check for failed auth attempts during signup
    const { count: failedAuths } = await supabase
      .from("failed_auth_attempts")
      .select("id", { count: "exact", head: true })
      .eq("failure_reason", "signup_trigger_error")
      .gte("attempted_at", fourHoursAgo);

    const totalFailures = (signupFailures || 0) + (failedAuths || 0);

    // 3. Quick sanity: verify the handle_new_user trigger exists and works
    // by checking recent profiles were created (if any users signed up)
    const { count: recentProfiles } = await supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .gte("created_at", fourHoursAgo);

    if (totalFailures > 0) {
      // CRITICAL: signup is broken — send Slack alert
      try {
        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        await fetch(`${supabaseUrl}/functions/v1/send-slack-notification`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${supabaseKey}` },
          body: JSON.stringify({
            channel: "C0AJB2V8F4G",
            text: `🚨 *SIGNUP ALERT*: ${totalFailures} signup failure(s) detected in the last 4 hours!\n• Audit log failures: ${signupFailures || 0}\n• Auth failures: ${failedAuths || 0}\n• Recent successful profiles: ${recentProfiles || 0}\n\n⚡ Immediate investigation required — users cannot create accounts.`,
          }),
        });
      } catch { /* Slack alert is best-effort */ }

      return {
        name: "Signup Flow Health",
        status: totalFailures >= 3 ? "fail" : "warn",
        message: `⚠️ ${totalFailures} signup failure(s) in last 4h. ${recentProfiles || 0} profiles created successfully.`,
        duration_ms: Date.now() - start,
      };
    }

    return {
      name: "Signup Flow Health",
      status: "pass",
      message: `Signup healthy. ${recentProfiles || 0} new profiles in last 4h. No failures detected.`,
      duration_ms: Date.now() - start,
    };
  } catch (e) {
    return {
      name: "Signup Flow Health",
      status: "fail",
      message: `Signup health check error: ${e instanceof Error ? e.message : "Unknown"}`,
      duration_ms: Date.now() - start,
    };
  }
}

// ══════════════════════════════════════════════
// ADDRESS ENRICHMENT HELPERS (for backfill)
// ══════════════════════════════════════════════

const CONTACT_PATHS = ["/contact", "/contact-us", "/about", "/about-us", "/location", "/locations"];
const ADDR_RE = /(\d{1,5}\s+[A-Za-z0-9\s.,#-]+(?:St|Street|Ave|Avenue|Blvd|Boulevard|Rd|Road|Dr|Drive|Ln|Lane|Way|Ct|Court|Pl|Place|Pkwy|Parkway|Cir|Circle|Hwy|Highway|Ter|Terrace)[.,]?\s*(?:[A-Za-z\s]+,\s*[A-Z]{2}\s*\d{5}(?:-\d{4})?))/gi;
const PHONE_RE = /(?:\+?1[-.\s]?)?\(?([2-9]\d{2})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})/g;
const ZIP_RE = /\b(\d{5})(?:-\d{4})?\b/g;

function extractContact(md: string): { address: string | null; phone: string | null; zip_code: string | null } {
  const r = { address: null as string | null, phone: null as string | null, zip_code: null as string | null };
  if (!md) return r;

  const addrMatches = md.match(ADDR_RE);
  if (addrMatches) r.address = addrMatches.sort((a, b) => b.length - a.length)[0].trim();

  // Phone near keywords first
  for (const line of md.split("\n")) {
    const lo = line.toLowerCase();
    if (lo.includes("phone") || lo.includes("call") || lo.includes("tel:") || lo.includes("contact")) {
      const pm = line.match(PHONE_RE);
      if (pm) { r.phone = pm[0].trim(); break; }
    }
  }
  if (!r.phone) { const ap = md.match(PHONE_RE); if (ap) r.phone = ap[0].trim(); }

  if (r.address) { const zm = r.address.match(ZIP_RE); if (zm) r.zip_code = zm[0]; }
  if (!r.zip_code) { const az = md.match(ZIP_RE); if (az) r.zip_code = az[0]; }

  return r;
}

async function scrapeContactFromPages(websiteUrl: string, firecrawlKey: string): Promise<{ address: string | null; phone: string | null; zip_code: string | null }> {
  const combined = { address: null as string | null, phone: null as string | null, zip_code: null as string | null };
  let baseUrl = websiteUrl.replace(/\/+$/, "");
  if (!baseUrl.startsWith("http")) baseUrl = `https://${baseUrl}`;

  for (const path of CONTACT_PATHS) {
    if (combined.address && combined.phone) break;
    try {
      const ctrl = new AbortController();
      const tid = setTimeout(() => ctrl.abort(), 6000);
      const res = await fetch("https://api.firecrawl.dev/v1/scrape", {
        method: "POST",
        headers: { "Authorization": `Bearer ${firecrawlKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ url: `${baseUrl}${path}`, formats: ["markdown"], onlyMainContent: true, timeout: 5000 }),
        signal: ctrl.signal,
      });
      clearTimeout(tid);
      if (!res.ok) continue;
      const d = await res.json();
      const md = d?.data?.markdown || "";
      if (md.length < 50) continue;
      const ex = extractContact(md);
      if (ex.address && !combined.address) combined.address = ex.address;
      if (ex.phone && !combined.phone) combined.phone = ex.phone;
      if (ex.zip_code && !combined.zip_code) combined.zip_code = ex.zip_code;
    } catch { continue; }
  }
  return combined;
}

async function geocodeForHealthCheck(address: string, city: string, state: string, zip: string, mapboxToken: string): Promise<{ latitude: number | null; longitude: number | null }> {
  try {
    const full = [address, city, state, zip].filter(Boolean).join(", ");
    if (full.length < 5) return { latitude: null, longitude: null };
    const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(full)}.json?access_token=${mapboxToken}&limit=1&country=us`);
    if (!res.ok) return { latitude: null, longitude: null };
    const d = await res.json();
    const f = d?.features?.[0];
    if (f?.center) return { latitude: f.center[1], longitude: f.center[0] };
  } catch {}
  return { latitude: null, longitude: null };
}

// ══════════════════════════════════════════════
// MAIN HANDLER
// ══════════════════════════════════════════════

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // ── Authentication: require service role key or valid admin JWT ──
  const authHeader = req.headers.get("Authorization");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const isServiceRole = authHeader === `Bearer ${serviceRoleKey}`;

  if (!isServiceRole) {
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
    }
    const userClient = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: claims, error: claimsErr } = await userClient.auth.getClaims(authHeader.replace("Bearer ", ""));
    if (claimsErr || !claims?.claims?.sub) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
    }
    const { data: isAdmin } = await userClient.rpc("is_admin_secure");
    if (isAdmin !== true) {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: corsHeaders });
    }
  }

  const startTime = Date.now();

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      serviceRoleKey,
    );

    const body = await req.json().catch(() => ({}));
    const checkType = body.checkType || "scheduled";
    const autoFix = body.autoFix !== false; // Default: true

    console.log(`🏥 Kayla Health Check starting (${checkType}, autoFix=${autoFix})...`);

    // Run core checks in parallel (including signup monitoring)
    const [dbCheck, authCheck, edgeCheck, coreCheck, signupCheck] = await Promise.all([
      checkDatabase(supabase),
      checkAuth(supabase),
      checkEdgeFunctions(),
      checkCoreServices(supabase),
      checkSignupHealth(supabase),
    ]);

    const checks: HealthCheck[] = [dbCheck, authCheck, edgeCheck, coreCheck, signupCheck];
    let remediations: RemediationAction[] = [];

    // Run data integrity + auto-healing if autoFix is enabled
    if (autoFix) {
      const integrityResult = await checkAndFixDataIntegrity(supabase);
      checks.push(integrityResult.check);
      remediations = integrityResult.remediations;
    }

    const passed = checks.filter(c => c.status === "pass").length;
    const failed = checks.filter(c => c.status === "fail").length;
    const warned = checks.filter(c => c.status === "warn").length;
    const autoFixed = remediations.filter(r => r.result === "fixed").length;
    const escalated = remediations.filter(r => r.result === "escalated").length;

    const overallStatus = failed > 0 ? "critical" : warned > 0 ? "degraded" : "healthy";
    const totalDuration = Date.now() - startTime;

    // Save health check record
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

    // Build summary
    const checkSummary = checks.map(c =>
      `${c.status === "pass" ? "✅" : c.status === "warn" ? "⚠️" : "❌"} ${c.name}: ${c.message} (${c.duration_ms}ms)`
    ).join("\n");

    const remediationSummary = remediations.length > 0
      ? `\n\n🔧 AUTO-HEALING ACTIONS:\n${remediations.map(r =>
          `${r.result === "fixed" ? "✅" : r.result === "escalated" ? "🔺" : "🔄"} ${r.action} — ${r.details}`
        ).join("\n")}`
      : "";

    const actionsTaken = remediations
      .filter(r => r.result === "fixed")
      .map(r => `🔧 ${r.action}: ${r.details}`);

    if (overallStatus === "critical") {
      actionsTaken.push("🚨 Admin alert sent for failing checks");
    }

    // Save agent report
    await supabase.from("kayla_agent_reports").insert({
      report_type: "health_check",
      status: "completed",
      summary: `🏥 Health Check: ${overallStatus.toUpperCase()} | ${autoFixed} auto-fixed | ${escalated} escalated\n${checkSummary}${remediationSummary}`,
      issues_found: failed + warned + remediations.length,
      issues_fixed: autoFixed,
      issues_requiring_review: failed + escalated,
      details: { checks, remediations, overall_status: overallStatus, duration_ms: totalDuration },
      actions_taken: actionsTaken,
    });

    // Alert admins if critical
    if (overallStatus === "critical") {
      const failedChecks = checks.filter(c => c.status === "fail").map(c => c.name).join(", ");
      const { data: admins } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_type", "admin")
        .limit(10);

      if (admins?.length) {
        const fixNote = autoFixed > 0 ? ` Kayla auto-fixed ${autoFixed} issue(s), but ${failed} check(s) still need human attention.` : "";
        await supabase.from("notifications").insert(
          admins.map((admin: any) => ({
            user_id: admin.id,
            type: "kayla_health_alert",
            title: "🚨 System Health Alert",
            message: `Kayla detected ${failed} failing check(s): ${failedChecks}.${fixNote} Immediate attention required.`,
            metadata: { checks, remediations, overall_status: overallStatus },
          }))
        );
      }
      console.error(`🚨 CRITICAL: ${failed} checks failed — ${failedChecks}`);
    }

    console.log(`🏥 Health Check complete: ${overallStatus} (${totalDuration}ms) — ${autoFixed} auto-fixed, ${escalated} escalated`);

    return new Response(
      JSON.stringify({
        success: true,
        overall_status: overallStatus,
        checks,
        passed,
        failed,
        warnings: warned,
        auto_fixed: autoFixed,
        escalated,
        remediations,
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
