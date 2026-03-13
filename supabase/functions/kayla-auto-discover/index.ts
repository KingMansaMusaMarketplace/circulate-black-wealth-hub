import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const TARGET_CITIES = [
  { city: "Atlanta", state: "GA" },
  { city: "Los Angeles", state: "CA" },
  { city: "Chicago", state: "IL" },
  { city: "Washington", state: "DC" },
  { city: "Houston", state: "TX" },
  { city: "New Orleans", state: "LA" },
  { city: "Oakland", state: "CA" },
  { city: "Nashville", state: "TN" },
  { city: "Durham", state: "NC" },
  { city: "Brooklyn", state: "NY" },
  { city: "Baltimore", state: "MD" },
  { city: "Detroit", state: "MI" },
  { city: "Memphis", state: "TN" },
  { city: "Charlotte", state: "NC" },
  { city: "Philadelphia", state: "PA" },
  { city: "Dallas", state: "TX" },
  { city: "Miami", state: "FL" },
  { city: "Birmingham", state: "AL" },
  { city: "Jackson", state: "MS" },
  { city: "Richmond", state: "VA" },
];

const CATEGORIES = [
  "Restaurant", "Barbershop", "Beauty Salon", "Bakery", "Bookstore",
  "Clothing", "Coffee Shop", "Consulting", "Fitness", "Health & Wellness",
  "Photography", "Real Estate", "Technology", "Catering", "Art Gallery",
  "Legal Services", "Accounting", "Home Services", "Auto Repair", "Florist",
];

const PLACEHOLDER_OWNER_ID = "bd72a75e-1310-4f40-9c74-380443b09d9b";

/**
 * Scrape a business website for logo and banner images using Firecrawl
 */
async function scrapeWebsiteImages(websiteUrl: string, firecrawlKey: string): Promise<{ logo_url: string | null; banner_url: string | null }> {
  const result = { logo_url: null as string | null, banner_url: null as string | null };
  
  if (!websiteUrl || !firecrawlKey) return result;

  try {
    // Normalize URL
    let url = websiteUrl.trim();
    if (!url.startsWith("http")) url = `https://${url}`;

    const response = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${firecrawlKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
        formats: ["markdown"],
        onlyMainContent: false,
        timeout: 15000,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.log(`[Scrape] Failed for ${url}: ${response.status} - ${errText.substring(0, 100)}`);
      return result;
    }

    const data = await response.json();
    const metadata = data?.data?.metadata || {};
    const markdown = data?.data?.markdown || "";

    // Extract OG image / favicon from metadata
    if (metadata.ogImage) {
      result.banner_url = metadata.ogImage;
    }
    if (metadata.favicon) {
      // Try to get a higher-res logo from common patterns
      const faviconUrl = metadata.favicon;
      if (faviconUrl.includes(".ico") || faviconUrl.length < 10) {
        // Skip tiny favicons, look for logo in page content instead
      } else {
        result.logo_url = faviconUrl;
      }
    }

    // Look for logo images in the markdown content
    const imgRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    let match;
    while ((match = imgRegex.exec(markdown)) !== null) {
      const alt = (match[1] || "").toLowerCase();
      const src = match[2];
      if (!src || src.includes("data:") || src.includes("pixel") || src.includes("spacer")) continue;

      // Prioritize images with "logo" in alt text or URL
      if (alt.includes("logo") || src.toLowerCase().includes("logo")) {
        result.logo_url = src;
      }
      // Use large hero/banner images
      if (!result.banner_url && (alt.includes("hero") || alt.includes("banner") || alt.includes("header") || src.includes("hero") || src.includes("banner"))) {
        result.banner_url = src;
      }
    }

    // If we still don't have a banner, use ogImage or first substantial image from metadata
    if (!result.banner_url && metadata.ogImage) {
      result.banner_url = metadata.ogImage;
    }

    // If no logo found but ogImage exists, use it as logo fallback
    if (!result.logo_url && result.banner_url) {
      result.logo_url = result.banner_url;
    }

    console.log(`[Scrape] ${url} → logo: ${result.logo_url ? "✅" : "❌"}, banner: ${result.banner_url ? "✅" : "❌"}`);
  } catch (err) {
    console.log(`[Scrape] Error for ${websiteUrl}: ${err instanceof Error ? err.message : "unknown"}`);
  }

  return result;
}

