
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Control } from 'react-hook-form';

interface SponsorshipDetailsSectionProps {
  control: Control<any>;
}

const SponsorshipDetailsSection: React.FC<SponsorshipDetailsSectionProps> = ({ control }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Sponsorship Details</h3>
      
      <FormField
        control={control}
        name="sponsorshipTier"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Sponsorship Tier <span className="text-red-500">*</span></FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a tier" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="silver">Silver ($2,000/month)</SelectItem>
                <SelectItem value="gold">Gold ($5,000/month)</SelectItem>
                <SelectItem value="platinum">Platinum ($10,000/month)</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="message"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Additional Information (Optional)</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Tell us about your company and goals for sponsorship" 
                className="min-h-[120px]"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default SponsorshipDetailsSection;
