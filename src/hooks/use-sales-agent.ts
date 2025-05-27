
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { SalesAgent, SalesAgentApplication, Referral, AgentCommission } from '@/types/sales-agent';
import { 
  getSalesAgentByUserId, 
  getSalesAgentApplication, 
  getAgentReferrals, 
  getAgentCommissions 
} from '@/lib/api/sales-agent-api';

export const useSalesAgent = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isAgent, setIsAgent] = useState(false);
  const [hasApplication, setHasApplication] = useState(false);
  const [application, setApplication] = useState<SalesAgentApplication | null>(null);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [agent, setAgent] = useState<SalesAgent | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [commissions, setCommissions] = useState<AgentCommission[]>([]);
  const [totalEarned, setTotalEarned] = useState(0);
  const [totalPending, setTotalPending] = useState(0);

  useEffect(() => {
    const fetchAgentStatus = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching sales agent data for user:', user.id);
        
        // Check if user is already a sales agent
        const existingAgent = await getSalesAgentByUserId(user.id);
        if (existingAgent) {
          console.log('User is already a sales agent:', existingAgent);
          setIsAgent(true);
          setAgent(existingAgent);
          setReferralCode(existingAgent.referral_code);
          
          // Fetch agent's referrals and commissions
          const agentReferrals = await getAgentReferrals(existingAgent.id);
          const agentCommissions = await getAgentCommissions(existingAgent.id);
          
          setReferrals(agentReferrals);
          setCommissions(agentCommissions);
          
          // Calculate totals
          const earned = agentCommissions
            .filter(c => c.status === 'paid')
            .reduce((sum, c) => sum + Number(c.amount), 0);
          const pending = agentCommissions
            .filter(c => c.status === 'pending')
            .reduce((sum, c) => sum + Number(c.amount), 0);
            
          setTotalEarned(earned);
          setTotalPending(pending);
        } else {
          // Check if user has an application
          const userApplication = await getSalesAgentApplication(user.id);
          if (userApplication) {
            console.log('User has an application:', userApplication);
            setHasApplication(true);
            setApplication(userApplication);
          } else {
            console.log('User has no application or agent record');
            setHasApplication(false);
            setIsAgent(false);
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching agent status:', error);
        setLoading(false);
      }
    };

    fetchAgentStatus();
  }, [user]);

  return {
    loading,
    isAgent,
    hasApplication,
    application,
    referralCode,
    agent,
    referrals,
    commissions,
    totalEarned,
    totalPending
  };
};
