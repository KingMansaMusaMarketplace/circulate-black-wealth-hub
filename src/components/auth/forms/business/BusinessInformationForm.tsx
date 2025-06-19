
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { SalesAgent } from '@/types/sales-agent';
import ReferralCodeField from '../fields/ReferralCodeField';
import HBCUVerificationField from '../fields/HBCUVerificationField';

interface BusinessSignupFormValues {
  name: string;
  email: string;
  password: string;
  business_name: string;
  business_description: string;
  business_address: string;
  phone: string;
  referralCode?: string;
  isHBCUMember: boolean;
  subscription_tier: 'business_starter' | 'business';
}

interface BusinessInformationFormProps {
  form: UseFormReturn<any>; // Use any to avoid type conflicts
  onSubmit: (values: any) => Promise<void>; // Use any to avoid type conflicts
  isLoading: boolean;
  isHBCUMember: boolean;
  referringAgent: SalesAgent | null;
  selectedTierName: string;
  onReferralCodeBlur: () => void;
  onHBCUStatusChange: (checked: boolean) => void;
  onHBCUFileChange: (file: File | null) => void;
}

const BusinessInformationForm: React.FC<BusinessInformationFormProps> = ({
  form,
  onSubmit,
  isLoading,
  isHBCUMember,
  referringAgent,
  selectedTierName,
  onReferralCodeBlur,
  onHBCUStatusChange,
  onHBCUFileChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Information</CardTitle>
        <CardDescription>
          Tell us about your business to create your profile
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Your Full Name *</Label>
              <Input
                id="name"
                {...form.register('name')}
                placeholder="John Doe"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                {...form.register('email')}
                placeholder="john@business.com"
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                {...form.register('password')}
                placeholder="••••••••"
              />
              {form.formState.errors.password && (
                <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                {...form.register('phone')}
                placeholder="(555) 123-4567"
              />
              {form.formState.errors.phone && (
                <p className="text-sm text-red-500">{form.formState.errors.phone.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="business_name">Business Name *</Label>
            <Input
              id="business_name"
              {...form.register('business_name')}
              placeholder="Your Business Name"
            />
            {form.formState.errors.business_name && (
              <p className="text-sm text-red-500">{form.formState.errors.business_name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="business_description">Business Description *</Label>
            <Textarea
              id="business_description"
              {...form.register('business_description')}
              placeholder="Describe your business, what you offer, and what makes you unique..."
              rows={4}
            />
            {form.formState.errors.business_description && (
              <p className="text-sm text-red-500">{form.formState.errors.business_description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="business_address">Business Address *</Label>
            <Input
              id="business_address"
              {...form.register('business_address')}
              placeholder="123 Main St, City, State 12345"
            />
            {form.formState.errors.business_address && (
              <p className="text-sm text-red-500">{form.formState.errors.business_address.message}</p>
            )}
          </div>

          <ReferralCodeField
            value={form.watch('referralCode') || ''}
            onChange={(value) => form.setValue('referralCode', value)}
            onBlur={onReferralCodeBlur}
            referringAgent={referringAgent}
          />

          <HBCUVerificationField
            isHBCUMember={isHBCUMember}
            onHBCUStatusChange={onHBCUStatusChange}
            onFileChange={onHBCUFileChange}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating Account...
              </>
            ) : (
              `Start ${selectedTierName} Free Trial`
            )}
          </Button>

          <p className="text-sm text-gray-600 text-center">
            By signing up, you agree to our Terms of Service and Privacy Policy.
            Your 30-day free trial will begin immediately.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default BusinessInformationForm;
