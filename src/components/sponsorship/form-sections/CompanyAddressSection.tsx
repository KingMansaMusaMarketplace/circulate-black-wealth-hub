
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Control } from 'react-hook-form';

interface CompanyAddressSectionProps {
  control: Control<any>;
}

const CompanyAddressSection: React.FC<CompanyAddressSectionProps> = ({ control }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Company Address</h3>
      
      <FormField
        control={control}
        name="companyAddress"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Street Address <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <Input placeholder="123 Main Street" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormField
          control={control}
          name="companyCity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="New York" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="companyState"
          render={({ field }) => (
            <FormItem>
              <FormLabel>State <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="NY" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="companyZipCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ZIP Code <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="10001" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default CompanyAddressSection;
