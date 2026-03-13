import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface AuditIssue {
  business_id: string;
  business_name: string;
  issue_type: string;
  details: string;
  auto_fixed: boolean;
  fix_applied?: string;
}

const PLACEHOLDER_PATTERNS = [
  "placeholder", "default-banner", "default-logo", "unsplash.com",
  "restaurant-banner.jpg", "images/businesses/", "${", "{{",
];

const isPlaceholder = (url: string | null): boolean => {
  if (!url) return true;
  const lc = url.toLowerCase().trim();
  if (!lc) return true;
  return PLACEHOLDER_PATTERNS.some(p => lc.includes(p));
};

const checkUrlHealth = async (url: string): Promise<{ alive: boolean; status?: number }> => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
      redirect: "follow",
      headers: { "User-Agent": "Kayla-DataAgent/1.0 (+https://1325.ai)" },
    });
    clearTimeout(timeout);
    return { alive: res.ok, status: res.status };
  } catch {
    return { alive: false };
  }
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    // This function runs as a scheduled job via pg_cron with service_role
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const issues: AuditIssue[] = [];
    const actionsTaken: string[] = [];

    // ── AUDIT 1: Businesses with missing/null images ──
    const { data: missingImages } = await supabase
      .from("businesses")
      .select("id, name, business_name, logo_url, banner_url, website")
      .or("logo_url.is.null,banner_url.is.null,logo_url.eq.,banner_url.eq.")
      .limit(100);

    for (const biz of missingImages || []) {
      const name = biz.business_name || biz.name || "Unknown";
      if (!biz.logo_url && !biz.banner_url) {
        issues.push({
          business_id: biz.id,
          business_name: name,
          issue_type: "missing_both_images",
          details: `No logo or banner. Website: ${biz.website || "none"}`,
          auto_fixed: false,
        });
      } else if (!biz.logo_url) {
        issues.push({
          business_id: biz.id,
          business_name: name,
          issue_type: "missing_logo",
          details: "Logo URL is empty",
          auto_fixed: false,
        });
      } else if (!biz.banner_url) {
        issues.push({
          business_id: biz.id,
          business_name: name,
          issue_type: "missing_banner",
          details: "Banner URL is empty",
          auto_fixed: false,
        });
      }
    }

    // ── AUDIT 2: Businesses with placeholder/generic images ──
    const { data: allBusinesses } = await supabase
      .from("businesses")
      .select("id, name, business_name, logo_url, banner_url")
      .not("logo_url", "is", null)
      .not("banner_url", "is", null)
      .limit(500);

    let placeholderCount = 0;
    for (const biz of allBusinesses || []) {
      const name = biz.business_name || biz.name || "Unknown";
      const logoPlaceholder = isPlaceholder(biz.logo_url);
      const bannerPlaceholder = isPlaceholder(biz.banner_url);

      if (logoPlaceholder || bannerPlaceholder) {
        placeholderCount++;
        if (placeholderCount <= 30) { // Cap details to keep report manageable
          issues.push({
            business_id: biz.id,
            business_name: name,
            issue_type: "placeholder_image",
            details: `${logoPlaceholder ? "Logo" : ""}${logoPlaceholder && bannerPlaceholder ? " & " : ""}${bannerPlaceholder ? "Banner" : ""} using generic placeholder`,
            auto_fixed: false,
          });
        }
      }
    }

    // ── AUDIT 3: Sample dead website checks (spot-check 20 random) ──
    const { data: websiteBusinesses } = await supabase
      .from("businesses")
      .select("id, name, business_name, website")
      .not("website", "is", null)
      .neq("website", "")
      .limit(20);

    let deadSiteCount = 0;
    const deadSiteNames: string[] = [];

    for (const biz of websiteBusinesses || []) {
      const website = biz.website?.trim();
      if (!website) continue;

      const url = website.startsWith("http") ? website : `https://${website}`;
      const { alive, status } = await checkUrlHealth(url);

      if (!alive) {
        deadSiteCount++;
        const name = biz.business_name || biz.name || "Unknown";
        deadSiteNames.push(name);
        issues.push({
          business_id: biz.id,
          business_name: name,
          issue_type: "dead_website",
          details: `Website ${url} is unreachable${status ? ` (HTTP ${status})` : " (DNS/timeout)"}`,
          auto_fixed: false,
        });
      }

      // Small delay to be polite
      await new Promise(r => setTimeout(r, 300));
    }

    // ── AUDIT 4: Businesses missing descriptions ──
    const { data: missingDesc, count: missingDescCount } = await supabase
      .from("businesses")
      .select("id", { count: "exact" })
      .or("description.is.null,description.eq.");

    if ((missingDescCount || 0) > 0) {
      issues.push({
        business_id: "aggregate",
        business_name: "Multiple businesses",
        issue_type: "missing_description",
        details: `${missingDescCount} businesses have no description`,
        auto_fixed: false,
      });
    }

    // ── AUDIT 5: Businesses missing contact info ──
    const { data: missingContact, count: missingContactCount } = await supabase
      .from("businesses")
      .select("id", { count: "exact" })
      .or("phone.is.null,phone.eq.")
      .or("email.is.null,email.eq.");

    if ((missingContactCount || 0) > 0) {
      issues.push({
        business_id: "aggregate",
        business_name: "Multiple businesses",
        issue_type: "missing_contact_info",
        details: `${missingContactCount} businesses missing phone or email`,
        auto_fixed: false,
      });
    }

    // ── AUTO-FIX: Normalize empty strings to null for cleaner data ──
    const { count: fixedEmptyLogos } = await supabase
      .from("businesses")
      .update({ logo_url: null })
      .eq("logo_url", "")
      .select("id", { count: "exact" });

    const { count: fixedEmptyBanners } = await supabase
      .from("businesses")
      .update({ banner_url: null })
      .eq("banner_url", "")
      .select("id", { count: "exact" });

    const normalizedCount = (fixedEmptyLogos || 0) + (fixedEmptyBanners || 0);
    if (normalizedCount > 0) {
      actionsTaken.push(`Normalized ${normalizedCount} empty string image URLs to NULL`);
    }

    // ── Generate Summary ──
    const issuesFixed = normalizedCount;
    const issuesRequiringReview = issues.filter(i => !i.auto_fixed).length;

    const summaryParts: string[] = [];
    summaryParts.push(`📊 Data Quality Audit Complete`);
    summaryParts.push(`Found ${issues.length} issues across the directory.`);

    if ((missingImages?.length || 0) > 0) {
      summaryParts.push(`🖼️ ${missingImages?.length} businesses missing images`);
    }
    if (placeholderCount > 0) {
      summaryParts.push(`🎨 ${placeholderCount} businesses still using placeholder images`);
    }
    if (deadSiteCount > 0) {
      summaryParts.push(`💀 ${deadSiteCount} dead websites detected: ${deadSiteNames.slice(0, 5).join(", ")}${deadSiteNames.length > 5 ? "..." : ""}`);
    }
    if ((missingDescCount || 0) > 0) {
      summaryParts.push(`📝 ${missingDescCount} businesses without descriptions`);
    }
    if (normalizedCount > 0) {
      summaryParts.push(`✅ Auto-fixed: ${normalizedCount} empty URLs normalized`);
    }

    const summary = summaryParts.join("\n");

    // ── Save Report ──
    const { error: reportError } = await supabase
      .from("kayla_agent_reports")
      .insert({
        report_type: "data_quality_audit",
        status: "completed",
        summary,
        issues_found: issues.length,
        issues_fixed: issuesFixed,
        issues_requiring_review: issuesRequiringReview,
        details: issues,
        actions_taken: actionsTaken,
      });

    if (reportError) {
      console.error("Failed to save report:", reportError);
    }

    const elapsed = Date.now() - startTime;
    console.log(`Kayla data agent completed in ${elapsed}ms. Issues: ${issues.length}, Fixed: ${issuesFixed}`);

    return new Response(
      JSON.stringify({
        success: true,
        summary,
        stats: {
          issues_found: issues.length,
          issues_fixed: issuesFixed,
          issues_requiring_review: issuesRequiringReview,
          elapsed_ms: elapsed,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("kayla-data-agent error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
