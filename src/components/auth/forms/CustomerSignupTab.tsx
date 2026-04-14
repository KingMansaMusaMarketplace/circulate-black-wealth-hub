
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { FormCheckbox } from './FormCheckbox';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';
import { useNavigate } from 'react-router-dom';

const customerSignupSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must include an uppercase letter')
    .regex(/[a-z]/, 'Must include a lowercase letter')
    .regex(/[0-9]/, 'Must include a number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Must include a special character'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type CustomerSignupForm = z.infer<typeof customerSignupSchema>;

interface CustomerSignupTabProps {
  onSuccess?: () => void;
}

const CustomerSignupTab: React.FC<CustomerSignupTabProps> = ({ onSuccess }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<CustomerSignupForm>({
    resolver: zodResolver(customerSignupSchema)
  });

  const passwordValue = watch('password', '');

  const onSubmit = async (data: CustomerSignupForm) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('[CUSTOMER SIGNUP] Starting signup process...');
      
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const isCapacitor = !!(window as any).Capacitor;
      const platform = isCapacitor ? (/(iPhone|iPad|iPod)/i.test(navigator.userAgent) ? 'ios' : 'android') : (isMobile ? 'mobile_web' : 'web');
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/welcome`,
          data: {
            user_type: 'customer',
            signup_platform: platform,
            device_info: navigator.userAgent,
            profile_completion_percentage: 20,
          }
        }
      });

      if (authError) {
        console.error('[CUSTOMER SIGNUP] Signup error:', authError);
        
        // Friendly error messages
        let friendlyError = authError.message;
        if (authError.message.includes('already registered') || authError.message.includes('already been registered')) {
          friendlyError = 'An account with this email already exists. Please sign in instead.';
        } else if (authError.message.includes('rate') || authError.message.includes('limit')) {
          friendlyError = 'Too many attempts. Please wait a few minutes and try again.';
        }
        
        throw new Error(friendlyError);
      }

      if (authData.user) {
        console.log('[CUSTOMER SIGNUP] User created successfully:', authData.user.id);
        
        // Activate beta tester if applicable (non-blocking)
        try {
          const { data: isBeta } = await supabase.rpc('activate_beta_tester', {
            p_email: data.email,
            p_user_id: authData.user.id,
          });
          if (isBeta) {
            console.log('[CUSTOMER SIGNUP] Beta tester activated — free access granted');
          }
        } catch (betaErr) {
          console.warn('[CUSTOMER SIGNUP] Beta tester check failed (non-blocking):', betaErr);
        }
        
        const pendingSubscription = sessionStorage.getItem('pendingSubscription');
        
        setSuccess(true);
        
        if (pendingSubscription) {
          toast.success('Account created! Redirecting to complete your subscription...', {
            duration: 2000
          });
          setTimeout(() => {
            sessionStorage.removeItem('pendingSubscription');
            window.location.href = `/subscription?tier=${pendingSubscription}`;
          }, 1500);
        } else {
          toast.success('Welcome to 1325.AI! 🎉', {
            description: authData.session ? 'Let\'s find some businesses near you!' : 'Please check your email to verify your account.'
          });
          
          if (authData.session) {
            setTimeout(() => {
              navigate('/welcome');
            }, 1000);
          }
        }
        
        reset();
        onSuccess?.();
      }
    } catch (err) {
      console.error('[CUSTOMER SIGNUP] Signup error:', err);
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          Account created successfully! Please check your email to verify your account.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-mansagold/10 to-amber-500/10 border border-mansagold/30 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-mansagold" />
          <span className="font-semibold text-sm">Quick signup - just 2 fields!</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Get started in seconds. Add more details later to earn bonus points.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            disabled={isLoading}
            placeholder="Enter your email"
            autoComplete="email"
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            {...register('password')}
            disabled={isLoading}
            placeholder="Create a strong password"
            autoComplete="new-password"
          />
          {errors.password && (
            <p className="text-sm text-red-600">{errors.password.message}</p>
          )}
          <PasswordStrengthIndicator password={passwordValue} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            {...register('confirmPassword')}
            disabled={isLoading}
            placeholder="Confirm your password"
            autoComplete="new-password"
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>

        <FormCheckbox
          id="customer-terms"
          checked={agreedToTerms}
          onCheckedChange={setAgreedToTerms}
        />

        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-mansablue to-indigo-600 hover:from-mansablue-dark hover:to-indigo-700" 
          disabled={isLoading || !agreedToTerms}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Account...
            </>
          ) : (
            'Create Free Account'
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          You can add your name, phone, and address later to earn 50 bonus points!
        </p>
      </form>
    </div>
  );
};

export default CustomerSignupTab;
