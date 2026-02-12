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
    const FIRECRAWL_API_KEY = Deno.env.get('FIRECRAWL_API_KEY');
    if (!FIRECRAWL_API_KEY) {
      return new Response(
        JSON.stringify({ success: false, error: 'FIRECRAWL_API_KEY not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Parse optional params: batch size, offset, specific IDs
    const body = await req.json().catch(() => ({}));
    const batchSize = body.batchSize || 10;
    const offset = body.offset || 0;
    const specificIds = body.ids || null;

    // Fetch HBCUs that need image updates
    let query = supabaseAdmin
      .from('businesses')
      .select('id, name, website, logo_url, banner_url')
      .or('category.ilike.%HBCU%,category.ilike.%university%,category.ilike.%college%')
      .not('website', 'is', null)
      .neq('website', '')
      .order('name');

    if (specificIds && specificIds.length > 0) {
      query = query.in('id', specificIds);
    } else {
      query = query.range(offset, offset + batchSize - 1);
    }

    const { data: businesses, error: fetchError } = await query;

    if (fetchError) {
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to fetch businesses: ' + fetchError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!businesses || businesses.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: 'No businesses to process', updated: 0, total: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing ${businesses.length} businesses starting at offset ${offset}`);

    const results: Array<{ id: string; name: string; status: string; logoUrl?: string; bannerUrl?: string; error?: string }> = [];

    const isValidImageUrl = (url: string): boolean => {
      if (!url) return false;
      if (url.includes('${') || url.includes('{{')) return false;
      if (url.startsWith('/images/')) return false; // broken local paths
      return url.startsWith('http://') || url.startsWith('https://');
    };

    const needsUpdate = (biz: any): boolean => {
      const logoOk = isValidImageUrl(biz.logo_url) && !biz.logo_url.includes('clearbit');
      const bannerOk = isValidImageUrl(biz.banner_url) && !biz.banner_url.includes('clearbit');
      return !logoOk || !bannerOk;
    };

    for (const biz of businesses) {
      // Skip if both images are already good (not clearbit, not broken local)
      if (!needsUpdate(biz)) {
        results.push({ id: biz.id, name: biz.name, status: 'skipped_already_good' });
        continue;
      }

      try {
        let formattedUrl = biz.website.trim();
        if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
          formattedUrl = `https://${formattedUrl}`;
        }

        console.log(`Scraping: ${biz.name} (${formattedUrl})`);

        const scrapeResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: formattedUrl,
            formats: ['markdown', 'branding'],
            onlyMainContent: false,
          }),
        });

        if (!scrapeResponse.ok) {
          const errText = await scrapeResponse.text();
          console.error(`Scrape failed for ${biz.name}: ${scrapeResponse.status} ${errText}`);
          results.push({ id: biz.id, name: biz.name, status: 'scrape_failed', error: `HTTP ${scrapeResponse.status}` });
          continue;
        }

        const scrapeData = await scrapeResponse.json();
        const branding = scrapeData.data?.branding || {};
        const metadata = scrapeData.data?.metadata || {};
        const brandingImages = branding?.images || {};

        console.log(`Metadata for ${biz.name}:`, JSON.stringify(metadata));
        console.log(`Branding for ${biz.name}:`, JSON.stringify(branding));

        // Extract best logo - try multiple sources
        const logoFromBranding = brandingImages.logo || branding?.logo || '';
        // Extract best banner - OG image from metadata is the most reliable source
        const ogImage = metadata?.ogImage || metadata?.['og:image'] || brandingImages.ogImage || '';
        const twitterImage = metadata?.['twitter:image'] || '';
        const favicon = brandingImages.favicon || metadata?.favicon || '';
        
        // Also try to find logo from page content (common patterns in university sites)
        const markdown = scrapeData.data?.markdown || '';
        // Look for image URLs that contain 'logo' in the markdown
        const logoRegex = /!\[.*?\]\((https?:\/\/[^\s)]+logo[^\s)]*)\)/i;
        const logoMatch = markdown.match(logoRegex);
        const logoFromContent = logoMatch ? logoMatch[1] : '';
        
        // Look for hero/banner images in the markdown - first large image is often the hero
        const allImagesRegex = /!\[([^\]]*)\]\((https?:\/\/[^\s)]+\.(jpg|jpeg|png|webp)[^\s)]*)\)/gi;
        const allImages: string[] = [];
        let imgMatch;
        while ((imgMatch = allImagesRegex.exec(markdown)) !== null) {
          const imgUrl = imgMatch[2];
          // Skip tiny icons, favicons, social media icons
          if (!imgUrl.includes('icon') && !imgUrl.includes('favicon') && !imgUrl.includes('logo') 
              && !imgUrl.includes('social') && !imgUrl.includes('badge') && !imgUrl.includes('1x1')
              && !imgUrl.includes('pixel')) {
            allImages.push(imgUrl);
          }
        }
        
        // Also look for image URLs in markdown that might use different syntax
        const rawImgRegex = /(https?:\/\/[^\s"'<>]+\.(jpg|jpeg|png|webp)(?:\?[^\s"'<>]*)?)/gi;
        let rawMatch;
        while ((rawMatch = rawImgRegex.exec(markdown)) !== null) {
          const imgUrl = rawMatch[1];
          if (!imgUrl.includes('icon') && !imgUrl.includes('favicon') && !imgUrl.includes('logo')
              && !imgUrl.includes('social') && !imgUrl.includes('badge') && !imgUrl.includes('1x1')
              && !allImages.includes(imgUrl)) {
            allImages.push(imgUrl);
          }
        }

        console.log(`Found ${allImages.length} candidate images for ${biz.name}`);

        const updates: Record<string, string> = {};

        // Update logo if we found a better one
        if (isValidImageUrl(logoFromBranding)) {
          updates.logo_url = logoFromBranding;
        } else if (isValidImageUrl(logoFromContent)) {
          updates.logo_url = logoFromContent;
        } else if (isValidImageUrl(favicon) && !isValidImageUrl(biz.logo_url)) {
          updates.logo_url = favicon;
        }

        // Update banner - try OG image first, then twitter image, then first large page image
        if (isValidImageUrl(ogImage)) {
          updates.banner_url = ogImage;
        } else if (isValidImageUrl(twitterImage)) {
          updates.banner_url = twitterImage;
        } else if (allImages.length > 0) {
          // Use the first non-logo/icon image as banner
          updates.banner_url = allImages[0];
        }

        if (Object.keys(updates).length > 0) {
          updates.updated_at = new Date().toISOString();
          
          const { error: updateError } = await supabaseAdmin
            .from('businesses')
            .update(updates)
            .eq('id', biz.id);

          if (updateError) {
            console.error(`Update failed for ${biz.name}:`, updateError);
            results.push({ id: biz.id, name: biz.name, status: 'update_failed', error: updateError.message });
          } else {
            console.log(`Updated ${biz.name}: logo=${updates.logo_url || 'unchanged'}, banner=${updates.banner_url || 'unchanged'}`);
            results.push({ 
              id: biz.id, 
              name: biz.name, 
              status: 'updated',
              logoUrl: updates.logo_url,
              bannerUrl: updates.banner_url
            });
          }
        } else {
          console.log(`No usable images found for ${biz.name}`);
          results.push({ id: biz.id, name: biz.name, status: 'no_images_found' });
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (bizError) {
        console.error(`Error processing ${biz.name}:`, bizError);
        results.push({ 
          id: biz.id, 
          name: biz.name, 
          status: 'error',
          error: bizError instanceof Error ? bizError.message : 'Unknown error'
        });
      }
    }

    const updated = results.filter(r => r.status === 'updated').length;
    const failed = results.filter(r => r.status === 'error' || r.status === 'scrape_failed' || r.status === 'update_failed').length;
    const skipped = results.filter(r => r.status === 'skipped_already_good' || r.status === 'no_images_found').length;

    return new Response(
      JSON.stringify({
        success: true,
        summary: { total: businesses.length, updated, failed, skipped, nextOffset: offset + batchSize },
        results,
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
