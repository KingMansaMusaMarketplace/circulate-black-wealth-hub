import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Target cities where the platform already has presence
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

// Business categories to rotate through
const CATEGORIES = [
  "Restaurant", "Barbershop", "Beauty Salon", "Bakery", "Bookstore",
  "Clothing", "Coffee Shop", "Consulting", "Fitness", "Health & Wellness",
  "Photography", "Real Estate", "Technology", "Catering", "Art Gallery",
  "Legal Services", "Accounting", "Home Services", "Auto Repair", "Florist",
];

const PLACEHOLDER_OWNER_ID = "bd72a75e-1310-4f40-9c74-380443b09d9b";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    const perplexityKey = Deno.env.get("PERPLEXITY_API_KEY");
    if (!perplexityKey) {
      throw new Error("PERPLEXITY_API_KEY not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Pick a random city and category combo for variety
    const targetCity = TARGET_CITIES[Math.floor(Math.random() * TARGET_CITIES.length)];
    const categoryFocus = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];

    console.log(`[Kayla Auto-Discover] Searching for Black-owned ${categoryFocus} businesses in ${targetCity.city}, ${targetCity.state}`);

    // Use Perplexity structured output to discover businesses
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
            content: `You are a business research assistant. Find REAL, currently operating Black-owned businesses. Only return businesses that genuinely exist with verifiable information. Do NOT invent or fabricate businesses. If you cannot find 3 real businesses, return fewer.`,
          },
          {
            role: "user",
            content: `Find 3 real, currently operating Black-owned ${categoryFocus} businesses in ${targetCity.city}, ${targetCity.state}. For each, provide the business name, a brief description, category, street address, city, state, zip code, phone number, email, and website URL. Only include businesses you are confident are real and currently open.`,
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
                      description: { type: "string", description: "2-3 sentence description" },
                      category: { type: "string", description: "Business category" },
                      address: { type: "string", description: "Street address" },
                      city: { type: "string" },
                      state: { type: "string", description: "2-letter state code" },
                      zip_code: { type: "string" },
                      phone: { type: "string" },
                      email: { type: "string" },
                      website: { type: "string" },
                      confidence: { type: "number", description: "0-1 confidence this is a real business" },
                    },
                    required: ["name", "city", "state"],
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

    for (const biz of businesses) {
      if (!biz.name || !biz.city) {
        console.log(`[Kayla Auto-Discover] Skipping - missing name or city`);
        continue;
      }

      // Confidence threshold for auto-verification
      const confidence = biz.confidence ?? 0.5;
      if (confidence < 0.4) {
        console.log(`[Kayla Auto-Discover] Skipping "${biz.name}" - low confidence: ${confidence}`);
        skippedLowConfidence++;
        continue;
      }

      // Deduplication: check if business with same name in same city already exists
      const { data: existing } = await supabase
        .from("businesses")
        .select("id, name")
        .ilike("name", biz.name.trim())
        .ilike("city", biz.city.trim())
        .limit(1);

      if (existing && existing.length > 0) {
        console.log(`[Kayla Auto-Discover] Skipping "${biz.name}" - already exists (${existing[0].id})`);
        skippedDuplicates++;
        continue;
      }

      // Also check b2b_external_leads for duplicates
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

      // Auto-verify if confidence is high enough
      const isVerified = confidence >= 0.7;

      const { error: insertErr } = await supabase.from("businesses").insert({
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
        website: biz.website || "",
        owner_id: PLACEHOLDER_OWNER_ID,
        is_verified: isVerified,
        source_citations: citations.length > 0 ? citations : null,
      });

      if (insertErr) {
        console.error(`[Kayla Auto-Discover] Insert error for "${biz.name}":`, insertErr.message);
        continue;
      }

      inserted++;
      insertedNames.push(biz.name);
      console.log(`[Kayla Auto-Discover] ✅ Added "${biz.name}" (confidence: ${confidence}, verified: ${isVerified})`);
    }

    // Log report to kayla_agent_reports
    const durationMs = Date.now() - startTime;
    const reportData = {
      service_name: "auto_discover",
      run_type: "scheduled",
      status: "completed",
      summary: `Discovered ${businesses.length} candidates in ${targetCity.city}, ${targetCity.state} (${categoryFocus}). Inserted: ${inserted}, Duplicates skipped: ${skippedDuplicates}, Low confidence skipped: ${skippedLowConfidence}.`,
      details: {
        target_city: targetCity,
        category_focus: categoryFocus,
        candidates_found: businesses.length,
        inserted,
        skipped_duplicates: skippedDuplicates,
        skipped_low_confidence: skippedLowConfidence,
        inserted_names: insertedNames,
        citations,
        duration_ms: durationMs,
      },
      items_processed: businesses.length,
      items_fixed: inserted,
      duration_ms: durationMs,
    };

    await supabase.from("kayla_agent_reports").insert(reportData);

    console.log(`[Kayla Auto-Discover] Complete: ${inserted} businesses added in ${durationMs}ms`);

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
        durationMs,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("[Kayla Auto-Discover] Error:", errMsg);

    // Try to log failure
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
