
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ResponsiveLayout from '@/components/layouts/ResponsiveLayout';
import BusinessSignupForm from '@/components/auth/forms/BusinessSignupForm';
import { getSalesAgentByReferralCode } from '@/lib/api/sales-agent-api';
import { SalesAgent } from '@/types/sales-agent';

const BusinessSignupPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const referralCode = searchParams.get('ref') || '';
  const [referringAgent, setReferringAgent] = useState<SalesAgent | null>(null);
  
  // Function to check referral code validity and set the referring agent
  const checkReferralCode = async (code: string) => {
    if (!code) return;
    
    try {
      const agent = await getSalesAgentByReferralCode(code);
      setReferringAgent(agent);
      return agent;
    } catch (error) {
      console.error('Error checking referral code:', error);
      return null;
    }
  };

  return (
    <ResponsiveLayout title="Business Sign Up">
      <div className="max-w-3xl mx-auto">
        <BusinessSignupForm 
          referralCode={referralCode}
          referringAgent={referringAgent}
          onCheckReferralCode={checkReferralCode}
        />
      </div>
    </ResponsiveLayout>
  );
};

export default BusinessSignupPage;
