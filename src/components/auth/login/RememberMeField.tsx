
import React from 'react';
import { FormField } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Link } from 'react-router-dom';
import { UseFormReturn } from 'react-hook-form';
import { LoginFormValues } from './LoginSchema';

interface RememberMeFieldProps {
  form: UseFormReturn<LoginFormValues>;
}

export const RememberMeField: React.FC<RememberMeFieldProps> = ({ form }) => {
  return (
    <div className="flex items-center justify-between">
      <FormField
        control={form.control}
        name="rememberMe"
        render={({ field }) => (
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="rememberMe" 
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <label 
              htmlFor="rememberMe" 
              className="text-sm text-gray-600 cursor-pointer"
            >
              Remember me
            </label>
          </div>
        )}
      />
      <Link 
        to="/reset-password"
        className="text-sm text-mansablue hover:text-mansagold transition-colors"
      >
        Forgot password?
      </Link>
    </div>
  );
};
