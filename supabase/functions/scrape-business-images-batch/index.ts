import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { offset = 0, limit = 10 } = await req.json().catch(() => ({}));

    const FIRECRAWL_API_KEY = Deno.env.get('FIRECRAWL_API_KEY');
    if (!FIRECRAWL_API_KEY) {
      return new Response(JSON.stringify({ error: 'FIRECRAWL_API_KEY not configured' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get businesses with placeholder images (paginated)
    const { data: businesses, error: fetchError } = await supabase
      .from('businesses')
      .select('id, name, website, logo_url, banner_url')
      .or('logo_url.like.%placeholders%,banner_url.like.%placeholders%')
      .order('name')
      .range(offset, offset + limit - 1);

    if (fetchError) {
      return new Response(JSON.stringify({ error: fetchError.message }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`Processing ${businesses.length} businesses (offset ${offset})`);

    // Junk URL patterns to reject
    const junkPatterns = [
      'parastorage.com', 'wix-public', 'error-pages', 'favicon',
      'pixel.gif', 'spacer.gif', '1x1.', 'tracking', 'analytics',
      'googletagmanager', 'facebook.com/tr', 'cloudflare',
    ];

    const isJunkUrl = (url: string) => junkPatterns.some(p => url.toLowerCase().includes(p));

    const results: { name: string; status: string; logo?: string; banner?: string }[] = [];
    let updatedCount = 0;

    // Process sequentially to be gentle on rate limits
    for (const biz of businesses) {
      try {
        if (!biz.website) {
          results.push({ name: biz.name, status: 'no_website' });
          continue;
        }

        console.log(`Scraping: ${biz.name} (${biz.website})`);

        // Use branding format for logo extraction + screenshot metadata for banner
        const scrapeResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: biz.website,
            formats: ['branding', 'markdown'],
            onlyMainContent: false,
            waitFor: 2000,
          }),
        });

        if (!scrapeResponse.ok) {
          const errText = await scrapeResponse.text();
          console.error(`Firecrawl error for ${biz.name}: ${scrapeResponse.status}`);
          results.push({ name: biz.name, status: `error_${scrapeResponse.status}` });
          continue;
        }

        const scrapeData = await scrapeResponse.json();
        const branding = scrapeData.data?.branding || scrapeData.branding || {};
        const metadata = scrapeData.data?.metadata || scrapeData.metadata || {};

        let logoUrl = '';
        let bannerUrl = '';

        // Extract logo from branding
        if (branding.logo && !isJunkUrl(branding.logo)) {
          logoUrl = branding.logo;
        }
        if (branding.images?.logo && !isJunkUrl(branding.images.logo)) {
          logoUrl = branding.images.logo;
        }

        // Extract banner from branding or metadata
        if (branding.images?.ogImage && !isJunkUrl(branding.images.ogImage)) {
          bannerUrl = branding.images.ogImage;
        }
        if (!bannerUrl && metadata.ogImage && !isJunkUrl(metadata.ogImage)) {
          bannerUrl = metadata.ogImage;
        }
        if (!bannerUrl && metadata.image && !isJunkUrl(metadata.image)) {
          bannerUrl = metadata.image;
        }

        // If no logo, use og:image as logo too
        if (!logoUrl && bannerUrl) logoUrl = bannerUrl;
        // If no banner, use logo as banner
        if (!bannerUrl && logoUrl) bannerUrl = logoUrl;

        if ((logoUrl || bannerUrl) && !isJunkUrl(logoUrl || '') && !isJunkUrl(bannerUrl || '')) {
          const updates: Record<string, string> = { updated_at: new Date().toISOString() };
          if (logoUrl) updates.logo_url = logoUrl;
          if (bannerUrl) updates.banner_url = bannerUrl;

          const { error: updateError } = await supabase
            .from('businesses')
            .update(updates)
            .eq('id', biz.id);

          if (updateError) {
            results.push({ name: biz.name, status: 'update_error' });
          } else {
            updatedCount++;
            results.push({ name: biz.name, status: 'updated', logo: logoUrl, banner: bannerUrl });
            console.log(`✅ ${biz.name}: logo=${!!logoUrl}, banner=${!!bannerUrl}`);
          }
        } else {
          results.push({ name: biz.name, status: 'no_images_found' });
          console.log(`❌ ${biz.name}: no usable images`);
        }

        // Small delay between requests
        await new Promise(r => setTimeout(r, 500));

      } catch (err) {
        console.error(`Exception for ${biz.name}:`, err);
        results.push({ name: biz.name, status: 'exception' });
      }
    }

    console.log(`Done batch: ${updatedCount}/${businesses.length} updated`);

    return new Response(JSON.stringify({
      success: true,
      total: businesses.length,
      updated: updatedCount,
      results
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Fatal error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
