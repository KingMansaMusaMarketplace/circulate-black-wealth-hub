import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const TARGET_CITIES = [
  // Georgia
  { city: "Atlanta", state: "GA" }, { city: "Savannah", state: "GA" }, { city: "Augusta", state: "GA" }, { city: "Macon", state: "GA" }, { city: "Columbus", state: "GA" },
  // California
  { city: "Los Angeles", state: "CA" }, { city: "Oakland", state: "CA" }, { city: "Sacramento", state: "CA" }, { city: "San Diego", state: "CA" }, { city: "San Francisco", state: "CA" },
  { city: "Compton", state: "CA" }, { city: "Inglewood", state: "CA" }, { city: "Long Beach", state: "CA" }, { city: "Fresno", state: "CA" }, { city: "San Jose", state: "CA" },
  { city: "Riverside", state: "CA" }, { city: "Stockton", state: "CA" }, { city: "Bakersfield", state: "CA" }, { city: "Vallejo", state: "CA" },
  // Illinois
  { city: "Chicago", state: "IL" }, { city: "Rockford", state: "IL" }, { city: "Springfield", state: "IL" }, { city: "East St. Louis", state: "IL" },
  // DC / Maryland / Virginia
  { city: "Washington", state: "DC" }, { city: "Baltimore", state: "MD" }, { city: "Silver Spring", state: "MD" }, { city: "Prince George's County", state: "MD" },
  { city: "Richmond", state: "VA" }, { city: "Norfolk", state: "VA" }, { city: "Hampton", state: "VA" }, { city: "Newport News", state: "VA" }, { city: "Virginia Beach", state: "VA" },
  // Texas
  { city: "Houston", state: "TX" }, { city: "Dallas", state: "TX" }, { city: "San Antonio", state: "TX" }, { city: "Austin", state: "TX" }, { city: "Fort Worth", state: "TX" },
  { city: "Arlington", state: "TX" }, { city: "El Paso", state: "TX" }, { city: "Beaumont", state: "TX" }, { city: "Killeen", state: "TX" },
  // Louisiana
  { city: "New Orleans", state: "LA" }, { city: "Baton Rouge", state: "LA" }, { city: "Shreveport", state: "LA" }, { city: "Lafayette", state: "LA" },
  // Tennessee
  { city: "Nashville", state: "TN" }, { city: "Memphis", state: "TN" }, { city: "Chattanooga", state: "TN" }, { city: "Knoxville", state: "TN" },
  // North Carolina
  { city: "Durham", state: "NC" }, { city: "Charlotte", state: "NC" }, { city: "Raleigh", state: "NC" }, { city: "Greensboro", state: "NC" }, { city: "Winston-Salem", state: "NC" }, { city: "Fayetteville", state: "NC" },
  // New York
  { city: "New York", state: "NY" }, { city: "Harlem", state: "NY" }, { city: "Brooklyn", state: "NY" }, { city: "Bronx", state: "NY" }, { city: "Queens", state: "NY" },
  { city: "Buffalo", state: "NY" }, { city: "Rochester", state: "NY" }, { city: "Syracuse", state: "NY" }, { city: "Albany", state: "NY" }, { city: "Mount Vernon", state: "NY" }, { city: "Hempstead", state: "NY" },
  // Michigan
  { city: "Detroit", state: "MI" }, { city: "Flint", state: "MI" }, { city: "Grand Rapids", state: "MI" }, { city: "Lansing", state: "MI" }, { city: "Saginaw", state: "MI" },
  // Pennsylvania
  { city: "Philadelphia", state: "PA" }, { city: "Pittsburgh", state: "PA" }, { city: "Harrisburg", state: "PA" },
  // Florida
  { city: "Miami", state: "FL" }, { city: "Tampa", state: "FL" }, { city: "Jacksonville", state: "FL" }, { city: "Orlando", state: "FL" }, { city: "Fort Lauderdale", state: "FL" },
  { city: "Tallahassee", state: "FL" }, { city: "St. Petersburg", state: "FL" }, { city: "West Palm Beach", state: "FL" },
  // Alabama
  { city: "Birmingham", state: "AL" }, { city: "Montgomery", state: "AL" }, { city: "Mobile", state: "AL" }, { city: "Huntsville", state: "AL" }, { city: "Selma", state: "AL" },
  // Mississippi
  { city: "Jackson", state: "MS" }, { city: "Hattiesburg", state: "MS" }, { city: "Gulfport", state: "MS" }, { city: "Meridian", state: "MS" },
  // Missouri
  { city: "St. Louis", state: "MO" }, { city: "Kansas City", state: "MO" }, { city: "Ferguson", state: "MO" },
  // Ohio
  { city: "Cleveland", state: "OH" }, { city: "Columbus", state: "OH" }, { city: "Cincinnati", state: "OH" }, { city: "Dayton", state: "OH" }, { city: "Toledo", state: "OH" }, { city: "Akron", state: "OH" },
  // Indiana
  { city: "Indianapolis", state: "IN" }, { city: "Gary", state: "IN" }, { city: "Fort Wayne", state: "IN" }, { city: "South Bend", state: "IN" },
  // Wisconsin
  { city: "Milwaukee", state: "WI" }, { city: "Madison", state: "WI" }, { city: "Racine", state: "WI" },
  // South Carolina
  { city: "Columbia", state: "SC" }, { city: "Charleston", state: "SC" }, { city: "Greenville", state: "SC" }, { city: "North Charleston", state: "SC" },
  // New Jersey
  { city: "Newark", state: "NJ" }, { city: "Jersey City", state: "NJ" }, { city: "Trenton", state: "NJ" }, { city: "Camden", state: "NJ" }, { city: "Paterson", state: "NJ" },
  // Connecticut
  { city: "Hartford", state: "CT" }, { city: "New Haven", state: "CT" }, { city: "Bridgeport", state: "CT" },
  // Massachusetts
  { city: "Boston", state: "MA" }, { city: "Springfield", state: "MA" }, { city: "Worcester", state: "MA" }, { city: "Brockton", state: "MA" },
  // Minnesota
  { city: "Minneapolis", state: "MN" }, { city: "St. Paul", state: "MN" }, { city: "Brooklyn Park", state: "MN" },
  // Colorado
  { city: "Denver", state: "CO" }, { city: "Aurora", state: "CO" }, { city: "Colorado Springs", state: "CO" },
  // Arizona
  { city: "Phoenix", state: "AZ" }, { city: "Tucson", state: "AZ" }, { city: "Mesa", state: "AZ" },
  // Nevada
  { city: "Las Vegas", state: "NV" }, { city: "Henderson", state: "NV" }, { city: "North Las Vegas", state: "NV" }, { city: "Reno", state: "NV" },
  // Oregon
  { city: "Portland", state: "OR" }, { city: "Salem", state: "OR" }, { city: "Eugene", state: "OR" },
  // Washington
  { city: "Seattle", state: "WA" }, { city: "Tacoma", state: "WA" }, { city: "Spokane", state: "WA" }, { city: "Kent", state: "WA" },
  // Kansas
  { city: "Wichita", state: "KS" }, { city: "Kansas City", state: "KS" }, { city: "Topeka", state: "KS" },
  // Oklahoma
  { city: "Oklahoma City", state: "OK" }, { city: "Tulsa", state: "OK" }, { city: "Lawton", state: "OK" },
  // Arkansas
  { city: "Little Rock", state: "AR" }, { city: "Pine Bluff", state: "AR" }, { city: "Fort Smith", state: "AR" },
  // Kentucky
  { city: "Louisville", state: "KY" }, { city: "Lexington", state: "KY" }, { city: "Frankfort", state: "KY" },
  // Iowa
  { city: "Des Moines", state: "IA" }, { city: "Waterloo", state: "IA" }, { city: "Cedar Rapids", state: "IA" },
  // Nebraska
  { city: "Omaha", state: "NE" }, { city: "Lincoln", state: "NE" },
  // West Virginia
  { city: "Charleston", state: "WV" }, { city: "Huntington", state: "WV" },
  // Delaware
  { city: "Wilmington", state: "DE" }, { city: "Dover", state: "DE" },
  // Rhode Island
  { city: "Providence", state: "RI" },
  // Hawaii
  { city: "Honolulu", state: "HI" },
  // Alaska
  { city: "Anchorage", state: "AK" },
  // New Hampshire
  { city: "Manchester", state: "NH" },
  // Vermont
  { city: "Burlington", state: "VT" },
  // Maine
  { city: "Portland", state: "ME" },
  // Montana
  { city: "Billings", state: "MT" },
  // Wyoming
  { city: "Cheyenne", state: "WY" },
  // North Dakota
  { city: "Fargo", state: "ND" },
  // South Dakota
  { city: "Sioux Falls", state: "SD" },
  // Idaho
  { city: "Boise", state: "ID" },
  // Utah
  { city: "Salt Lake City", state: "UT" },
  // New Mexico
  { city: "Albuquerque", state: "NM" },
];