/**
 * Geocode an address using Mapbox
 */
async function geocodeAddress(address: string, city: string, state: string, zipCode: string, mapboxToken: string): Promise<{ latitude: number | null; longitude: number | null }> {
  const result = { latitude: null as number | null, longitude: null as number | null };
  
  if (!mapboxToken) return result;

  try {
    const fullAddress = [address, city, state, zipCode].filter(Boolean).join(", ");
    if (!fullAddress || fullAddress.length < 5) return result;

    const encoded = encodeURIComponent(fullAddress);
    const geoRes = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encoded}.json?access_token=${mapboxToken}&limit=1&country=us`
    );

    if (!geoRes.ok) {
      await geoRes.text();
      return result;
    }

    const geoData = await geoRes.json();
    const feature = geoData?.features?.[0];
    if (feature?.center) {
      result.longitude = feature.center[0];
      result.latitude = feature.center[1];
      console.log(`[Geocode] ${fullAddress} → ${result.latitude}, ${result.longitude}`);
    }
  } catch (err) {
    console.log(`[Geocode] Error: ${err instanceof Error ? err.message : "unknown"}`);
  }

  return result;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    const perplexityKey = Deno.env.get("PERPLEXITY_API_KEY");
    const firecrawlKey = Deno.env.get("FIRECRAWL_API_KEY");
    const mapboxToken = Deno.env.get("MAPBOX_PUBLIC_TOKEN");
    
    if (!perplexityKey) {
      throw new Error("PERPLEXITY_API_KEY not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const targetCity = TARGET_CITIES[Math.floor(Math.random() * TARGET_CITIES.length)];
    const categoryFocus = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];

    console.log(`[Kayla Auto-Discover] Searching for Black-owned ${categoryFocus} businesses in ${targetCity.city}, ${targetCity.state}`);

    // Enhanced Perplexity prompt requesting COMPLETE business data
    const perplexityResponse = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${perplexityKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "sonar",
        messages: [
          {
            role: "system",
            content: `You are a business research assistant specializing in finding Black-owned businesses. Find REAL, currently operating businesses with COMPLETE, ACCURATE information. Every field matters — provide the full street address, working phone number, actual website URL, business hours, and a rich 2-3 sentence description highlighting what makes the business special. Do NOT invent or fabricate any information. If you cannot verify a detail, omit that field rather than guessing.`,
          },
          {
            role: "user",
            content: `Find 3 real, currently operating Black-owned ${categoryFocus} businesses in ${targetCity.city}, ${targetCity.state}. 

For EACH business provide ALL of the following:
- Exact legal business name
- Rich 2-3 sentence description of what they offer and what makes them special
- Specific category (e.g. "Soul Food Restaurant" not just "Restaurant")
- Complete street address (number and street name)
- City, State (2-letter code), ZIP code
- Phone number (with area code)
- Email address (if publicly available)
- Website URL (full URL including https://)
- Price range (one of: $, $$, $$$, $$$$)
- Your confidence level (0 to 1) that this business exists and is currently operating

Only include businesses you are highly confident are real and currently open. Quality over quantity — if you can only find 2 that meet all criteria, only return 2.`,
          },
        ],
        temperature: 0.1,
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "discovered_businesses",
            schema: {
              type: "object",
              properties: {
                businesses: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string", description: "Exact business name" },
                      description: { type: "string", description: "Rich 2-3 sentence description" },
                      category: { type: "string", description: "Specific business category" },
                      address: { type: "string", description: "Full street address" },
                      city: { type: "string" },
                      state: { type: "string", description: "2-letter state code" },
                      zip_code: { type: "string" },
                      phone: { type: "string", description: "Phone with area code" },
                      email: { type: "string" },
                      website: { type: "string", description: "Full website URL" },
                      price_range: { type: "string", description: "One of: $, $$, $$$, $$$$" },
                      confidence: { type: "number", description: "0-1 confidence this is a real business" },
                    },
                    required: ["name", "description", "category", "address", "city", "state"],
                  },
                },
              },
              required: ["businesses"],
            },
          },
        },
      }),
    });

    if (!perplexityResponse.ok) {
      const errText = await perplexityResponse.text();
      throw new Error(`Perplexity API error [${perplexityResponse.status}]: ${errText}`);
    }

    const perplexityData = await perplexityResponse.json();
    const content = perplexityData.choices?.[0]?.message?.content;
    const citations = perplexityData.citations || [];

    if (!content) {
      throw new Error("No content returned from Perplexity");
    }

    let discovered: any;
    try {
      discovered = JSON.parse(content);
    } catch {
      throw new Error(`Failed to parse Perplexity response: ${content.substring(0, 200)}`);
    }

    const businesses = discovered.businesses || [];
    console.log(`[Kayla Auto-Discover] Found ${businesses.length} candidates`);

    let inserted = 0;
    let skippedDuplicates = 0;
    let skippedLowConfidence = 0;
    const insertedNames: string[] = [];
    const enrichmentDetails: any[] = [];

    for (const biz of businesses) {
      if (!biz.name || !biz.city) {
        console.log(`[Kayla Auto-Discover] Skipping - missing name or city`);
        continue;
      }

      const confidence = biz.confidence ?? 0.5;
      if (confidence < 0.4) {
        console.log(`[Kayla Auto-Discover] Skipping "${biz.name}" - low confidence: ${confidence}`);
        skippedLowConfidence++;
        continue;
      }

      // Deduplication against businesses table
      const { data: existing } = await supabase
        .from("businesses")
        .select("id, name")
        .ilike("name", biz.name.trim())
        .ilike("city", biz.city.trim())
        .limit(1);

      if (existing && existing.length > 0) {
        console.log(`[Kayla Auto-Discover] Skipping "${biz.name}" - already exists`);
        skippedDuplicates++;
        continue;
      }

      // Deduplication against b2b_external_leads
      const { data: existingLead } = await supabase
        .from("b2b_external_leads")
        .select("id")
        .ilike("business_name", biz.name.trim())
        .ilike("city", biz.city.trim())
        .limit(1);

      if (existingLead && existingLead.length > 0) {
        console.log(`[Kayla Auto-Discover] Skipping "${biz.name}" - already in leads`);
        skippedDuplicates++;
        continue;
      }

      // === ENRICHMENT PHASE ===
      // 1. Scrape website for logo and banner images
      let images = { logo_url: null as string | null, banner_url: null as string | null };
      if (biz.website && firecrawlKey) {
        console.log(`[Kayla Auto-Discover] Scraping website for "${biz.name}": ${biz.website}`);
        images = await scrapeWebsiteImages(biz.website, firecrawlKey);
      }

      // 2. Geocode the address for map pin
      let coords = { latitude: null as number | null, longitude: null as number | null };
      if (biz.address && mapboxToken) {
        coords = await geocodeAddress(biz.address, biz.city, biz.state || targetCity.state, biz.zip_code || "", mapboxToken);
      }

      const isVerified = confidence >= 0.7;

      // Clean website - filter out non-URL values like "Not publicly available"
      const cleanWebsite = biz.website && biz.website.match(/^https?:\/\/|^www\./) ? biz.website.trim() : "";

      // Build the complete business record
      const businessRecord: Record<string, any> = {
        name: biz.name.trim(),
        business_name: biz.name.trim(),
        description: biz.description || `Black-owned ${biz.category || categoryFocus} business in ${biz.city}, ${biz.state}.`,
        category: biz.category || categoryFocus,
        address: biz.address || "",
        city: biz.city.trim(),
        state: biz.state?.trim() || targetCity.state,
        zip_code: biz.zip_code || "",
        phone: biz.phone || "",
        email: biz.email || "",
        website: cleanWebsite,
        owner_id: PLACEHOLDER_OWNER_ID,
        is_verified: isVerified,
      };

      // Add images if scraped
      if (images.logo_url) businessRecord.logo_url = images.logo_url;
      if (images.banner_url) businessRecord.banner_url = images.banner_url;

      // Add coordinates if geocoded
      if (coords.latitude !== null) businessRecord.latitude = coords.latitude;
      if (coords.longitude !== null) businessRecord.longitude = coords.longitude;

      const { error: insertErr } = await supabase.from("businesses").insert(businessRecord);

      if (insertErr) {
        console.error(`[Kayla Auto-Discover] Insert error for "${biz.name}":`, insertErr.message);
        continue;
      }

      inserted++;
      insertedNames.push(biz.name);
      enrichmentDetails.push({
        name: biz.name,
        has_logo: !!images.logo_url,
        has_banner: !!images.banner_url,
        has_coords: coords.latitude !== null,
        has_phone: !!biz.phone,
        has_website: !!biz.website,
        has_address: !!biz.address,
        confidence,
        verified: isVerified,
      });

      console.log(`[Kayla Auto-Discover] ✅ Added "${biz.name}" | logo:${images.logo_url ? "✅" : "❌"} banner:${images.banner_url ? "✅" : "❌"} coords:${coords.latitude ? "✅" : "❌"} phone:${biz.phone ? "✅" : "❌"}`);
    }

    // Log report
    const durationMs = Date.now() - startTime;
    const reportData = {
      service_name: "auto_discover",
      run_type: "scheduled",
      status: "completed",
      summary: `Discovered ${businesses.length} candidates in ${targetCity.city}, ${targetCity.state} (${categoryFocus}). Inserted: ${inserted}, Duplicates: ${skippedDuplicates}, Low confidence: ${skippedLowConfidence}. Enrichment: ${enrichmentDetails.filter(d => d.has_logo).length}/${inserted} logos, ${enrichmentDetails.filter(d => d.has_banner).length}/${inserted} banners, ${enrichmentDetails.filter(d => d.has_coords).length}/${inserted} geocoded.`,
      details: {
        target_city: targetCity,
        category_focus: categoryFocus,
        candidates_found: businesses.length,
        inserted,
        skipped_duplicates: skippedDuplicates,
        skipped_low_confidence: skippedLowConfidence,
        inserted_names: insertedNames,
        enrichment: enrichmentDetails,
        citations,
        duration_ms: durationMs,
      },
      items_processed: businesses.length,
      items_fixed: inserted,
      duration_ms: durationMs,
    };

    await supabase.from("kayla_agent_reports").insert(reportData);

    console.log(`[Kayla Auto-Discover] Complete: ${inserted} fully-enriched businesses added in ${durationMs}ms`);

    return new Response(
      JSON.stringify({
        success: true,
        city: `${targetCity.city}, ${targetCity.state}`,
        category: categoryFocus,
        candidates: businesses.length,
        inserted,
        skippedDuplicates,
        skippedLowConfidence,
        insertedNames,
        enrichment: enrichmentDetails,
        durationMs,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("[Kayla Auto-Discover] Error:", errMsg);

    try {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      await supabase.from("kayla_agent_reports").insert({
        service_name: "auto_discover",
        run_type: "scheduled",
        status: "error",
        summary: `Auto-discover failed: ${errMsg}`,
        details: { error: errMsg },
        items_processed: 0,
        items_fixed: 0,
        duration_ms: Date.now() - startTime,
      });
    } catch {}

    return new Response(
      JSON.stringify({ success: false, error: errMsg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
