
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { loginSchema, LoginFormValues } from './LoginSchema';

interface UseLoginFormProps {
  onSubmit: (email: string, password: string) => Promise<any>;
}

export const useLoginForm = ({ onSubmit }: UseLoginFormProps) => {
  const [isReady, setIsReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMFAVerification, setShowMFAVerification] = useState(false);
  const [mfaData, setMfaData] = useState<{factorId: string, challengeId: string} | null>(null);
  const [email, setEmailCache] = useState('');

  // Safely get navigation and location only when router context is ready
  let navigate: any = null;
  let location: any = null;
  
  try {
    if (isReady) {
      navigate = useNavigate();
      location = useLocation();
    }
  } catch (error) {
    console.warn('Router hooks not available yet:', error);
  }

  // Get the redirect path from location state or default to dashboard
  const from = location?.state?.from || '/dashboard';

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  // Initialize the component safely
  useEffect(() => {
    setIsReady(true);
  }, []);

  // Load remembered email on component mount
  useEffect(() => {
    if (!isReady) return;
    
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      form.setValue('email', rememberedEmail);
      form.setValue('rememberMe', true);
    }
  }, [form, isReady]);

  const handleFormSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    console.log("Login form submitted with values:", values);
    
    try {
      // Save email to localStorage if rememberMe is checked
      if (values.rememberMe) {
        localStorage.setItem('rememberedEmail', values.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      
      // Cache the email in case we need it for MFA
      setEmailCache(values.email);
      
      console.log("Attempting to sign in with:", values.email);
      const result = await onSubmit(values.email, values.password);
      console.log("Login result:", result);
      
      if (result.error) {
        console.error("Login error:", result.error);
        throw new Error(result.error.message);
      }
      
      // Check if MFA is required
      if (result.mfaRequired && result.factorId && result.challengeId) {
        console.log("MFA required. Setting up MFA verification with:", {
          factorId: result.factorId,
          challengeId: result.challengeId
        });
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
        // Navigate only if navigate is available
        if (navigate) {
          navigate(from, { replace: true });
        } else {
          // Fallback to window.location if navigate is not available
          window.location.href = from;
        }
      } else {
        console.warn("Login returned success but no session", result);
        // Handle edge case where login succeeds but no session is returned
        toast.error('Authentication Issue', {
          description: 'Your login was processed, but we couldn\'t establish a session. Please try again.',
        });
      }
    } catch (error: any) {
      console.error("Login form submission error:", error);
      toast.error('Login Failed', {
        description: error.message || 'Please check your credentials and try again',
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
