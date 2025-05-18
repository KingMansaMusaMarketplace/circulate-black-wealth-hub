
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { loginSchema, LoginFormValues } from './LoginSchema';

interface UseLoginFormProps {
  onSubmit: (email: string, password: string) => Promise<any>;
}

export const useLoginForm = ({ onSubmit }: UseLoginFormProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMFAVerification, setShowMFAVerification] = useState(false);
  const [mfaData, setMfaData] = useState<{factorId: string, challengeId: string} | null>(null);
  const [email, setEmailCache] = useState('');

  // Get the redirect path from location state or default to dashboard
  const from = (location.state as any)?.from || '/dashboard';

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  // Load remembered email on component mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      form.setValue('email', rememberedEmail);
      form.setValue('rememberMe', true);
    }
  }, [form]);

  const handleFormSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      // Save email to localStorage if rememberMe is checked
      if (values.rememberMe) {
        localStorage.setItem('rememberedEmail', values.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      
      // Cache the email in case we need it for MFA
      setEmailCache(values.email);
      
      const result = await onSubmit(values.email, values.password);
      
      if (result.error) {
        console.error("Login error:", result.error);
        throw new Error(result.error.message);
      }
      
      // Check if MFA is required
      if (result.mfaRequired && result.factorId && result.challengeId) {
        setMfaData({
          factorId: result.factorId,
          challengeId: result.challengeId
        });
        setShowMFAVerification(true);
        setIsSubmitting(false);
        return; // Stop here until MFA is verified
      }
      
      if (result.data?.session) {
        console.log("Login successful, navigating to:", from);
        // Navigate to the page they were trying to access or dashboard
        navigate(from, { replace: true });
      } else {
        console.warn("Login returned success but no session", result);
        // Handle edge case where login succeeds but no session is returned
        toast({
          title: 'Authentication Issue',
          description: 'Your login was processed, but we couldn\'t establish a session. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error("Login form submission error:", error);
      toast({
        title: 'Login Failed',
        description: error.message || 'Please check your credentials and try again',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMFACancel = () => {
    setShowMFAVerification(false);
    setMfaData(null);
  };

  return {
    form,
    isSubmitting,
    showMFAVerification,
    mfaData,
    email,
    handleFormSubmit,
    handleMFACancel
  };
};
