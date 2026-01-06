import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Validate US phone number format
function validatePhoneNumber(phone: string | null): boolean {
  if (!phone) return false;
  
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Check for valid US phone number (10 or 11 digits with country code)
  if (digits.length === 10) {
    return true;
  }
  if (digits.length === 11 && digits.startsWith('1')) {
    return true;
  }
  
  return false;
}

// Check if website is accessible
async function validateWebsite(url: string | null): Promise<{ valid: boolean; status?: number; error?: string }> {
  if (!url) return { valid: false, error: 'No URL provided' };
  
  try {
    // Format URL
    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }
    
    // Use HEAD request for efficiency
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(formattedUrl, {
      method: 'HEAD',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; BusinessValidator/1.0)',
      },
    });
    
    clearTimeout(timeoutId);
    
    // Consider 2xx and 3xx status codes as valid
    const valid = response.status >= 200 && response.status < 400;
    return { valid, status: response.status };
  } catch (error) {
    // Try GET request as fallback (some servers don't support HEAD)
    try {
      let formattedUrl = url.trim();
      if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
        formattedUrl = `https://${formattedUrl}`;
      }
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(formattedUrl, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; BusinessValidator/1.0)',
        },
      });
      
      clearTimeout(timeoutId);
      
      const valid = response.status >= 200 && response.status < 400;
      return { valid, status: response.status };
    } catch (fallbackError) {
      return { 
        valid: false, 
        error: fallbackError instanceof Error ? fallbackError.message : 'Request failed' 
      };
    }
  }
}

// Calculate data quality score (0-100)
function calculateQualityScore(lead: any): number {
  let score = 0;
  const weights = {
    business_name: 15,
    owner_email: 20,
    phone_number: 15,
    website_url: 15,
    category: 10,
    business_description: 10,
    city: 5,
    state: 5,
    owner_name: 5,
  };
  
  if (lead.business_name?.trim()) score += weights.business_name;
  if (lead.owner_email?.trim()) score += weights.owner_email;
  if (lead.phone_number?.trim()) score += weights.phone_number;
  if (lead.website_url?.trim()) score += weights.website_url;
  if (lead.category?.trim()) score += weights.category;
  if (lead.business_description?.trim()) score += weights.business_description;
  if (lead.city?.trim()) score += weights.city;
  if (lead.state?.trim()) score += weights.state;
  if (lead.owner_name?.trim()) score += weights.owner_name;
  
  return score;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { lead_ids, validate_all } = await req.json();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get leads to validate
    let query = supabase
      .from('b2b_external_leads')
      .select('*')
      .eq('is_converted', false);

    if (lead_ids && lead_ids.length > 0) {
      query = query.in('id', lead_ids);
    } else if (validate_all) {
      query = query.or('validation_status.eq.pending,validation_status.is.null');
    } else {
      return new Response(
        JSON.stringify({ success: false, error: 'No leads specified' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: leads, error: fetchError } = await query.limit(50); // Limit batch size

    if (fetchError) {
      console.error('Error fetching leads:', fetchError);
      return new Response(
        JSON.stringify({ success: false, error: fetchError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!leads || leads.length === 0) {
      return new Response(
        JSON.stringify({ success: true, validated: 0, message: 'No leads to validate' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Validating ${leads.length} leads...`);

    const results = [];

    for (const lead of leads) {
      try {
        // Update status to validating
        await supabase
          .from('b2b_external_leads')
          .update({ validation_status: 'validating' })
          .eq('id', lead.id);

        // Validate phone
        const phoneValid = validatePhoneNumber(lead.phone_number);

        // Validate website
        const websiteResult = await validateWebsite(lead.website_url);

        // Calculate quality score
        const qualityScore = calculateQualityScore(lead);

        // Build validation notes
        const notes = [];
        if (!phoneValid && lead.phone_number) {
          notes.push('Invalid phone format');
        }
        if (!websiteResult.valid && lead.website_url) {
          notes.push(`Website: ${websiteResult.error || `Status ${websiteResult.status}`}`);
        }

        // Update lead with validation results
        const { error: updateError } = await supabase
          .from('b2b_external_leads')
          .update({
            validation_status: 'validated',
            website_valid: lead.website_url ? websiteResult.valid : null,
            phone_valid: lead.phone_number ? phoneValid : null,
            data_quality_score: qualityScore,
            last_validated_at: new Date().toISOString(),
            validation_notes: notes.length > 0 ? notes.join('; ') : null,
          })
          .eq('id', lead.id);

        if (updateError) {
          console.error(`Error updating lead ${lead.id}:`, updateError);
          results.push({ id: lead.id, success: false, error: updateError.message });
        } else {
          results.push({
            id: lead.id,
            success: true,
            phone_valid: phoneValid,
            website_valid: websiteResult.valid,
            quality_score: qualityScore,
          });
        }
      } catch (leadError) {
        console.error(`Error validating lead ${lead.id}:`, leadError);
        
        // Mark as failed
        await supabase
          .from('b2b_external_leads')
          .update({
            validation_status: 'failed',
            validation_notes: leadError instanceof Error ? leadError.message : 'Validation failed',
          })
          .eq('id', lead.id);

        results.push({
          id: lead.id,
          success: false,
          error: leadError instanceof Error ? leadError.message : 'Unknown error',
        });
      }
    }

    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    console.log(`Validation complete: ${successful} successful, ${failed} failed`);

    return new Response(
      JSON.stringify({
        success: true,
        validated: successful,
        failed,
        results,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in validate-business-leads:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
