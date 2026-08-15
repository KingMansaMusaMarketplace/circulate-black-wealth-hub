import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { requireAdminOrCron } from "../_shared/auth-guard.ts";
import { createLovableAiGatewayProvider } from "../_shared/lovable-ai-gateway.ts";
import { z } from "npm:zod";

/**
 * Outreach CRM Contact Finder
 * - Scrapes each outreach target's website with Firecrawl v2
 * - Uses Lovable AI Gateway to extract owner/decision-maker name, title, email, phone
 * - Writes results back into public.outreach_targets (never overwrites existing values)
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-csrf-token, x-cron-secret',
};

const FIRECRAWL_V2 = 'https://api.firecrawl.dev/v2';

const ContactSchema = z.object({
  owner_name: z.string().nullable(),
  owner_title: z.string().nullable(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  linkedin_url: z.string().nullable(),
  source: z.string().nullable(),
  confidence: z.number().min(0).max(1).nullable(),
}).partial();

function normalizeUrl(url: string): string {
  const trimmed = url.trim();
  if (!/^https?:\/\//i.test(trimmed)) return `https://${trimmed}`;
  return trimmed;
}

async function scrapeWithFirecrawl(url: string, apiKey: string): Promise<string> {
  const response = await fetch(`${FIRECRAWL_V2}/scrape`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url, formats: ['markdown'], onlyMainContent: false, waitFor: 2000 }),
  });
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Firecrawl scrape failed [${response.status}]: ${errorBody.slice(0, 300)}`);
  }
  const data = await response.json();
  return data.markdown || data.data?.markdown || '';
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

    if (!FIRECRAWL_API_KEY || !LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Firecrawl or Lovable AI Gateway key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!) as any;
    const ai = createLovableAiGatewayProvider(LOVABLE_API_KEY);

    const body = await req.json().catch(() => ({}));
    const targetIds: string[] | undefined = body.target_ids;
    const listName: string | undefined = body.list_name;
    const limit: number = Math.min(Number(body.limit) || 25, 50);
    const runId = crypto.randomUUID();

    let query = supabase
      .from('outreach_targets')
      .select('id, directory_name, website, owner_name, owner_title, contact_value, contact_method, phone, linkedin_url, notes')
      .not('website', 'is', null);

    if (targetIds?.length) {
      query = query.in('id', targetIds);
    } else {
      // Only rows still missing an email or an owner name
      query = query.or('contact_value.is.null,owner_name.is.null');
      if (listName) query = query.eq('list_name', listName);
    }

    const { data: targets, error: fetchError } = await query.limit(limit);
    if (fetchError) throw fetchError;

    if (!targets || targets.length === 0) {
      return new Response(JSON.stringify({ message: 'Nothing left to enrich', processed: 0 }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const results = {
      run_id: runId,
      processed: 0,
      updated: 0,
      emails_found: 0,
      names_found: 0,
      phones_found: 0,
      failed: 0,
      details: [] as any[],
    };

    for (const t of targets) {
      results.processed++;
      try {
        const url = normalizeUrl(t.website);
        const markdown = await scrapeWithFirecrawl(url, FIRECRAWL_API_KEY);

        const extracted = await ai.generateObject({
          model: 'google/gemini-3.6-flash',
          schema: ContactSchema,
          prompt: `You are researching a Black business directory / chamber / association so our partnerships team can contact its leadership.

Organization: ${t.directory_name}
Website: ${url}

Scraped website content:
---
${markdown.slice(0, 14000)}
---

Return JSON with:
- owner_name: full name of the founder / owner / executive director / president (null if not clearly stated)
- owner_title: their title (null if unknown)
- email: the best email address to reach leadership or partnerships (null if none found)
- phone: main phone number in +1-XXX-XXX-XXXX or local format (null if none)
- linkedin_url: LinkedIn profile or company page URL (null if none)
- source: where on the site you found it (e.g. "About page", "Footer")
- confidence: 0 to 1

Rules: never invent an email, name, or phone. Only report values literally present in the content. If unsure, use null.`,
        });

        const update: any = {};
        if (extracted.owner_name && !t.owner_name) { update.owner_name = extracted.owner_name; results.names_found++; }
        if (extracted.owner_title && !t.owner_title) update.owner_title = extracted.owner_title;
        if (extracted.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(extracted.email) && !t.contact_value) {
          update.contact_value = extracted.email;
          if (!t.contact_method) update.contact_method = 'email';
          results.emails_found++;
        }
        if (extracted.phone && !t.phone) { update.phone = extracted.phone; results.phones_found++; }
        if (extracted.linkedin_url && !t.linkedin_url) update.linkedin_url = extracted.linkedin_url;

        if (Object.keys(update).length > 0) {
          update.updated_at = new Date().toISOString();
          const stamp = `[Kayla contact finder ${new Date().toISOString().slice(0, 10)}] source: ${extracted.source || 'website'} (confidence ${(extracted.confidence ?? 0).toFixed(2)})`;
          update.notes = t.notes ? `${t.notes}\n${stamp}` : stamp;

          const { error: updateError } = await supabase
            .from('outreach_targets')
            .update(update)
            .eq('id', t.id);
          if (updateError) throw updateError;
          results.updated++;
        }

        results.details.push({
          id: t.id,
          directory_name: t.directory_name,
          found: Object.keys(update).filter((k) => k !== 'updated_at' && k !== 'notes'),
        });

        await new Promise((r) => setTimeout(r, 800));
      } catch (err) {
        results.failed++;
        console.error(`[outreach contact finder] ${t.directory_name}:`, err);
        results.details.push({
          id: t.id,
          directory_name: t.directory_name,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }

    console.log(`[outreach contact finder] run=${runId}`, {
      processed: results.processed, updated: results.updated, failed: results.failed,
    });

    return new Response(JSON.stringify({ message: 'Contact finder pass complete', ...results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in enrich-outreach-contacts:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
