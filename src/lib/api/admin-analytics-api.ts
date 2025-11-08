import { supabase } from '@/integrations/supabase/client';

export interface SalesAgentStats {
  id: string;
  full_name: string;
  email: string;
  referral_code: string;
  total_referrals: number;
  total_earned: number;
  total_pending: number;
  active_referrals: number;
  conversion_rate: number;
  is_active: boolean;
  created_at: string;
}

export interface QRCodeMetrics {
  total_scans: number;
  total_conversions: number;
  overall_conversion_rate: number;
  scans_today: number;
  scans_this_week: number;
  scans_this_month: number;
  conversions_today: number;
  conversions_this_week: number;
  conversions_this_month: number;
  top_performing_agents: Array<{
    agent_name: string;
    referral_code: string;
    scans: number;
    conversions: number;
    conversion_rate: number;
  }>;
}

export interface AgentPerformance {
  agent_id: string;
  agent_name: string;
  referral_code: string;
  total_referrals: number;
  active_referrals: number;
  pending_commissions: number;
  paid_commissions: number;
  total_scans: number;
  total_conversions: number;
  conversion_rate: number;
  recruited_agents: number;
  team_earnings: number;
}

/**
 * Fetch all sales agents with their performance statistics
 */
export const getAllSalesAgentStats = async (): Promise<SalesAgentStats[]> => {
  try {
    const { data, error } = await supabase
      .from('sales_agents')
      .select('*')
      .order('total_earned', { ascending: false });

    if (error) throw error;

    // Fetch referral counts for each agent
    const statsWithReferrals = await Promise.all(
      (data || []).map(async (agent) => {
        const { count: totalReferrals } = await supabase
          .from('referrals')
          .select('*', { count: 'exact', head: true })
          .eq('sales_agent_id', agent.id);

        const { count: activeReferrals } = await supabase
          .from('referrals')
          .select('*', { count: 'exact', head: true })
          .eq('sales_agent_id', agent.id)
          .eq('subscription_status', 'active');

        return {
          id: agent.id,
          full_name: agent.full_name,
          email: agent.email,
          referral_code: agent.referral_code,
          total_referrals: totalReferrals || 0,
          total_earned: agent.total_earned || 0,
          total_pending: agent.total_pending || 0,
          active_referrals: activeReferrals || 0,
          conversion_rate: totalReferrals ? ((activeReferrals || 0) / totalReferrals) * 100 : 0,
          is_active: agent.is_active,
          created_at: agent.created_at
        };
      })
    );

    return statsWithReferrals;
  } catch (error) {
    console.error('Error fetching sales agent stats:', error);
    return [];
  }
};

/**
 * Fetch comprehensive QR code metrics across all agents
 */
export const getQRCodeMetrics = async (): Promise<QRCodeMetrics> => {
  try {
    // Get total scans and conversions
    const { data: allScans, error: scansError } = await supabase
      .from('qr_code_scans')
      .select('*');

    if (scansError) throw scansError;

    const totalScans = allScans?.length || 0;
    const totalConversions = allScans?.filter(scan => scan.converted).length || 0;

    // Calculate time-based metrics
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const scansToday = allScans?.filter(scan => new Date(scan.scanned_at) >= today).length || 0;
    const scansThisWeek = allScans?.filter(scan => new Date(scan.scanned_at) >= weekAgo).length || 0;
    const scansThisMonth = allScans?.filter(scan => new Date(scan.scanned_at) >= monthAgo).length || 0;

    const conversionsToday = allScans?.filter(scan => 
      scan.converted && scan.converted_at && new Date(scan.converted_at) >= today
    ).length || 0;
    const conversionsThisWeek = allScans?.filter(scan => 
      scan.converted && scan.converted_at && new Date(scan.converted_at) >= weekAgo
    ).length || 0;
    const conversionsThisMonth = allScans?.filter(scan => 
      scan.converted && scan.converted_at && new Date(scan.converted_at) >= monthAgo
    ).length || 0;

    // Get top performing agents
    const { data: agents, error: agentsError } = await supabase
      .from('sales_agents')
      .select('id, full_name, referral_code')
      .eq('is_active', true);

    if (agentsError) throw agentsError;

    const topPerformingAgents = await Promise.all(
      (agents || []).map(async (agent) => {
        const agentScans = allScans?.filter(scan => scan.referral_code === agent.referral_code) || [];
        const agentConversions = agentScans.filter(scan => scan.converted).length;
        
        return {
          agent_name: agent.full_name,
          referral_code: agent.referral_code,
          scans: agentScans.length,
          conversions: agentConversions,
          conversion_rate: agentScans.length > 0 ? (agentConversions / agentScans.length) * 100 : 0
        };
      })
    );

    // Sort by conversions and take top 5
    const sortedAgents = topPerformingAgents
      .sort((a, b) => b.conversions - a.conversions)
      .slice(0, 5);

    return {
      total_scans: totalScans,
      total_conversions: totalConversions,
      overall_conversion_rate: totalScans > 0 ? (totalConversions / totalScans) * 100 : 0,
      scans_today: scansToday,
      scans_this_week: scansThisWeek,
      scans_this_month: scansThisMonth,
      conversions_today: conversionsToday,
      conversions_this_week: conversionsThisWeek,
      conversions_this_month: conversionsThisMonth,
      top_performing_agents: sortedAgents
    };
  } catch (error) {
    console.error('Error fetching QR code metrics:', error);
    return {
      total_scans: 0,
      total_conversions: 0,
      overall_conversion_rate: 0,
      scans_today: 0,
      scans_this_week: 0,
      scans_this_month: 0,
      conversions_today: 0,
      conversions_this_week: 0,
      conversions_this_month: 0,
      top_performing_agents: []
    };
  }
};

