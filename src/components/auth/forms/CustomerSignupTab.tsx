
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomerSignupForm } from './CustomerSignupForm';
import { useAuth } from '@/contexts/AuthContext';
import { subscriptionService } from '@/lib/services/subscription-service';
import { toast } from 'sonner';

const CustomerSignupTab: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const validatePasswords = () => {
    if (password !== confirmPassword) {
      setPasswordError("Passwords don't match");
      return false;
    }
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePasswords()) {
      return;
    }

    if (!agreeTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    setLoading(true);
    
    try {
      console.log('Creating customer account...');
      
      const metadata = {
        name,
        user_type: 'customer',
        phone,
        address,
        subscription_tier: 'paid'
      };

      const result = await signUp(email, password, metadata);

      if (result.data?.user) {
        console.log('✅ Customer account created, redirecting to payment...');
        
        // Create Stripe checkout session for customer subscription
        const checkoutData = await subscriptionService.createCheckoutSession({
          userType: 'customer',
          email,
          name,
          tier: 'premium'
        });

        if (checkoutData.url) {
          // Redirect to Stripe checkout
          window.location.href = checkoutData.url;
        } else {
          throw new Error('Failed to create checkout session');
        }
      }
    } catch (error: any) {
      console.error('❌ Customer signup error:', error);
      toast.error(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomerSignupForm
      onSubmit={handleSubmit}
      name={name}
      setName={setName}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      confirmPassword={confirmPassword}
      setConfirmPassword={setConfirmPassword}
      agreeTerms={agreeTerms}
      setAgreeTerms={setAgreeTerms}
      loading={loading}
      phone={phone}
      setPhone={setPhone}
      address={address}
      setAddress={setAddress}
      passwordError={passwordError}
    />
  );
};

export default CustomerSignupTab;
