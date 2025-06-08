
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
              placeholder="10"
              min="1"
              max="100"
              {...field}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
          </FormControl>
          <FormDescription>
            Enter the discount percentage customers will receive (1-100%).
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
