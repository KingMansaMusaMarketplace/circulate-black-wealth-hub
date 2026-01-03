
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, CheckCircle, Building2, Sparkles } from 'lucide-react';
import { secureSignUp } from '@/lib/security/auth-security';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { FormCheckbox } from './FormCheckbox';
import { useNavigate } from 'react-router-dom';

// Simplified schema - only 4 fields required upfront
const businessSignupSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  cityZip: z.string().min(2, 'Please enter your city or ZIP code'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type BusinessSignupFormData = z.infer<typeof businessSignupSchema>;

interface BusinessSignupFormProps {
  referralCode?: string;
  referringAgent?: any;
  onCheckReferralCode?: (code: string) => Promise<any>;
  onSuccess?: () => void;
}

const BusinessSignupForm: React.FC<BusinessSignupFormProps> = ({ 
  referralCode = '', 
  onSuccess 
}) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<BusinessSignupFormData>({
    resolver: zodResolver(businessSignupSchema)
  });

  const onSubmit = async (data: BusinessSignupFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Use secure signup with enhanced validation and rate limiting
      const result = await secureSignUp(
        data.email,
        data.password,
        {
          user_type: 'business',
          business_name: data.businessName,
          city_zip: data.cityZip,
          referral_code: referralCode || null,
          profile_completion_percentage: 25, // Minimal signup = 25%
        }
      );

      if (!result.success) {
        throw new Error(result.error || 'Failed to create account');
      }

      if (result.data?.user) {
        // Create minimal business profile - rest filled in during onboarding
        const { error: businessError } = await supabase
          .from('businesses')
          .insert({
            name: data.businessName,
            business_name: data.businessName,
            owner_id: result.data.user.id,
            email: data.email,
            city: data.cityZip, // Will be refined during onboarding
            listing_status: 'draft', // Not visible until they complete profile
          });

        if (businessError) {
          console.error('Business creation error:', businessError);
          toast.warning('Account created! Complete your business profile after verification.');
        }

        setSuccess(true);
        toast.success('Business account created! 🎉', {
          description: 'Let\'s set up your listing!'
        });
        
        reset();
        
        // Redirect to business onboarding after a short delay
        if (result.data.session) {
          setTimeout(() => {
            navigate('/business/onboarding');
          }, 1000);
        }
        
        onSuccess?.();
      }
    } catch (err) {
      console.error('Business signup error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      toast.error('Failed to create business account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <Alert className="border-0 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 p-0.5 shadow-xl">
          <div className="bg-white rounded-lg p-6 flex items-start gap-4">
            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <AlertDescription className="text-gray-800 font-medium text-base">
              <strong className="text-green-700 text-lg block mb-2">🎉 Business account created!</strong>
              Check your email to verify, then complete your listing to go live.
            </AlertDescription>
          </div>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/30 via-orange-400/30 to-amber-400/30 rounded-3xl blur-2xl" />
        <div className="relative bg-white/95 backdrop-blur-sm border-0 shadow-2xl rounded-3xl overflow-hidden p-6 md:p-8">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-yellow-500 via-orange-500 to-amber-500" />
          
          <div className="relative pt-4 space-y-6">
            {/* Benefits Banner */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-mansagold to-amber-500 rounded-lg">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Quick Business Signup</h3>
                  <p className="text-sm text-gray-600">Just 4 fields to get started!</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-amber-700">
                <Sparkles className="w-4 h-4" />
                <span>Complete your profile later to go live in the directory</span>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <Alert className="border-0 bg-gradient-to-r from-red-500 to-orange-500 p-0.5">
                  <div className="bg-white rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <AlertDescription className="text-gray-800 font-medium">{error}</AlertDescription>
                  </div>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="businessName" className="text-gray-900 font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500"></span>
                  Business Name
                </Label>
                <Input
                  id="businessName"
                  {...register('businessName')}
                  disabled={isLoading}
                  placeholder="Enter your business name"
                  className="border-2 focus:border-orange-500"
                />
                {errors.businessName && (
                  <p className="text-sm text-red-600">{errors.businessName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cityZip" className="text-gray-900 font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500"></span>
                  City or ZIP Code
                </Label>
                <Input
                  id="cityZip"
                  {...register('cityZip')}
                  disabled={isLoading}
                  placeholder="e.g., Atlanta or 30301"
                  className="border-2 focus:border-orange-500"
                />
                {errors.cityZip && (
                  <p className="text-sm text-red-600">{errors.cityZip.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-900 font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500"></span>
                  Business Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  disabled={isLoading}
                  placeholder="Enter business email"
                  className="border-2 focus:border-orange-500"
                  autoComplete="email"
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    {...register('password')}
                    disabled={isLoading}
                    placeholder="Create a password"
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
              </div>

              <FormCheckbox
                id="business-terms"
                checked={agreedToTerms}
                onCheckedChange={setAgreedToTerms}
              />

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-yellow-500 via-orange-500 to-amber-500 hover:from-yellow-600 hover:via-orange-600 hover:to-amber-600 text-white font-bold py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]" 
                disabled={isLoading || !agreedToTerms}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating Business Account...
                  </>
                ) : (
                  'Create Business Account 🚀'
                )}
              </Button>

              <p className="text-xs text-center text-gray-500">
                Add your category, description, and photos after signup to appear in the directory.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessSignupForm;
