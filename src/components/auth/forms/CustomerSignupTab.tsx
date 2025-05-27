
import React from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useSignupForm } from '../hooks/useSignupForm';
import { subscriptionService } from '@/lib/services/subscription-service';
import { toast } from 'sonner';

const CustomerSignupTab: React.FC = () => {
  const { 
    form, 
    isLoading, 
    onSubmit
  } = useSignupForm();

  const handleSubmitWithPayment = async (values: any) => {
    try {
      // First create the account
      await onSubmit(values);
      
      // Then redirect to Stripe checkout for subscription
      const checkoutData = await subscriptionService.createCheckoutSession({
        userType: 'customer',
        email: values.email,
        name: values.name
      });
      
      // Open Stripe checkout in a new tab
      window.open(checkoutData.url, '_blank');
      
      toast.success('Account created! Complete your subscription in the new tab.');
    } catch (error: any) {
      console.error('Signup with payment error:', error);
      toast.error(error.message || 'Failed to create account or start subscription');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmitWithPayment)} className="space-y-4">
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
        
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Customer Benefits:</h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Access to exclusive Black-owned businesses</li>
            <li>• Earn loyalty points with every purchase</li>
            <li>• Special discounts and offers</li>
            <li>• Support economic empowerment</li>
          </ul>
          <div className="mt-2 text-xs text-blue-800 font-medium">
            Subscription: $10/month after account creation
          </div>
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Creating Account...' : 'Create Account & Subscribe'}
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
