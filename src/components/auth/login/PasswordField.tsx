
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
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

interface PasswordFieldProps {
  form: UseFormReturn<LoginFormValues>;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({ form }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <FormField
      control={form.control}
      name="password"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-slate-200">Password</FormLabel>
          <div className="relative">
            <FormControl>
              <Input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                {...field}
                className="bg-slate-800/50 border-white/10 text-white placeholder:text-slate-500 focus:border-mansablue/50 focus:ring-mansablue/20"
              />
            </FormControl>
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
