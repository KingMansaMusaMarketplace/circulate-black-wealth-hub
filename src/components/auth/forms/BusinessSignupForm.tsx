
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
        const { error: businessError } = await supabase
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
          });

        if (businessError) {
          console.error('Business creation error:', businessError);
          // Don't throw here as the user account was created successfully
          toast.error('Account created but business profile needs completion');
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
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          Business account created successfully! Please check your email to verify your account.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <ProgressiveDisclosure
        id="business-signup-benefits"
        title="Ready to grow your business?"
        message="Join thousands of successful Black-owned businesses on our platform. Get discovered by customers actively looking for businesses like yours, build loyalty with rewards, and access detailed analytics to grow your reach."
        autoShow={true}
        position="top"
        actionText="Let's Get Started!"
      />
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Owner Full Name</Label>
          <Input
            id="fullName"
            {...register('fullName')}
            disabled={isLoading}
            placeholder="Enter owner's full name"
          />
          {errors.fullName && (
            <p className="text-sm text-red-600">{errors.fullName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessName">Business Name</Label>
          <Input
            id="businessName"
            {...register('businessName')}
            disabled={isLoading}
            placeholder="Enter business name"
          />
          {errors.businessName && (
            <p className="text-sm text-red-600">{errors.businessName.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Business Email</Label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          disabled={isLoading}
          placeholder="Enter business email"
        />
        {errors.email && (
          <p className="text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Business Category</Label>
        <Select onValueChange={(value) => setValue('category', value)} value={watchCategory}>
          <SelectTrigger>
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
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            {...register('phone')}
            disabled={isLoading}
            placeholder="Business phone number"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website (Optional)</Label>
          <Input
            id="website"
            type="url"
            {...register('website')}
            disabled={isLoading}
            placeholder="https://yourbusiness.com"
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

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Business Account...
          </>
        ) : (
          'Create Business Account'
        )}
      </Button>
    </form>
    </div>
  );
};

export default BusinessSignupForm;
