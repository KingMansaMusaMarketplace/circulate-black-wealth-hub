
import React from 'react';
import { Control } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { FormValues } from './types';

interface DiscountFieldProps {
  control: Control<FormValues>;
}

export const DiscountField: React.FC<DiscountFieldProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="discountPercentage"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Discount Percentage</FormLabel>
          <FormControl>
            <Input
              type="number"
              {...field}
              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
            />
          </FormControl>
          <FormDescription>
            Discount percentage applied when this QR code is scanned.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