// High-yield categories get 3x weight, medium 2x, low 1x
const HIGH_YIELD_CATEGORIES = [
  "Restaurant", "Barbershop", "Beauty Salon", "Bakery", "Clothing",
  "Catering", "Coffee Shop", "Fitness", "Health & Wellness", "Home Services",
  "Auto Repair", "Day Spa",
];
const MEDIUM_YIELD_CATEGORIES = [
  "Real Estate", "Consulting", "Photography", "Art Gallery", "Event Planning",
  "Technology", "Tattoo Studio", "Juice Bar", "Dance Studio", "Music Studio",
];
const LOW_YIELD_CATEGORIES = [
  "Legal Services", "Accounting", "Insurance", "Financial Planning",
  "Bookstore", "Florist", "Pet Grooming", "Tutoring",
];

// Build weighted category pool: high=3x, medium=2x, low=1x
const CATEGORIES: string[] = [
  ...HIGH_YIELD_CATEGORIES, ...HIGH_YIELD_CATEGORIES, ...HIGH_YIELD_CATEGORIES,
  ...MEDIUM_YIELD_CATEGORIES, ...MEDIUM_YIELD_CATEGORIES,
  ...LOW_YIELD_CATEGORIES,
];

const PLACEHOLDER_OWNER_ID = "bd72a75e-1310-4f40-9c74-380443b09d9b";

