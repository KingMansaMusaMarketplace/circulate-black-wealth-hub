import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, userLocation } = await req.json();
    
    if (!query || query.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Query is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const systemPrompt = `You are a search query parser for a Black business directory. Extract structured search parameters from natural language queries.

Available categories: Restaurant, Cafe, Bakery, Grocery, Clothing, Beauty, Barbershop, Salon, Fitness, Health, Tech, Services, Retail, Entertainment, Education, Real Estate, Finance, Legal, Other

Return ONLY the structured data, no explanations.`;

    const userPrompt = `Parse this search query: "${query}"
${userLocation ? `User location: ${userLocation.city || 'Unknown'}` : ''}

Extract:
- searchTerm: main keyword/business name (string)
- category: business category if mentioned (string or null)
- distance: max distance in miles if mentioned (number or null)  
- priceRange: if mentioned as $ ($), $$ ($$), $$$ ($$$), $$$$ ($$$$) (string or null)
- features: array of features like "open now", "delivery", "outdoor seating", etc (array or empty)
- rating: minimum rating if mentioned (number or null)
- discount: true if user mentions deals/discounts (boolean)`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        tools: [{
          type: 'function',
          function: {
            name: 'parse_search',
            description: 'Parse natural language search query into structured filters',
            parameters: {
              type: 'object',
              properties: {
                searchTerm: { type: 'string' },
                category: { type: 'string' },
                distance: { type: 'number' },
                priceRange: { type: 'string', enum: ['$', '$$', '$$$', '$$$$'] },
                features: { type: 'array', items: { type: 'string' } },
                rating: { type: 'number' },
                discount: { type: 'boolean' }
              },
              required: ['searchTerm'],
              additionalProperties: false
            }
          }
        }],
        tool_choice: { type: 'function', function: { name: 'parse_search' } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits to your workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      throw new Error('AI API request failed');
    }

    const data = await response.json();
    console.log('AI response:', JSON.stringify(data, null, 2));

    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error('No tool call in AI response');
    }

    const parsedQuery = JSON.parse(toolCall.function.arguments);
    
    return new Response(
      JSON.stringify({
        originalQuery: query,
        parsed: parsedQuery
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in parse-search-query:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
