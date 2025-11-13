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
    const { userLocation, userPreferences, browsingHistory, limit = 5 } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch businesses from database
    let query = supabase
      .from('businesses')
      .select('id, business_name, description, category, city, state, address, average_rating, logo_url, banner_url')
      .eq('is_verified', true)
      .limit(50);

    // Filter by location if provided
    if (userLocation?.city) {
      query = query.eq('city', userLocation.city);
    }

    const { data: businesses, error: dbError } = await query;

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to fetch businesses');
    }

    if (!businesses || businesses.length === 0) {
      return new Response(JSON.stringify({ recommendations: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Build context for AI
    const businessList = businesses.map((b, idx) => 
      `${idx + 1}. ${b.business_name} - ${b.category || 'General'} (${b.city}, ${b.state}) - Rating: ${b.average_rating || 'N/A'}\n   Description: ${b.description || 'No description'}`
    ).join('\n\n');

    const systemPrompt = `You are an AI recommendation engine for Mansa Musa Marketplace, a platform dedicated to promoting Black-owned businesses and circulating wealth within the Black community.

Your goal is to provide personalized business recommendations that match user preferences and needs while supporting the mission of economic empowerment.

Consider:
- User location and proximity
- User's stated preferences and interests
- Browsing history patterns
- Business ratings and quality
- Category diversity in recommendations
- Supporting lesser-known but quality businesses alongside popular ones

Return ONLY a JSON array with the top ${limit} business IDs in order of recommendation strength, with a brief reason for each. Format:
[
  {"id": "business-id-1", "reason": "Perfect match because..."},
  {"id": "business-id-2", "reason": "Great option because..."}
]`;

    const userContext = `
User Location: ${userLocation?.city || 'Not specified'}, ${userLocation?.state || ''}
User Preferences: ${userPreferences?.categories?.join(', ') || 'Not specified'}
Recent Browsing: ${browsingHistory?.map((b: any) => b.category).join(', ') || 'No history'}

Available Businesses:
${businessList}`;

    console.log('Requesting AI recommendations...');

    // Call Lovable AI
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
          { role: 'user', content: userContext }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('AI API error:', error);
      throw new Error('Failed to generate recommendations');
    }

    const aiResult = await response.json();
    const aiContent = aiResult.choices[0].message.content;
    
    console.log('AI response:', aiContent);

    // Parse AI response
    let recommendedIds;
    try {
      // Extract JSON from response (handle markdown code blocks)
      const jsonMatch = aiContent.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        recommendedIds = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in AI response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Fallback to random selection
      recommendedIds = businesses
        .sort(() => Math.random() - 0.5)
        .slice(0, limit)
        .map(b => ({ id: b.id, reason: 'Featured business in your area' }));
    }

    // Get full business details for recommended IDs
    const recommendations = recommendedIds
      .map((rec: any) => {
        const business = businesses.find(b => b.id === rec.id);
        return business ? { ...business, recommendationReason: rec.reason } : null;
      })
      .filter((b: any) => b !== null);

    return new Response(JSON.stringify({ recommendations }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
