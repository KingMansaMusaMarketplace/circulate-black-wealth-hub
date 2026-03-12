import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // Get businesses with placeholder images
    const { data: businesses, error } = await supabase
      .from("businesses")
      .select("id, name, website, logo_url, banner_url")
      .ilike("banner_url", "%placeholder%")
      .not("website", "is", null)
      .neq("website", "");

    if (error) throw error;
    if (!businesses?.length) {
      return new Response(JSON.stringify({ success: true, message: "No placeholder images found" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Found ${businesses.length} businesses with placeholder images`);

    const results: Array<{ name: string; status: string; banner?: string; logo?: string; error?: string }> = [];

    for (const biz of businesses) {
      try {
        let website = biz.website.trim();
        if (!website.startsWith("http")) website = `https://${website}`;

        console.log(`Scraping: ${biz.name} (${website})`);

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(website, {
          signal: controller.signal,
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; BrandingBot/1.0)",
            "Accept": "text/html",
          },
          redirect: "follow",
        });
        clearTimeout(timeout);

        if (!response.ok) {
          results.push({ name: biz.name, status: "fetch_failed", error: `HTTP ${response.status}` });
          continue;
        }

        const html = await response.text();
        const finalUrl = response.url || website;

        // Extract OG image for banner
        const ogMatch = html.match(/<meta[^>]+(?:property|name)=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
                         html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']og:image["']/i);
        
        const twitterMatch = html.match(/<meta[^>]+(?:property|name)=["']twitter:image["'][^>]+content=["']([^"']+)["']/i) ||
                             html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']twitter:image["']/i);

        let bannerUrl = (ogMatch?.[1] || twitterMatch?.[1] || "").trim();
        
        // Make relative URLs absolute
        if (bannerUrl && !bannerUrl.startsWith("http")) {
          try { bannerUrl = new URL(bannerUrl, finalUrl).toString(); } catch { bannerUrl = ""; }
        }

        // Extract logo
        const logoMatch = html.match(/<img[^>]*(?:class|alt|id)=["'][^"']*(logo|brand)[^"']*["'][^>]*src=["']([^"']+)["']/i) ||
                          html.match(/<img[^>]*src=["']([^"']+)["'][^>]*(?:class|alt|id)=["'][^"']*(logo|brand)[^"']*["']/i);
        
        let logoUrl = (logoMatch?.[2] || logoMatch?.[1] || "").trim();
        if (logoUrl && !logoUrl.startsWith("http")) {
          try { logoUrl = new URL(logoUrl, finalUrl).toString(); } catch { logoUrl = ""; }
        }

        // Filter junk
        const isJunk = (url: string) => !url || url.includes("favicon") || url.includes("${") || url.includes("{{");

        const updates: Record<string, string> = { updated_at: new Date().toISOString() };
        
        if (bannerUrl && !isJunk(bannerUrl)) {
          updates.banner_url = bannerUrl;
        }
        
        // Only update logo if current one is also a placeholder
        const needsLogo = !biz.logo_url || biz.logo_url.includes("placeholder");
        if (needsLogo && logoUrl && !isJunk(logoUrl)) {
          updates.logo_url = logoUrl;
        }

        if (Object.keys(updates).length <= 1) {
          results.push({ name: biz.name, status: "no_images_found" });
          continue;
        }

        const { error: updateError } = await supabase
          .from("businesses")
          .update(updates)
          .eq("id", biz.id);

        if (updateError) {
          results.push({ name: biz.name, status: "update_failed", error: updateError.message });
        } else {
          results.push({ name: biz.name, status: "updated", banner: updates.banner_url, logo: updates.logo_url });
        }

        // Rate limit
        await new Promise(r => setTimeout(r, 300));
      } catch (err) {
        results.push({ name: biz.name, status: "error", error: err instanceof Error ? err.message : "Unknown" });
      }
    }

    const updated = results.filter(r => r.status === "updated").length;
    const failed = results.filter(r => ["error", "update_failed", "fetch_failed"].includes(r.status)).length;

    return new Response(JSON.stringify({
      success: true,
      summary: { total: businesses.length, updated, failed, noImages: results.length - updated - failed },
      results,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err instanceof Error ? err.message : "Unknown" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
