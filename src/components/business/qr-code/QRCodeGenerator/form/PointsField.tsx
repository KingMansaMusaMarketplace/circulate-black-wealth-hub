
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

interface PointsFieldProps {
  control: Control<FormValues>;
}

export const PointsField: React.FC<PointsFieldProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="pointsValue"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Points Value</FormLabel>
          <FormControl>
            <Input
              type="number"
              {...field}
              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
            />
          </FormControl>
          <FormDescription>
            Number of loyalty points awarded when this QR code is scanned.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
