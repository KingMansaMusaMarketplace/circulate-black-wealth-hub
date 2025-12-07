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
    const { userId, period = 'month' } = await req.json();
    
    if (!userId) {
      throw new Error('User ID is required');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Calculate date range
    const now = new Date();
    const startDate = new Date(now);
    if (period === 'month') {
      startDate.setMonth(now.getMonth() - 1);
    } else if (period === 'year') {
      startDate.setFullYear(now.getFullYear() - 1);
    } else {
      startDate.setDate(now.getDate() - 7); // week
    }

    console.log('Fetching transactions for user:', userId);

    // Fetch user transactions from the existing transactions table
    const { data: transactions, error: transError } = await supabase
      .from('transactions')
      .select('amount, created_at, business_id')
      .eq('customer_id', userId)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });

    if (transError) {
      console.error('Transaction fetch error:', transError);
      // Continue with empty data instead of throwing
    }

    // Fetch user business interactions/visits
    const { data: interactions, error: interactionsError } = await supabase
      .from('business_interactions')
      .select('business_id, created_at, interaction_type')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString());

    if (interactionsError) {
      console.error('Interactions fetch error:', interactionsError);
      // Continue with empty data
    }

    // Fetch aggregate community metrics
    const { data: communityData, error: communityError } = await supabase
      .from('community_aggregate_metrics')
      .select('*')
      .gte('period_start', startDate.toISOString().split('T')[0])
      .order('period_start', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (communityError) {
      console.error('Community metrics fetch error:', communityError);
    }

    // Get total verified businesses count
    const { count: businessCount } = await supabase
      .from('businesses')
      .select('*', { count: 'exact', head: true })
      .eq('is_verified', true);

    // Get total users count
    const { count: userCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    // Calculate user statistics
    const safeTransactions = transactions || [];
    const safeInteractions = interactions || [];
    
    const totalSpent = safeTransactions.reduce((sum, t) => sum + parseFloat(t.amount?.toString() || '0'), 0);
    const uniqueBusinesses = new Set(safeTransactions.map(t => t.business_id).filter(Boolean)).size;
    const totalVisits = safeInteractions.length;
    const transactionCount = safeTransactions.length;

    // Fetch business names for context
    const businessIds = Array.from(new Set([
      ...safeTransactions.map(t => t.business_id),
      ...safeInteractions.map(i => i.business_id)
    ].filter(Boolean)));
    
    let businessNames: any[] = [];
    if (businessIds.length > 0) {
      const { data: businesses } = await supabase
        .from('businesses')
        .select('id, business_name, category')
        .in('id', businessIds);
      businessNames = businesses || [];
    }

    // Calculate community totals from transactions
    const { data: allTransactions } = await supabase
      .from('transactions')
      .select('amount')
      .gte('created_at', startDate.toISOString());

    const totalCirculation = allTransactions?.reduce((sum, t) => sum + parseFloat(t.amount?.toString() || '0'), 0) || 0;

    const systemPrompt = `You are an AI storyteller for Mansa Musa Marketplace, a platform dedicated to circulating wealth within the Black community. Your goal is to create inspiring, personalized impact stories that make users feel proud of their contribution to economic empowerment.

Generate a compelling impact report that:
1. Celebrates their specific contributions with enthusiasm
2. Shows concrete economic impact with real numbers
3. Connects individual actions to broader community benefit
4. Uses inspiring language about wealth building and economic power
5. References Mansa Musa's legacy of wealth and prosperity
6. Makes them feel like heroes in the economic empowerment movement

Be warm, uplifting, and motivational. Use emojis occasionally but not excessively. Focus on transformation and collective power.`;

    const userContext = `
Period: ${period === 'month' ? 'This Month' : period === 'year' ? 'This Year' : 'This Week'}

USER'S PERSONAL IMPACT:
- Total Amount Circulated: $${totalSpent.toFixed(2)}
- Black-Owned Businesses Supported: ${uniqueBusinesses}
- Business Visits/Discoveries: ${totalVisits}
- Transactions Made: ${transactionCount}
- Businesses Supported: ${businessNames.map(b => `${b.business_name} (${b.category})`).join(', ') || 'None yet'}

COMMUNITY COLLECTIVE IMPACT:
- Total Community Circulation: $${totalCirculation.toFixed(2)}
- Active Community Members: ${userCount || 0}
- Businesses on Platform: ${businessCount || 0}
- Average Dollar Circulation Time: 6 hours (building momentum)

Generate a personalized impact story that celebrates their contribution and motivates continued engagement. Include:
1. A powerful opening statement about their impact
2. Specific numbers and achievements
3. Connection to the broader community movement
4. A forward-looking encouragement to continue

Keep it under 200 words but make every word count.`;

    console.log('Requesting AI impact story...');

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
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('AI API error:', error);
      throw new Error('Failed to generate impact story');
    }

    const aiResult = await response.json();
    const impactStory = aiResult.choices[0].message.content;

    console.log('Successfully generated impact report');

    return new Response(JSON.stringify({
      story: impactStory,
      stats: {
        totalSpent,
        uniqueBusinesses,
        totalVisits,
        transactionCount,
        businesses: businessNames
      },
      communityStats: {
        totalCirculation,
        activeUsers: userCount || 0,
        businessesSupported: businessCount || 0,
        circulationTimeHours: 6
      }
    }), {
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
