
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const customerSignupSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  phone: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type CustomerSignupForm = z.infer<typeof customerSignupSchema>;

interface CustomerSignupTabProps {
  onSuccess?: () => void;
}

const CustomerSignupTab: React.FC<CustomerSignupTabProps> = ({ onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<CustomerSignupForm>({
    resolver: zodResolver(customerSignupSchema)
  });

  const onSubmit = async (data: CustomerSignupForm) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('[CUSTOMER SIGNUP] Starting signup process...');
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: data.fullName,
            phone: data.phone,
            user_type: 'customer'
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
          toast.success('Account created successfully!', {
            description: authData.session ? 'You are now logged in.' : 'Please check your email to verify your account.'
          });
          
          // If user is auto-logged in (session exists), redirect to home
          if (authData.session) {
            setTimeout(() => {
              window.location.href = '/';
            }, 1500);
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          {...register('fullName')}
          disabled={isLoading}
          placeholder="Enter your full name"
        />
        {errors.fullName && (
          <p className="text-sm text-red-600">{errors.fullName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          disabled={isLoading}
          placeholder="Enter your email"
        />
        {errors.email && (
          <p className="text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone (Optional)</Label>
        <Input
          id="phone"
          type="tel"
          {...register('phone')}
          disabled={isLoading}
          placeholder="Enter your phone number"
        />
        {errors.phone && (
          <p className="text-sm text-red-600">{errors.phone.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          {...register('password')}
          disabled={isLoading}
          placeholder="Create a password"
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
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Account...
          </>
        ) : (
          'Create Customer Account'
        )}
      </Button>
    </form>
  );
};

export default CustomerSignupTab;
