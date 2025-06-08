
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
import { Switch } from '@/components/ui/switch';
import { FormValues } from './types';

interface ActiveStatusFieldProps {
  control: Control<FormValues>;
}

export const ActiveStatusField: React.FC<ActiveStatusFieldProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="isActive"
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <FormLabel className="text-base">Active Status</FormLabel>
            <FormDescription>
              Enable this QR code for customer scanning.
            </FormDescription>
          </div>
          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
