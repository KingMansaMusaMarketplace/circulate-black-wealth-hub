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
    const FIRECRAWL_API_KEY = Deno.env.get("FIRECRAWL_API_KEY");
    if (!FIRECRAWL_API_KEY) {
      return new Response(JSON.stringify({ success: false, error: "FIRECRAWL_API_KEY not set" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // Get businesses still with placeholder images
    const { data: businesses, error } = await supabase
      .from("businesses")
      .select("id, name, website, logo_url, banner_url, category")
      .ilike("banner_url", "%placeholder%")
      .not("website", "is", null)
      .neq("website", "");

    if (error) throw error;
    if (!businesses?.length) {
      return new Response(JSON.stringify({ success: true, message: "No placeholders remaining" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Processing ${businesses.length} businesses with Firecrawl`);

    const results: Array<{ name: string; status: string; banner?: string; logo?: string; error?: string }> = [];

    for (const biz of businesses) {
      try {
        let website = biz.website.trim();
        if (!website.startsWith("http")) website = `https://${website}`;

        console.log(`Firecrawl scraping: ${biz.name} (${website})`);

        const scrapeResponse = await fetch("https://api.firecrawl.dev/v1/scrape", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${FIRECRAWL_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: website,
            formats: ["branding"],
            onlyMainContent: false,
            timeout: 15000,
          }),
        });

        const scrapeData = await scrapeResponse.json();

        if (!scrapeResponse.ok || !scrapeData.success) {
          console.log(`Firecrawl failed for ${biz.name}:`, scrapeData.error || "unknown");
          results.push({ name: biz.name, status: "scrape_failed", error: scrapeData.error || `HTTP ${scrapeResponse.status}` });
          continue;
        }

        const branding = scrapeData.data?.branding || {};
        const metadata = scrapeData.data?.metadata || {};
        const brandingImages = branding?.images || {};

        const ogImage = brandingImages.ogImage || metadata?.ogImage || "";
        const logo = brandingImages.logo || branding?.logo || "";

        const isValid = (url: string) => url && url.startsWith("http") && !url.includes("${") && !url.includes("favicon");

        const updates: Record<string, string> = { updated_at: new Date().toISOString() };

        if (isValid(ogImage)) {
          updates.banner_url = ogImage;
        }

        const needsLogo = !biz.logo_url || biz.logo_url.includes("placeholder");
        if (needsLogo && isValid(logo)) {
          updates.logo_url = logo;
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

        // Rate limit between Firecrawl calls
        await new Promise(r => setTimeout(r, 500));
      } catch (err) {
        results.push({ name: biz.name, status: "error", error: err instanceof Error ? err.message : "Unknown" });
      }
    }

    const updated = results.filter(r => r.status === "updated").length;
    const failed = results.filter(r => !["updated", "no_images_found"].includes(r.status)).length;

    return new Response(JSON.stringify({
      success: true,
      summary: { total: businesses.length, updated, failed, noImages: results.length - updated - failed },
      results,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err instanceof Error ? err.message : "Unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
