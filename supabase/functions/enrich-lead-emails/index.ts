import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { requireAdminOrCron } from "../_shared/auth-guard.ts";
import { createLovableAiGatewayProvider } from "../_shared/lovable-ai-gateway.ts";
import { z } from "npm:zod";

/**
 * Kayla Contact Enrichment Pass
 * - Uses Firecrawl v2 (direct API) to scrape business websites
 * - Uses Lovable AI Gateway (google/gemini-3.6-flash) to extract owner/operator contact info
 * - Updates b2b_external_leads with owner_email, confidence_score, and enrichment details
 * - Writes to kayla_enrichment_log for audit/debugging
 * - Runs in batches to stay under rate limits
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-csrf-token, x-cron-secret',
};

const FIRECRAWL_V2 = 'https://api.firecrawl.dev/v2';

interface EnrichRequest {
  lead_ids?: string[];
  enrich_missing_only?: boolean;
  limit?: number;
}

const ContactSchema = z.object({
  owner_name: z.string().nullable(),
  owner_email: z.string().email().nullable(),
  general_email: z.string().email().nullable(),
  phone: z.string().nullable(),
  source: z.string().nullable(),
  confidence: z.number().min(0).max(1),
  reasoning: z.string().nullable(),
}).partial();

function normalizeUrl(url: string): string {
  let normalized = url.trim();
  if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
    normalized = `https://${normalized}`;
  }
  return normalized;
}

function isDisposableEmail(email: string): boolean {
  const disposable = [
    '@gmail.com', '@yahoo.com', '@hotmail.com', '@outlook.com', '@aol.com', '@icloud.com', '@me.com', '@msn.com', '@live.com',
  ];
  const lower = email.toLowerCase();
  // We actually DO want to find business emails, but prefer domain emails over personal freemail when possible
  return false;
}

function scoreEmail(email: string, businessDomain: string): number {
  const lower = email.toLowerCase();
  const local = lower.split('@')[0];
  const domain = lower.split('@')[1];

  let score = 0.5;

  // Prefer domain emails matching business domain
  if (domain && businessDomain.toLowerCase().includes(domain.replace(/^www\./, '').split('.')[0])) {
    score += 0.3;
  }

  // Prefer owner-style local parts
  if (/^(owner|founder|ceo|manager|director|president|principal|proprietor)/i.test(local)) {
    score += 0.2;
  }

  // Prefer contact-style local parts
  if (/^(info|contact|hello|business|sales)/i.test(local)) {
    score += 0.1;
  }

  // Penalize obvious noreply / support-only
  if (/^(noreply|no-reply|donotreply|support)/i.test(local)) {
    score -= 0.3;
  }

  return Math.max(0.1, Math.min(1, score));
}

async function scrapeWithFirecrawl(url: string, apiKey: string): Promise<{ markdown: string; metadata: any }> {
  const response = await fetch(`${FIRECRAWL_V2}/scrape`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url,
      formats: ['markdown'],
      onlyMainContent: false,
      waitFor: 2000,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Firecrawl scrape failed [${response.status}]: ${errorBody}`);
  }

  const data = await response.json();
  const markdown = data.markdown || data.data?.markdown || '';
  const metadata = data.metadata || data.data?.metadata || {};
  return { markdown, metadata };
}

async function extractContactsWithAI(
  provider: ReturnType<typeof createLovableAiGatewayProvider>,
  businessName: string,
  websiteUrl: string,
  markdown: string
) {
  const prompt = `You are a business intelligence researcher extracting the owner/operator contact for a Black-owned business.

Business name: ${businessName}
Website: ${websiteUrl}

Scraped website content:
---
${markdown.slice(0, 12000)}
---

Extract the most likely owner/operator contact information. Return a JSON object with these fields:
- owner_name: string or null (full name of the owner/operator if clearly stated)
- owner_email: string or null (email most likely to reach the owner/operator directly)
- general_email: string or null (fallback general business email like info@, contact@)
- phone: string or null (business phone)
- source: string or null (where on the site this was found, e.g., "About page", "Contact page", "Footer")
- confidence: number between 0 and 1 (how confident you are that owner_email reaches the owner)
- reasoning: string or null (1 sentence explaining the confidence)

Rules:
- Only return emails that look real.
- Prefer owner_email over general_email.
- If no owner email exists, return the best general contact email as general_email.
- If you are unsure, set confidence below 0.6.`;

  return await provider.generateObject({
    model: "google/gemini-3.6-flash",
    prompt,
    schema: ContactSchema,
  });
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const auth = await requireAdminOrCron(req, corsHeaders);
  if (!auth.authenticated) {
    return new Response(JSON.stringify({ error: auth.error }), {
      status: auth.status ?? 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const FIRECRAWL_API_KEY = Deno.env.get('FIRECRAWL_API_KEY');
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!FIRECRAWL_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Firecrawl connector not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Lovable AI Gateway key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!) as any;
    const ai = createLovableAiGatewayProvider(LOVABLE_API_KEY);

    const body: EnrichRequest = await req.json().catch(() => ({}));
    const { lead_ids, enrich_missing_only = true, limit = 500 } = body;
    const runId = crypto.randomUUID();

    console.log(`[Kayla Enrichment] run=${runId} ids=${lead_ids?.length || 'auto'} limit=${limit}`);

    let query = supabase
      .from('b2b_external_leads')
      .select('id, business_name, website_url, owner_email, phone_number, contact_info, enrichment_attempts')
      .order('enrichment_attempts', { ascending: true, nullsFirst: true })
      .order('created_at', { ascending: true });

    if (lead_ids && lead_ids.length > 0) {
      query = query.in('id', lead_ids);
    } else if (enrich_missing_only) {
      // Robust filter: website present AND (owner_email IS NULL OR owner_email = '')
      // Supabase JS .or() syntax with proper empty-string handling
      query = query
        .not('website_url', 'is', null)
        .or('owner_email.is.null,owner_email.eq.""');
    }

    const { data: leads, error: fetchError, count } = await query.limit(Math.min(limit, 500));

    console.log(`[Kayla Enrichment] query matched count=${count ?? 'unknown'} error=${fetchError ? fetchError.message : 'none'}`);

    if (fetchError) throw fetchError;

    if (!leads || leads.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No leads to enrich', enriched: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const results = {
      run_id: runId,
      processed: 0,
      enriched: 0,
      emails_found: 0,
      phones_found: 0,
      failed: 0,
      details: [] as any[],
    };

    for (const lead of leads) {
      if (!lead.website_url) continue;

      try {
        const url = normalizeUrl(lead.website_url);
        const businessDomain = new URL(url).hostname;

        console.log(`[Kayla Enrichment] scraping ${url} for ${lead.business_name}`);
        const { markdown } = await scrapeWithFirecrawl(url, FIRECRAWL_API_KEY);

        const extracted = await extractContactsWithAI(ai, lead.business_name, url, markdown);

        const chosenEmail = extracted.owner_email || extracted.general_email || null;
        let finalConfidence = extracted.confidence ?? 0.5;
        if (chosenEmail) {
          finalConfidence = Math.max(finalConfidence, scoreEmail(chosenEmail, businessDomain));
        }

        const updateData: any = {
          enrichment_attempts: (lead.enrichment_attempts || 0) + 1,
          last_enriched_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          enrichment_source: 'firecrawl_v2_ai',
          enrichment_details: {
            run_id: runId,
            owner_name: extracted.owner_name || null,
            source: extracted.source || null,
            reasoning: extracted.reasoning || null,
            ai_confidence: extracted.confidence ?? null,
            final_confidence: finalConfidence,
            scraped_domain: businessDomain,
          },
        };

        if (chosenEmail && !lead.owner_email) {
          updateData.owner_email = chosenEmail;
          updateData.email_status = 'not_sent';
          results.emails_found++;
        }

        if (extracted.phone && !lead.phone_number) {
          updateData.phone_number = extracted.phone;
          results.phones_found++;
        }

        updateData.confidence_score = finalConfidence;

        // Merge into contact_info jsonb if it exists
        const existingContactInfo = lead.contact_info || {};
        updateData.contact_info = {
          ...existingContactInfo,
          enriched_name: extracted.owner_name || existingContactInfo.enriched_name || null,
          enriched_email: chosenEmail || existingContactInfo.enriched_email || null,
          enriched_phone: extracted.phone || existingContactInfo.enriched_phone || null,
          enrichment_source: 'firecrawl_v2_ai',
          enrichment_run_id: runId,
        };

        const { error: updateError } = await supabase
          .from('b2b_external_leads')
          .update(updateData)
          .eq('id', lead.id);

        if (updateError) throw updateError;

        // Audit log
        await supabase.from('kayla_enrichment_log').insert({
          lead_id: lead.id,
          run_id: runId,
          source_url: url,
          emails_found: chosenEmail ? [chosenEmail] : [],
          owner_name: extracted.owner_name || null,
          owner_email: chosenEmail,
          confidence_score: finalConfidence,
          extraction_method: 'firecrawl_v2_ai',
          error_message: null,
        });

        results.enriched++;
        results.details.push({
          id: lead.id,
          business_name: lead.business_name,
          owner_email: chosenEmail,
          owner_name: extracted.owner_name,
          confidence: finalConfidence,
          source: extracted.source,
        });

        // Delay to respect Firecrawl / AI rate limits
        await new Promise(resolve => setTimeout(resolve, 800));

      } catch (err) {
        console.error(`[Kayla Enrichment] error on lead ${lead.id}:`, err);
        results.failed++;
        await supabase.from('kayla_enrichment_log').insert({
          lead_id: lead.id,
          run_id: runId,
          source_url: lead.website_url ? normalizeUrl(lead.website_url) : null,
          emails_found: [],
          owner_name: null,
          owner_email: null,
          confidence_score: null,
          extraction_method: 'firecrawl_v2_ai',
          error_message: err instanceof Error ? err.message : String(err),
        });

        // Increment attempts even on failure so we don't hammer the same broken site
        await supabase
          .from('b2b_external_leads')
          .update({
            enrichment_attempts: (lead.enrichment_attempts || 0) + 1,
            last_enriched_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', lead.id);
      }

      results.processed++;
    }

    console.log(`[Kayla Enrichment] run=${runId} complete:`, results);

    return new Response(
      JSON.stringify({
        message: 'Kayla enrichment pass complete',
        ...results,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in enrich-lead-emails:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
