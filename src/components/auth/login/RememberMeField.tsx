
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
              className="border-white/20 data-[state=checked]:bg-mansablue data-[state=checked]:border-mansablue"
            />
            <label 
              htmlFor="rememberMe" 
              className="text-sm text-slate-300 cursor-pointer hover:text-white transition-colors"
            >
              Remember me
            </label>
          </div>
        )}
      />
      <Link 
        to="/reset-password"
        className="text-sm text-mansagold hover:text-amber-300 transition-colors font-medium"
      >
        Forgot password?
      </Link>
    </div>
  );
};