/**
 * Fetch detailed agent performance including recruitment metrics
 */
export const getAgentPerformanceMetrics = async (): Promise<AgentPerformance[]> => {
  try {
    const { data: agents, error } = await supabase
      .from('sales_agents')
      .select('*')
      .order('total_earned', { ascending: false });

    if (error) throw error;

    const performanceData = await Promise.all(
      (agents || []).map(async (agent) => {
        // Get referral stats
        const { count: totalReferrals } = await supabase
          .from('referrals')
          .select('*', { count: 'exact', head: true })
          .eq('sales_agent_id', agent.id);

        const { count: activeReferrals } = await supabase
          .from('referrals')
          .select('*', { count: 'exact', head: true })
          .eq('sales_agent_id', agent.id)
          .eq('subscription_status', 'active');

        // Get commission stats
        const { data: commissions } = await supabase
          .from('agent_commissions')
          .select('amount, status')
          .eq('sales_agent_id', agent.id);

        const pendingCommissions = commissions
          ?.filter(c => c.status === 'pending')
          .reduce((sum, c) => sum + (Number(c.amount) || 0), 0) || 0;

        const paidCommissions = commissions
          ?.filter(c => c.status === 'paid')
          .reduce((sum, c) => sum + (Number(c.amount) || 0), 0) || 0;

        // Get QR code stats
        const { data: scans } = await supabase
          .from('qr_code_scans')
          .select('*')
          .eq('referral_code', agent.referral_code);

        const totalScans = scans?.length || 0;
        const totalConversions = scans?.filter(scan => scan.converted).length || 0;

        // Get recruited agents
        const { count: recruitedAgents } = await supabase
          .from('sales_agents')
          .select('*', { count: 'exact', head: true })
          .eq('recruited_by_agent_id', agent.id);

        // Get team earnings
        const { data: teamOverrides } = await supabase
          .from('agent_team_overrides')
          .select('override_amount')
          .eq('recruiter_agent_id', agent.id);

        const teamEarnings = teamOverrides?.reduce((sum, override) => 
          sum + (Number(override.override_amount) || 0), 0) || 0;

        return {
          agent_id: agent.id,
          agent_name: agent.full_name,
          referral_code: agent.referral_code,
          total_referrals: totalReferrals || 0,
          active_referrals: activeReferrals || 0,
          pending_commissions: pendingCommissions,
          paid_commissions: paidCommissions,
          total_scans: totalScans,
          total_conversions: totalConversions,
          conversion_rate: totalScans > 0 ? (totalConversions / totalScans) * 100 : 0,
          recruited_agents: recruitedAgents || 0,
          team_earnings: teamEarnings
        };
      })
    );

    return performanceData;
  } catch (error) {
    console.error('Error fetching agent performance metrics:', error);
    return [];
  }
};
