
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormValues } from './types';

interface QRCodeTypeFieldProps {
  control: Control<FormValues>;
}

export const QRCodeTypeField: React.FC<QRCodeTypeFieldProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="codeType"
      render={({ field }) => (
        <FormItem>
          <FormLabel>QR Code Type</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a QR code type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="loyalty">Loyalty Points</SelectItem>
              <SelectItem value="discount">Discount</SelectItem>
              <SelectItem value="checkin">Check-in</SelectItem>
            </SelectContent>
          </Select>
          <FormDescription>
            Select the type of QR code you want to generate.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
