
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { secureSignUp } from '@/lib/security/auth-security';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ContextualTooltip } from '@/components/ui/ContextualTooltip';
import { ProgressiveDisclosure } from '@/components/ui/ProgressiveDisclosure';
import { businessCategories as businessCategoriesData } from '@/data/categories';
import ReferralCodeInput from '@/components/business/ReferralCodeInput';
import { processBusinessReferral } from '@/lib/api/referral-tracking-api';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';
import { Progress } from '@/components/ui/progress';

const businessSignupSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  category: z.string().min(1, 'Please select a business category'),
  phone: z.string().min(10, 'Phone number is required for business accounts'),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  website: z.string().optional(),
  description: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type BusinessSignupForm = z.infer<typeof businessSignupSchema>;

interface BusinessSignupFormProps {
  referralCode: string;
  referringAgent: any;
  onCheckReferralCode: (code: string) => Promise<any>;
  onSuccess?: () => void;
}

const categoryOptions = Array.from(
  new Set(
    (businessCategoriesData || []).map(c => c.name).filter(Boolean)
  )
).sort((a, b) => a.localeCompare(b));

const BusinessSignupForm: React.FC<BusinessSignupFormProps> = ({ 
  referralCode, 
  referringAgent, 
  onCheckReferralCode,
  onSuccess 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [enteredReferralCode, setEnteredReferralCode] = useState(referralCode || '');
  const [isReferralValid, setIsReferralValid] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<BusinessSignupForm>({
    resolver: zodResolver(businessSignupSchema)
  });

  const watchCategory = watch('category');
  const watchPassword = watch('password');

  // Calculate form completion percentage
  const formFields = ['fullName', 'businessName', 'email', 'category', 'phone', 'password', 'confirmPassword'];
  const completedFields = formFields.filter(field => {
    const value = watch(field as any);
    return value && value.toString().length > 0;
  }).length;
  const completionPercentage = Math.round((completedFields / formFields.length) * 100);

  const onSubmit = async (data: BusinessSignupForm) => {
    setIsLoading(true);
    setError(null);

    try {
      // Use secure signup with enhanced validation and rate limiting
      const result = await secureSignUp(
        data.email,
        data.password,
        {
          user_type: 'business',
          full_name: data.fullName,
          business_name: data.businessName,
          business_description: data.description,
          business_category: data.category,
          phone: data.phone,
          referral_code: referralCode
        }
      );

      if (!result.success) {
        throw new Error(result.error || 'Failed to create account');
      }

      if (result.data?.user) {
        // Create business profile
        const { data: businessData, error: businessError } = await supabase
          .from('businesses')
          .insert({
            name: data.businessName,
            business_name: data.businessName,
            owner_id: result.data.user.id,
            category: data.category,
            description: data.description,
            email: data.email,
            phone: data.phone,
            address: data.address,
            city: data.city,
            state: data.state,
            zip_code: data.zipCode,
            website: data.website,
          })
          .select()
          .single();

        if (businessError) {
          console.error('Business creation error:', businessError);
          toast.error('Account created but business profile needs completion');
        } else if (businessData && enteredReferralCode && isReferralValid) {
          // Process referral tracking if valid referral code was provided
          try {
            const referralResult = await processBusinessReferral(
              businessData.id,
              enteredReferralCode
            );
            
            if (referralResult.success) {
              toast.success('Referral tracked! Your sales agent will receive credit.');
            }
          } catch (referralError) {
            console.error('Referral processing error:', referralError);
            // Don't fail the signup if referral tracking fails
            toast.warning('Business created but referral tracking failed');
          }
        }

        setSuccess(true);
        toast.success('Business account created successfully! Please check your email to verify your account.');
        reset();
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
              <strong className="text-green-700 text-lg block mb-2">🎉 Business account created successfully!</strong>
              Please check your email to verify your account and get started.
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
          <div className="relative pt-4">
      <ProgressiveDisclosure
        id="business-signup-benefits"
        title="Ready to grow your business?"
        message="Join thousands of successful Black-owned businesses on our platform. Get discovered by customers actively looking for businesses like yours, build loyalty with rewards, and access detailed analytics to grow your reach."
        autoShow={true}
        position="top"
        actionText="Let's Get Started!"
      />

      {/* Progress Indicator */}
      {completionPercentage > 0 && completionPercentage < 100 && (
        <div className="space-y-2 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-gray-700 font-semibold">Form Completion</span>
            <span className="font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className="h-3" />
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <Alert className="border-0 bg-gradient-to-r from-red-500 to-orange-500 p-0.5">
            <div className="bg-white rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <AlertDescription className="text-gray-800 font-medium">{error}</AlertDescription>
            </div>
          </Alert>
        )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-gray-900 font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500"></span>
            Owner Full Name
          </Label>
          <Input
            id="fullName"
            {...register('fullName')}
            disabled={isLoading}
            placeholder="Enter owner's full name"
            className="border-2 focus:border-orange-500"
          />
          {errors.fullName && (
            <p className="text-sm text-red-600">{errors.fullName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessName" className="text-gray-900 font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500"></span>
            Business Name
          </Label>
          <Input
            id="businessName"
            {...register('businessName')}
            disabled={isLoading}
            placeholder="Enter business name"
            className="border-2 focus:border-orange-500"
          />
          {errors.businessName && (
            <p className="text-sm text-red-600">{errors.businessName.message}</p>
          )}
        </div>
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
        />
        {errors.email && (
          <p className="text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category" className="text-gray-900 font-semibold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500"></span>
          Business Category
        </Label>
        <Select onValueChange={(value) => setValue('category', value)} value={watchCategory}>
          <SelectTrigger className="border-2 focus:border-orange-500">
            <SelectValue placeholder="Select business category" />
          </SelectTrigger>
          <SelectContent className="max-h-80 overflow-y-auto z-50 bg-background">
            {categoryOptions.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-sm text-red-600">{errors.category.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-gray-900 font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500"></span>
            Phone
          </Label>
          <Input
            id="phone"
            type="tel"
            {...register('phone')}
            disabled={isLoading}
            placeholder="Business phone number"
            className="border-2 focus:border-orange-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website" className="text-gray-900 font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500"></span>
            Website (Optional)
          </Label>
          <Input
            id="website"
            type="url"
            {...register('website')}
            disabled={isLoading}
            placeholder="https://yourbusiness.com"
            className="border-2 focus:border-orange-500"
          />
        </div>
      </div>

      <ContextualTooltip
        id="business-location-info"
        title="Location Information"
        tip="Accurate location details help customers find your business on our map and in local searches. Complete address information improves your visibility to nearby customers."
        trigger="hover"
      >
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            {...register('address')}
            disabled={isLoading}
            placeholder="Business address"
          />
        </div>
      </ContextualTooltip>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            {...register('city')}
            disabled={isLoading}
            placeholder="City"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            {...register('state')}
            disabled={isLoading}
            placeholder="State"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="zipCode">ZIP Code</Label>
          <Input
            id="zipCode"
            {...register('zipCode')}
            disabled={isLoading}
            placeholder="ZIP Code"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Business Description</Label>
        <Textarea
          id="description"
          {...register('description')}
          disabled={isLoading}
          placeholder="Tell us about your business..."
          rows={3}
        />
      </div>

      <ReferralCodeInput
        value={enteredReferralCode}
        onChange={setEnteredReferralCode}
        onValidate={(isValid) => setIsReferralValid(isValid)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <PasswordStrengthIndicator password={watchPassword || ''} />
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
      </div>

      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-yellow-500 via-orange-500 to-amber-500 hover:from-yellow-600 hover:via-orange-600 hover:to-amber-600 text-white font-bold py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]" 
        disabled={isLoading}
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
    </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessSignupForm;
