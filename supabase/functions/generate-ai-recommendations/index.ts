import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

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
    
    if (!userId) {
      throw new Error('User ID is required');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('[AI Recommendations] Generating for user:', userId);

    // Get user preferences
    const { data: preferences } = await supabaseClient
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    // Get user interaction history
    const { data: interactions } = await supabaseClient
      .from('business_interactions')
      .select(`
        business_id,
        interaction_type,
        interaction_score,
        created_at,
        businesses (
          business_name,
          category,
          city,
          state
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);

    // Get all businesses
    const { data: businesses } = await supabaseClient
      .from('businesses')
      .select('id, business_name, category, city, state, description, is_verified, average_rating')
      .eq('is_verified', true)
      .order('average_rating', { ascending: false })
      .limit(100);

    // Prepare context for AI
    const userContext = {
      preferences: preferences || {},
      recentInteractions: interactions || [],
      availableBusinesses: businesses || []
    };

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Generate AI recommendations
    const systemPrompt = `You are a personalized business recommendation engine for a Black-owned business marketplace.
Your goal is to recommend businesses that the user will love based on their preferences and behavior.

Consider:
1. User's preferred categories and locations
2. Past interaction patterns
3. Business ratings and quality
4. Geographic proximity to user's preferred areas
5. Diversity of recommendations

Provide exactly 5 business recommendations with scores 0.75-1.00.`;

    const userPrompt = `User Context:
${JSON.stringify(userContext, null, 2)}

Please recommend 5 businesses that would be perfect for this user. Return JSON format:
{
  "recommendations": [
    {
      "business_id": "uuid",
      "score": 0.95,
      "reason": "Brief compelling reason why this is a great match"
    }
  ]
}`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
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
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('[AI Recommendations] AI API error:', aiResponse.status, errorText);
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices[0].message.content;
    
    // Parse AI response
    let recommendations;
    try {
      const parsed = JSON.parse(aiContent);
      recommendations = parsed.recommendations;
    } catch (parseError) {
      console.error('[AI Recommendations] Failed to parse AI response:', aiContent);
      throw new Error('Failed to parse AI recommendations');
    }

    // Store recommendations in database
    const recommendationsToStore = recommendations.map((rec: any) => ({
      user_id: userId,
      business_id: rec.business_id,
      recommendation_score: rec.score,
      recommendation_reason: rec.reason,
      metadata: { generated_at: new Date().toISOString() }
    }));

    // Delete old recommendations
    await supabaseClient
      .from('ai_recommendations')
      .delete()
      .eq('user_id', userId);

    // Insert new recommendations
    const { error: insertError } = await supabaseClient
      .from('ai_recommendations')
      .insert(recommendationsToStore);

    if (insertError) {
      console.error('[AI Recommendations] Error storing recommendations:', insertError);
      throw insertError;
    }

    console.log('[AI Recommendations] Successfully generated', recommendations.length, 'recommendations');

    return new Response(
      JSON.stringify({
        success: true,
        recommendations,
        count: recommendations.length
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('[AI Recommendations] Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
