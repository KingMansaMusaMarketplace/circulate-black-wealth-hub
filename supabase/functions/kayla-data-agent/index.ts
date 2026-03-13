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

// ── AUTO-FIX: Generate AI description ──
const generateDescription = async (
  name: string,
  category: string | null,
  city: string | null,
  state: string | null
): Promise<string | null> => {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) return null;

  try {
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: "You write concise, warm, professional business descriptions for a Black-owned business directory. 2-3 sentences max. Highlight what makes the business special. Do not use generic filler. Do not mention that the business is Black-owned unless it's central to their identity.",
          },
          {
            role: "user",
            content: `Write a brief description for: "${name}"${category ? `, category: ${category}` : ""}${city ? `, located in ${city}${state ? `, ${state}` : ""}` : ""}. Be specific and authentic.`,
          },
        ],
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() || null;
  } catch {
    return null;
  }
};

// ── AUTO-FIX: Scrape images via Firecrawl ──
const scrapeBusinessImages = async (
  website: string
): Promise<{ logo?: string; banner?: string } | null> => {
  const FIRECRAWL_API_KEY = Deno.env.get("FIRECRAWL_API_KEY");
  if (!FIRECRAWL_API_KEY) return null;

  try {
    const url = website.startsWith("http") ? website : `https://${website}`;
    const res = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${FIRECRAWL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
        formats: ["branding"],
        waitFor: 3000,
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();

    const branding = data.data?.branding || data.branding;
    if (!branding) return null;

    const logo = branding.images?.logo || branding.logo || null;
    const banner = branding.images?.ogImage || null;

    const result: { logo?: string; banner?: string } = {};
    if (logo && logo.startsWith("http")) result.logo = logo;
    if (banner && banner.startsWith("http")) result.banner = banner;

    return Object.keys(result).length > 0 ? result : null;
  } catch {
    return null;
  }
};

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
    const mode = body.mode || "full"; // "full" | "audit_only" | "fix_only"

    const issues: AuditIssue[] = [];
    const actionsTaken: string[] = [];
    let totalFixed = 0;

    // ════════════════════════════════════════
    // PHASE 1: AUDIT
    // ════════════════════════════════════════

    // ── AUDIT 1: Missing images ──
    const { data: missingImages } = await supabase
      .from("businesses")
      .select("id, name, business_name, logo_url, banner_url, website")
      .or("logo_url.is.null,banner_url.is.null,logo_url.eq.,banner_url.eq.")
      .limit(100);

    for (const biz of missingImages || []) {
      const name = biz.business_name || biz.name || "Unknown";
      if (!biz.logo_url && !biz.banner_url) {
        issues.push({ business_id: biz.id, business_name: name, issue_type: "missing_both_images", details: `No logo or banner. Website: ${biz.website || "none"}`, auto_fixed: false });
      } else if (!biz.logo_url) {
        issues.push({ business_id: biz.id, business_name: name, issue_type: "missing_logo", details: "Logo URL is empty", auto_fixed: false });
      } else if (!biz.banner_url) {
        issues.push({ business_id: biz.id, business_name: name, issue_type: "missing_banner", details: "Banner URL is empty", auto_fixed: false });
      }
    }

    // ── AUDIT 2: Placeholder images ──
    const { data: allBusinesses } = await supabase
      .from("businesses")
      .select("id, name, business_name, logo_url, banner_url")
      .not("logo_url", "is", null)
      .not("banner_url", "is", null)
      .limit(500);

    let placeholderCount = 0;
    for (const biz of allBusinesses || []) {
      const name = biz.business_name || biz.name || "Unknown";
      if (isPlaceholder(biz.logo_url) || isPlaceholder(biz.banner_url)) {
        placeholderCount++;
        if (placeholderCount <= 20) {
          issues.push({ business_id: biz.id, business_name: name, issue_type: "placeholder_image", details: "Using generic placeholder", auto_fixed: false });
        }
      }
    }

    // ── AUDIT 3: Dead websites (spot-check 20) ──
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
        issues.push({ business_id: biz.id, business_name: name, issue_type: "dead_website", details: `${url} unreachable${status ? ` (HTTP ${status})` : ""}`, auto_fixed: false });
      }
      await new Promise(r => setTimeout(r, 300));
    }

    // ── AUDIT 4: Missing descriptions ──
    const { count: missingDescCount } = await supabase
      .from("businesses")
      .select("id", { count: "exact" })
      .or("description.is.null,description.eq.");

    if ((missingDescCount || 0) > 0) {
      issues.push({ business_id: "aggregate", business_name: "Multiple", issue_type: "missing_description", details: `${missingDescCount} businesses have no description`, auto_fixed: false });
    }

    // ── AUDIT 5: Missing contact info ──
    const { count: missingContactCount } = await supabase
      .from("businesses")
      .select("id", { count: "exact" })
      .or("phone.is.null,phone.eq.")
      .or("email.is.null,email.eq.");

    if ((missingContactCount || 0) > 0) {
      issues.push({ business_id: "aggregate", business_name: "Multiple", issue_type: "missing_contact_info", details: `${missingContactCount} businesses missing phone or email`, auto_fixed: false });
    }

    // ════════════════════════════════════════
    // PHASE 2: AUTO-FIX
    // ════════════════════════════════════════

    if (mode !== "audit_only") {
      // ── FIX 1: Normalize empty strings ──
      const { count: fixedLogos } = await supabase
        .from("businesses")
        .update({ logo_url: null })
        .eq("logo_url", "")
        .select("id", { count: "exact" });

      const { count: fixedBanners } = await supabase
        .from("businesses")
        .update({ banner_url: null })
        .eq("banner_url", "")
        .select("id", { count: "exact" });

      const normalizedCount = (fixedLogos || 0) + (fixedBanners || 0);
      if (normalizedCount > 0) {
        actionsTaken.push(`Normalized ${normalizedCount} empty image URLs to NULL`);
        totalFixed += normalizedCount;
      }

      // ── FIX 2: Auto-generate descriptions (batch of 10) ──
      const { data: noDescBiz } = await supabase
        .from("businesses")
        .select("id, name, business_name, category, city, state")
        .or("description.is.null,description.eq.")
        .limit(10);

      let descGenerated = 0;
      for (const biz of noDescBiz || []) {
        const name = biz.business_name || biz.name || "Unknown";
        const desc = await generateDescription(name, biz.category, biz.city, biz.state);
        if (desc && desc.length > 20) {
          const { error } = await supabase
            .from("businesses")
            .update({ description: desc, updated_at: new Date().toISOString() })
            .eq("id", biz.id);

          if (!error) {
            descGenerated++;
            totalFixed++;
            // Update the issue to mark as fixed
            const existingIssue = issues.find(i => i.issue_type === "missing_description");
            if (existingIssue) {
              existingIssue.auto_fixed = true;
            }
            issues.push({
              business_id: biz.id,
              business_name: name,
              issue_type: "missing_description",
              details: `Generated: "${desc.substring(0, 80)}..."`,
              auto_fixed: true,
              fix_applied: "ai_description_generated",
            });
          }
        }
        // Rate limit AI calls
        await new Promise(r => setTimeout(r, 500));
      }
      if (descGenerated > 0) {
        actionsTaken.push(`🤖 Auto-generated ${descGenerated} business descriptions using AI`);
      }

      // ── FIX 3: Scrape images for businesses with live websites but missing images (batch of 5) ──
      const { data: scrapeCandidates } = await supabase
        .from("businesses")
        .select("id, name, business_name, website, logo_url, banner_url")
        .not("website", "is", null)
        .neq("website", "")
        .or("logo_url.is.null,banner_url.is.null")
        .limit(5);

      let imagesScraped = 0;
      for (const biz of scrapeCandidates || []) {
        const name = biz.business_name || biz.name || "Unknown";
        const website = biz.website?.trim();
        if (!website) continue;

        // First check if site is alive
        const url = website.startsWith("http") ? website : `https://${website}`;
        const { alive } = await checkUrlHealth(url);
        if (!alive) continue;

        const scraped = await scrapeBusinessImages(website);
        if (!scraped) continue;

        const updates: Record<string, string> = { updated_at: new Date().toISOString() };
        if (!biz.logo_url && scraped.logo) updates.logo_url = scraped.logo;
        if (!biz.banner_url && scraped.banner) updates.banner_url = scraped.banner;

        if (Object.keys(updates).length <= 1) continue; // only updated_at

        const { error } = await supabase
          .from("businesses")
          .update(updates)
          .eq("id", biz.id);

        if (!error) {
          imagesScraped++;
          totalFixed++;
          issues.push({
            business_id: biz.id,
            business_name: name,
            issue_type: "missing_images_scraped",
            details: `Scraped from ${website}: ${scraped.logo ? "logo" : ""}${scraped.logo && scraped.banner ? " + " : ""}${scraped.banner ? "banner" : ""}`,
            auto_fixed: true,
            fix_applied: "firecrawl_scrape",
          });
        }
        await new Promise(r => setTimeout(r, 1000));
      }
      if (imagesScarped > 0) {
        actionsTaken.push(`🔍 Scraped ${imagesScarped} fresh images from live business websites`);
      }

      // ── FIX 4: Create proactive outreach notifications for incomplete profiles ──
      const { data: incompleteBiz } = await supabase
        .from("businesses")
        .select("id, owner_id, name, business_name, description, logo_url, banner_url, phone, email, website")
        .not("owner_id", "is", null)
        .limit(50);

      let outreachCreated = 0;
      for (const biz of incompleteBiz || []) {
        const missing: string[] = [];
        if (!biz.description) missing.push("description");
        if (!biz.logo_url || isPlaceholder(biz.logo_url)) missing.push("logo");
        if (!biz.banner_url || isPlaceholder(biz.banner_url)) missing.push("banner image");
        if (!biz.phone) missing.push("phone number");
        if (!biz.website) missing.push("website");

        // Only notify if 2+ things missing (don't spam for minor gaps)
        if (missing.length < 2) continue;

        const name = biz.business_name || biz.name || "Unknown";

        // Check if we already sent a notification in the last 7 days
        const { count: recentNotifs } = await supabase
          .from("notifications")
          .select("id", { count: "exact" })
          .eq("user_id", biz.owner_id)
          .eq("type", "kayla_profile_nudge")
          .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

        if ((recentNotifs || 0) > 0) continue;

        const message = `Hi! Kayla here 👋 Your listing for "${name}" is missing: ${missing.join(", ")}. A complete profile gets 3x more views! Want me to help fill these in?`;

        const { error } = await supabase
          .from("notifications")
          .insert({
            user_id: biz.owner_id,
            type: "kayla_profile_nudge",
            title: "Complete your business profile",
            message,
            data: { business_id: biz.id, missing_fields: missing },
          });

        if (!error) {
          outreachCreated++;
          issues.push({
            business_id: biz.id,
            business_name: name,
            issue_type: "proactive_outreach_sent",
            details: `Nudge sent to owner: missing ${missing.join(", ")}`,
            auto_fixed: true,
            fix_applied: "profile_nudge_notification",
          });
        }
      }
      if (outreachCreated > 0) {
        actionsTaken.push(`📬 Sent ${outreachCreated} proactive profile-completion nudges to business owners`);
        totalFixed += outreachCreated;
      }
    }

    // ════════════════════════════════════════
    // PHASE 3: REPORT
    // ════════════════════════════════════════

    const issuesRequiringReview = issues.filter(i => !i.auto_fixed).length;

    const summaryParts: string[] = [];
    summaryParts.push("📊 Kayla Data Quality Report");
    summaryParts.push(`Found ${issues.length} items across the directory.`);

    if ((missingImages?.length || 0) > 0) summaryParts.push(`🖼️ ${missingImages?.length} businesses missing images`);
    if (placeholderCount > 0) summaryParts.push(`🎨 ${placeholderCount} businesses using placeholder images`);
    if (deadSiteCount > 0) summaryParts.push(`💀 ${deadSiteCount} dead websites: ${deadSiteNames.slice(0, 5).join(", ")}${deadSiteNames.length > 5 ? "..." : ""}`);
    if ((missingDescCount || 0) > 0) summaryParts.push(`📝 ${missingDescCount} without descriptions`);

    if (totalFixed > 0) {
      summaryParts.push("");
      summaryParts.push("✅ Auto-fixes applied:");
      for (const action of actionsTaken) {
        summaryParts.push(`  ${action}`);
      }
    }

    const summary = summaryParts.join("\n");

    await supabase.from("kayla_agent_reports").insert({
      report_type: mode === "audit_only" ? "audit_only" : "data_quality_audit",
      status: "completed",
      summary,
      issues_found: issues.length,
      issues_fixed: totalFixed,
      issues_requiring_review: issuesRequiringReview,
      details: issues,
      actions_taken: actionsTaken,
    });

    const elapsed = Date.now() - startTime;
    console.log(`Kayla agent done in ${elapsed}ms. Found: ${issues.length}, Fixed: ${totalFixed}`);

    return new Response(
      JSON.stringify({ success: true, summary, stats: { issues_found: issues.length, issues_fixed: totalFixed, issues_requiring_review: issuesRequiringReview, elapsed_ms: elapsed } }),
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
