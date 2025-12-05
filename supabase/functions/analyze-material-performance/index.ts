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
    const { dateRange = 30 } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('[MATERIAL PERFORMANCE] Analyzing material performance for last', dateRange, 'days');

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - dateRange);

    // Get material download data
    const { data: materials, error: materialsError } = await supabase
      .from('marketing_materials')
      .select(`
        id,
        title,
        type,
        download_count,
        created_at
      `)
      .eq('is_active', true);

    if (materialsError) {
      throw new Error(`Failed to fetch materials: ${materialsError.message}`);
    }

    // Get download data with agent info
    const { data: downloads, error: downloadsError } = await supabase
      .from('marketing_material_downloads')
      .select(`
        id,
        material_id,
        sales_agent_id,
        downloaded_at,
        sales_agents(tier, user_id)
      `)
      .gte('downloaded_at', startDate.toISOString());

    if (downloadsError) {
      throw new Error(`Failed to fetch downloads: ${downloadsError.message}`);
    }

    // Get referral data to track conversions
    const { data: referrals, error: referralsError } = await supabase
      .from('referrals')
      .select(`
        id,
        sales_agent_id,
        referral_date,
        commission_status,
        commission_amount
      `)
      .gte('referral_date', startDate.toISOString());

    if (referralsError) {
      console.warn('Failed to fetch referrals:', referralsError);
    }

    // Build performance metrics
    const materialPerformance = materials?.map(material => {
      const materialDownloads = downloads?.filter(d => d.material_id === material.id) || [];
      const uniqueAgents = new Set(materialDownloads.map(d => d.sales_agent_id));
      
      // Track conversions: referrals made within 30 days after download
      const conversions = materialDownloads.reduce((count, download) => {
        const downloadDate = new Date(download.downloaded_at);
        const agentReferrals = referrals?.filter(ref => {
          const refDate = new Date(ref.referral_date);
          return ref.sales_agent_id === download.sales_agent_id &&
                 refDate >= downloadDate &&
                 refDate <= new Date(downloadDate.getTime() + 30 * 24 * 60 * 60 * 1000);
        }) || [];
        return count + agentReferrals.length;
      }, 0);

      const conversionRate = materialDownloads.length > 0 
        ? (conversions / materialDownloads.length) * 100 
        : 0;

      const tierDistribution = materialDownloads.reduce((acc, d) => {
        const tier = d.sales_agents?.tier || 'unknown';
        acc[tier] = (acc[tier] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        id: material.id,
        title: material.title,
        type: material.type,
        total_downloads: materialDownloads.length,
        unique_agents: uniqueAgents.size,
        conversions,
        conversion_rate: conversionRate,
        tier_distribution: tierDistribution,
        downloads_per_day: materialDownloads.length / dateRange,
        created_days_ago: Math.floor((Date.now() - new Date(material.created_at).getTime()) / (1000 * 60 * 60 * 24))
      };
    }) || [];

    // Sort by conversion rate and downloads
    const topPerformers = materialPerformance
      .sort((a, b) => (b.conversions || 0) - (a.conversions || 0))
      .slice(0, 10);

    const underperformers = materialPerformance
      .filter(m => m.total_downloads > 5 && m.conversion_rate < 5)
      .sort((a, b) => a.conversion_rate - b.conversion_rate)
      .slice(0, 5);

    // Call Lovable AI for insights
    const aiPrompt = `You are an expert marketing analyst. Analyze this marketing material performance data and provide actionable insights and optimization strategies.

Performance Summary:
- Total Materials: ${materialPerformance.length}
- Total Downloads: ${materialPerformance.reduce((s, m) => s + m.total_downloads, 0)}
- Average Conversion Rate: ${(materialPerformance.reduce((s, m) => s + m.conversion_rate, 0) / materialPerformance.length).toFixed(2)}%

Top Performing Materials (by conversions):
${topPerformers.map(m => `- ${m.title} (${m.type}): ${m.conversions} conversions, ${m.conversion_rate.toFixed(1)}% rate, ${m.total_downloads} downloads`).join('\n')}

Underperforming Materials (high downloads, low conversions):
${underperformers.map(m => `- ${m.title} (${m.type}): ${m.conversion_rate.toFixed(1)}% rate, ${m.total_downloads} downloads`).join('\n')}

Material Type Distribution:
${Object.entries(materialPerformance.reduce((acc, m) => {
  acc[m.type] = (acc[m.type] || 0) + m.total_downloads;
  return acc;
}, {} as Record<string, number>)).map(([type, count]) => `- ${type}: ${count} downloads`).join('\n')}

Please provide:
1. Key insights about what's working well (2-3 points)
2. Areas of concern (2-3 points)
3. Specific optimization strategies (3-5 actionable recommendations)
4. Material creation suggestions (what types/topics to create next)

Keep your response concise, actionable, and data-driven. Focus on practical steps that can be implemented immediately.`;

    console.log('[AI] Calling Lovable AI for performance analysis...');

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are an expert marketing performance analyst specializing in content optimization and conversion rate improvement. Provide clear, actionable insights based on data.'
          },
          {
            role: 'user',
            content: aiPrompt
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('[AI] Error response:', aiResponse.status, errorText);
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const insights = aiData.choices[0]?.message?.content || 'Unable to generate insights at this time.';

    console.log('[MATERIAL PERFORMANCE] Analysis complete');

    return new Response(
      JSON.stringify({
        summary: {
          total_materials: materialPerformance.length,
          total_downloads: materialPerformance.reduce((s, m) => s + m.total_downloads, 0),
          total_conversions: materialPerformance.reduce((s, m) => s + m.conversions, 0),
          avg_conversion_rate: (materialPerformance.reduce((s, m) => s + m.conversion_rate, 0) / materialPerformance.length).toFixed(2),
        },
        top_performers: topPerformers,
        underperformers: underperformers,
        ai_insights: insights,
        performance_data: materialPerformance
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[MATERIAL PERFORMANCE] Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : undefined
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
