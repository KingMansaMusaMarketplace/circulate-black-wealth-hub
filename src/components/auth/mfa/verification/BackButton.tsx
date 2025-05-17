
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  onCancel: () => void;
}

export const BackButton: React.FC<BackButtonProps> = ({ onCancel }) => {
  return (
    <Button
      type="button"
      variant="ghost"
      className="w-full flex items-center justify-center"
      onClick={onCancel}
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      Back to Login
    </Button>
  );
};
