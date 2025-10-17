
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, QrCode } from 'lucide-react';

interface SubmitButtonProps {
  isLoading: boolean;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({ isLoading }) => {
  return (
    <Button type="submit" disabled={isLoading} className="w-full">
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4" />
          Generating QR Code...
        </>
      ) : (
        <>
          <QrCode className="mr-2 h-4 w-4" />
          Generate QR Code
        </>
      )}
    </Button>
  );
};
