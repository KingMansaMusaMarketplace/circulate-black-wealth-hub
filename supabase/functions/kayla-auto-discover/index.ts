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

// Build weighted category pool
const CATEGORIES: string[] = [
  ...HIGH_YIELD_CATEGORIES, ...HIGH_YIELD_CATEGORIES, ...HIGH_YIELD_CATEGORIES,
  ...MEDIUM_YIELD_CATEGORIES, ...MEDIUM_YIELD_CATEGORIES,
  ...LOW_YIELD_CATEGORIES,
];

const PLACEHOLDER_OWNER_ID = "bd72a75e-1310-4f40-9c74-380443b09d9b";

// === OPTIMIZATION #3: Increased volume per cycle ===
const NUM_SEARCHES = 20;        // Up from 15
const PER_QUERY_LIMIT = 8;     // Up from 5
const MIN_CONFIDENCE = 0.55;
const SCRAPE_BATCH_SIZE = 10;   // Parallel Firecrawl batch limit

// === OPTIMIZATION #4: Category-specific stock banners for fallback ===
const CATEGORY_STOCK_BANNERS: Record<string, string> = {
  "Restaurant": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
  "Barbershop": "https://images.unsplash.com/photo-1585747860019-8e3e5da3c3ab?w=800&q=80",
  "Beauty Salon": "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80",
  "Bakery": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80",
  "Clothing": "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&q=80",
  "Coffee Shop": "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80",
  "Fitness": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
  "Auto Repair": "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&q=80",
  "Day Spa": "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80",
  "Catering": "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80",
  "Real Estate": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
  "Photography": "https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?w=800&q=80",
  "Art Gallery": "https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=800&q=80",
  "Technology": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
  "default": "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=80",
};

/**
 * Generate an initials-based placeholder logo URL
 */
function generateInitialsLogo(businessName: string): string {
  const initials = businessName.split(/\s+/).map(w => w[0]?.toUpperCase()).filter(Boolean).slice(0, 2).join("");
  return `https://placehold.co/400x400/1a1a2e/e0a346?text=${encodeURIComponent(initials)}&font=montserrat`;
}

/**
 * Get a stock banner for a category
 */
function getCategoryBanner(category: string): string {
  // Try exact match first, then partial match
  for (const [key, url] of Object.entries(CATEGORY_STOCK_BANNERS)) {
    if (key === "default") continue;
    if (category.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(category.toLowerCase())) {
      return url;
    }
  }
  return CATEGORY_STOCK_BANNERS["default"];
}

/**
 * Validate that a URL points to a real image
 */
function isValidImageUrl(url: string | null): boolean {
  if (!url) return false;
  const lower = url.toLowerCase();
  if (lower.includes("data:") || lower.includes("pixel") || lower.includes("spacer")) return false;
  if (lower.includes("1x1") || lower.includes("tracking") || lower.includes("analytics")) return false;
  if (lower.includes("favicon.ico")) return false;
  if (lower.length < 15) return false;
  if (!lower.startsWith("http")) return false;
  return true;
}

/**
 * Scrape a business website for logo and banner images using Firecrawl
 */
