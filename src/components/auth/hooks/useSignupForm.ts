
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext'; // Fixed: Use the main AuthContext
import { toast } from 'sonner';
import { getSalesAgentByReferralCode } from '@/lib/api/sales-agent-api';
import { uploadHBCUVerificationDocument } from '@/lib/api/hbcu-verification';
import { useEmailNotifications } from '@/hooks/use-email-notifications';
import { SalesAgent } from '@/types/sales-agent';
import { signupFormSchema, SignupFormValues } from '../schemas/signupFormSchema';
import { trackQRCodeScan, markQRScanConverted } from '@/lib/api/qr-analytics-api';

export const useSignupForm = () => {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const { sendWelcomeEmail } = useEmailNotifications();
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<'customer' | 'business'>('customer');
  const [referringAgent, setReferringAgent] = useState<SalesAgent | null>(null);
  const [isHBCUMember, setIsHBCUMember] = useState(false);
  const [hbcuVerificationFile, setHBCUVerificationFile] = useState<File | null>(null);
  
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      referralCode: '',
      isHBCUMember: false
    },
  });
  
  // Check for referral code in URL and track QR scan
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const refCode = params.get('ref');
    
    if (refCode) {
      form.setValue('referralCode', refCode);
      checkReferralCode(refCode);
      
      // Track QR code scan when user lands with referral code
      trackQRCodeScan(refCode).then((scanId) => {
        if (scanId) {
          console.log('QR code scan tracked:', scanId);
        }
      }).catch((error) => {
        console.error('Error tracking QR scan:', error);
      });
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

  const onSubmit = async (values: SignupFormValues & { 
    subscription_tier?: 'free' | 'paid' | 'premium' | 'business_starter' | 'business' | 'enterprise';
    business_name?: string;
    business_description?: string;
    business_address?: string;
    phone?: string;
    address?: string;
  }) => {
    try {
      setIsLoading(true);
      console.log('🚀 Starting signup process with values:', { 
        ...values, 
        password: '[REDACTED]',
        isHBCUMember,
        hasVerificationFile: !!hbcuVerificationFile 
      });
      
      // Check referral code if provided and not already checked
      if (values.referralCode && !referringAgent) {
        console.log('Checking referral code:', values.referralCode);
        await checkReferralCode(values.referralCode);
      }

      const metadata = {
        name: values.name,
        email: values.email,
        user_type: userType,
        referral_code: values.referralCode,
        referring_agent: referringAgent?.id,
        is_hbcu_member: isHBCUMember,
        subscription_tier: values.subscription_tier || 'free',
        // Include business-specific fields if it's a business signup
        ...(userType === 'business' && {
          business_name: values.business_name,
          business_description: values.business_description,
          business_address: values.business_address,
          phone: values.phone
        }),
        // Include customer-specific fields if it's a customer signup
        ...(userType === 'customer' && {
          phone: values.phone,
          address: values.address
        })
      };

      console.log('Signing up user with metadata:', metadata);
      const result = await signUp(values.email, values.password, metadata);

      if (result.data?.user) {
        console.log('✅ User created successfully:', result.data.user.id);
        
        // Mark QR scan as converted if user signed up with referral code
        if (values.referralCode) {
          try {
            await markQRScanConverted(values.referralCode, result.data.user.id);
            console.log('✅ QR scan marked as converted');
            
            // Track agent milestones after conversion
            const agent = await getSalesAgentByReferralCode(values.referralCode);
            if (agent && agent.id) {
              // Import milestone tracker dynamically to avoid circular dependencies
              import('@/lib/api/milestone-tracker').then(({ trackAndNotifyMilestones }) => {
                trackAndNotifyMilestones(agent.id).catch(error => {
                  console.error('Failed to track milestones:', error);
                });
              });
            }
          } catch (conversionError) {
            console.error('❌ Failed to mark QR scan as converted:', conversionError);
            // Don't block signup for conversion tracking failure
          }
        }
        
        // Send welcome email
        try {
          await sendWelcomeEmail(userType, values.email, result.data.user.id, values.name);
          console.log('✅ Welcome email sent successfully');
        } catch (emailError) {
          console.error('❌ Failed to send welcome email:', emailError);
          // Don't block signup for email failure
        }
        
        if (isHBCUMember && hbcuVerificationFile) {
          console.log('📄 Uploading HBCU verification document...');
          
          const uploadResult = await uploadHBCUVerificationDocument(result.data.user.id, {
            documentType: 'student_id',
            file: hbcuVerificationFile
          });

          if (uploadResult.success) {
            console.log('✅ HBCU verification document uploaded successfully');
            toast.success('Account created successfully! HBCU verification document uploaded for review.');
          } else {
            console.error('❌ Failed to upload HBCU verification document:', uploadResult.error);
            toast.error('Account created but failed to upload verification document. You can upload it later from your profile.');
          }
        } else {
          console.log('✅ Account created successfully');
          const tierMessage = values.subscription_tier === 'free' 
            ? 'Free account created successfully!' 
            : 'Account created successfully! Complete your subscription to get started.';
          toast.success(tierMessage);
        }
        
        // Sign in the user automatically
        console.log('🔑 Signing in user automatically...');
        await signIn(values.email, values.password);
        
        return result; // Return the result so forms can handle next steps
      } else {
        console.error('❌ No user data returned from signup');
        throw new Error('Account creation failed - no user data returned');
      }
    } catch (error: any) {
      console.error('❌ Signup error:', error);
      toast.error(error.message || 'Failed to create account');
      throw error; // Re-throw so forms can handle the error
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

  const handleHBCUStatusChange = (checked: boolean) => {
    setIsHBCUMember(checked);
    form.setValue('isHBCUMember', checked);
    if (!checked) {
      setHBCUVerificationFile(null);
    }
  };

  const handleHBCUFileChange = (file: File | null) => {
    setHBCUVerificationFile(file);
  };

  return {
    form,
    isLoading,
    userType,
    referringAgent,
    isHBCUMember,
    onSubmit,
    onReferralCodeBlur,
    handleUserTypeChange,
    handleHBCUStatusChange,
    handleHBCUFileChange,
    checkReferralCode
  };
};
