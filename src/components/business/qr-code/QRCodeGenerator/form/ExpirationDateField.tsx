
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
              value={field.value || ''}
            />
          </FormControl>
          <FormDescription>
            Date when this QR code expires. Leave empty for no expiration.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
