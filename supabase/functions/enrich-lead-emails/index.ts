import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

/**
 * Enrich Lead Emails - Uses Firecrawl to find contact emails from websites
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EnrichRequest {
  lead_ids?: string[];
  enrich_missing_only?: boolean;
  limit?: number;
}

// Extract emails from scraped content
function extractEmails(content: string): string[] {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const matches = content.match(emailRegex) || [];
  
  // Filter out common non-contact emails
  const excludePatterns = [
    /noreply/i,
    /no-reply/i,
    /donotreply/i,
    /support@/i,
    /admin@/i,
    /webmaster/i,
    /example\.com/i,
    /test@/i,
    /localhost/i,
    /\.png$/i,
    /\.jpg$/i,
    /\.gif$/i,
  ];
  
  return [...new Set(matches)].filter(email => {
    return !excludePatterns.some(pattern => pattern.test(email));
  });
}

// Extract phone numbers from content
function extractPhones(content: string): string[] {
  // Match various phone formats
  const phoneRegex = /(?:\+1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/g;
  const matches = content.match(phoneRegex) || [];
  return [...new Set(matches)].filter(phone => {
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 10 && digits.length <= 11;
  });
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const FIRECRAWL_API_KEY = Deno.env.get('FIRECRAWL_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!FIRECRAWL_API_KEY) {
      console.error('FIRECRAWL_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Firecrawl connector not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    const body: EnrichRequest = await req.json();
    const { lead_ids, enrich_missing_only = true, limit = 20 } = body;

    console.log(`Enriching lead emails: ids=${lead_ids?.length || 'auto'}, limit=${limit}`);

    // Build query for leads needing email enrichment
    let query = supabase
      .from('b2b_external_leads')
      .select('id, business_name, website_url, owner_email, phone_number');

    if (lead_ids && lead_ids.length > 0) {
      query = query.in('id', lead_ids);
    } else if (enrich_missing_only) {
      // Get leads with websites but no email
      query = query
        .not('website_url', 'is', null)
        .or('owner_email.is.null,owner_email.eq.');
    }

    const { data: leads, error: fetchError } = await query.limit(limit);

    if (fetchError) {
      throw fetchError;
    }

    if (!leads || leads.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No leads to enrich', enriched: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${leads.length} leads to enrich with Firecrawl`);

    const results = {
      enriched: 0,
      emails_found: 0,
      phones_found: 0,
      failed: 0,
      details: [] as any[],
    };

    // Process leads sequentially to avoid rate limits
    for (const lead of leads) {
      if (!lead.website_url) continue;

      try {
        // Format URL
        let url = lead.website_url.trim();
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          url = `https://${url}`;
        }

        console.log(`Scraping ${url} for contact info...`);

        // Scrape the website for contact info
        const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url,
            formats: ['markdown'],
            onlyMainContent: false, // We want footer/header too for contact info
            waitFor: 2000,
          }),
        });

        if (!response.ok) {
          console.warn(`Failed to scrape ${url}: ${response.status}`);
          results.failed++;
          continue;
        }

        const data = await response.json();
        const markdown = data.data?.markdown || data.markdown || '';

        // Extract contact information
        const foundEmails = extractEmails(markdown);
        const foundPhones = extractPhones(markdown);

        console.log(`Found ${foundEmails.length} emails, ${foundPhones.length} phones for ${lead.business_name}`);

        const updateData: any = {
          last_enriched_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        // Update email if we found one and lead doesn't have one
        if (foundEmails.length > 0 && !lead.owner_email) {
          // Prefer emails with info@, contact@, or owner names
          const priorityEmail = foundEmails.find(e => 
            /^(info|contact|hello|sales|business)@/i.test(e)
          ) || foundEmails[0];
          
          updateData.owner_email = priorityEmail;
          updateData.email_status = 'not_sent';
          results.emails_found++;
        }

        // Update phone if we found one and lead doesn't have one
        if (foundPhones.length > 0 && !lead.phone_number) {
          updateData.phone_number = foundPhones[0];
          updateData.phone_valid = true;
          results.phones_found++;
        }

        // Update the lead
        const { error: updateError } = await supabase
          .from('b2b_external_leads')
          .update(updateData)
          .eq('id', lead.id);

        if (updateError) {
          console.error(`Failed to update lead ${lead.id}:`, updateError);
          results.failed++;
        } else {
          results.enriched++;
          results.details.push({
            id: lead.id,
            business_name: lead.business_name,
            email_found: updateData.owner_email || null,
            phone_found: updateData.phone_number || null,
          });
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (scrapeError) {
        console.error(`Error scraping lead ${lead.id}:`, scrapeError);
        results.failed++;
      }
    }

    console.log(`Enrichment complete: ${results.emails_found} emails, ${results.phones_found} phones found`);

    return new Response(
      JSON.stringify({
        message: 'Email enrichment complete',
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
