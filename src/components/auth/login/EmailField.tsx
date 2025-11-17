
import React from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { LoginFormValues } from './LoginSchema';

interface EmailFieldProps {
  form: UseFormReturn<LoginFormValues>;
}

export const EmailField: React.FC<EmailFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-slate-200">Email</FormLabel>
          <FormControl>
            <Input 
              placeholder="Enter your email" 
              {...field}
              className="bg-slate-800/50 border-white/10 text-white placeholder:text-slate-500 focus:border-mansablue/50 focus:ring-mansablue/20"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
