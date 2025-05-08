
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { CustomerSignupForm } from './forms/CustomerSignupForm';
import { BusinessSignupForm } from './forms/BusinessSignupForm';
import { PaymentNotice } from './forms/PaymentNotice';

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
            subscription_status: 'active',
            subscription_start_date: new Date().toISOString(),
            subscription_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
          }
        : {
            userType: 'business',
            businessName,
            businessType,
            businessAddress,
            subscription_status: 'trial',
            subscription_start_date: new Date().toISOString(),
            subscription_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 day trial
          };
      
      const { data, error } = await onSubmit(email, password, metadata);
      
      if (error) throw error;
      
      // If signup was successful, redirect to dashboard
      if (data) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Signup error:', error);
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

      <PaymentNotice />

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
