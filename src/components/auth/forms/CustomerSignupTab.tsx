
import React from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useSignupForm } from '../hooks/useSignupForm';

const CustomerSignupTab: React.FC = () => {
  const { 
    form, 
    isLoading, 
    onSubmit
  } = useSignupForm();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Creating Account...' : 'Create Customer Account'}
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
