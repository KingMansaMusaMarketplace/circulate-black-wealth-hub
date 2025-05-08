
import React from 'react';
import SuccessResult from './components/results/SuccessResult';
import FailedResult from './components/results/FailedResult';

interface ScanResultProps {
  result: {
    success: boolean;
    businessName?: string;
    pointsEarned?: number;
    discountApplied?: number;
  };
  onScanAgain: () => void;
}

const ScanResult: React.FC<ScanResultProps> = ({ result, onScanAgain }) => {
  if (!result.success) {
    return <FailedResult onScanAgain={onScanAgain} />;
  }

  return (
    <SuccessResult 
      businessName={result.businessName}
      pointsEarned={result.pointsEarned}
      discountApplied={result.discountApplied}
      onScanAgain={onScanAgain}
    />
  );
}

export default ScanResult;
