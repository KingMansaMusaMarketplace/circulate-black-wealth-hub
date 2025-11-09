import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
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

    // Fetch user transactions
    const { data: transactions, error: transError } = await supabase
      .from('user_impact_transactions')
      .select('amount, transaction_date, business_id')
      .eq('user_id', userId)
      .gte('transaction_date', startDate.toISOString())
      .order('transaction_date', { ascending: false });

    if (transError) throw transError;

    // Fetch user business visits
    const { data: visits, error: visitsError } = await supabase
      .from('user_business_visits')
      .select('business_id, visit_date, visit_source')
      .eq('user_id', userId)
      .gte('visit_date', startDate.toISOString());

    if (visitsError) throw visitsError;

    // Fetch community metrics
    const { data: communityMetrics, error: metricsError } = await supabase
      .from('community_impact_metrics')
      .select('*')
      .gte('metric_date', startDate.toISOString().split('T')[0])
      .order('metric_date', { ascending: false })
      .limit(1)
      .single();

    // Calculate user statistics
    const totalSpent = transactions?.reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0) || 0;
    const uniqueBusinesses = new Set(transactions?.map(t => t.business_id) || []).size;
    const totalVisits = visits?.length || 0;
    const transactionCount = transactions?.length || 0;

    // Fetch business names for context
    const businessIds = Array.from(new Set(transactions?.map(t => t.business_id) || []));
    let businessNames: any[] = [];
    if (businessIds.length > 0) {
      const { data: businesses } = await supabase
        .from('businesses')
        .select('id, business_name, category')
        .in('id', businessIds);
      businessNames = businesses || [];
    }

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
- Total Community Circulation: $${communityMetrics?.total_circulation || 0}
- Active Community Members: ${communityMetrics?.active_users || 0}
- Businesses Supported Community-Wide: ${communityMetrics?.businesses_supported || 0}
- Average Dollar Circulation Time: ${communityMetrics?.average_circulation_time_hours || 6} hours (up from 6 hours baseline)

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
        totalCirculation: communityMetrics?.total_circulation || 0,
        activeUsers: communityMetrics?.active_users || 0,
        businessesSupported: communityMetrics?.businesses_supported || 0,
        circulationTimeHours: communityMetrics?.average_circulation_time_hours || 6
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
