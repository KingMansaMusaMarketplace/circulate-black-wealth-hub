
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Coins, Badge } from 'lucide-react';
import ResultCard from '../ResultCard';
import ResultItem from './ResultItem';

interface SuccessResultProps {
  businessName?: string;
  pointsEarned?: number;
  discountApplied?: number;
  onScanAgain: () => void;
}

const SuccessResult: React.FC<SuccessResultProps> = ({ 
  businessName = 'Business',
  pointsEarned = 0,
  discountApplied = 0,
  onScanAgain 
}) => {
  return (
    <ResultCard title="Success!" titleColor="text-green-600">
      <div className="flex justify-center mb-4">
        <div className="rounded-full bg-green-100 p-3">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
      </div>
      
      <div className="space-y-4 mb-6">
        {pointsEarned > 0 && (
          <ResultItem 
            icon={<Coins className="text-mansagold" size={18} />} 
            title={`${pointsEarned} Points Earned`}
            description="Added to your loyalty balance"
          />
        )}
        
        {discountApplied > 0 && (
          <ResultItem 
            icon={<Badge className="text-mansablue" size={18} />} 
            title={`${discountApplied}% Discount`}
            description="Show this to the cashier"
          />
        )}
        
        {businessName && (
          <div className="bg-gray-50 rounded-md p-3 text-center">
            <p className="text-gray-500 text-sm">Scanned at</p>
            <p className="font-medium text-gray-800">{businessName}</p>
          </div>
        )}
      </div>
      
      <div className="flex justify-center">
        <Button onClick={onScanAgain} className="w-full">
          Scan Another Code
        </Button>
      </div>
    </ResultCard>
  );
};

export default SuccessResult;
