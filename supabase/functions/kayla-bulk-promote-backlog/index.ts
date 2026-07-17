// One-shot bulk backlog flush. Promotes pending/needs_review leads into businesses,
// enforcing dedup on website_domain and (normalized_name, city). Skips strict Firecrawl checks.
// Processes synchronously for up to ~45 seconds, then returns a continuation flag.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { requireAdminOrCron, authErrorResponse } from "../_shared/auth-guard.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-csrf-token",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const PLACEHOLDER_OWNER_ID = "bd72a75e-1310-4f40-9c74-380443b09d9b";
const BATCH_SIZE = 200;
const PARALLEL_CONCURRENCY = 20;
const MAX_BATCHES = 50; // safety cap
const TIME_LIMIT_MS = 45_000; // process until 45s then return

function normalizeName(s?: string | null): string | null {
  if (!s) return null;
  return s.toLowerCase().trim().replace(/\s+/g, " ");
}

function extractDomain(url?: string | null): string | null {
  if (!url) return null;
  try {
    const u = new URL(url.startsWith("http") ? url : `https://${url}`);
    return u.hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const authResult = await requireAdminOrCron(req, corsHeaders);
  if (!authResult.authenticated) return authErrorResponse(authResult, corsHeaders);

  const handlerStart = Date.now();
  const stats = {
    processed: 0,
    promoted: 0,
    skipped_duplicate_domain: 0,
    skipped_duplicate_name_city: 0,
    skipped_missing_required: 0,
    errors: 0,
    batches: 0,
  };

  let statuses = ["pending", "needs_review"];
  try {
    try {
      const body = await req.json();
      if (Array.isArray(body?.statuses) && body.statuses.length > 0) {
        statuses = body.statuses;
      }
    } catch { /* no body */ }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    let done = true;

    for (let batch = 0; batch < MAX_BATCHES; batch++) {
      if (Date.now() - handlerStart > TIME_LIMIT_MS) {
        done = false;
        break;
      }

      const { data: leads, error: leadsErr } = await supabase
        .from("b2b_external_leads")
        .select("*")
        .in("verification_status", statuses)
        .eq("is_converted", false)
        .order("lead_score", { ascending: false, nullsFirst: false })
        .order("created_at", { ascending: true })
        .limit(BATCH_SIZE);

      if (leadsErr) {
        console.error("fetch batch failed", leadsErr);
        break;
      }
      if (!leads || leads.length === 0) {
        console.log("backlog empty, stopping");
        break;
      }

      stats.batches++;

      const processLead = async (lead: any) => {
        stats.processed++;
        const websiteUrl = lead.website_url?.trim();
        if (!lead.business_name) {
          await supabase.from("b2b_external_leads")
            .update({
              verification_status: "rejected",
              verification_notes: [{ reason: "bulk_missing_name", at: new Date().toISOString() }],
            })
            .eq("id", lead.id);
          stats.skipped_missing_required++;
          return;
        }

        const domain = lead.website_domain || extractDomain(websiteUrl);
        const normName = lead.normalized_name || normalizeName(lead.business_name);

        if (domain) {
          const { data: dup } = await supabase
            .from("businesses")
            .select("id")
            .eq("website_domain", domain)
            .limit(1)
            .maybeSingle();
          if (dup) {
            await supabase.from("b2b_external_leads")
              .update({
                verification_status: "rejected",
                verification_notes: [{ reason: "bulk_dedup_domain", at: new Date().toISOString() }],
              })
              .eq("id", lead.id);
            stats.skipped_duplicate_domain++;
            return;
          }
        }

        if (normName && lead.city) {
          const { data: nameDup } = await supabase
            .from("businesses")
            .select("id")
            .eq("normalized_name", normName)
            .ilike("city", lead.city)
            .limit(1)
            .maybeSingle();
          if (nameDup) {
            await supabase.from("b2b_external_leads")
              .update({
                verification_status: "rejected",
                verification_notes: [{ reason: "bulk_dedup_name_city", at: new Date().toISOString() }],
              })
              .eq("id", lead.id);
            stats.skipped_duplicate_name_city++;
            return;
          }
        }

        const { data: inserted, error: insertErr } = await supabase
          .from("businesses")
          .insert({
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
            website: websiteUrl || "",
            website_domain: domain,
            normalized_name: normName,
            owner_id: PLACEHOLDER_OWNER_ID,
            is_verified: true,
            listing_status: "live",
            logo_url: lead.logo_url,
            banner_url: lead.banner_url,
            latitude: lead.latitude,
            longitude: lead.longitude,
          })
          .select("id")
          .single();

        if (insertErr || !inserted) {
          const msg = insertErr?.message?.toLowerCase() || "";
          if (msg.includes("duplicate")) {
            await supabase.from("b2b_external_leads")
              .update({
                verification_status: "rejected",
                verification_notes: [{ reason: "bulk_db_duplicate", at: new Date().toISOString() }],
              })
              .eq("id", lead.id);
            stats.skipped_duplicate_domain++;
          } else {
            await supabase.from("b2b_external_leads")
              .update({
                verification_status: "rejected",
                verification_notes: [{ reason: "bulk_insert_error", error: insertErr?.message, at: new Date().toISOString() }],
              })
              .eq("id", lead.id);
            stats.errors++;
            console.error("insert error", lead.id, insertErr?.message);
          }
          return;
        }

        await supabase.from("b2b_external_leads")
          .update({
            is_converted: true,
            converted_business_id: inserted.id,
            verification_status: "promoted",
            verified_at: new Date().toISOString(),
            verification_notes: [{ reason: "bulk_backlog_flush", at: new Date().toISOString() }],
          })
          .eq("id", lead.id);
        stats.promoted++;
      };

      for (let i = 0; i < leads.length; i += PARALLEL_CONCURRENCY) {
        const chunk = leads.slice(i, i + PARALLEL_CONCURRENCY);
        await Promise.all(chunk.map(processLead));
      }
    }

    // Check remaining
    const { count: remaining } = await supabase
      .from("b2b_external_leads")
      .select("id", { count: "exact", head: true })
      .in("verification_status", statuses)
      .eq("is_converted", false);

    return new Response(
      JSON.stringify({
        status: "ok",
        done,
        remaining: remaining ?? 0,
        stats,
        duration_ms: Date.now() - handlerStart,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("bulk-promote-backlog fatal", err);
    return new Response(
      JSON.stringify({ status: "error", error: String(err), stats }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
