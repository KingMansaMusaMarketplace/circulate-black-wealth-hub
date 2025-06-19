
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Navbar } from '@/components/navbar';
import Footer from '@/components/Footer';
import BusinessSignupForm from '@/components/auth/forms/BusinessSignupForm';
import { SalesAgent } from '@/types/sales-agent';

const BusinessSignupPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const referralCode = searchParams.get('ref') || '';
  const [referringAgent, setReferringAgent] = useState<SalesAgent | null>(null);
  
  // Function to check referral code validity and set the referring agent
  const checkReferralCode = async (code: string): Promise<SalesAgent | null> => {
    if (!code) return null;
    
    try {
      // For now, return null until sales agent API is working
      console.log('Checking referral code:', code);
      return null;
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

      <Navbar />
      
      <main className="flex-1 py-8">
        <BusinessSignupForm 
          referralCode={referralCode}
          referringAgent={referringAgent}
          onCheckReferralCode={checkReferralCode}
        />
      </main>

      <Footer />
    </div>
  );
};

export default BusinessSignupPage;
