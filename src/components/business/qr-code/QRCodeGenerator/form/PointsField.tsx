
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
              placeholder="10"
              min="1"
              max="1000"
              {...field}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
          </FormControl>
          <FormDescription>
            Enter the number of loyalty points customers will earn (1-1000).
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
