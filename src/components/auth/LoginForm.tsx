
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Loader2, Eye, EyeOff, MapPin, BadgeDollarSign, Users, TrendingUp, LogIn } from 'lucide-react';

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
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import MFAVerification from './MFAVerification';
import { useAuth } from '@/contexts/AuthContext';
import { SubmitButton } from './forms/SubmitButton';
import { motion } from 'framer-motion';

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
    <div className="space-y-6">
      <div className="bg-mansablue/5 p-4 rounded-lg border border-mansablue/10 mb-6">
        <div className="flex items-center mb-2">
          <Badge className="bg-mansagold text-white">Premium Benefits</Badge>
        </div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Join the Mansa Musa Movement</h3>
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
          <div className="flex items-center">
            <MapPin size={12} className="text-mansablue mr-1" />
            <span>Find Black-owned businesses</span>
          </div>
          <div className="flex items-center">
            <BadgeDollarSign size={12} className="text-mansablue mr-1" />
            <span>Exclusive member discounts</span>
          </div>
          <div className="flex items-center">
            <Users size={12} className="text-mansablue mr-1" />
            <span>Community events</span>
          </div>
          <div className="flex items-center">
            <TrendingUp size={12} className="text-mansablue mr-1" />
            <span>Track economic impact</span>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
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

          <SubmitButton 
            loading={isSubmitting}
            text="Sign In"
            loadingText="Signing in..."
            className="w-full bg-mansablue hover:bg-mansablue/90 mt-2"
            icon={<LogIn className="h-4 w-4" />}
          />
          
          <Separator className="my-4" />
          
          <motion.div 
            className="text-center space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-mansablue hover:text-mansagold transition-colors font-medium"
              >
                Sign up
              </Link>
            </p>
            
            <p className="text-xs text-gray-500">
              By signing in, you're joining a movement to circulate wealth in the Black community.
            </p>
          </motion.div>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
