
import React from 'react';
import { Link } from 'react-router-dom';
import { Checkbox } from '@/components/ui/checkbox';

interface FormCheckboxProps {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export const FormCheckbox: React.FC<FormCheckboxProps> = ({ id, checked, onCheckedChange }) => {
  return (
    <div className="flex items-center space-x-2 pt-2">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(checked) => onCheckedChange(checked as boolean)}
      />
      <label
        htmlFor={id}
        className="text-sm text-gray-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        I agree to the{' '}
        <Link to="/terms" className="text-mansablue hover:underline">
          terms of service
        </Link>{' '}
        and{' '}
        <Link to="/privacy" className="text-mansablue hover:underline">
          privacy policy
        </Link>
      </label>
    </div>
  );
};
