import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface ScrapedBusinessData {
  name: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  category: string;
  website: string;
  logoUrl: string;
  bannerUrl: string;
  hours: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url, saveAsDraft } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ success: false, error: 'URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const FIRECRAWL_API_KEY = Deno.env.get('FIRECRAWL_API_KEY');
    if (!FIRECRAWL_API_KEY) {
      console.error('FIRECRAWL_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'Firecrawl not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Format URL
    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    console.log('Scraping website:', formattedUrl);

    // Step 1: Scrape the website using Firecrawl with branding to get images
    const scrapeResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: formattedUrl,
        formats: ['markdown', 'links', 'branding'],
        onlyMainContent: false,
      }),
    });

    const scrapeData = await scrapeResponse.json();

    if (!scrapeResponse.ok || !scrapeData.success) {
      console.error('Firecrawl error:', scrapeData);
      return new Response(
        JSON.stringify({ success: false, error: scrapeData.error || 'Failed to scrape website' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const markdown = scrapeData.data?.markdown || '';
    const metadata = scrapeData.data?.metadata || {};
    const links = scrapeData.data?.links || [];
    const branding = scrapeData.data?.branding || {};
    
    console.log('Branding data:', JSON.stringify(branding));

    console.log('Scraped content length:', markdown.length);
    console.log('Metadata:', JSON.stringify(metadata));

    // Step 2: Use AI to extract structured business data
    const extractionPrompt = `You are a business data extraction expert. Extract business information from this website content.

Website URL: ${formattedUrl}
Page Title: ${metadata.title || 'Unknown'}
Page Description: ${metadata.description || 'None'}

Links found on page:
${links.slice(0, 20).join('\n')}

Website Content:
${markdown.substring(0, 8000)}

Extract the following information. If not found, return empty string. Be accurate and concise:
- Business name
- Business description (2-3 sentences describing what they do)
- Phone number (format: XXX-XXX-XXXX if US)
- Email address
- Full street address
- City
- State (2-letter abbreviation for US)
- ZIP/Postal code
- Business category (e.g., Restaurant, Salon, Consulting, Retail, etc.)
- Operating hours (if available)
- Logo URL (if found in content)
- Social media links (Facebook, Instagram, Twitter, LinkedIn)

Return ONLY valid JSON with this exact structure:
{
  "name": "",
  "description": "",
  "phone": "",
  "email": "",
  "address": "",
  "city": "",
  "state": "",
  "zipCode": "",
  "category": "",
  "hours": "",
  "logoUrl": "",
  "socialLinks": {
    "facebook": "",
    "instagram": "",
    "twitter": "",
    "linkedin": ""
  }
}`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: 'You are a precise data extraction assistant. Always return valid JSON only, no markdown formatting.' },
          { role: 'user', content: extractionPrompt }
        ],
        temperature: 0.1,
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ success: false, error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errText = await aiResponse.text();
      console.error('AI error:', aiResponse.status, errText);
      return new Response(
        JSON.stringify({ success: false, error: 'AI extraction failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices?.[0]?.message?.content || '';
    
    console.log('AI response:', aiContent);

    // Parse the JSON from AI response
    let extractedData: ScrapedBusinessData;
    try {
      // Clean up the response - remove markdown code blocks if present
      let cleanContent = aiContent.trim();
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      extractedData = JSON.parse(cleanContent);
      extractedData.website = formattedUrl;
      
      // Helper to validate URL (filter out template variables and invalid URLs)
      const isValidImageUrl = (url: string): boolean => {
        if (!url) return false;
        if (url.includes('${') || url.includes('{{')) return false;
        return url.startsWith('http://') || url.startsWith('https://');
      };
      
      // Use branding data for images if available (prioritize over AI-extracted)
      const brandingImages = branding?.images || {};
      const logoFromBranding = brandingImages.logo || branding?.logo || '';
      const ogImageFromBranding = brandingImages.ogImage || metadata?.ogImage || '';
      const faviconFromBranding = brandingImages.favicon || '';
      
      // Set logoUrl from branding if not already set or empty
      if (!extractedData.logoUrl || !isValidImageUrl(extractedData.logoUrl)) {
        if (isValidImageUrl(logoFromBranding)) {
          extractedData.logoUrl = logoFromBranding;
        }
      }
      
      // Set bannerUrl from OG image (validate it's a real URL, not a template)
      if (isValidImageUrl(ogImageFromBranding)) {
        extractedData.bannerUrl = ogImageFromBranding;
      } else {
        // Fallback: try to find any usable image from branding
        extractedData.bannerUrl = '';
      }
      
    } catch (parseError) {
      console.error('JSON parse error:', parseError, 'Content:', aiContent);
      
      // Helper to validate URL
      const isValidImageUrl = (url: string): boolean => {
        if (!url) return false;
        if (url.includes('${') || url.includes('{{')) return false;
        return url.startsWith('http://') || url.startsWith('https://');
      };
      
      // Get images from branding data
      const brandingImages = branding?.images || {};
      const logoFromBranding = brandingImages.logo || branding?.logo || '';
      const ogImageFromBranding = brandingImages.ogImage || metadata?.ogImage || '';
      
      // Return partial data with what we have from metadata
      extractedData = {
        name: metadata.title || '',
        description: metadata.description || '',
        phone: '',
        email: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        category: '',
        website: formattedUrl,
        logoUrl: isValidImageUrl(logoFromBranding) ? logoFromBranding : '',
        bannerUrl: isValidImageUrl(ogImageFromBranding) ? ogImageFromBranding : '',
        hours: '',
        socialLinks: {}
      };
    }

    // Step 3: Optionally save as draft to database
    if (saveAsDraft) {
      const authHeader = req.headers.get('Authorization');
      if (!authHeader) {
        return new Response(
          JSON.stringify({ success: false, error: 'Authentication required to save' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_ANON_KEY') ?? '',
        { global: { headers: { Authorization: authHeader } } }
      );

      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        return new Response(
          JSON.stringify({ success: false, error: 'Invalid authentication' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Insert as draft (listing_status = 'draft')
      const { data: business, error: insertError } = await supabase
        .from('businesses')
        .insert({
          owner_id: user.id,
          name: extractedData.name || 'Untitled Business',
          business_name: extractedData.name || 'Untitled Business',
          description: extractedData.description,
          phone: extractedData.phone,
          email: extractedData.email,
          address: extractedData.address,
          city: extractedData.city,
          state: extractedData.state,
          zip_code: extractedData.zipCode,
          category: extractedData.category || 'Other',
          website: extractedData.website,
          logo_url: extractedData.logoUrl,
          banner_url: extractedData.bannerUrl,
          listing_status: 'draft',
          is_verified: false,
        })
        .select()
        .single();

      if (insertError) {
        console.error('Insert error:', insertError);
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to save business: ' + insertError.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('Business saved as draft:', business.id);

      return new Response(
        JSON.stringify({ 
          success: true, 
          data: extractedData,
          saved: true,
          businessId: business.id,
          message: 'Business saved as draft. Review and publish when ready.'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Return extracted data for preview
    return new Response(
      JSON.stringify({ 
        success: true, 
        data: extractedData,
        saved: false,
        message: 'Data extracted successfully. Review and save when ready.'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
