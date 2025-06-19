
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Rocket, Building, Star, Check } from 'lucide-react';
import { useSignupForm } from '../hooks/useSignupForm';
import { SalesAgent } from '@/types/sales-agent';
import ReferralCodeField from './fields/ReferralCodeField';
import HBCUVerificationField from './fields/HBCUVerificationField';
import { type SubscriptionTier } from '@/lib/services/subscription-tiers';

const businessSignupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  business_name: z.string().min(2, 'Business name must be at least 2 characters'),
  business_description: z.string().min(10, 'Description must be at least 10 characters'),
  business_address: z.string().min(5, 'Address must be at least 5 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  referralCode: z.string().optional(),
  isHBCUMember: z.boolean().default(false),
  subscription_tier: z.enum(['business_starter', 'business']).default('business_starter')
});

type BusinessSignupFormValues = z.infer<typeof businessSignupSchema>;

interface BusinessSignupFormProps {
  referralCode?: string;
  referringAgent?: SalesAgent | null;
  onCheckReferralCode?: (code: string) => Promise<SalesAgent | null>;
}

const BusinessSignupForm: React.FC<BusinessSignupFormProps> = ({
  referralCode = '',
  referringAgent,
  onCheckReferralCode
}) => {
  const navigate = useNavigate();
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>('business_starter');
  
  const {
    form: signupForm,
    isLoading,
    isHBCUMember,
    onSubmit: handleSignupSubmit,
    onReferralCodeBlur,
    handleHBCUStatusChange,
    handleHBCUFileChange
  } = useSignupForm();

  const form = useForm<BusinessSignupFormValues>({
    resolver: zodResolver(businessSignupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      business_name: '',
      business_description: '',
      business_address: '',
      phone: '',
      referralCode: referralCode,
      isHBCUMember: false,
      subscription_tier: 'business_starter'
    }
  });

  const onSubmit = async (values: BusinessSignupFormValues) => {
    try {
      const signupData = {
        ...values,
        subscription_tier: selectedTier === 'business_starter' ? 'free' : 'free', // Start with free trial for both
        user_type: 'business' as const
      };

      const result = await handleSignupSubmit(signupData);
      
      if (result?.data?.user) {
        // Redirect to subscription page to complete the subscription
        navigate(`/subscription?tier=${selectedTier}&trial=true`);
      }
    } catch (error) {
      console.error('Business signup error:', error);
    }
  };

  const businessPlans = [
    {
      id: 'business_starter' as SubscriptionTier,
      name: 'Starter Business',
      price: 29,
      description: 'Perfect for new and small businesses',
      features: [
        'Business profile creation',
        'Up to 3 QR codes',
        'Basic analytics',
        'Email support',
        '30-day free trial'
      ],
      icon: <Rocket className="h-5 w-5" />,
      popular: false
    },
    {
      id: 'business' as SubscriptionTier,
      name: 'Professional Business',
      price: 100,
      description: 'Complete business management suite',
      features: [
        'Everything in Starter',
        'Up to 50 QR codes',
        'Advanced analytics',
        'Marketing tools',
        'Priority support'
      ],
      icon: <Building className="h-5 w-5" />,
      popular: true
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Plan Selection */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Choose Your Business Plan</CardTitle>
          <CardDescription>
            Select the plan that best fits your business needs. Both plans include a 30-day free trial.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={selectedTier} 
            onValueChange={(value) => setSelectedTier(value as SubscriptionTier)}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {businessPlans.map((plan) => (
              <div key={plan.id} className="relative">
                <RadioGroupItem 
                  value={plan.id} 
                  id={plan.id} 
                  className="peer sr-only" 
                />
                <Label
                  htmlFor={plan.id}
                  className={`flex flex-col p-6 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                    selectedTier === plan.id 
                      ? 'border-mansablue bg-mansablue/5' 
                      : 'border-gray-200 hover:border-gray-300'
                  } ${plan.popular ? 'ring-2 ring-mansagold' : ''}`}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-4 bg-mansagold text-mansablue">
                      <Star className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  )}
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        selectedTier === plan.id ? 'bg-mansablue text-white' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {plan.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{plan.name}</h3>
                        <p className="text-sm text-gray-600">{plan.description}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold">${plan.price}</div>
                      <div className="text-sm text-gray-500">/month</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Business Information Form */}
      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
          <CardDescription>
            Tell us about your business to create your profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Your Full Name *</Label>
                <Input
                  id="name"
                  {...form.register('name')}
                  placeholder="John Doe"
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  {...form.register('email')}
                  placeholder="john@business.com"
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  {...form.register('password')}
                  placeholder="••••••••"
                />
                {form.formState.errors.password && (
                  <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  {...form.register('phone')}
                  placeholder="(555) 123-4567"
                />
                {form.formState.errors.phone && (
                  <p className="text-sm text-red-500">{form.formState.errors.phone.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="business_name">Business Name *</Label>
              <Input
                id="business_name"
                {...form.register('business_name')}
                placeholder="Your Business Name"
              />
              {form.formState.errors.business_name && (
                <p className="text-sm text-red-500">{form.formState.errors.business_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="business_description">Business Description *</Label>
              <Textarea
                id="business_description"
                {...form.register('business_description')}
                placeholder="Describe your business, what you offer, and what makes you unique..."
                rows={4}
              />
              {form.formState.errors.business_description && (
                <p className="text-sm text-red-500">{form.formState.errors.business_description.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="business_address">Business Address *</Label>
              <Input
                id="business_address"
                {...form.register('business_address')}
                placeholder="123 Main St, City, State 12345"
              />
              {form.formState.errors.business_address && (
                <p className="text-sm text-red-500">{form.formState.errors.business_address.message}</p>
              )}
            </div>

            <ReferralCodeField
              value={form.watch('referralCode') || ''}
              onChange={(value) => form.setValue('referralCode', value)}
              onBlur={onReferralCodeBlur}
              referringAgent={referringAgent}
            />

            <HBCUVerificationField
              isHBCUMember={isHBCUMember}
              onHBCUStatusChange={handleHBCUStatusChange}
              onFileChange={handleHBCUFileChange}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </>
              ) : (
                `Start ${businessPlans.find(p => p.id === selectedTier)?.name} Free Trial`
              )}
            </Button>

            <p className="text-sm text-gray-600 text-center">
              By signing up, you agree to our Terms of Service and Privacy Policy.
              Your 30-day free trial will begin immediately.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessSignupForm;
