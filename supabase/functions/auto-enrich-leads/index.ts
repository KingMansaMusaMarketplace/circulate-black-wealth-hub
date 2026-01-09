import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

/**
 * Auto-Enrich Leads Edge Function
 * Validates and enriches newly imported leads with website/email/phone checks
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EnrichmentRequest {
  lead_ids?: string[];
  enrich_all_new?: boolean;
  limit?: number;
}

interface EnrichmentResult {
  id: string;
  website_valid: boolean | null;
  phone_valid: boolean | null;
  email_status: string;
  lead_score: number;
  data_quality_score: number;
}

// Simple URL validation
async function validateWebsite(url: string): Promise<boolean> {
  if (!url) return false;
  
  try {
    const cleanUrl = url.startsWith('http') ? url : `https://${url}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(cleanUrl, {
      method: 'HEAD',
      signal: controller.signal,
      redirect: 'follow',
    });
    
    clearTimeout(timeoutId);
    return response.ok || response.status === 301 || response.status === 302;
  } catch {
    return false;
  }
}

// Basic email format validation
function validateEmailFormat(email: string): boolean {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Basic phone format validation
function validatePhoneFormat(phone: string): boolean {
  if (!phone) return false;
  // Remove non-digits and check length
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15;
}

// Calculate lead score based on data completeness and quality
function calculateLeadScore(lead: any, websiteValid: boolean): number {
  let score = 0;
  
  // Business info (max 30)
  if (lead.business_name) score += 10;
  if (lead.business_description) score += 10;
  if (lead.category) score += 5;
  if (lead.location || (lead.city && lead.state)) score += 5;
  
  // Contact info (max 40)
  if (lead.owner_email && validateEmailFormat(lead.owner_email)) score += 15;
  if (lead.phone_number && validatePhoneFormat(lead.phone_number)) score += 15;
  if (lead.owner_name) score += 10;
  
  // Digital presence (max 30)
  if (lead.website_url) {
    score += 10;
    if (websiteValid) score += 15; // Bonus for valid website
  }
  if (lead.confidence_score && lead.confidence_score > 0.7) score += 5;
  
  return Math.min(score, 100);
}

// Calculate data quality score
function calculateDataQualityScore(lead: any, websiteValid: boolean, emailValid: boolean, phoneValid: boolean): number {
  let score = 0;
  let fields = 0;
  
  // Check each field for quality
  if (lead.business_name && lead.business_name.length > 2) { score += 20; fields++; }
  if (lead.business_description && lead.business_description.length > 20) { score += 15; fields++; }
  if (emailValid) { score += 25; fields++; }
  if (phoneValid) { score += 20; fields++; }
  if (websiteValid) { score += 20; fields++; }
  
  return fields > 0 ? Math.round(score / fields * (fields / 5) * 100) / 100 : 0;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing Supabase configuration');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const body: EnrichmentRequest = await req.json();
    const { lead_ids, enrich_all_new = false, limit = 50 } = body;

    console.log(`Auto-enriching leads: ids=${lead_ids?.length || 'all new'}, limit=${limit}`);

    // Fetch leads to enrich
    let query = supabase
      .from('b2b_external_leads')
      .select('*');

    if (lead_ids && lead_ids.length > 0) {
      query = query.in('id', lead_ids);
    } else if (enrich_all_new) {
      query = query.is('last_enriched_at', null);
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

    console.log(`Found ${leads.length} leads to enrich`);

    const results: EnrichmentResult[] = [];

    // Process leads in batches to avoid overwhelming external services
    for (const lead of leads) {
      const websiteValid = lead.website_url ? await validateWebsite(lead.website_url) : null;
      const emailValid = validateEmailFormat(lead.owner_email);
      const phoneValid = validatePhoneFormat(lead.phone_number);

      const leadScore = calculateLeadScore(lead, websiteValid === true);
      const dataQualityScore = calculateDataQualityScore(lead, websiteValid === true, emailValid, phoneValid);

      // Determine priority rank
      let priorityRank = 'normal';
      if (leadScore >= 70 && (emailValid || phoneValid)) {
        priorityRank = 'high';
      } else if (leadScore < 40 || (!websiteValid && !emailValid && !phoneValid)) {
        priorityRank = 'low';
      }

      const result: EnrichmentResult = {
        id: lead.id,
        website_valid: websiteValid,
        phone_valid: phoneValid,
        email_status: emailValid ? (lead.email_status || 'not_sent') : 'invalid',
        lead_score: leadScore,
        data_quality_score: dataQualityScore,
      };

      results.push(result);

      // Update the lead in database
      const { error: updateError } = await supabase
        .from('b2b_external_leads')
        .update({
          website_valid: websiteValid,
          phone_valid: phoneValid,
          email_status: result.email_status,
          lead_score: leadScore,
          data_quality_score: dataQualityScore,
          priority_rank: priorityRank,
          last_enriched_at: new Date().toISOString(),
          validation_status: websiteValid || emailValid || phoneValid ? 'valid' : 'invalid',
        })
        .eq('id', lead.id);

      if (updateError) {
        console.error(`Failed to update lead ${lead.id}:`, updateError);
      }
    }

    const highPriorityCount = results.filter(r => r.lead_score >= 70).length;
    const validCount = results.filter(r => r.website_valid || r.email_status !== 'invalid').length;

    console.log(`Enriched ${results.length} leads: ${highPriorityCount} high-priority, ${validCount} valid contacts`);

    return new Response(
      JSON.stringify({
        message: 'Enrichment complete',
        enriched: results.length,
        high_priority: highPriorityCount,
        valid_contacts: validCount,
        results,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in auto-enrich-leads:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
