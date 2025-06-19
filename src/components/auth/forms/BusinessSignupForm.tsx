
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useSignupForm } from '../hooks/useSignupForm';
import { SalesAgent } from '@/types/sales-agent';
import { type SubscriptionTier } from '@/lib/services/subscription-tiers';
import PlanSelection from './business/PlanSelection';
import BusinessInformationForm from './business/BusinessInformationForm';

const businessSignupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  business_name: z.string().min(2, 'Business name must be at least 2 characters'),
  business_description: z.string().min(10, 'Description must be at least 10 characters'),
  business_address: z.string().min(5, 'Address must be at least 5 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  referralCode: z.string().optional(),
  isHBCUMember: z.boolean().default(false),
  subscription_tier: z.enum(['business_starter', 'business']).default('business_starter')
});

type BusinessSignupFormValues = z.infer<typeof businessSignupSchema>;

interface BusinessSignupFormProps {
  referralCode?: string;
  referringAgent?: SalesAgent | null;
  onCheckReferralCode?: (code: string) => Promise<SalesAgent | null>;
}

const BusinessSignupForm: React.FC<BusinessSignupFormProps> = ({
  referralCode = '',
  referringAgent,
  onCheckReferralCode
}) => {
  const navigate = useNavigate();
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>('business_starter');
  
  const {
    form: signupForm,
    isLoading,
    isHBCUMember,
    onSubmit: handleSignupSubmit,
    onReferralCodeBlur,
    handleHBCUStatusChange,
    handleHBCUFileChange
  } = useSignupForm();

  const form = useForm<BusinessSignupFormValues>({
    resolver: zodResolver(businessSignupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      business_name: '',
      business_description: '',
      business_address: '',
      phone: '',
      referralCode: referralCode,
      isHBCUMember: false,
      subscription_tier: 'business_starter'
    }
  });

  const onSubmit = async (values: BusinessSignupFormValues) => {
    try {
      const signupData = {
        ...values,
        subscription_tier: 'free' as const,
        user_type: 'business' as const
      };

      const result = await handleSignupSubmit(signupData);
      
      if (result?.data?.user) {
        navigate(`/subscription?tier=${selectedTier}&trial=true`);
      }
    } catch (error) {
      console.error('Business signup error:', error);
    }
  };

  const businessPlans = [
    { id: 'business_starter', name: 'Starter Business' },
    { id: 'business', name: 'Professional Business' }
  ];

  const selectedTierName = businessPlans.find(p => p.id === selectedTier)?.name || 'Starter Business';

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-mansablue mb-2">Join Mansa Musa Marketplace</h1>
        <p className="text-gray-600">Start your journey to build wealth in Black communities</p>
      </div>

      <PlanSelection
        selectedTier={selectedTier}
        onTierChange={setSelectedTier}
      />

      <BusinessInformationForm
        form={form}
        onSubmit={onSubmit}
        isLoading={isLoading}
        isHBCUMember={isHBCUMember}
        referringAgent={referringAgent}
        selectedTierName={selectedTierName}
        onReferralCodeBlur={onReferralCodeBlur}
        onHBCUStatusChange={handleHBCUStatusChange}
        onHBCUFileChange={handleHBCUFileChange}
      />
    </div>
  );
};

export default BusinessSignupForm;
