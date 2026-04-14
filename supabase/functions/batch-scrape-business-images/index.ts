import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

import { requireAdmin, authErrorResponse } from "../_shared/auth-guard.ts";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // AUTH: Require admin
    const authResult = await requireAdmin(req, corsHeaders);
    if (!authResult.authenticated) {
      return authErrorResponse(authResult, corsHeaders);
    }

    // Use service role for DB operations
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const FIRECRAWL_API_KEY = Deno.env.get('FIRECRAWL_API_KEY');
    if (!FIRECRAWL_API_KEY) {
      return new Response(
        JSON.stringify({ success: false, error: 'Firecrawl not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse optional body params
    let batchSize = 5;
    let specificIds: string[] = [];
    try {
      const body = await req.json();
      if (body.batchSize) batchSize = Math.min(body.batchSize, 15);
      if (body.businessIds) specificIds = body.businessIds;
    } catch { /* no body is fine */ }

    // Find businesses with placeholder or missing images
    let query = supabase
      .from('businesses')
      .select('id, business_name, website, logo_url, banner_url')
      .not('website', 'is', null)
      .neq('website', '');

    if (specificIds.length > 0) {
      query = query.in('id', specificIds);
    } else {
      query = query.or(
        'logo_url.is.null,logo_url.eq.,logo_url.like.%placeholder%,banner_url.is.null,banner_url.eq.,banner_url.like.%placeholder%'
      );
    }

    const { data: businesses, error: fetchError } = await query.limit(batchSize);

    if (fetchError) {
      console.error('Fetch error:', fetchError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to fetch businesses' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!businesses || businesses.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: 'No businesses need image updates', results: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing ${businesses.length} businesses for image scraping`);

    const results: Array<{ id: string; name: string; status: string; logo?: string; banner?: string; error?: string }> = [];

    const isValidImageUrl = (url: string | null): boolean => {
      if (!url) return false;
      if (url.includes('placeholder')) return false;
      if (url.includes('${') || url.includes('{{')) return false;
      return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/');
    };

    for (const biz of businesses) {
      try {
        const needsLogo = !isValidImageUrl(biz.logo_url);
        const needsBanner = !isValidImageUrl(biz.banner_url);

        if (!needsLogo && !needsBanner) {
          results.push({ id: biz.id, name: biz.business_name, status: 'skipped' });
          continue;
        }

        let formattedUrl = biz.website.trim();
        if (!formattedUrl.startsWith('http')) {
          formattedUrl = `https://${formattedUrl}`;
        }

        console.log(`Scraping: ${biz.business_name} (${formattedUrl})`);

        const scrapeResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: formattedUrl,
            formats: ['branding'],
            onlyMainContent: false,
          }),
        });

        if (scrapeResponse.status === 402) {
          console.error('Firecrawl credits exhausted');
          results.push({ id: biz.id, name: biz.business_name, status: 'error', error: 'Firecrawl credits exhausted' });
          break; // Stop processing if credits are out
        }

        const scrapeData = await scrapeResponse.json();

        if (!scrapeResponse.ok || !scrapeData.success) {
          console.error(`Scrape failed for ${biz.business_name}:`, scrapeData.error);
          results.push({ id: biz.id, name: biz.business_name, status: 'error', error: scrapeData.error || 'Scrape failed' });
          continue;
        }

        const branding = scrapeData.data?.branding || {};
        const metadata = scrapeData.data?.metadata || {};
        const brandingImages = branding?.images || {};

        // Extract best available images
        const logoUrl = brandingImages.logo || branding?.logo || '';
        const bannerUrl = brandingImages.ogImage || metadata?.ogImage || '';

        const updates: Record<string, string> = {};

        if (needsLogo && isValidImageUrl(logoUrl)) {
          updates.logo_url = logoUrl;
        }
        if (needsBanner && isValidImageUrl(bannerUrl)) {
          updates.banner_url = bannerUrl;
        }

        if (Object.keys(updates).length > 0) {
          const { error: updateError } = await supabase
            .from('businesses')
            .update(updates)
            .eq('id', biz.id);

          if (updateError) {
            console.error(`Update failed for ${biz.business_name}:`, updateError);
            results.push({ id: biz.id, name: biz.business_name, status: 'error', error: updateError.message });
          } else {
            console.log(`Updated ${biz.business_name}: ${JSON.stringify(updates)}`);
            results.push({ 
              id: biz.id, 
              name: biz.business_name, 
              status: 'updated', 
              logo: updates.logo_url, 
              banner: updates.banner_url 
            });
          }
        } else {
          console.log(`No valid images found for ${biz.business_name}`);
          results.push({ id: biz.id, name: biz.business_name, status: 'no_images_found' });
        }

        // Brief delay to avoid rate limiting
        await new Promise(r => setTimeout(r, 500));

      } catch (err) {
        console.error(`Error processing ${biz.business_name}:`, err);
        results.push({ 
          id: biz.id, 
          name: biz.business_name, 
          status: 'error', 
          error: err instanceof Error ? err.message : 'Unknown error' 
        });
      }
    }

    const updated = results.filter(r => r.status === 'updated').length;
    const failed = results.filter(r => r.status === 'error').length;
    const noImages = results.filter(r => r.status === 'no_images_found').length;

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Processed ${businesses.length} businesses: ${updated} updated, ${failed} failed, ${noImages} no images found`,
        results 
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
