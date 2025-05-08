
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Loader2, Eye, EyeOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { MFAVerification } from './MFAVerification';
import { useAuth } from '@/contexts/AuthContext';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<any>;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { verifyMFA } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
        throw new Error(result.error.message);
      }
      
      // Check if MFA is required
      if (result.mfaRequired && result.factorId && result.challengeId) {
        setMfaData({
          factorId: result.factorId,
          challengeId: result.challengeId
        });
        setShowMFAVerification(true);
        return; // Stop here until MFA is verified
      }
      
      // Navigate to the page they were trying to access or dashboard
      navigate(from, { replace: true });
    } catch (error: any) {
      toast({
        title: 'Login Failed',
        description: error.message || 'Please check your credentials and try again',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMFAVerify = async (factorId: string, code: string, challengeId: string) => {
    setIsSubmitting(true);
    try {
      const result = await verifyMFA(factorId, code, challengeId);
      
      if (!result.success) {
        throw new Error(result.error?.message || 'MFA verification failed');
      }
      
      toast({
        title: 'Verification Successful',
        description: 'You have been successfully logged in',
      });
      
      // Navigate to the page they were trying to access or dashboard
      navigate(from, { replace: true });
      
      return result;
    } catch (error: any) {
      toast({
        title: 'Verification Failed',
        description: error.message || 'Invalid verification code',
        variant: 'destructive',
      });
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMFACancel = () => {
    setShowMFAVerification(false);
    setMfaData(null);
  };

  // Load remembered email on component mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      form.setValue('email', rememberedEmail);
      form.setValue('rememberMe', true);
    }
  }, [form]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (showMFAVerification && mfaData) {
    return (
      <MFAVerification 
        factorId={mfaData.factorId}
        challengeId={mfaData.challengeId}
        onVerify={handleMFAVerify}
        onCancel={handleMFACancel}
      />
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    {...field} 
                  />
                </FormControl>
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-between">
          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="rememberMe" 
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <label 
                  htmlFor="rememberMe" 
                  className="text-sm text-gray-600 cursor-pointer"
                >
                  Remember me
                </label>
              </div>
            )}
          />
          <Link 
            to="/reset-password"
            className="text-sm text-mansablue hover:text-mansagold transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full bg-mansablue hover:bg-mansablue/90"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </Button>

        <div className="text-center mt-4">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-mansablue hover:text-mansagold transition-colors font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </Form>
  );
};

export default LoginForm;
