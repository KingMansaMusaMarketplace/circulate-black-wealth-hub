
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { CustomerSignupForm } from './forms/CustomerSignupForm';
import { BusinessSignupForm } from './forms/BusinessSignupForm';
import { PaymentNotice } from './forms/PaymentNotice';
import { subscriptionService } from '@/lib/services/subscription-service';

interface SignupFormProps {
  onSubmit: (email: string, password: string, metadata: any) => Promise<any>;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent, userType: 'customer' | 'business') => {
    e.preventDefault();
    
    if (!agreeTerms) {
      toast({
        title: "Please agree to terms",
        description: "You must agree to the terms of service to continue.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Create metadata based on user type
      const metadata = userType === 'customer' 
        ? { 
            userType: 'customer',
            fullName: name,
            subscription_status: 'pending',
          }
        : {
            userType: 'business',
            businessName,
            businessType,
            businessAddress,
            subscription_status: 'trial',
          };
      
      console.log("Attempting signup with metadata:", metadata);
      
      // Register the user first
      const { data, error } = await onSubmit(email, password, metadata);
      
      if (error) {
        console.error("Signup error:", error);
        throw error;
      }
      
      console.log("Signup successful:", data);
      
      // If signup was successful, redirect to Stripe checkout or dashboard
      if (data) {
        try {
          // Create checkout session
          const checkoutOptions = {
            userType,
            email,
            name: name,
            businessName: businessName
          };
          
          console.log("Creating checkout session with options:", checkoutOptions);
          
          const { url } = await subscriptionService.createCheckoutSession(checkoutOptions);
          
          if (url) {
            console.log("Redirecting to checkout URL:", url);
            // Redirect to Stripe checkout
            window.location.href = url;
          } else {
            // Fallback to dashboard if no URL
            toast({
              title: "Account Created",
              description: "Your account has been created successfully!",
            });
            navigate('/dashboard');
          }
        } catch (checkoutError) {
          console.error('Checkout error:', checkoutError);
          // If checkout fails, still allow access but show warning
          toast({
            title: "Subscription Setup Pending",
            description: "Your account was created, but we couldn't set up your subscription. Please try again from your dashboard.",
            variant: "destructive"
          });
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: "Signup Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tabs defaultValue="customer" className="w-full">
      <TabsList className="grid grid-cols-2 mb-6">
        <TabsTrigger value="customer">Customer</TabsTrigger>
        <TabsTrigger value="business">Business Owner</TabsTrigger>
      </TabsList>

      <TabsContent value="customer">
        <CustomerSignupForm 
          onSubmit={(e) => handleSignup(e, 'customer')}
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          agreeTerms={agreeTerms}
          setAgreeTerms={setAgreeTerms}
          loading={loading}
        />
      </TabsContent>

      <TabsContent value="business">
        <BusinessSignupForm 
          onSubmit={(e) => handleSignup(e, 'business')}
          businessName={businessName}
          setBusinessName={setBusinessName}
          businessType={businessType}
          setBusinessType={setBusinessType}
          businessAddress={businessAddress}
          setBusinessAddress={setBusinessAddress}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          agreeTerms={agreeTerms}
          setAgreeTerms={setAgreeTerms}
          loading={loading}
        />
      </TabsContent>
    </Tabs>
  );
};

export default SignupForm;
