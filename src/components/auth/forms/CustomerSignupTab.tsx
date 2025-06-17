
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomerSignupForm } from './CustomerSignupForm';
import { useAuth } from '@/contexts/AuthContext';
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
      console.log('Creating free customer account...');
      
      const metadata = {
        name,
        fullName: name,
        email,
        user_type: 'customer',
        userType: 'customer',
        phone,
        address,
        subscription_tier: 'free' // Set to free tier instead of paid
      };

      const result = await signUp(email, password, metadata);

      if (result.data?.user) {
        console.log('✅ Free customer account created successfully');
        toast.success('Welcome! Your free account has been created. Start browsing businesses now!');
        
        // Redirect to directory instead of payment
        navigate('/directory');
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
