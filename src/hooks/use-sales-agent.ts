
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { 
  getSalesAgentApplication,
  getSalesAgentByUserId,
  getAgentReferrals,
  getAgentCommissions
} from '@/lib/api/sales-agent-api';
import { SalesAgentApplication, SalesAgent, Referral, AgentCommission } from '@/types/sales-agent';

export const useSalesAgent = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState<SalesAgentApplication | null>(null);
  const [agent, setAgent] = useState<SalesAgent | null>(null);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [commissions, setCommissions] = useState<any[]>([]);

  useEffect(() => {
    const loadAgentData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // First, check if the user is already an agent
        const agentData = await getSalesAgentByUserId(user.id);
        setAgent(agentData);
        
        if (agentData) {
          // Load agent-specific data
          const [referralsData, commissionsData] = await Promise.all([
            getAgentReferrals(agentData.id),
            getAgentCommissions(agentData.id)
          ]);
          
          setReferrals(referralsData);
          setCommissions(commissionsData);
        } else {
          // If not an agent, check if they have a pending application
          const applicationData = await getSalesAgentApplication(user.id);
          setApplication(applicationData);
        }
      } catch (error) {
        console.error('Error loading sales agent data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAgentData();
  }, [user]);

  return {
    loading,
    isAgent: !!agent,
    hasApplication: !!application,
    applicationStatus: application?.application_status,
    application,
    agent,
    referrals,
    commissions,
    totalPending: agent?.total_pending || 0,
    totalEarned: agent?.total_earned || 0,
    referralCode: agent?.referral_code
  };
};
