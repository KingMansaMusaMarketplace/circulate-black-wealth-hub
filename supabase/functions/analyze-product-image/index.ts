import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-csrf-token',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrl, imageBase64, businessContext } = await req.json();

    const imageInput = imageBase64
      ? `data:image/jpeg;base64,${imageBase64}`
      : imageUrl;

    if (!imageInput) {
      return new Response(
        JSON.stringify({ error: 'imageUrl or imageBase64 required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY not configured');

    const systemPrompt = `You are an expert product cataloger for a Black-owned business marketplace. Looking at a product photo, extract structured product details. Be specific, culturally relevant, and conversion-focused. For pricing, give a realistic suggested USD range based on what you see.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-pro',
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analyze this product photo and extract catalog details.${businessContext ? ` Business context: ${JSON.stringify(businessContext)}` : ''}`
              },
              { type: 'image_url', image_url: { url: imageInput } }
            ]
          }
        ],
        tools: [{
          type: 'function',
          function: {
            name: 'extract_product_details',
            description: 'Extract structured product info from a photo',
            parameters: {
              type: 'object',
              properties: {
                title: { type: 'string', description: 'Concise product name (3-6 words)' },
                category: { type: 'string', description: 'One of: Apparel, Beauty, Food, Art, Jewelry, Home, Wellness, Tech, Service, Other' },
                description: { type: 'string', description: '80-150 word compelling description' },
                suggestedPrice: { type: 'string', description: 'USD price or range, e.g. "$24.99" or "Starting at $50"' },
                tags: { type: 'array', items: { type: 'string' }, description: '5-7 SEO tags' },
                altText: { type: 'string', description: 'SEO alt text under 125 chars' },
                confidence: { type: 'number', description: '0-1 confidence in identification' }
              },
              required: ['title', 'category', 'description', 'suggestedPrice', 'tags', 'altText', 'confidence']
            }
          }
        }],
        tool_choice: { type: 'function', function: { name: 'extract_product_details' } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit reached. Try again shortly.' }), { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits exhausted. Add credits in Workspace settings.' }), { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      throw new Error(`AI error: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error('No analysis returned');

    const result = JSON.parse(toolCall.function.arguments);

    return new Response(
      JSON.stringify({ success: true, ...result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('analyze-product-image error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
