
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { SalesAgent, SalesAgentApplication } from '@/types/sales-agent';

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
          updated_at: new Date().toISOString()
        };

        // For demo, show as if user has applied but is not yet an agent
        setHasApplication(true);
        setApplication(mockApplication);
        setIsAgent(false);
        setReferralCode('AGENT123');
        
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
    referralCode
  };
};