async function scrapeWebsiteImages(websiteUrl: string, firecrawlKey: string): Promise<{ logo_url: string | null; banner_url: string | null }> {
  const result = { logo_url: null as string | null, banner_url: null as string | null };
  
  if (!websiteUrl || !firecrawlKey) return result;

  try {
    let url = websiteUrl.trim();
    if (!url.startsWith("http")) url = `https://${url}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // Reduced from 12s to 8s

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
        timeout: 7000,
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

    if (metadata.ogImage && isValidImageUrl(metadata.ogImage)) {
      result.banner_url = metadata.ogImage;
    }

    if (metadata.favicon && !metadata.favicon.includes(".ico") && isValidImageUrl(metadata.favicon)) {
      result.logo_url = metadata.favicon;
    }

    const imgRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    let match;
    const allImages: { alt: string; src: string }[] = [];
    
    while ((match = imgRegex.exec(markdown)) !== null) {
      const alt = (match[1] || "").toLowerCase();
      const src = match[2];
      if (!isValidImageUrl(src)) continue;
      allImages.push({ alt, src });

      if (alt.includes("logo") || src.toLowerCase().includes("logo")) {
        result.logo_url = src;
      }
      if (!result.banner_url && (alt.includes("hero") || alt.includes("banner") || alt.includes("header") || src.includes("hero") || src.includes("banner"))) {
        result.banner_url = src;
      }
    }

    if (!result.banner_url && metadata.ogImage && isValidImageUrl(metadata.ogImage)) {
      result.banner_url = metadata.ogImage;
    }

    if (!result.banner_url && allImages.length > 0) {
      const contentImage = allImages.find(img => 
        !img.alt.includes("icon") && !img.src.includes("icon") &&
        !img.alt.includes("arrow") && !img.src.includes("arrow")
      );
      if (contentImage) {
        result.banner_url = contentImage.src;
      }
    }

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
      throw new Error("FIRECRAWL_API_KEY required");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // === Pick unique city/category combos (OPTIMIZATION #3: 20 searches) ===
    const searchCombos: { city: typeof TARGET_CITIES[0]; category: string }[] = [];
    const usedCombos = new Set<string>();
    
    while (searchCombos.length < NUM_SEARCHES) {
      const city = TARGET_CITIES[Math.floor(Math.random() * TARGET_CITIES.length)];
      const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
      const key = `${city.city}-${category}`;
      if (!usedCombos.has(key)) {
        usedCombos.add(key);
        searchCombos.push({ city, category });
      }
    }

    console.log(`[Kayla Auto-Discover] Running ${NUM_SEARCHES} parallel searches (requesting ${PER_QUERY_LIMIT} per query)`);

    // Fire all Perplexity searches in parallel
    const searchPromises = searchCombos.map(async (combo) => {
      const { city: targetCity, category: categoryFocus } = combo;
      const label = `${categoryFocus} in ${targetCity.city}, ${targetCity.state}`;
      
      try {
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
                content: `Find ${PER_QUERY_LIMIT} real, currently operating Black-owned ${categoryFocus} businesses in ${targetCity.city}, ${targetCity.state}. 

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
          return { businesses: [], citations, label, targetCity, categoryFocus };
        }

        let discovered: any;
        try {
          discovered = JSON.parse(content);
        } catch {
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
    
    // Flatten all candidates
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
    
    console.log(`[Kayla Auto-Discover] Total candidates from ${NUM_SEARCHES} searches: ${allCandidates.length}`);

    if (allCandidates.length === 0) {
      console.log(`[Kayla Auto-Discover] No candidates found across all searches`);
    }

    // === OPTIMIZATION #1 & #2: Filter basics first, then batch dedup ===
    
    // Step 1: Filter out candidates missing name/city, low confidence, no website
    let skippedLowConfidence = 0;
    let skippedNoWebsite = 0;
    const viableCandidates: typeof allCandidates = [];
    
    for (const candidate of allCandidates) {
      const { biz } = candidate;
      if (!biz.name || !biz.city) continue;
      
      const confidence = biz.confidence ?? 0.5;
      if (confidence < MIN_CONFIDENCE) {
        skippedLowConfidence++;
        continue;
      }
      
      const websiteUrl = biz.website && biz.website.match(/^https?:\/\/|^www\./) ? biz.website.trim() : null;
      if (!websiteUrl) {
        skippedNoWebsite++;
        continue;
      }
      
      viableCandidates.push(candidate);
    }
    
    console.log(`[Kayla Auto-Discover] Viable candidates after basic filter: ${viableCandidates.length}`);

    // Step 2: BATCH DEDUPLICATION — single query instead of per-candidate lookups
    let skippedDuplicates = 0;
    const candidateNames = viableCandidates.map(c => c.biz.name.trim().toLowerCase());
    const candidateCities = [...new Set(viableCandidates.map(c => c.biz.city.trim().toLowerCase()))];
    
    // Batch check businesses table
    const { data: existingBusinesses } = await supabase
      .from("businesses")
      .select("name, city")
      .in("city", candidateCities.map(c => c.charAt(0).toUpperCase() + c.slice(1)));
    
    const existingBizSet = new Set(
      (existingBusinesses || []).map(b => `${b.name?.toLowerCase()}|${b.city?.toLowerCase()}`)
    );
    
    // Batch check b2b_external_leads table
    const { data: existingLeads } = await supabase
      .from("b2b_external_leads")
      .select("business_name, city")
      .in("city", candidateCities.map(c => c.charAt(0).toUpperCase() + c.slice(1)));
    
    const existingLeadSet = new Set(
      (existingLeads || []).map(l => `${l.business_name?.toLowerCase()}|${l.city?.toLowerCase()}`)
    );
    
    const dedupedCandidates = viableCandidates.filter(c => {
      const key = `${c.biz.name.trim().toLowerCase()}|${c.biz.city.trim().toLowerCase()}`;
      if (existingBizSet.has(key) || existingLeadSet.has(key)) {
        skippedDuplicates++;
        return false;
      }
      return true;
    });
    
    console.log(`[Kayla Auto-Discover] After batch dedup: ${dedupedCandidates.length} (${skippedDuplicates} duplicates removed)`);

    // === OPTIMIZATION #1: Parallel enrichment in batches of SCRAPE_BATCH_SIZE ===
    let inserted = 0;
    let skippedNoImages = 0;
    const insertedNames: string[] = [];
    const enrichmentDetails: any[] = [];

    // Process in parallel batches
    for (let i = 0; i < dedupedCandidates.length; i += SCRAPE_BATCH_SIZE) {
      const batch = dedupedCandidates.slice(i, i + SCRAPE_BATCH_SIZE);
      
      // Parallel scrape + geocode for entire batch
      const enrichmentResults = await Promise.allSettled(
        batch.map(async ({ biz, targetCity, categoryFocus: catFocus }) => {
          const websiteUrl = biz.website.trim();
          
          // Run scrape and geocode in parallel for each candidate
          const [images, coords] = await Promise.all([
            scrapeWebsiteImages(websiteUrl, firecrawlKey),
            biz.address && mapboxToken
              ? geocodeAddress(biz.address, biz.city, biz.state || targetCity.state, biz.zip_code || "", mapboxToken)
              : Promise.resolve({ latitude: null, longitude: null }),
          ]);
          
          return { biz, targetCity, catFocus, websiteUrl, images, coords };
        })
      );
      
      // Process results and insert
      for (const result of enrichmentResults) {
        if (result.status === "rejected") {
          console.log(`[Kayla Auto-Discover] Enrichment failed: ${result.reason}`);
          continue;
        }
        
        const { biz, targetCity, catFocus, websiteUrl, images, coords } = result.value;
        
        // === OPTIMIZATION #4: Tiered image fallback ===
        let finalLogoUrl = images.logo_url;
        let finalBannerUrl = images.banner_url;
        let imageSource = "website";
        
        if (!isValidImageUrl(finalLogoUrl)) {
          finalLogoUrl = generateInitialsLogo(biz.name);
          imageSource = "fallback";
        }
        if (!isValidImageUrl(finalBannerUrl)) {
          finalBannerUrl = getCategoryBanner(biz.category || catFocus);
          imageSource = imageSource === "fallback" ? "fallback" : "mixed";
        }
        
        // Now we always have images — no more hard rejection
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
          logo_url: finalLogoUrl,
          banner_url: finalBannerUrl,
        };

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
          has_logo: isValidImageUrl(images.logo_url),
          has_banner: isValidImageUrl(images.banner_url),
          image_source: imageSource,
          has_coords: coords.latitude !== null,
          has_phone: !!biz.phone,
          has_website: true,
          confidence: biz.confidence ?? 0.5,
          verified: true,
        });

        console.log(`[Kayla Auto-Discover] ✅ Added "${biz.name}" | imgs:${imageSource} coords:${coords.latitude ? "✅" : "❌"}`);
      }
    }

    // Log report
    const durationMs = Date.now() - startTime;
    const searchCombosSummary = searchCombos.map(s => `${s.category} in ${s.city.city}, ${s.city.state}`).join("; ");
    const reportData = {
      report_type: "auto_discover",
      status: "completed",
      summary: `Optimized multi-search: ${NUM_SEARCHES} queries (${PER_QUERY_LIMIT}/query). ${allCandidates.length} candidates total. Inserted: ${inserted}, Duplicates: ${skippedDuplicates}, Low confidence: ${skippedLowConfidence}, No website: ${skippedNoWebsite}. Duration: ${durationMs}ms. Parallel enrichment + tiered image fallback active.`,
      details: {
        searches: searchCombosSummary,
        num_searches: NUM_SEARCHES,
        per_query_limit: PER_QUERY_LIMIT,
        candidates_found: allCandidates.length,
        viable_after_filter: viableCandidates.length,
        after_dedup: dedupedCandidates.length,
        inserted,
        skipped_duplicates: skippedDuplicates,
        skipped_low_confidence: skippedLowConfidence,
        skipped_no_website: skippedNoWebsite,
        skipped_no_images: skippedNoImages,
        inserted_names: insertedNames,
        enrichment: enrichmentDetails,
        citations: allCitations,
        duration_ms: durationMs,
        min_confidence: MIN_CONFIDENCE,
        quality_gate: "tiered_image_fallback",
        optimizations: ["parallel_enrichment", "batch_dedup", "increased_volume", "tiered_images"],
      },
      issues_found: allCandidates.length,
      issues_fixed: inserted,
    };

    const { error: reportErr } = await supabase.from("kayla_agent_reports").insert(reportData);
    if (reportErr) console.error("[Kayla Auto-Discover] Report insert error:", reportErr.message);

    console.log(`[Kayla Auto-Discover] Complete: ${inserted}/${allCandidates.length} businesses added in ${durationMs}ms`);

    return new Response(
      JSON.stringify({
        success: true,
        searches: NUM_SEARCHES,
        perQueryLimit: PER_QUERY_LIMIT,
        candidates: allCandidates.length,
        viable: viableCandidates.length,
        afterDedup: dedupedCandidates.length,
        inserted,
        skippedDuplicates,
        skippedLowConfidence,
        skippedNoWebsite,
        skippedNoImages,
        insertedNames,
        enrichment: enrichmentDetails,
        durationMs,
        optimizations: ["parallel_enrichment", "batch_dedup", "increased_volume", "tiered_images"],
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
