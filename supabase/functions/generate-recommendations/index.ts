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
    const { userId } = await req.json();
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Get user's interaction history and preferences
    const { data: userProfile } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    const { data: userPreferences } = await supabaseClient
      .from('user_discovery_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    const { data: recentTransactions } = await supabaseClient
      .from('transactions')
      .select('*, businesses(*)')
      .eq('customer_id', userId)
      .order('transaction_date', { ascending: false })
      .limit(10);

    const { data: recentScans } = await supabaseClient
      .from('qr_scans')
      .select('*, businesses(*)')
      .eq('customer_id', userId)
      .order('scan_date', { ascending: false })
      .limit(10);

    const { data: allBusinesses } = await supabaseClient
      .from('businesses')
      .select('*')
      .eq('subscription_status', 'active')
      .order('average_rating', { ascending: false });

    // Prepare context for AI
    const userContext = {
      location: userProfile ? {
        city: userProfile.city,
        state: userProfile.state,
        zipCode: userProfile.zip_code
      } : null,
      preferences: userPreferences ? {
        maxDistance: userPreferences.max_distance,
        priceRange: {
          min: userPreferences.price_range_min,
          max: userPreferences.price_range_max
        },
        interests: userPreferences.interests,
        preferredCategories: userPreferences.preferred_categories
      } : null,
      recentActivity: {
        visitedBusinesses: recentTransactions?.map(t => ({
          name: t.businesses?.business_name,
          category: t.businesses?.category,
          amount: t.amount,
          date: t.transaction_date
        })) || [],
        scannedBusinesses: recentScans?.map(s => ({
          name: s.businesses?.business_name,
          category: s.businesses?.category,
          date: s.scan_date
        })) || []
      }
    };

    const systemPrompt = `You are an AI recommendation engine for a local business discovery platform. Analyze the user's data and generate personalized business recommendations.

Consider:
- User's location and preferred travel distance
- Price range preferences
- Interest categories and past business interactions
- Seasonal trends and local events
- Business ratings and verification status

Generate 6-8 highly relevant business recommendations with specific reasons why each business matches the user's preferences.`;

    const userPrompt = `Based on this user data, recommend businesses:

User Context:
${JSON.stringify(userContext, null, 2)}

Available Businesses:
${JSON.stringify(allBusinesses?.slice(0, 50), null, 2)}

Generate personalized recommendations with:
1. Business selection reasoning
2. Match score (1-10)
3. Specific recommendation reason
4. Expected experience description`;

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
          { role: 'user', content: userPrompt }
        ],
        tools: [{
          type: "function",
          function: {
            name: "generate_recommendations",
            description: "Generate personalized business recommendations",
            parameters: {
              type: "object",
              properties: {
                recommendations: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      businessId: { type: "string" },
                      businessName: { type: "string" },
                      category: { type: "string" },
                      matchScore: { type: "number", minimum: 1, maximum: 10 },
                      reason: { type: "string" },
                      expectedExperience: { type: "string" },
                      recommendationType: { 
                        type: "string", 
                        enum: ["trending", "personalized", "nearby", "similar", "new", "seasonal"]
                      }
                    },
                    required: ["businessId", "businessName", "category", "matchScore", "reason", "expectedExperience", "recommendationType"]
                  }
                },
                summary: { type: "string" },
                confidence: { type: "number", minimum: 0, maximum: 1 }
              },
              required: ["recommendations", "summary", "confidence"]
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "generate_recommendations" } }
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
      throw new Error('No recommendations generated');
    }

    const recommendations = JSON.parse(toolCall.function.arguments);
    
    console.log('Generated recommendations:', recommendations);

    return new Response(JSON.stringify(recommendations), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-recommendations function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      recommendations: [],
      summary: "Unable to generate recommendations at this time",
      confidence: 0
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});