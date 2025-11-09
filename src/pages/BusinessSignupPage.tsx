
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import BusinessSignupForm from '@/components/auth/forms/BusinessSignupForm';
import { getSalesAgentByReferralCode } from '@/lib/api/sales-agent-api';
import { SalesAgent } from '@/types/sales-agent';

const BusinessSignupPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const referralCode = searchParams.get('ref') || '';
  const [referringAgent, setReferringAgent] = useState<SalesAgent | null>(null);
  
  // Function to check referral code validity and set the referring agent
  const checkReferralCode = async (code: string): Promise<SalesAgent | null> => {
    if (!code) return null;
    
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Helmet>
        <title>Business Sign Up | Mansa Musa Marketplace</title>
        <meta name="description" content="Register your business with Mansa Musa Marketplace" />
      </Helmet>
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 mb-6">
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/20 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 16v-4"/>
                  <path d="M12 8h.01"/>
                </svg>
              </div>
              <div>
                <p className="font-semibold text-foreground">New to MMM Payments?</p>
                <p className="text-sm text-muted-foreground">Learn how our QR payment system works for your business</p>
              </div>
            </div>
            <a 
              href="/business/how-it-works" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
            >
              See How It Works
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"/>
                <path d="m12 5 7 7-7 7"/>
              </svg>
            </a>
          </div>
        </div>
        
        <BusinessSignupForm 
          referralCode={referralCode}
          referringAgent={referringAgent}
          onCheckReferralCode={checkReferralCode}
        />
      </main>
    </div>
  );
};

export default BusinessSignupPage;
