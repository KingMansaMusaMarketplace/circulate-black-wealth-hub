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
      console.error('Fetch error:', fetchError);
      return new Response(JSON.stringify({ error: fetchError.message }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`Found ${businesses.length} businesses with placeholder images`);

    const results: { name: string; status: string; logo?: string; banner?: string }[] = [];
    let updatedCount = 0;

    // Process in batches of 3 to avoid rate limits
    for (let i = 0; i < businesses.length; i += 3) {
      const batch = businesses.slice(i, i + 3);
      
      const batchPromises = batch.map(async (biz) => {
        try {
          if (!biz.website) {
            results.push({ name: biz.name, status: 'no_website' });
            return;
          }

          console.log(`Scraping: ${biz.name} (${biz.website})`);

          const scrapeResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              url: biz.website,
              formats: ['html', 'links'],
              onlyMainContent: false,
              waitFor: 3000,
            }),
          });

          if (!scrapeResponse.ok) {
            const errText = await scrapeResponse.text();
            console.error(`Firecrawl error for ${biz.name}: ${scrapeResponse.status} - ${errText}`);
            results.push({ name: biz.name, status: `firecrawl_error_${scrapeResponse.status}` });
            return;
          }

          const scrapeData = await scrapeResponse.json();
          const html = scrapeData.data?.html || scrapeData.html || '';
          const metadata = scrapeData.data?.metadata || scrapeData.metadata || {};

          // Extract images from multiple sources
          let logoUrl = '';
          let bannerUrl = '';

          // 1. Try metadata og:image for banner
          if (metadata.ogImage) {
            bannerUrl = metadata.ogImage;
          }

          // 2. Try to find logo from HTML
          const logoPatterns = [
            // img tags with logo in class/alt/id
            /<img[^>]*?(?:class|alt|id)=["'][^"']*(logo|brand|site-logo|header-logo|navbar-logo)[^"']*["'][^>]*?src=["']([^"']+)["']/gi,
            // img tags with src containing logo
            /<img[^>]*?src=["']([^"']*logo[^"']*)["']/gi,
            // link rel="icon" for favicon as fallback
            /<link[^>]*?rel=["'](?:icon|shortcut icon|apple-touch-icon)["'][^>]*?href=["']([^"']+)["']/gi,
          ];

          for (const pattern of logoPatterns) {
            if (logoUrl) break;
            let match;
            while ((match = pattern.exec(html)) !== null) {
              // The URL is in the last capture group
              const url = match[match.length - 1];
              if (url && !url.includes('data:') && !url.includes('.svg') && url.length < 500) {
                logoUrl = resolveUrl(url, biz.website);
                break;
              }
            }
          }

          // 3. Try banner from HTML if no og:image
          if (!bannerUrl) {
            const bannerPatterns = [
              /<img[^>]*?(?:class|alt)=["'][^"']*(hero|banner|cover|featured|main-image|header-image)[^"']*["'][^>]*?src=["']([^"']+)["']/gi,
              // Large images in header areas
              /<(?:header|section)[^>]*>[\s\S]*?<img[^>]*?src=["']([^"']+\.(?:jpg|jpeg|png|webp))["']/gi,
            ];

            for (const pattern of bannerPatterns) {
              if (bannerUrl) break;
              let match;
              while ((match = pattern.exec(html)) !== null) {
                const url = match[match.length - 1];
                if (url && !url.includes('data:') && url.length < 500) {
                  bannerUrl = resolveUrl(url, biz.website);
                  break;
                }
              }
            }
          }

          // 4. Resolve relative banner URL
          if (bannerUrl && !bannerUrl.startsWith('http')) {
            bannerUrl = resolveUrl(bannerUrl, biz.website);
          }

          // 5. If no logo found, use og:image as logo too
          if (!logoUrl && bannerUrl) {
            logoUrl = bannerUrl;
          }

          // 6. If still no banner, try first large image from metadata
          if (!bannerUrl && metadata.image) {
            bannerUrl = metadata.image;
          }

          if (logoUrl || bannerUrl) {
            const updates: Record<string, string> = {};
            if (logoUrl) updates.logo_url = logoUrl;
            if (bannerUrl) updates.banner_url = bannerUrl;
            updates.updated_at = new Date().toISOString();

            const { error: updateError } = await supabase
              .from('businesses')
              .update(updates)
              .eq('id', biz.id);

            if (updateError) {
              console.error(`Update error for ${biz.name}:`, updateError);
              results.push({ name: biz.name, status: 'update_error', logo: logoUrl, banner: bannerUrl });
            } else {
              updatedCount++;
              results.push({ name: biz.name, status: 'updated', logo: logoUrl, banner: bannerUrl });
              console.log(`✅ Updated ${biz.name}: logo=${logoUrl ? 'yes' : 'no'}, banner=${bannerUrl ? 'yes' : 'no'}`);
            }
          } else {
            results.push({ name: biz.name, status: 'no_images_found' });
            console.log(`❌ No images found for ${biz.name}`);
          }
        } catch (err) {
          console.error(`Error processing ${biz.name}:`, err);
          results.push({ name: biz.name, status: 'exception' });
        }
      });

      await Promise.all(batchPromises);
      
      // Small delay between batches
      if (i + 5 < businesses.length) {
        await new Promise(r => setTimeout(r, 1000));
      }
    }

    console.log(`\nDone! Updated ${updatedCount}/${businesses.length} businesses`);

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

function resolveUrl(url: string, baseUrl: string): string {
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  try {
    const base = new URL(baseUrl);
    if (url.startsWith('//')) return base.protocol + url;
    if (url.startsWith('/')) return base.origin + url;
    return new URL(url, baseUrl).href;
  } catch {
    return url;
  }
}
