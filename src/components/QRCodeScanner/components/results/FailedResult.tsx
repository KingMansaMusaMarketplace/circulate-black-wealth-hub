
import React from 'react';
import { Button } from '@/components/ui/button';
import ResultCard from '../ResultCard';

interface FailedResultProps {
  onScanAgain: () => void;
}

const FailedResult: React.FC<FailedResultProps> = ({ onScanAgain }) => {
  return (
    <ResultCard title="Scan Failed" titleColor="text-red-500">
      <div className="text-center">
        <p className="mb-4">We couldn't process this QR code. It may be invalid or expired.</p>
        <Button onClick={onScanAgain}>Try Again</Button>
      </div>
    </ResultCard>
  );
};

export default FailedResult;
