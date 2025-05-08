
import React from 'react';
import { Button } from '@/components/ui/button';

interface SubmitButtonProps {
  isLoading?: boolean;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({ isLoading = false }) => {
  return (
    <Button type="submit" className="w-full" disabled={isLoading}>
      {isLoading ? "Generating..." : "Generate QR Code"}
    </Button>
  );
};