// Increased batch: request 15 to aim for 10-15 quality inserts after filtering
const TARGET_BATCH_SIZE = 15;
const MIN_CONFIDENCE = 0.55;

/**
 * Validate that a URL points to a real image (not an error page or tracking pixel)
 */
function isValidImageUrl(url: string | null): boolean {
  if (!url) return false;
  const lower = url.toLowerCase();
  // Reject junk URLs
  if (lower.includes("data:") || lower.includes("pixel") || lower.includes("spacer")) return false;
  if (lower.includes("1x1") || lower.includes("tracking") || lower.includes("analytics")) return false;
  if (lower.includes("favicon.ico")) return false;
  if (lower.length < 15) return false;
  // Must be an actual URL
  if (!lower.startsWith("http")) return false;
  return true;
}

/**
 * Scrape a business website for logo and banner images using Firecrawl
 * Returns images ONLY from the business's own website
 */
async function scrapeWebsiteImages(websiteUrl: string, firecrawlKey: string): Promise<{ logo_url: string | null; banner_url: string | null }> {
  const result = { logo_url: null as string | null, banner_url: null as string | null };
  
  if (!websiteUrl || !firecrawlKey) return result;

  try {
    let url = websiteUrl.trim();
    if (!url.startsWith("http")) url = `https://${url}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

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
        timeout: 10000,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text();
      console.log(`[Scrape] Failed for ${url}: ${response.status} - ${errText.substring(0, 100)}`);
      return result;
    }

    const data = await response.json();
    const metadata = data?.data?.metadata || {};
    const markdown = data?.data?.markdown || "";

    // Extract OG image as banner (these are specifically chosen by the site owner)
    if (metadata.ogImage && isValidImageUrl(metadata.ogImage)) {
      result.banner_url = metadata.ogImage;
    }

    // Try to find a proper logo (not just favicon)
    if (metadata.favicon && !metadata.favicon.includes(".ico") && isValidImageUrl(metadata.favicon)) {
      result.logo_url = metadata.favicon;
    }

    // Search page content for logo and banner images
    const imgRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    let match;
    const allImages: { alt: string; src: string }[] = [];
    
    while ((match = imgRegex.exec(markdown)) !== null) {
      const alt = (match[1] || "").toLowerCase();
      const src = match[2];
      if (!isValidImageUrl(src)) continue;
      allImages.push({ alt, src });

      // Prioritize images with "logo" in alt text or URL
      if (alt.includes("logo") || src.toLowerCase().includes("logo")) {
        result.logo_url = src;
      }
      // Use hero/banner images
      if (!result.banner_url && (alt.includes("hero") || alt.includes("banner") || alt.includes("header") || src.includes("hero") || src.includes("banner"))) {
        result.banner_url = src;
      }
    }

    // If we still don't have a banner, use ogImage
    if (!result.banner_url && metadata.ogImage && isValidImageUrl(metadata.ogImage)) {
      result.banner_url = metadata.ogImage;
    }

    // If no banner from og/hero, pick the first substantial image from the page
    if (!result.banner_url && allImages.length > 0) {
      // Skip tiny icons, pick the first real content image
      const contentImage = allImages.find(img => 
        !img.alt.includes("icon") && !img.src.includes("icon") &&
        !img.alt.includes("arrow") && !img.src.includes("arrow")
      );
      if (contentImage) {
        result.banner_url = contentImage.src;
      }
    }

    // If no logo found, use ogImage as logo fallback (business usually puts their branding there)
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
    if (!firecrawlKey) {
      throw new Error("FIRECRAWL_API_KEY required — images are mandatory");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Run multiple search queries per invocation to maximize throughput
    const NUM_SEARCHES = 15;
    const searchCombos: { city: typeof TARGET_CITIES[0]; category: string }[] = [];
    const usedCombos = new Set<string>();
    
    // Pick 15 unique city/category combinations with weighted categories
    while (searchCombos.length < NUM_SEARCHES) {
      const city = TARGET_CITIES[Math.floor(Math.random() * TARGET_CITIES.length)];
      const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
      const key = `${city.city}-${category}`;
      if (!usedCombos.has(key)) {
        usedCombos.add(key);
        searchCombos.push({ city, category });
      }
    }

    console.log(`[Kayla Auto-Discover] Running ${NUM_SEARCHES} parallel searches: ${searchCombos.map(s => `${s.category} in ${s.city.city}`).join(", ")}`);

    // Fire all Perplexity searches in parallel
    const searchPromises = searchCombos.map(async (combo) => {
      const { city: targetCity, category: categoryFocus } = combo;
      const label = `${categoryFocus} in ${targetCity.city}, ${targetCity.state}`;
      
      try {
        console.log(`[Kayla Auto-Discover] Searching: Black-owned ${label}`);
        
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
                content: `You are a business research assistant specializing in finding Black-owned businesses. Find REAL, currently operating businesses with COMPLETE, ACCURATE information. Every field matters — provide the full street address, working phone number, actual website URL, business hours, and a rich 2-3 sentence description highlighting what makes the business special. Do NOT invent or fabricate any information. If you cannot verify a detail, omit that field rather than guessing. CRITICAL: Every business MUST have a working website URL — do not include businesses without websites.`,
              },
              {
                role: "user",
                content: `Find 5 real, currently operating Black-owned ${categoryFocus} businesses in ${targetCity.city}, ${targetCity.state}. 

IMPORTANT: Only include businesses that have their OWN website (not just a Yelp or Facebook page). The website URL is MANDATORY.

For EACH business provide ALL of the following:
- Exact legal business name
- Rich 2-3 sentence description of what they offer and what makes them special
- Specific category (e.g. "Soul Food Restaurant" not just "Restaurant")
- Complete street address (number and street name)
- City, State (2-letter code), ZIP code
- Phone number (with area code)
- Email address (if publicly available)
- Website URL (full URL including https:// — REQUIRED, must be the business's own website)
- Price range (one of: $, $$, $$$, $$$$)
- Your confidence level (0 to 1) that this business exists and is currently operating

Only include businesses you are highly confident (0.7+) are real and currently open WITH their own website. Quality over quantity.`,
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
                          website: { type: "string", description: "Full website URL — REQUIRED" },
                          price_range: { type: "string", description: "One of: $, $$, $$$, $$$$" },
                          confidence: { type: "number", description: "0-1 confidence this is a real business" },
                        },
                        required: ["name", "description", "category", "address", "city", "state", "website"],
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
          console.error(`[Kayla Auto-Discover] Perplexity error for ${label}: ${perplexityResponse.status} - ${errText.substring(0, 200)}`);
          return { businesses: [], citations: [], label, targetCity, categoryFocus };
        }

        const perplexityData = await perplexityResponse.json();
        const content = perplexityData.choices?.[0]?.message?.content;
        const citations = perplexityData.citations || [];

        if (!content) {
          console.log(`[Kayla Auto-Discover] No content for ${label}`);
          return { businesses: [], citations, label, targetCity, categoryFocus };
        }

        let discovered: any;
        try {
          discovered = JSON.parse(content);
        } catch {
          console.log(`[Kayla Auto-Discover] Failed to parse response for ${label}`);
          return { businesses: [], citations, label, targetCity, categoryFocus };
        }

        const bizList = discovered.businesses || [];
        console.log(`[Kayla Auto-Discover] Found ${bizList.length} candidates for ${label}`);
        return { businesses: bizList, citations, label, targetCity, categoryFocus };
      } catch (err) {
        console.error(`[Kayla Auto-Discover] Search error for ${label}: ${err instanceof Error ? err.message : "unknown"}`);
        return { businesses: [], citations: [], label, targetCity, categoryFocus };
      }
    });

    const searchResults = await Promise.all(searchPromises);
    
    // Flatten all candidates with their source info
    const allCandidates: { biz: any; targetCity: typeof TARGET_CITIES[0]; categoryFocus: string }[] = [];
    let allCitations: string[] = [];
    const searchSummaries: string[] = [];
    
    for (const result of searchResults) {
      searchSummaries.push(`${result.label}: ${result.businesses.length} found`);
      allCitations = [...allCitations, ...result.citations];
      for (const biz of result.businesses) {
        allCandidates.push({ biz, targetCity: result.targetCity, categoryFocus: result.categoryFocus });
      }
    }
    
    console.log(`[Kayla Auto-Discover] Total candidates from ${NUM_SEARCHES} searches: ${allCandidates.length} (${searchSummaries.join(", ")})`);

    if (allCandidates.length === 0) {
      console.log(`[Kayla Auto-Discover] No candidates found across all searches`);
    }
    
    const businesses = allCandidates;
    const citations = allCitations;
    const categoryFocus = searchCombos.map(s => s.category).join(", ");

    let inserted = 0;
    let skippedDuplicates = 0;
    let skippedLowConfidence = 0;
    let skippedNoImages = 0;
    let skippedNoWebsite = 0;
    const insertedNames: string[] = [];
    const enrichmentDetails: any[] = [];

    for (const { biz, targetCity, categoryFocus: catFocus } of businesses) {
      if (!biz.name || !biz.city) {
        console.log(`[Kayla Auto-Discover] Skipping - missing name or city`);
        continue;
      }

      const confidence = biz.confidence ?? 0.5;
      if (confidence < MIN_CONFIDENCE) {
        console.log(`[Kayla Auto-Discover] Skipping "${biz.name}" - low confidence: ${confidence} (min: ${MIN_CONFIDENCE})`);
        skippedLowConfidence++;
        continue;
      }

      // MANDATORY: Must have a website URL to scrape images from
      const websiteUrl = biz.website && biz.website.match(/^https?:\/\/|^www\./) ? biz.website.trim() : null;
      if (!websiteUrl) {
        console.log(`[Kayla Auto-Discover] Skipping "${biz.name}" - NO WEBSITE (images mandatory)`);
        skippedNoWebsite++;
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

      // === ENRICHMENT PHASE: Scrape website for images ===
      console.log(`[Kayla Auto-Discover] Scraping website for "${biz.name}": ${websiteUrl}`);
      const images = await scrapeWebsiteImages(websiteUrl, firecrawlKey);

      // MANDATORY: Must have BOTH logo AND banner
      if (!isValidImageUrl(images.logo_url) || !isValidImageUrl(images.banner_url)) {
        console.log(`[Kayla Auto-Discover] ❌ Skipping "${biz.name}" - MISSING IMAGES (logo: ${images.logo_url ? "✅" : "❌"}, banner: ${images.banner_url ? "✅" : "❌"})`);
        skippedNoImages++;
        continue;
      }

      // Geocode the address for map pin
      let coords = { latitude: null as number | null, longitude: null as number | null };
      if (biz.address && mapboxToken) {
        coords = await geocodeAddress(biz.address, biz.city, biz.state || targetCity.state, biz.zip_code || "", mapboxToken);
      }

      // Build the complete business record — only fully enriched listings
      const businessRecord: Record<string, any> = {
        name: biz.name.trim(),
        business_name: biz.name.trim(),
        description: biz.description || `Black-owned ${biz.category || catFocus} business in ${biz.city}, ${biz.state}.`,
        category: biz.category || catFocus,
        address: biz.address || "",
        city: biz.city.trim(),
        state: biz.state?.trim() || targetCity.state,
        zip_code: biz.zip_code || "",
        phone: biz.phone || "",
        email: biz.email || "",
        website: websiteUrl,
        owner_id: PLACEHOLDER_OWNER_ID,
        is_verified: true,
        listing_status: 'live',
        logo_url: images.logo_url,
        banner_url: images.banner_url,
      };

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
        has_logo: true,
        has_banner: true,
        has_coords: coords.latitude !== null,
        has_phone: !!biz.phone,
        has_website: true,
        has_address: !!biz.address,
        confidence,
        verified: true,
      });

      console.log(`[Kayla Auto-Discover] ✅ Added "${biz.name}" | logo:✅ banner:✅ coords:${coords.latitude ? "✅" : "❌"} phone:${biz.phone ? "✅" : "❌"}`);
    }

    // Log report
    const durationMs = Date.now() - startTime;
    const searchCombosSummary = searchCombos.map(s => `${s.category} in ${s.city.city}, ${s.city.state}`).join("; ");
    const reportData = {
      report_type: "auto_discover",
      status: "completed",
      summary: `Multi-search: ${NUM_SEARCHES} queries across cities. ${allCandidates.length} candidates total. Inserted: ${inserted}, Duplicates: ${skippedDuplicates}, Low confidence: ${skippedLowConfidence}, No website: ${skippedNoWebsite}, No images: ${skippedNoImages}. Duration: ${durationMs}ms.`,
      details: {
        searches: searchCombosSummary,
        num_searches: NUM_SEARCHES,
        candidates_found: allCandidates.length,
        inserted,
        skipped_duplicates: skippedDuplicates,
        skipped_low_confidence: skippedLowConfidence,
        skipped_no_website: skippedNoWebsite,
        skipped_no_images: skippedNoImages,
        inserted_names: insertedNames,
        enrichment: enrichmentDetails,
        citations,
        duration_ms: durationMs,
        min_confidence: MIN_CONFIDENCE,
        quality_gate: "mandatory_logo_and_banner",
      },
      issues_found: allCandidates.length,
      issues_fixed: inserted,
    };

    const { error: reportErr } = await supabase.from("kayla_agent_reports").insert(reportData);
    if (reportErr) console.error("[Kayla Auto-Discover] Report insert error:", reportErr.message);

    console.log(`[Kayla Auto-Discover] Complete: ${inserted}/${allCandidates.length} fully-enriched businesses added in ${durationMs}ms (${skippedNoImages} rejected for missing images)`);

    return new Response(
      JSON.stringify({
        success: true,
        searches: NUM_SEARCHES,
        candidates: allCandidates.length,
        inserted,
        skippedDuplicates,
        skippedLowConfidence,
        skippedNoWebsite,
        skippedNoImages,
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
        report_type: "auto_discover",
        status: "error",
        summary: `Auto-discover failed: ${errMsg}`,
        details: { error: errMsg, duration_ms: Date.now() - startTime },
        issues_found: 0,
        issues_fixed: 0,
      });
    } catch {}

    return new Response(
      JSON.stringify({ success: false, error: errMsg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
