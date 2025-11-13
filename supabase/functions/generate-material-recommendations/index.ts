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
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('[RECOMMENDATIONS] Generating recommendations for user:', userId);

    // Get current agent's profile and download history
    const { data: agent, error: agentError } = await supabase
      .from('sales_agents')
      .select('id, tier, user_id')
      .eq('user_id', userId)
      .single();

    if (agentError) {
      console.error('[RECOMMENDATIONS] Error fetching agent:', agentError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch agent profile' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get agent's region from profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('state, city')
      .eq('id', userId)
      .single();

    const agentRegion = profile?.state || null;

    // Get agent's download history
    const { data: downloads } = await supabase
      .from('marketing_material_downloads')
      .select('material_id')
      .eq('sales_agent_id', agent.id)
      .order('downloaded_at', { ascending: false })
      .limit(50);

    const downloadedMaterialIds = downloads?.map(d => d.material_id) || [];

    // Get download patterns of similar agents (same tier and/or region)
    const { data: similarAgentsDownloads } = await supabase
      .from('marketing_material_downloads')
      .select(`
        material_id,
        sales_agents!inner(tier, user_id, id)
      `)
      .neq('sales_agent_id', agent.id);

    // Get all active materials with their metadata
    const { data: allMaterials } = await supabase
      .from('marketing_materials')
      .select(`
        id,
        title,
        type,
        file_url,
        thumbnail_url,
        description,
        is_active,
        download_count,
        material_category_assignments(
          material_categories(id, name)
        ),
        material_tag_assignments(
          material_tags(id, name)
        )
      `)
      .eq('is_active', true);

    if (!allMaterials || allMaterials.length === 0) {
      return new Response(
        JSON.stringify({ recommendations: [] }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build collaborative filtering scores
    const materialScores = new Map<string, number>();
    const materialDownloadCounts = new Map<string, number>();
    const tierWeights: Record<string, number> = {
      'bronze': 1,
      'silver': 1.2,
      'gold': 1.5,
      'platinum': 2
    };

    // Process similar agents' downloads
    if (similarAgentsDownloads) {
      for (const download of similarAgentsDownloads) {
        const downloadAgent = download.sales_agents;
        if (!downloadAgent) continue;

        let similarityScore = 0;

        // Same tier = higher weight
        if (downloadAgent.tier === agent.tier) {
          similarityScore += 3;
        }
        
        // Adjacent tier = medium weight
        const tiers = ['bronze', 'silver', 'gold', 'platinum'];
        const agentTierIndex = tiers.indexOf(agent.tier?.toLowerCase() || 'bronze');
        const otherTierIndex = tiers.indexOf(downloadAgent.tier?.toLowerCase() || 'bronze');
        if (Math.abs(agentTierIndex - otherTierIndex) === 1) {
          similarityScore += 1.5;
        }

        if (similarityScore > 0) {
          const currentScore = materialScores.get(download.material_id) || 0;
          materialScores.set(download.material_id, currentScore + similarityScore);
          
          const currentCount = materialDownloadCounts.get(download.material_id) || 0;
          materialDownloadCounts.set(download.material_id, currentCount + 1);
        }
      }
    }

    // Score and rank materials
    const scoredMaterials = allMaterials
      .filter(material => !downloadedMaterialIds.includes(material.id))
      .map(material => {
        let score = materialScores.get(material.id) || 0;
        const downloadCount = materialDownloadCounts.get(material.id) || 0;

        // Boost by popularity (normalized)
        score += Math.log(downloadCount + 1) * 2;

        // Boost trending materials
        if (material.download_count > 10) {
          score += Math.log(material.download_count) * 0.5;
        }

        return {
          material,
          score,
          reason: generateReason(score, downloadCount, agent.tier, material)
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);

    const recommendations = scoredMaterials.map(({ material, reason }) => ({
      id: material.id,
      title: material.title,
      type: material.type,
      file_url: material.file_url,
      thumbnail_url: material.thumbnail_url,
      description: material.description,
      download_count: material.download_count,
      categories: material.material_category_assignments?.map((ca: any) => ca.material_categories?.name).filter(Boolean) || [],
      tags: material.material_tag_assignments?.map((ta: any) => ta.material_tags?.name).filter(Boolean) || [],
      recommendation_reason: reason
    }));

    console.log('[RECOMMENDATIONS] Generated', recommendations.length, 'recommendations');

    return new Response(
      JSON.stringify({ recommendations }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[RECOMMENDATIONS] Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function generateReason(score: number, downloadCount: number, tier: string | undefined, material: any): string {
  if (downloadCount > 5) {
    return `Popular with ${tier || 'similar'} agents in your tier`;
  }
  if (score > 5) {
    return `Highly recommended based on your activity`;
  }
  if (material.download_count > 20) {
    return `Trending material across all agents`;
  }
  return `Recommended for ${tier || 'your'} tier agents`;
}
