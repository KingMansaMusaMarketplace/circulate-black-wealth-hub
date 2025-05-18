
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { FormCheckbox } from './FormCheckbox';
import { SubmitButton } from './SubmitButton';

interface BusinessSignupFormProps {
  onSubmit: (e: React.FormEvent) => void;
  businessName: string;
  setBusinessName: (name: string) => void;
  businessType: string;
  setBusinessType: (type: string) => void;
  businessAddress: string;
  setBusinessAddress: (address: string) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  agreeTerms: boolean;
  setAgreeTerms: (agree: boolean) => void;
  loading: boolean;
}

export const BusinessSignupForm: React.FC<BusinessSignupFormProps> = ({
  onSubmit,
  businessName,
  setBusinessName,
  businessType,
  setBusinessType,
  businessAddress,
  setBusinessAddress,
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
          <label htmlFor="business-name" className="block text-sm font-medium text-gray-700 mb-1">
            Business Name <span className="text-red-500">*</span>
          </label>
          <Input
            id="business-name"
            type="text"
            placeholder="Your Business Name"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="business-type" className="block text-sm font-medium text-gray-700 mb-1">
            Business Type <span className="text-red-500">*</span>
          </label>
          <select
            id="business-type"
            value={businessType}
            onChange={(e) => setBusinessType(e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-mansablue focus:ring-mansablue"
            required
          >
            <option value="">Select a category</option>
            <option value="restaurant">Restaurant</option>
            <option value="retail">Retail</option>
            <option value="beauty">Beauty & Barber</option>
            <option value="services">Professional Services</option>
            <option value="health">Health & Wellness</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="business-address" className="block text-sm font-medium text-gray-700 mb-1">
            Business Address <span className="text-red-500">*</span>
          </label>
          <Input
            id="business-address"
            type="text"
            placeholder="123 Main St, City, State"
            value={businessAddress}
            onChange={(e) => setBusinessAddress(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="business-email" className="block text-sm font-medium text-gray-700 mb-1">
            Business Email <span className="text-red-500">*</span>
          </label>
          <Input
            id="business-email"
            type="email"
            placeholder="business@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="business-password" className="block text-sm font-medium text-gray-700 mb-1">
            Password <span className="text-red-500">*</span>
          </label>
          <Input
            id="business-password"
            type="password"
            placeholder="Create a secure password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Business Subscription:</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• First month completely free</li>
            <li>• $100/month after trial period</li>
            <li>• Enhanced visibility to subscribers</li>
            <li>• QR code for in-store discounts</li>
            <li>• Customer loyalty analytics</li>
          </ul>
        </div>
        
        <FormCheckbox 
          id="business-terms" 
          checked={agreeTerms}
          onCheckedChange={setAgreeTerms}
        />
        
        <SubmitButton 
          loading={loading}
          text="Continue to Payment"
        />
      </div>
    </form>
  );
};
