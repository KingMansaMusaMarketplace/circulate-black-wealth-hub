import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface MentionResult {
  source_url: string;
  source_domain: string;
  title: string;
  snippet: string;
  mention_type: string;
  sentiment: string;
  sentiment_score: number;
  is_negative: boolean;
  drafted_response: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { business_id } = await req.json();

    if (!business_id) {
      return new Response(
        JSON.stringify({ error: "business_id is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const PERPLEXITY_API_KEY = Deno.env.get("PERPLEXITY_API_KEY");
    if (!PERPLEXITY_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Perplexity API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch business details
    const { data: business, error: bizError } = await supabase
      .from("businesses")
      .select("id, business_name, category, city, state, description")
      .eq("id", business_id)
      .single();

    if (bizError || !business) {
      return new Response(
        JSON.stringify({ error: "Business not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch monitor config for custom keywords
    const { data: config } = await supabase
      .from("reputation_monitor_configs")
      .select("*")
      .eq("business_id", business_id)
      .maybeSingle();

    const customKeywords = config?.custom_keywords || [];
    const excludedDomains = config?.excluded_domains || [];

    // Build search query
    const searchTerms = [
      `"${business.business_name}"`,
      ...customKeywords.map((k: string) => `"${k}"`),
    ].join(" OR ");

    const locationContext = business.city && business.state
      ? ` ${business.city} ${business.state}`
      : "";

    const query = `${searchTerms}${locationContext} reviews OR mentions OR news`;

    console.log(`Scanning reputation for: ${business.business_name}, query: ${query}`);

    // Use Perplexity to search for mentions
    const perplexityResponse = await fetch(
      "https://api.perplexity.ai/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "sonar",
          messages: [
            {
              role: "system",
              content: `You are an AI reputation monitoring agent. Search the web for recent mentions, reviews, news articles, blog posts, and social media references about a specific business. For each mention found, analyze the sentiment (positive, neutral, negative) and provide a confidence score from 0.0 to 1.0. Also draft a professional response the business owner could use.

Return your results as a JSON array of objects with these fields:
- source_url: the URL where the mention was found
- source_domain: the domain name (e.g. "yelp.com")
- title: title or headline of the mention
- snippet: a 1-2 sentence excerpt of what was said
- mention_type: one of "review", "news", "blog", "social", "forum", "directory"
- sentiment: one of "positive", "neutral", "negative"
- sentiment_score: 0.0 (very negative) to 1.0 (very positive)
- is_negative: true if sentiment is negative
- drafted_response: a professional 2-3 sentence response the owner could use

Return ONLY the JSON array, no markdown, no explanation. If no mentions found, return an empty array [].`,
            },
            {
              role: "user",
              content: `Find recent web mentions, reviews, and news about this business:

Business Name: ${business.business_name}
Category: ${business.category || "General"}
Location: ${business.city || ""}, ${business.state || ""}
Description: ${business.description || "N/A"}
${customKeywords.length > 0 ? `Also search for these keywords: ${customKeywords.join(", ")}` : ""}
${excludedDomains.length > 0 ? `Exclude results from these domains: ${excludedDomains.join(", ")}` : ""}

Search query: ${query}`,
            },
          ],
          temperature: 0.1,
          max_tokens: 4000,
        }),
      }
    );

    if (!perplexityResponse.ok) {
      const errBody = await perplexityResponse.text();
      console.error("Perplexity API error:", perplexityResponse.status, errBody);
      return new Response(
        JSON.stringify({ error: `Perplexity API error: ${perplexityResponse.status}` }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const perplexityData = await perplexityResponse.json();
    const rawContent = perplexityData.choices?.[0]?.message?.content || "[]";
    const citations = perplexityData.citations || [];

    // Parse mentions from AI response
    let mentions: MentionResult[] = [];
    try {
      // Strip markdown code fences if present
      const cleaned = rawContent.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      mentions = JSON.parse(cleaned);
      if (!Array.isArray(mentions)) mentions = [];
    } catch (e) {
      console.error("Failed to parse mentions JSON:", e, rawContent);
      mentions = [];
    }

    // Filter excluded domains
    if (excludedDomains.length > 0) {
      mentions = mentions.filter(
        (m) => !excludedDomains.some((d: string) => m.source_domain?.includes(d))
      );
    }

    // Deduplicate against existing mentions
    const { data: existingMentions } = await supabase
      .from("reputation_mentions")
      .select("source_url")
      .eq("business_id", business_id);

    const existingUrls = new Set(
      (existingMentions || []).map((m: any) => m.source_url)
    );

    const newMentions = mentions.filter((m) => !existingUrls.has(m.source_url));

    // Insert new mentions
    if (newMentions.length > 0) {
      const rows = newMentions.map((m) => ({
        business_id,
        source_url: m.source_url,
        source_domain: m.source_domain || new URL(m.source_url).hostname,
        title: m.title,
        snippet: m.snippet,
        mention_type: m.mention_type || "news",
        sentiment: m.sentiment || "neutral",
        sentiment_score: m.sentiment_score ?? 0.5,
        is_negative: m.is_negative ?? false,
        drafted_response: m.drafted_response,
        response_status: "pending",
        discovered_at: new Date().toISOString(),
      }));

      const { error: insertError } = await supabase
        .from("reputation_mentions")
        .insert(rows);

      if (insertError) {
        console.error("Error inserting mentions:", insertError);
      }
    }

    // Update last scan time
    await supabase
      .from("reputation_monitor_configs")
      .upsert(
        {
          business_id,
          last_scan_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "business_id" }
      );

    // Log to kayla event queue
    try {
      await supabase.from("kayla_event_queue").insert({
        event_type: "reputation_scan_complete",
        business_id,
        payload: {
          total_found: mentions.length,
          new_mentions: newMentions.length,
          negative_count: newMentions.filter((m) => m.is_negative).length,
          citations,
        },
        status: "completed",
      });
    } catch (e) {
      console.warn("Could not log kayla event:", e);
    }

    // Alert check: notify if negative mentions found
    const negativeMentions = newMentions.filter((m) => m.is_negative);

    const result = {
      success: true,
      business_name: business.business_name,
      total_found: mentions.length,
      new_mentions: newMentions.length,
      negative_alerts: negativeMentions.length,
      mentions: newMentions,
      citations,
    };

    console.log(
      `Reputation scan complete for ${business.business_name}: ${newMentions.length} new mentions, ${negativeMentions.length} negative`
    );

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Reputation monitor error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
