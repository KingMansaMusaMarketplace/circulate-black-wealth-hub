// Kayla Verify & Promote
// Pulls pending leads from b2b_external_leads, scrapes the actual website with
// Firecrawl, runs accuracy checks, and either promotes to `businesses` (live)
// or marks needs_review for the admin queue.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { requireAdminOrCron, authErrorResponse } from "../_shared/auth-guard.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-csrf-token, x-cron-secret",
};

const PLACEHOLDER_OWNER_ID = "bd72a75e-1310-4f40-9c74-380443b09d9b";
const BATCH_SIZE = 150;
const PARALLEL_CONCURRENCY = 15;

function digitsOnly(s: string | null | undefined): string {
  return (s || "").replace(/\D/g, "");
}

function fuzzyContains(haystack: string, needle: string): boolean {
  const h = haystack.toLowerCase();
  const n = needle.toLowerCase().trim();
  if (!n) return false;
  if (h.includes(n)) return true;
  // Check if at least 70% of name tokens appear
  const tokens = n.split(/\s+/).filter(t => t.length > 2);
  if (tokens.length === 0) return false;
  const hits = tokens.filter(t => h.includes(t)).length;
  return hits / tokens.length >= 0.7;
}

async function scrapeSite(url: string, key: string): Promise<{ ok: boolean; markdown: string; status?: number }> {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 8000);
    const res = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method: "POST",
      headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ url, formats: ["markdown"], onlyMainContent: false, timeout: 7000 }),
      signal: ctrl.signal,
    });
    clearTimeout(t);
    if (!res.ok) return { ok: false, markdown: "", status: res.status };
    const data = await res.json();
    return { ok: true, markdown: data?.data?.markdown || "" };
  } catch {
    return { ok: false, markdown: "" };
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const startTime = Date.now();
  let supabase: any = null;
  let runId: string | null = null;
  try {
    const auth = await requireAdminOrCron(req, corsHeaders);
    if (!auth.authenticated) return authErrorResponse(auth, corsHeaders);

    const firecrawlKey = Deno.env.get("FIRECRAWL_API_KEY");
    if (!firecrawlKey) throw new Error("FIRECRAWL_API_KEY required");

    supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    ) as any;

    const TWO_MIN_AGO = new Date(Date.now() - 2 * 60 * 1000).toISOString();
    const { data: recentRun } = await supabase
      .from("kayla_run_log")
      .select("id, completed_at")
      .eq("agent_name", "kayla-verify-and-promote")
      .eq("run_status", "completed")
      .gte("completed_at", TWO_MIN_AGO)
      .order("completed_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (recentRun) {
      return new Response(JSON.stringify({
        success: true,
        skipped: true,
        reason: "recent_run_within_2min",
        lastCompleted: recentRun.completed_at,
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const FIVE_MIN_AGO = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const { data: inFlight } = await supabase
      .from("kayla_run_log")
      .select("id, started_at")
      .eq("agent_name", "kayla-verify-and-promote")
      .eq("run_status", "started")
      .gte("started_at", FIVE_MIN_AGO)
      .order("started_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (inFlight) {
      return new Response(JSON.stringify({
        success: true,
        skipped: true,
        reason: "run_in_progress",
        startedAt: inFlight.started_at,
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { data: runRow } = await supabase
      .from("kayla_run_log")
      .insert({ agent_name: "kayla-verify-and-promote", run_status: "started" })
      .select("id")
      .single();
    runId = runRow?.id ?? null;

    let verified = 0, needsReview = 0, rejected = 0, promoted = 0;

    const { data: leads, error: fetchErr } = await supabase
      .from("b2b_external_leads")
      .select("*")
      .eq("verification_status", "pending")
      .order("created_at", { ascending: true })
      .limit(BATCH_SIZE);

    if (fetchErr) throw new Error(`Fetch leads failed: ${fetchErr.message}`);

    const processLead = async (lead: any) => {
      const reasons: string[] = [];
      const websiteUrl = lead.website_url?.trim();
      if (!websiteUrl) {
        await supabase.from("b2b_external_leads")
          .update({ verification_status: "rejected", verification_notes: [{ reason: "no_website", at: new Date().toISOString() }] })
          .eq("id", lead.id);
        rejected++;
        return;
      }

      // Domain dedup against live directory
      if (lead.website_domain) {
        const { data: dup } = await supabase
          .from("businesses")
          .select("id")
          .eq("website_domain", lead.website_domain)
          .limit(1)
          .maybeSingle();
        if (dup) {
          await supabase.from("b2b_external_leads")
            .update({ verification_status: "rejected", verification_notes: [{ reason: "domain_already_live", at: new Date().toISOString() }] })
            .eq("id", lead.id);
          rejected++;
          return;
        }
      }

      // Name dedup against live
      if (lead.normalized_name) {
        const { data: nameDup } = await supabase
          .from("businesses")
          .select("id")
          .eq("normalized_name", lead.normalized_name)
          .ilike("city", lead.city || "")
          .limit(1)
          .maybeSingle();
        if (nameDup) {
          await supabase.from("b2b_external_leads")
            .update({ verification_status: "rejected", verification_notes: [{ reason: "name_city_already_live", at: new Date().toISOString() }] })
            .eq("id", lead.id);
          rejected++;
          return;
        }
      }

      // Scrape the actual website
      const scrape = await scrapeSite(websiteUrl, firecrawlKey);
      if (!scrape.ok || scrape.markdown.length < 100) {
        reasons.push(`website_unreachable${scrape.status ? `_${scrape.status}` : ""}`);
      } else {
        if (!fuzzyContains(scrape.markdown, lead.business_name)) {
          reasons.push("name_not_on_homepage");
        }
        const claimedPhoneDigits = digitsOnly(lead.phone_number);
        if (claimedPhoneDigits.length >= 7) {
          const last7 = claimedPhoneDigits.slice(-7);
          if (!scrape.markdown.replace(/\D/g, "").includes(last7)) {
            reasons.push("phone_mismatch");
          }
        }
        if (lead.city && !scrape.markdown.toLowerCase().includes(lead.city.toLowerCase())) {
          reasons.push("city_not_on_site");
        }
      }

      if ((lead.confidence_score ?? 0) < 0.75) {
        reasons.push("low_confidence");
      }

      const updateNote = { at: new Date().toISOString(), reasons, scrape_ok: scrape.ok };

      if (reasons.length === 0) {
        const { error: promoteErr } = await supabase.from("businesses").insert({
          name: lead.business_name,
          business_name: lead.business_name,
          description: lead.business_description || "",
          category: lead.category,
          address: lead.address || "",
          city: lead.city,
          state: lead.state,
          zip_code: lead.zip_code || "",
          phone: lead.phone_number || "",
          email: lead.owner_email || "",
          website: websiteUrl,
          owner_id: PLACEHOLDER_OWNER_ID,
          is_verified: true,
          listing_status: "live",
          logo_url: lead.logo_url,
          banner_url: lead.banner_url,
          latitude: lead.latitude,
          longitude: lead.longitude,
        });

        if (promoteErr) {
          if (promoteErr.message?.toLowerCase().includes("duplicate")) {
            await supabase.from("b2b_external_leads")
              .update({ verification_status: "rejected", verification_notes: [{ ...updateNote, reason: "db_duplicate" }] })
              .eq("id", lead.id);
            rejected++;
          } else {
            await supabase.from("b2b_external_leads")
              .update({ verification_status: "needs_review", verification_notes: [{ ...updateNote, reason: `promote_error: ${promoteErr.message}` }] })
              .eq("id", lead.id);
            needsReview++;
          }
        } else {
          await supabase.from("b2b_external_leads")
            .update({ verification_status: "promoted", verified_at: new Date().toISOString(), verification_notes: [updateNote] })
            .eq("id", lead.id);
          verified++;
          promoted++;
        }
      } else {
        await supabase.from("b2b_external_leads")
          .update({ verification_status: "needs_review", verification_notes: [updateNote] })
          .eq("id", lead.id);
        needsReview++;
      }
    };

    // Process in parallel chunks
    const allLeads = leads || [];
    for (let i = 0; i < allLeads.length; i += PARALLEL_CONCURRENCY) {
      const chunk = allLeads.slice(i, i + PARALLEL_CONCURRENCY);
      await Promise.all(chunk.map(processLead));
    }

    const durationMs = Date.now() - startTime;
    await supabase.from("kayla_agent_reports").insert({
      report_type: "verify_and_promote",
      status: "completed",
      summary: `Processed ${leads?.length || 0} pending leads. Promoted: ${promoted}, Needs review: ${needsReview}, Rejected: ${rejected}. Duration: ${durationMs}ms.`,
      details: { processed: leads?.length || 0, promoted, needs_review: needsReview, rejected, duration_ms: durationMs },
      issues_found: leads?.length || 0,
      issues_fixed: promoted,
    });

    if (runId) {
      await supabase
        .from("kayla_run_log")
        .update({
          run_status: "completed",
          completed_at: new Date().toISOString(),
          duration_ms: durationMs,
          details: { processed: leads?.length || 0, promoted, needs_review: needsReview, rejected },
        })
        .eq("id", runId);
    }

    return new Response(JSON.stringify({
      success: true, processed: leads?.length || 0, promoted, needsReview, rejected, durationMs,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[Kayla Verify] Error:", msg);
    if (supabase && runId) {
      await supabase
        .from("kayla_run_log")
        .update({
          run_status: "failed",
          completed_at: new Date().toISOString(),
          duration_ms: Date.now() - startTime,
          details: { error: msg },
        })
        .eq("id", runId);
    }
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
