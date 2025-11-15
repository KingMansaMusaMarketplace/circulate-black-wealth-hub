import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { productName, category, price, businessContext, imageUrl } = await req.json();

    if (!productName) {
      return new Response(
        JSON.stringify({ error: 'Product name is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = `You are an expert product copywriter specializing in creating compelling product descriptions for Black-owned businesses. Your descriptions should be:
- Engaging and persuasive
- SEO-optimized with natural keyword usage
- Focused on benefits, not just features
- Authentic and culturally relevant
- Action-oriented to drive conversions
- Between 80-150 words

Consider the business context, pricing, and product category to craft the perfect description.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { 
        role: 'user', 
        content: imageUrl ? [
          {
            type: 'text',
            text: `Generate a compelling product description for:

Product: ${productName}
${category ? `Category: ${category}` : ''}
${price ? `Price: ${price}` : ''}
${businessContext ? `Business Context: ${JSON.stringify(businessContext)}` : ''}

Create a description that highlights the product's unique value and appeals to customers.`
          },
          {
            type: 'image_url',
            image_url: { url: imageUrl }
          }
        ] : `Generate a compelling product description for:

Product: ${productName}
${category ? `Category: ${category}` : ''}
${price ? `Price: ${price}` : ''}
${businessContext ? `Business Context: ${JSON.stringify(businessContext)}` : ''}

Create a description that highlights the product's unique value and appeals to customers.`
      }
    ];

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Generating product description with AI...');
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: imageUrl ? 'google/gemini-2.5-pro' : 'google/gemini-2.5-flash',
        messages,
        tools: [{
          type: "function",
          function: {
            name: "generate_product_description",
            description: "Generate compelling product description with SEO suggestions",
            parameters: {
              type: "object",
              properties: {
                description: { 
                  type: "string", 
                  description: "Compelling 80-150 word product description"
                },
                suggestedTags: {
                  type: "array",
                  items: { type: "string" },
                  description: "5-7 relevant SEO tags"
                },
                keyFeatures: {
                  type: "array",
                  items: { type: "string" },
                  description: "3-5 key product features or benefits"
                },
                targetAudience: {
                  type: "string",
                  description: "Primary target audience for this product"
                },
                seoKeywords: {
                  type: "array",
                  items: { type: "string" },
                  description: "Top 5 SEO keywords to include"
                }
              },
              required: ["description", "suggestedTags", "keyFeatures", "targetAudience", "seoKeywords"]
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "generate_product_description" } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Description generated successfully');

    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error('No description generated');
    }

    const descriptionData = JSON.parse(toolCall.function.arguments);

    return new Response(
      JSON.stringify({
        success: true,
        ...descriptionData
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating product description:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
