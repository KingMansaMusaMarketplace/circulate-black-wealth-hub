
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

interface ScanLimitFieldProps {
  control: Control<FormValues>;
}

export const ScanLimitField: React.FC<ScanLimitFieldProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="scanLimit"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Scan Limit (Optional)</FormLabel>
          <FormControl>
            <Input
              type="number"
              placeholder="Unlimited"
              {...field}
              onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
              value={field.value || ''}
            />
          </FormControl>
          <FormDescription>
            Maximum number of times this QR code can be scanned. Leave empty for unlimited.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
