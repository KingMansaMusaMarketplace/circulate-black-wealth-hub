
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { UseFormReturn } from 'react-hook-form';
import { SalesAgent } from '@/types/sales-agent';
import { Loader2, Star, Crown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import ReferralCodeField from '../fields/ReferralCodeField';
import HBCUVerificationField from '../fields/HBCUVerificationField';
import CategoryField from '@/components/business/business-form/CategoryField';

interface BusinessInformationFormProps {
  form: UseFormReturn<any>;
  onSubmit: (values: any) => Promise<void>;
  isLoading: boolean;
  isHBCUMember: boolean;
  referringAgent?: SalesAgent | null;
  selectedTierName: string;
  onReferralCodeBlur?: (code: string) => Promise<void>;
  onHBCUStatusChange?: (isHBCU: boolean) => void;
  onHBCUFileChange?: (file: File | null) => void;
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
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Crown className="h-6 w-6 text-mansagold" />
          <CardTitle className="text-2xl">Business Information</CardTitle>
        </div>
        <CardDescription>
          Complete your business profile for {selectedTierName}
        </CardDescription>
        <div className="flex justify-center">
          <Badge variant="outline" className="text-mansablue border-mansablue">
            <Star className="h-3 w-3 mr-1" />
            30-Day Free Trial Included
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Your full name" {...field} />
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
                    <FormLabel>Email Address *</FormLabel>
                    <FormControl>
                      <Input placeholder="your@email.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password *</FormLabel>
                    <FormControl>
                      <Input placeholder="Create a secure password" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number *</FormLabel>
                    <FormControl>
                      <Input placeholder="(555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Business Information */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Details</h3>
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="business_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Your business name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <CategoryField form={form} name="category" />

                <FormField
                  control={form.control}
                  name="business_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Description *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your business, products, or services" 
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="business_address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Address *</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St, City, State 12345" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Referral Code Section */}
            <div className="border-t pt-6">
              <ReferralCodeField
                value={form.watch('referralCode') || ''}
                onChange={(value) => form.setValue('referralCode', value)}
                onBlur={() => {
                  const code = form.getValues('referralCode');
                  if (code && onReferralCodeBlur) {
                    onReferralCodeBlur(code);
                  }
                }}
                referringAgent={referringAgent || null}
              />
            </div>

            {/* HBCU Verification Section */}
            <div className="border-t pt-6">
              <HBCUVerificationField
                isHBCUMember={isHBCUMember}
                onHBCUStatusChange={onHBCUStatusChange}
                onFileChange={onHBCUFileChange}
              />
            </div>

            {/* Submit Button */}
            <div className="border-t pt-6">
              <Button 
                type="submit" 
                className="w-full bg-mansablue hover:bg-mansablue-dark text-white py-6 text-lg font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating Your Account...
                  </>
                ) : (
                  <>
                    Start Your Free Trial
                    <Star className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
              
              <p className="text-center text-sm text-gray-600 mt-3">
                You'll be redirected to complete your subscription setup after account creation.
              </p>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default BusinessInformationForm;
