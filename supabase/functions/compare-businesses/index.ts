/**
 * PATENT-PROTECTED IMPLEMENTATION
 * 
 * This edge function implements claims from:
 * "System and Method for a Multi-Tenant Vertical Marketplace Operating System"
 * 
 * CLAIM 10: AI-Powered Personalized Business Recommendation Engine
 * A computer-implemented system for generating personalized business comparisons
 * using artificial intelligence, comprising:
 * - Multi-dimensional business attribute extraction
 * - AI-driven comparative analysis with structured output
 * - Use-case based recommendation generation
 * - Value proposition scoring across multiple factors
 * 
 * Protected Elements:
 * - Structured AI tool calling with compare_businesses function schema
 * - Multi-factor comparison including services, pricing, experience, location
 * - Best-fit use case recommendations with reasoning
 * - Integration with Lovable AI Gateway for model abstraction
 * 
 * © 2024-2025 1325.ai - All Rights Reserved
 * Filing Date: January 2025
 */

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
    const { businessIds } = await req.json();
    
    if (!businessIds || businessIds.length < 2) {
      return new Response(
        JSON.stringify({ error: 'At least 2 business IDs are required for comparison' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch business details
    const { data: businesses, error: fetchError } = await supabaseClient
      .from('businesses')
      .select('id, name, business_name, category, description, city, state, average_rating, review_count, website, phone, email')
      .in('id', businessIds);

    if (fetchError || !businesses) {
      console.error('Error fetching businesses:', fetchError);
      throw new Error('Failed to fetch business details');
    }

    const systemPrompt = `You are an AI business analyst helping users compare Black-owned businesses. Provide objective, detailed comparisons highlighting:
1. Key differentiators and unique selling points
2. Service/product offerings comparison
3. Pricing and value propositions
4. Customer experience and ratings analysis
5. Location and accessibility comparison
6. Recommendations based on different use cases

Be fair, objective, and highlight the strengths of each business. Help users make informed decisions.`;

    const userPrompt = `Compare these businesses and provide detailed insights:

${businesses.map((b, i) => `
Business ${i + 1}: ${b.business_name || b.name}
Category: ${b.category || 'Not specified'}
Location: ${b.city}, ${b.state}
Rating: ${b.average_rating || 'N/A'} (${b.review_count || 0} reviews)
Description: ${b.description || 'Not provided'}
`).join('\n')}

Provide a structured comparison with:
1. Quick comparison summary (2-3 sentences)
2. Detailed feature-by-feature comparison
3. Best suited for (different customer needs)
4. Value proposition analysis
5. Final recommendations`;

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Calling AI for business comparison...');
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
          type: "function",
          function: {
            name: "compare_businesses",
            description: "Generate structured business comparison",
            parameters: {
              type: "object",
              properties: {
                summary: { 
                  type: "string", 
                  description: "Quick 2-3 sentence comparison summary"
                },
                comparison: {
                  type: "object",
                  description: "Feature-by-feature comparison",
                  properties: {
                    services: { type: "string" },
                    pricing: { type: "string" },
                    experience: { type: "string" },
                    location: { type: "string" }
                  }
                },
                bestFor: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      businessName: { type: "string" },
                      useCase: { type: "string" },
                      reason: { type: "string" }
                    }
                  }
                },
                valueAnalysis: { type: "string" },
                recommendation: { type: "string" }
              },
              required: ["summary", "comparison", "bestFor", "valueAnalysis", "recommendation"]
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "compare_businesses" } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI response received');

    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error('No comparison generated');
    }

    const comparisonData = JSON.parse(toolCall.function.arguments);

    return new Response(
      JSON.stringify({
        success: true,
        businesses: businesses,
        comparison: comparisonData
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in compare-businesses:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
