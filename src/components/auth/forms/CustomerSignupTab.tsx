
import React from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import ReferralCodeField from './fields/ReferralCodeField';
import { useSignupForm } from '../hooks/useSignupForm';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const CustomerSignupTab: React.FC = () => {
  const { 
    form, 
    isLoading, 
    referringAgent,
    onSubmit, 
    onReferralCodeBlur 
  } = useSignupForm();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
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
              <FormLabel>Email</FormLabel>
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Create a password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <ReferralCodeField
          control={form.control}
          referringAgent={referringAgent}
          onBlur={onReferralCodeBlur}
        />
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Creating Account...' : 'Sign Up'}
        </Button>
      </form>
      
      <div className="text-center mt-4">
        <p className="text-sm text-gray-500">
          Already have an account?{' '}
          <a
            href="/login"
            className="text-mansablue hover:text-mansablue-dark"
          >
            Sign in
          </a>
        </p>
      </div>
    </Form>
  );
};

export default CustomerSignupTab;
