
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';
import { getSalesAgentByReferralCode } from '@/lib/api/sales-agent-api';
import { SalesAgent } from '@/types/sales-agent';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import BusinessSignupForm from './forms/BusinessSignupForm';
import { CustomerSignupForm } from './forms/CustomerSignupForm';
import OrSeparator from './OrSeparator';
import SocialLogin from './SocialLogin';

const signupFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email.',
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters.',
  }),
  referralCode: z.string().optional(),
});

type SignupFormValues = z.infer<typeof signupFormSchema>;

const SignupForm: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<'customer' | 'business'>('customer');
  const [referringAgent, setReferringAgent] = useState<SalesAgent | null>(null);
  
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      referralCode: ''
    },
  });
  
  // Check for referral code in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const refCode = params.get('ref');
    
    if (refCode) {
      form.setValue('referralCode', refCode);
      checkReferralCode(refCode);
    }
  }, []);
  
  const checkReferralCode = async (code: string) => {
    if (!code) return;
    
    try {
      const agent = await getSalesAgentByReferralCode(code);
      if (agent) {
        setReferringAgent(agent);
        toast.success(`Referred by: ${agent.full_name}`);
      }
    } catch (error) {
      console.error('Error checking referral code:', error);
    }
  };

  const onSubmit = async (values: SignupFormValues) => {
    try {
      setIsLoading(true);
      
      // Check referral code if provided and not already checked
      if (values.referralCode && !referringAgent) {
        await checkReferralCode(values.referralCode);
      }

      await signUp(values.email, values.password, {
        name: values.name,
        user_type: userType,
        referral_code: values.referralCode,
        referring_agent: referringAgent?.id
      });

      toast.success('Account created successfully!');
      
      // Sign in the user automatically
      await signIn(values.email, values.password);
      
      navigate('/signup-success');
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const onReferralCodeBlur = () => {
    const code = form.getValues('referralCode');
    if (code) {
      checkReferralCode(code);
    }
  };

  const handleUserTypeChange = (value: string) => {
    setUserType(value as 'customer' | 'business');
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Sign up to start using Mansa Musa Marketplace
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs 
          defaultValue="customer" 
          className="w-full" 
          onValueChange={handleUserTypeChange}
        >
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="customer">Customer</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
          </TabsList>
          
          <TabsContent value="customer">
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
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Creating Account...' : 'Sign Up'}
                </Button>
              </form>
            </Form>
            
            <OrSeparator />
            
            <SocialLogin />
            
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
          </TabsContent>
          
          <TabsContent value="business">
            <BusinessSignupForm 
              referralCode={form.getValues('referralCode')}
              referringAgent={referringAgent}
              onCheckReferralCode={checkReferralCode}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SignupForm;
