
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

interface ExpirationDateFieldProps {
  control: Control<FormValues>;
}

export const ExpirationDateField: React.FC<ExpirationDateFieldProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="expirationDate"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Expiration Date (Optional)</FormLabel>
          <FormControl>
            <Input
              type="date"
              {...field}
              min={new Date().toISOString().split('T')[0]}
            />
          </FormControl>
          <FormDescription>
            Set when this QR code should expire. Leave empty if it should never expire.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
