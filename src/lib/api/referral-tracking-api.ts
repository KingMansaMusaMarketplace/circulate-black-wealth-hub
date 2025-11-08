import { supabase } from '@/integrations/supabase/client';

/**
 * Validate a referral code
 */
export const validateReferralCode = async (referralCode: string) => {
  try {
    const { data, error } = await supabase.rpc('validate_referral_code', {
      p_referral_code: referralCode
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error validating referral code:', error);
    throw error;
  }
};

/**
 * Process a business referral after signup
 */
export const processBusinessReferral = async (
  businessId: string,
  referralCode: string
) => {
  try {
    const { data, error } = await supabase.rpc('process_business_referral', {
      p_business_id: businessId,
      p_referral_code: referralCode
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error processing business referral:', error);
    throw error;
  }
};

/**
 * Get referral info for a business
 */
export const getBusinessReferralInfo = async (businessId: string) => {
  try {
    const { data, error } = await supabase.rpc('get_business_referral_info', {
      p_business_id: businessId
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting business referral info:', error);
    throw error;
  }
};

/**
 * Get agent's referrals
 */
export const getAgentReferrals = async (agentId: string) => {
  try {
    const { data, error } = await supabase
      .from('referrals')
      .select(`
        *,
        businesses:referred_user_id(
          business_name,
          city,
          state,
          created_at
        )
      `)
      .eq('sales_agent_id', agentId)
      .order('referral_date', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching agent referrals:', error);
    throw error;
  }
};

/**
 * Get agent's commissions
 */
export const getAgentCommissions = async (agentId: string) => {
  try {
    const { data, error } = await supabase
      .from('agent_commissions')
      .select(`
        *,
        referrals(
          referred_user_type,
          subscription_amount,
          referral_date
        )
      `)
      .eq('sales_agent_id', agentId)
      .order('due_date', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching agent commissions:', error);
    throw error;
  }
};

/**
 * Get agent's team overrides
 */
export const getAgentTeamOverrides = async (recruiterAgentId: string) => {
  try {
    const { data, error } = await supabase
      .from('agent_team_overrides')
      .select(`
        *,
        recruited_agent:recruited_agent_id(
          full_name,
          referral_code
        ),
        referrals(
          subscription_amount,
          referral_date
        )
      `)
      .eq('recruiter_agent_id', recruiterAgentId)
      .order('earned_date', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching team overrides:', error);
    throw error;
  }
};

/**
 * Get agent's recruitment bonuses
 */
export const getAgentRecruitmentBonuses = async (recruiterAgentId: string) => {
  try {
    const { data, error } = await supabase
      .from('agent_recruitment_bonuses')
      .select(`
        *,
        recruited_agent:recruited_agent_id(
          full_name,
          referral_code,
          created_at
        )
      `)
      .eq('recruiter_agent_id', recruiterAgentId)
      .order('earned_date', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching recruitment bonuses:', error);
    throw error;
  }
};
