
import React from 'react';
import { Control } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SalesAgent } from '@/types/sales-agent';
import { SignupFormValues } from '../schemas/signupFormSchema';

interface ReferralCodeFieldProps {
  control: Control<SignupFormValues>;
  referringAgent: SalesAgent | null;
  onBlur: () => void;
}

const ReferralCodeField: React.FC<ReferralCodeFieldProps> = ({ 
  control, 
  referringAgent, 
  onBlur 
}) => {
  return (
    <FormField
      control={control}
      name="referralCode"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Referral Code (Optional)</FormLabel>
          <FormControl>
            <Input
              placeholder="Enter referral code"
              {...field}
              onBlur={onBlur}
            />
          </FormControl>
          <FormMessage />
          {referringAgent && (
            <p className="text-xs text-green-600">Referred by: {referringAgent.full_name}</p>
          )}
        </FormItem>
      )}
    />
  );
};

export default ReferralCodeField;
