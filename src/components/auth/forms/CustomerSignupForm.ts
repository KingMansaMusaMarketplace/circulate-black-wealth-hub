
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
  phone: string;
  setPhone: (phone: string) => void;
  address: string;
  setAddress: (address: string) => void;
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
  loading,
  phone,
  setPhone,
  address,
  setAddress
}) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name <span className="text-red-500">*</span>
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
            Email <span className="text-red-500">*</span>
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
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <Input
            id="phone"
            type="tel"
            placeholder="Your Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Address <span className="text-red-500">*</span>
          </label>
          <Input
            id="address"
            type="text"
            placeholder="Your Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password <span className="text-red-500">*</span>
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
        
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Customer Subscription:</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• $10/month subscription fee</li>
            <li>• Access to all businesses in the network</li>
            <li>• Unlimited QR code scans</li>
            <li>• Loyalty rewards program access</li>
          </ul>
        </div>
        
        <SubmitButton 
          loading={loading}
          text="Continue to Payment"
        />
      </div>
    </form>
  );
};
