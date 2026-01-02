import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

/**
 * B2B Web Search Edge Function - Perplexity Integration with 24hr Caching
 * 
 * PATENT PROTECTED - Provisional Application Filed
 * ================================================
 * Multi-AI architecture for discovering Black-owned B2B suppliers
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WebSearchRequest {
  query: string;
  category?: string;
  location?: string;
  limit?: number;
}

interface DiscoveredBusiness {
  name: string;
  description: string;
  category: string;
  location?: string;
  website?: string;
  contact?: {
    email?: string;
    phone?: string;
    linkedin?: string;
  };
  confidence: number;
}

interface WebSearchResponse {
  businesses: DiscoveredBusiness[];
  citations: string[];
  query: string;
  searchedAt: string;
  cached: boolean;
}

// Create a simple hash for cache key
function hashQuery(query: string, category?: string, location?: string): string {
  const str = `${query.toLowerCase().trim()}|${category || ''}|${location || ''}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const PERPLEXITY_API_KEY = Deno.env.get('PERPLEXITY_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!PERPLEXITY_API_KEY) {
      console.error('PERPLEXITY_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'Perplexity API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { query, category, location, limit = 5 }: WebSearchRequest = await req.json();

    if (!query || query.trim().length < 3) {
      return new Response(
        JSON.stringify({ error: 'Query must be at least 3 characters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`B2B Web Search: query="${query}", category="${category}", location="${location}"`);

    // Create Supabase client for caching
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    const queryHash = hashQuery(query, category, location);

    // Check cache first
    const { data: cachedResult } = await supabase
      .from('b2b_web_search_cache')
      .select('*')
      .eq('query_hash', queryHash)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (cachedResult) {
      console.log('Returning cached result for query:', query);
      const response: WebSearchResponse = {
        businesses: cachedResult.results as DiscoveredBusiness[],
        citations: cachedResult.citations || [],
        query,
        searchedAt: cachedResult.created_at,
        cached: true,
      };
      return new Response(
        JSON.stringify(response),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build optimized search prompt
    const searchPrompt = buildSearchPrompt(query, category, location, limit);

    // Call Perplexity API
    const perplexityResponse = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [
          {
            role: 'system',
            content: `You are a B2B sourcing expert specializing in finding Black-owned businesses and minority-owned enterprises. Your goal is to help businesses find suppliers within their community to support economic circularity.

IMPORTANT: Return your response as a valid JSON object with this exact structure:
{
  "businesses": [
    {
      "name": "Business Name",
      "description": "Brief description of what they offer",
      "category": "Business category",
      "location": "City, State",
      "website": "https://example.com",
      "contact": {
        "email": "email@example.com",
        "phone": "555-123-4567",
        "linkedin": "linkedin.com/company/name"
      },
      "confidence": 0.9
    }
  ]
}

Only include businesses you're confident are Black-owned or minority-owned. Set confidence between 0.5-1.0 based on how certain you are. Omit contact fields if unknown.`
          },
          {
            role: 'user',
            content: searchPrompt
          }
        ],
        temperature: 0.1,
        max_tokens: 2000,
      }),
    });

    if (!perplexityResponse.ok) {
      const errorText = await perplexityResponse.text();
      console.error('Perplexity API error:', perplexityResponse.status, errorText);
      
      if (perplexityResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'Failed to search web for suppliers' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const perplexityData = await perplexityResponse.json();
    console.log('Perplexity response received');

    const content = perplexityData.choices?.[0]?.message?.content || '';
    const citations = perplexityData.citations || [];

    // Parse response
    let businesses: DiscoveredBusiness[] = [];
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        businesses = parsed.businesses || [];
      }
    } catch (parseError) {
      console.error('Failed to parse Perplexity response:', parseError);
      businesses = [];
    }

    // Filter and validate
    businesses = businesses
      .filter(b => b.name && b.name.length > 0)
      .slice(0, limit)
      .map(b => ({
        ...b,
        confidence: Math.min(Math.max(b.confidence || 0.5, 0), 1),
        category: b.category || category || 'Other',
      }));

    // Store in cache (24hr TTL)
    await supabase
      .from('b2b_web_search_cache')
      .upsert({
        query_hash: queryHash,
        query_text: query,
        category,
        location,
        results: businesses,
        citations: citations.slice(0, 10),
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      }, {
        onConflict: 'query_hash'
      });

    const response: WebSearchResponse = {
      businesses,
      citations: citations.slice(0, 10),
      query,
      searchedAt: new Date().toISOString(),
      cached: false,
    };

    console.log(`Found ${businesses.length} potential Black-owned suppliers (cached for 24hrs)`);

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in b2b-web-search:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function buildSearchPrompt(query: string, category?: string, location?: string, limit?: number): string {
  const parts = [
    `Find ${limit || 5} Black-owned or minority-owned businesses that provide:`,
    `"${query}"`,
  ];

  if (category && category !== 'all') {
    parts.push(`Category: ${category}`);
  }

  if (location) {
    parts.push(`Location preference: ${location} area or nationwide`);
  }

  parts.push(`
Focus on finding:
1. Established Black-owned B2B suppliers
2. Certified minority-owned enterprises (MBE, NMSDC certified)
3. Businesses listed in Black business directories

For each business found, provide:
- Company name
- What they offer (description)
- Their category
- Location
- Website if available
- Contact information if publicly available

Only include businesses you're confident are Black-owned or minority-owned.`);

  return parts.join('\n');
}
