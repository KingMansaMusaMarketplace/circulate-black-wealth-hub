import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const { businessName, category, city, state, currentDescription, businessType } = await req.json();

    console.log('Generating description for:', { businessName, category, city, state, businessType });

    // Validate required fields
    if (!businessName || !category) {
      return new Response(
        JSON.stringify({ error: 'Business name and category are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Create AI prompt for business description generation
    const systemPrompt = `You are an expert copywriter specializing in creating compelling business descriptions for Black-owned businesses in the Mansa Musa Marketplace. Your goal is to:

1. Highlight the unique value proposition and community impact
2. Emphasize quality, authenticity, and cultural connection
3. Include location relevance when provided
4. Create descriptions that attract customers and build trust
5. Keep descriptions engaging, professional, and between 100-200 words
6. Focus on what makes this business special in serving the community

Guidelines:
- Use inclusive, welcoming language
- Highlight community connection and Black ownership pride
- Mention specific services/products when category is provided
- Include location context when city/state are provided
- Create urgency and desire to visit/support
- Avoid generic corporate language`;

    const userPrompt = `Generate a compelling business description for:

Business Name: ${businessName}
Category: ${category}
Location: ${city ? `${city}, ${state || ''}` : 'Not specified'}
Business Type: ${businessType || 'Not specified'}
${currentDescription ? `Current Description (for reference/improvement): ${currentDescription}` : ''}

Create a description that will make potential customers excited to visit and support this Black-owned business.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.8,
        max_tokens: 300
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const generatedDescription = data.choices?.[0]?.message?.content;

    if (!generatedDescription) {
      throw new Error('No description generated from AI');
    }

    console.log('Successfully generated description');

    return new Response(
      JSON.stringify({ 
        success: true,
        description: generatedDescription.trim(),
        businessName,
        category
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in generate-business-description function:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        details: 'Failed to generate business description'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});