
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';
import { getSalesAgentByReferralCode } from '@/lib/api/sales-agent-api';
import { SalesAgent } from '@/types/sales-agent';
import { signupFormSchema, SignupFormValues } from '../schemas/signupFormSchema';

export const useSignupForm = () => {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<'customer' | 'business'>('customer');
  const [referringAgent, setReferringAgent] = useState<SalesAgent | null>(null);
  
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      referralCode: ''
    },
  });
  
  // Check for referral code in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const refCode = params.get('ref');
    
    if (refCode) {
      form.setValue('referralCode', refCode);
      checkReferralCode(refCode);
    }
  }, []);
  
  const checkReferralCode = async (code: string): Promise<SalesAgent | null> => {
    if (!code) return null;
    
    try {
      const agent = await getSalesAgentByReferralCode(code);
      if (agent) {
        setReferringAgent(agent);
        toast.success(`Referred by: ${agent.full_name}`);
      }
      return agent;
    } catch (error) {
      console.error('Error checking referral code:', error);
      return null;
    }
  };

  const onSubmit = async (values: SignupFormValues) => {
    try {
      setIsLoading(true);
      
      // Check referral code if provided and not already checked
      if (values.referralCode && !referringAgent) {
        await checkReferralCode(values.referralCode);
      }

      await signUp(values.email, values.password, {
        name: values.name,
        user_type: userType,
        referral_code: values.referralCode,
        referring_agent: referringAgent?.id
      });

      toast.success('Account created successfully!');
      
      // Sign in the user automatically
      await signIn(values.email, values.password);
      
      navigate('/signup-success');
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const onReferralCodeBlur = () => {
    const code = form.getValues('referralCode');
    if (code) {
      checkReferralCode(code);
    }
  };

  const handleUserTypeChange = (value: string) => {
    setUserType(value as 'customer' | 'business');
  };

  return {
    form,
    isLoading,
    userType,
    referringAgent,
    onSubmit,
    onReferralCodeBlur,
    handleUserTypeChange,
    checkReferralCode
  };
};
