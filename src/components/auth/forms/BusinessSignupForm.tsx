
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { signUp } from '@/lib/auth';
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';
import { SalesAgent } from '@/types/sales-agent';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import PaymentNotice from './PaymentNotice';

const businessSignupFormSchema = z.object({
  businessName: z.string().min(2, {
    message: 'Business name must be at least 2 characters.',
  }),
  description: z.string().optional(),
  name: z.string().min(2, {
    message: 'Owner name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email.',
  }),
  phone: z.string().optional(),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters.',
  }),
  referralCode: z.string().optional(),
});

type BusinessSignupFormValues = z.infer<typeof businessSignupFormSchema>;

interface BusinessSignupFormProps {
  referralCode?: string;
  referringAgent: SalesAgent | null;
  onCheckReferralCode: (code: string) => Promise<void>;
}

const BusinessSignupForm: React.FC<BusinessSignupFormProps> = ({ 
  referralCode,
  referringAgent,
  onCheckReferralCode
}) => {
  const navigate = useNavigate();
  const { signInWithEmail } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<BusinessSignupFormValues>({
    resolver: zodResolver(businessSignupFormSchema),
    defaultValues: {
      businessName: '',
      description: '',
      name: '',
      email: '',
      phone: '',
      password: '',
      referralCode: referralCode || ''
    },
  });

  const onSubmit = async (values: BusinessSignupFormValues) => {
    try {
      setIsLoading(true);
      
      if (values.referralCode && !referringAgent) {
        await onCheckReferralCode(values.referralCode);
      }
      
      // Sign up the business owner
      await signUp(values.email, values.password, {
        name: values.name,
        user_type: 'business',
        business_name: values.businessName,
        business_description: values.description,
        phone: values.phone,
        referral_code: values.referralCode,
        referring_agent: referringAgent?.id
      });

      toast.success('Business account created successfully!');
      
      // Sign in the user automatically
      await signInWithEmail(values.email, values.password);
      
      navigate('/signup-success');
    } catch (error: any) {
      console.error('Business signup error:', error);
      toast.error(error.message || 'Failed to create business account');
    } finally {
      setIsLoading(false);
    }
  };

  const onReferralCodeBlur = () => {
    const code = form.getValues('referralCode');
    if (code) {
      onCheckReferralCode(code);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="businessName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your business name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Description (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter a short description of your business" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Owner Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter owner name" {...field} />
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
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Enter your phone number" {...field} />
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
        
        <FormField
          control={form.control}
          name="referralCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Referral Code (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter referral code"
                  {...field}
                  onBlur={onReferralCodeBlur}
                />
              </FormControl>
              <FormMessage />
              {referringAgent && (
                <p className="text-xs text-green-600">Referred by: {referringAgent.full_name}</p>
              )}
            </FormItem>
          )}
        />
        
        <PaymentNotice />
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Creating Account...' : 'Sign Up as Business'}
        </Button>
        
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
      </form>
    </Form>
  );
};

export default BusinessSignupForm;
