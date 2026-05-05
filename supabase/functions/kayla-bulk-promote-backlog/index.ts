// One-shot bulk backlog flush. Promotes pending/needs_review leads into businesses,
// enforcing dedup on website_domain and (normalized_name, city). Skips strict Firecrawl checks.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-csrf-token",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const PLACEHOLDER_OWNER_ID = "bd72a75e-1310-4f40-9c74-380443b09d9b";
const BATCH_SIZE = 500;
const PARALLEL_CONCURRENCY = 25;

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

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const startTime = Date.now();
    const stats = {
      processed: 0,
      promoted: 0,
      skipped_duplicate_domain: 0,
      skipped_duplicate_name_city: 0,
      skipped_missing_required: 0,
      errors: 0,
    };

    const { data: leads, error: leadsErr } = await supabase
      .from("b2b_external_leads")
      .select("*")
      .in("verification_status", ["pending", "needs_review"])
      .eq("is_converted", false)
      .order("lead_score", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: true })
      .limit(BATCH_SIZE);

    if (leadsErr) throw leadsErr;
    const allLeads = leads || [];

    const processLead = async (lead: any) => {
      stats.processed++;
      const websiteUrl = lead.website_url?.trim();
      if (!lead.business_name) {
        stats.skipped_missing_required++;
        return;
      }

      const domain = lead.website_domain || extractDomain(websiteUrl);
      const normName = lead.normalized_name || normalizeName(lead.business_name);

      // Dedup: domain
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

      // Dedup: normalized_name + city
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
        if (insertErr?.message?.toLowerCase().includes("duplicate")) {
          await supabase.from("b2b_external_leads")
            .update({
              verification_status: "rejected",
              verification_notes: [{ reason: "bulk_db_duplicate", at: new Date().toISOString() }],
            })
            .eq("id", lead.id);
          stats.skipped_duplicate_domain++;
        } else {
          stats.errors++;
          console.error("insert error", lead.id, insertErr?.message);
        }
        return;
      }

      await supabase.from("b2b_external_leads")
        .update({
          is_converted: true,
          converted_business_id: inserted.id,
          verification_status: "promoted_bulk",
          verified_at: new Date().toISOString(),
          verification_notes: [{ reason: "bulk_backlog_flush", at: new Date().toISOString() }],
        })
        .eq("id", lead.id);
      stats.promoted++;
    };

    for (let i = 0; i < allLeads.length; i += PARALLEL_CONCURRENCY) {
      const chunk = allLeads.slice(i, i + PARALLEL_CONCURRENCY);
      await Promise.all(chunk.map(processLead));
    }

    const result = {
      ...stats,
      total_candidates: allLeads.length,
      duration_ms: Date.now() - startTime,
    };
    console.log("bulk-promote-backlog complete", result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("bulk-promote-backlog fatal", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
