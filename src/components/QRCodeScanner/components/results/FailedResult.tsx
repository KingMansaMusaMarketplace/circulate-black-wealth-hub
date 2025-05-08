
import React from 'react';
import { Button } from '@/components/ui/button';
import { XCircle, RefreshCw } from 'lucide-react';
import ResultCard from '../ResultCard';

interface FailedResultProps {
  onScanAgain: () => void;
  errorMessage?: string;
}

const FailedResult: React.FC<FailedResultProps> = ({ 
  onScanAgain,
  errorMessage 
}) => {
  return (
    <ResultCard title="Scan Failed" titleColor="text-red-500">
      <div className="flex justify-center mb-4">
        <div className="rounded-full bg-red-100 p-3">
          <XCircle className="h-8 w-8 text-red-500" />
        </div>
      </div>
      
      <div className="text-center mb-6">
        <p className="text-gray-600 mb-1">
          {errorMessage || "We couldn't process this QR code. It may be invalid or expired."}
        </p>
        <p className="text-gray-500 text-sm">
          Make sure the QR code is clearly visible and try again.
        </p>
      </div>
      
      <div className="flex justify-center">
        <Button onClick={onScanAgain} className="flex items-center gap-2">
          <RefreshCw size={16} />
          Try Again
        </Button>
      </div>
    </ResultCard>
  );
};

export default FailedResult;
