
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { FormCheckbox } from './FormCheckbox';
import { SubmitButton } from './SubmitButton';

interface CustomerSignupFormProps {
  onSubmit: (e: React.FormEvent) => void;
  name: string;
  setName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  agreeTerms: boolean;
  setAgreeTerms: (agree: boolean) => void;
  loading: boolean;
}

export const CustomerSignupForm: React.FC<CustomerSignupFormProps> = ({
  onSubmit,
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  agreeTerms,
  setAgreeTerms,
  loading
}) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <Input
            id="name"
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <Input
            id="password"
            type="password"
            placeholder="Create a secure password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            Password must be at least 8 characters long
          </p>
        </div>
        
        <FormCheckbox 
          id="terms" 
          checked={agreeTerms}
          onCheckedChange={setAgreeTerms}
        />
        
        <SubmitButton 
          loading={loading}
          text="Sign Up - $10/month (Register Now, Pay Later)"
        />
        
        <p className="text-xs text-gray-500 text-center">
          Your subscription gives you access to all discounts, QR scanning, and loyalty rewards.
        </p>
      </div>
    </form>
  );
};
