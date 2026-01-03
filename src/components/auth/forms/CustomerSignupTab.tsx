
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
import { useNavigate } from 'react-router-dom';

// Simplified schema - only email and password required upfront
const customerSignupSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
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
  } = useForm<CustomerSignupForm>({
    resolver: zodResolver(customerSignupSchema)
  });

  const onSubmit = async (data: CustomerSignupForm) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('[CUSTOMER SIGNUP] Starting simplified signup process...');
      
      // Detect platform
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
            profile_completion_percentage: 20, // Just email = 20%
          }
        }
      });

      if (authError) {
        console.error('[CUSTOMER SIGNUP] Signup error:', authError);
        throw authError;
      }

      if (authData.user) {
        console.log('[CUSTOMER SIGNUP] User created successfully:', authData.user.id);
        
        // Check if there's a pending subscription from sessionStorage
        const pendingSubscription = sessionStorage.getItem('pendingSubscription');
        
        setSuccess(true);
        
        if (pendingSubscription) {
          console.log('[CUSTOMER SIGNUP] Pending subscription found:', pendingSubscription);
          toast.success('Account created! Redirecting to complete your subscription...', {
            duration: 2000
          });
          
          // Wait for auth state to propagate
          setTimeout(() => {
            sessionStorage.removeItem('pendingSubscription');
            window.location.href = `/subscription?tier=${pendingSubscription}`;
          }, 1500);
        } else {
          toast.success('Welcome to Mansa Musa! 🎉', {
            description: authData.session ? 'Let\'s find some businesses near you!' : 'Please check your email to verify your account.'
          });
          
          // If user is auto-logged in (session exists), redirect to welcome page
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
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      toast.error('Failed to create account. Please try again.');
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
      {/* Benefits Banner */}
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
            placeholder="Create a password (8+ characters)"
            autoComplete="new-password"
          />
          {errors.password && (
            <p className="text-sm text-red-600">{errors.password.message}</p>
          )}
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
