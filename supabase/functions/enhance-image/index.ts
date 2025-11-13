import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrl, businessContext, currentTitle, currentDescription } = await req.json();
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const systemPrompt = `You are an AI image enhancement assistant for a business product catalog. Analyze the provided image and business context to generate optimized content for SEO and user engagement.

Your tasks:
1. Generate SEO-optimized alt text (descriptive, keyword-rich, under 125 characters)
2. Suggest an engaging product title (compelling, clear, under 60 characters)
3. Create a detailed product description (informative, persuasive, 100-200 words)
4. Provide image quality assessment and improvement suggestions
5. Suggest relevant tags/keywords for categorization
6. Recommend optimal pricing strategy context

Consider:
- Business type and target audience
- SEO best practices for product images
- Accessibility requirements for alt text
- Marketing appeal and conversion optimization
- Local business context and community appeal`;

    const userPrompt = `Analyze this product image and enhance its marketing content:

Image URL: ${imageUrl}
Business Context: ${JSON.stringify(businessContext, null, 2)}
Current Title: ${currentTitle || 'Not provided'}
Current Description: ${currentDescription || 'Not provided'}

Please provide comprehensive enhancements for this product image.`;

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

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
          { 
            role: 'user', 
            content: [
              { type: 'text', text: userPrompt },
              { 
                type: 'image_url', 
                image_url: { url: imageUrl }
              }
            ]
          }
        ],
        tools: [{
          type: "function",
          function: {
            name: "enhance_product_image",
            description: "Generate enhanced content and analysis for a product image",
            parameters: {
              type: "object",
              properties: {
                seoAltText: { 
                  type: "string", 
                  description: "SEO-optimized alt text under 125 characters"
                },
                suggestedTitle: { 
                  type: "string", 
                  description: "Engaging product title under 60 characters"
                },
                enhancedDescription: { 
                  type: "string", 
                  description: "Detailed product description 100-200 words"
                },
                qualityAssessment: {
                  type: "object",
                  properties: {
                    overallScore: { type: "number", minimum: 1, maximum: 10 },
                    strengths: { type: "array", items: { type: "string" } },
                    improvements: { type: "array", items: { type: "string" } },
                    technicalIssues: { type: "array", items: { type: "string" } }
                  }
                },
                suggestedTags: {
                  type: "array",
                  items: { type: "string" },
                  description: "Relevant tags for categorization"
                },
                keywordSuggestions: {
                  type: "array", 
                  items: { type: "string" },
                  description: "SEO keywords for the product"
                },
                pricingContext: {
                  type: "object",
                  properties: {
                    suggestedRange: { type: "string" },
                    reasoning: { type: "string" },
                    competitiveFactors: { type: "array", items: { type: "string" } }
                  }
                },
                marketingAngles: {
                  type: "array",
                  items: { type: "string" },
                  description: "Different marketing approaches for this product"
                }
              },
              required: [
                "seoAltText", 
                "suggestedTitle", 
                "enhancedDescription", 
                "qualityAssessment",
                "suggestedTags",
                "keywordSuggestions",
                "pricingContext",
                "marketingAngles"
              ]
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "enhance_product_image" } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API Error:', response.status, errorText);
      throw new Error(`AI API request failed: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices[0]?.message?.tool_calls?.[0];
    
    if (!toolCall) {
      throw new Error('No image enhancement generated');
    }

    const enhancement = JSON.parse(toolCall.function.arguments);
    
    console.log('Generated image enhancement:', enhancement);

    return new Response(JSON.stringify({
      success: true,
      enhancement,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in enhance-image function:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      enhancement: null
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});