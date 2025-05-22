
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { SalesAgent, SalesAgentApplication, Referral, AgentCommission } from '@/types/sales-agent';

// Placeholder function to get sales agent by referral code
export const getSalesAgentByReferralCode = async (code: string): Promise<SalesAgent | null> => {
  // In a real application, this would make an API call
  // For now, return mock data
  if (code) {
    return {
      id: '1',
      user_id: '1',
      full_name: 'John Doe',
      email: 'john@example.com',
      referral_code: code,
      status: 'active',
      created_at: new Date().toISOString()
    };
  }
  return null;
};

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
        // In a real app, these would be API calls
        // Simulating API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock data for demonstration
        const mockApplication: SalesAgentApplication = {
          id: '1',
          user_id: user.id,
          full_name: 'John Doe',
          email: user.email || '',
          phone: '123-456-7890',
          why_join: 'I want to help grow the community',
          business_experience: 'I have 5 years of sales experience',
          marketing_ideas: 'Social media campaigns and community events',
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          application_status: 'pending',
          application_date: new Date().toISOString(),
          test_score: 65,
          test_passed: false
        };

        // For demo, show as if user has applied but is not yet an agent
        setHasApplication(true);
        setApplication(mockApplication);
        setIsAgent(false);
        setReferralCode('AGENT123');
        
        // Mock agent data
        const mockAgent: SalesAgent = {
          id: '1',
          user_id: user.id,
          full_name: 'John Doe',
          email: user.email || '',
          referral_code: 'AGENT123',
          status: 'active',
          created_at: new Date().toISOString()
        };
        
        // Mock referrals
        const mockReferrals: Referral[] = [
          {
            id: '1',
            sales_agent_id: '1',
            referred_user_id: '2',
            referred_user_type: 'customer',
            referral_date: new Date().toISOString(),
            commission_status: 'paid',
            commission_amount: 15,
            referred_user: { email: 'customer@example.com' }
          },
          {
            id: '2',
            sales_agent_id: '1',
            referred_user_id: '3',
            referred_user_type: 'business',
            referral_date: new Date().toISOString(),
            commission_status: 'pending',
            commission_amount: 25,
            referred_user: { email: 'business@example.com' }
          }
        ];
        
        // Mock commissions
        const mockCommissions: AgentCommission[] = [
          {
            id: '1',
            sales_agent_id: '1',
            amount: 15,
            status: 'paid',
            paid_date: new Date().toISOString(),
            payment_reference: 'PAY123',
            referral: { referral_date: new Date().toISOString() }
          },
          {
            id: '2',
            sales_agent_id: '1',
            amount: 25,
            status: 'pending',
            due_date: new Date().toISOString(),
            referral: { referral_date: new Date().toISOString() }
          }
        ];
        
        setAgent(mockAgent);
        setReferrals(mockReferrals);
        setCommissions(mockCommissions);
        setTotalEarned(15);
        setTotalPending(25);
        
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
