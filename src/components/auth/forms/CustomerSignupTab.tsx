
import React, { useState } from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useSignupForm } from '../hooks/useSignupForm';
import { subscriptionService } from '@/lib/services/subscription-service';
import { getTierBenefits } from '@/lib/services/subscription-tiers';
import { toast } from 'sonner';
import { Crown, Star } from 'lucide-react';

const CustomerSignupTab: React.FC = () => {
  const { 
    form, 
    isLoading, 
    onSubmit
  } = useSignupForm();

  const [selectedTier, setSelectedTier] = useState<'free' | 'paid'>('free');

  const handleSubmitWithTier = async (values: any) => {
    try {
      // Add subscription tier to the signup data
      const signupData = {
        ...values,
        subscription_tier: selectedTier
      };

      if (selectedTier === 'free') {
        // For free tier, just create the account
        await onSubmit(signupData);
        toast.success('Free account created! You can upgrade anytime from your dashboard.');
      } else {
        // For paid tier, create account and redirect to Stripe
        await onSubmit(signupData);
        
        const checkoutData = await subscriptionService.createCheckoutSession({
          userType: 'customer',
          email: values.email,
          name: values.name
        });
        
        window.open(checkoutData.url, '_blank');
        toast.success('Account created! Complete your subscription in the new tab.');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Failed to create account');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmitWithTier)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name *</FormLabel>
              <FormControl>
                <Input placeholder="Enter your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email *</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter your email" {...field} />
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
              <FormLabel>Password *</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Create a password (min 8 characters)"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="referralCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Referral Code (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter referral code if you have one"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Subscription Tier Selection */}
        <div className="space-y-4">
          <FormLabel>Choose Your Plan</FormLabel>
          <RadioGroup 
            value={selectedTier} 
            onValueChange={(value: 'free' | 'paid') => setSelectedTier(value)}
            className="space-y-3"
          >
            {/* Free Tier */}
            <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
              <RadioGroupItem value="free" id="free" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="free" className="flex items-center gap-2 font-medium cursor-pointer">
                  <Star className="h-4 w-4 text-blue-500" />
                  Free Member
                  <span className="text-green-600 text-sm font-semibold">$0/month</span>
                </Label>
                <ul className="text-xs text-gray-600 mt-2 space-y-1">
                  {getTierBenefits('free').map((benefit, index) => (
                    <li key={index}>• {benefit}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Paid Tier */}
            <div className="flex items-start space-x-3 p-4 border-2 border-amber-200 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 hover:border-amber-300 transition-colors">
              <RadioGroupItem value="paid" id="paid" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="paid" className="flex items-center gap-2 font-medium cursor-pointer">
                  <Crown className="h-4 w-4 text-amber-500" />
                  Premium Member
                  <span className="text-amber-700 text-sm font-semibold">$10/month</span>
                </Label>
                <ul className="text-xs text-amber-700 mt-2 space-y-1">
                  {getTierBenefits('paid').map((benefit, index) => (
                    <li key={index}>• {benefit}</li>
                  ))}
                </ul>
              </div>
            </div>
          </RadioGroup>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="terms"
            required
          />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I agree to the Terms of Service and Privacy Policy *
          </label>
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Creating Account...' : 
           selectedTier === 'free' ? 'Create Free Account' : 'Create Account & Subscribe'}
        </Button>
      </form>
      
      <div className="text-center mt-4">
        <p className="text-sm text-gray-500">
          Already have an account?{' '}
          <a
            href="/login"
            className="text-mansablue hover:text-mansablue-dark font-medium"
          >
            Sign in
          </a>
        </p>
      </div>
    </Form>
  );
};

export default CustomerSignupTab;
