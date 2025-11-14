
import React from 'react';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { FormCheckbox } from './FormCheckbox';
import { SubmitButton } from './SubmitButton';
import { shouldHideStripePayments } from '@/utils/platform-utils';

interface CustomerSignupFormProps {
  onSubmit: (e: React.FormEvent) => void;
  name: string;
  setName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (confirmPassword: string) => void;
  agreeTerms: boolean;
  setAgreeTerms: (agree: boolean) => void;
  loading: boolean;
  phone: string;
  setPhone: (phone: string) => void;
  address: string;
  setAddress: (address: string) => void;
  passwordError?: string;
}

export const CustomerSignupForm: React.FC<CustomerSignupFormProps> = ({
  onSubmit,
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  agreeTerms,
  setAgreeTerms,
  loading,
  phone,
  setPhone,
  address,
  setAddress,
  passwordError
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
          <PasswordInput
            id="password"
            placeholder="Create a secure password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            Password must be at least 8 characters long
          </p>
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <PasswordInput
            id="confirmPassword"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {passwordError && (
            <p className="mt-1 text-xs text-red-500">{passwordError}</p>
          )}
        </div>
        
        <FormCheckbox 
          id="terms" 
          checked={agreeTerms}
          onCheckedChange={setAgreeTerms}
        />
        
        {/* Free Membership Benefits */}
        <div className="space-y-4">
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <h4 className="text-sm font-medium text-green-900 mb-2">🎉 FREE MEMBERSHIP INCLUDES:</h4>
            <ul className="text-xs text-green-700 space-y-1">
              <li>✓ Browse complete business directory</li>
              <li>✓ Discover Black-owned businesses near you</li>
              <li>✓ View detailed business profiles</li>
              <li>✓ Access business contact information</li>
              <li>✓ Support community economic growth</li>
            </ul>
          </div>
          
          {!shouldHideStripePayments() && (
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="text-sm font-medium text-blue-900 mb-2">🚀 Want More? Upgrade Later:</h4>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Premium features available</li>
                <li>• Get 5% - 30% discounts at businesses</li>
                <li>• Earn and redeem loyalty points</li>
                <li>• Access exclusive member deals</li>
                <li>• Priority customer support</li>
              </ul>
              <p className="text-xs text-blue-600 mt-2 font-medium">
                Start free now - upgrade anytime!
              </p>
            </div>
          )}
        </div>
        
        <SubmitButton 
          loading={loading}
          text="Create Free Account & Start Browsing"
        />
      </div>
    </form>
  );
};
