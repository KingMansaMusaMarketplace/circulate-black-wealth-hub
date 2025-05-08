
import React from 'react';
import { CheckCircle2, Store, Award, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import ResultCard from '../ResultCard';
import ResultItem from './ResultItem';

interface SuccessResultProps {
  businessName?: string;
  pointsEarned?: number;
  discountApplied?: number;
  onScanAgain: () => void;
}

const SuccessResult: React.FC<SuccessResultProps> = ({ 
  businessName, 
  pointsEarned, 
  discountApplied,
  onScanAgain 
}) => {
  const navigate = useNavigate();
  
  return (
    <ResultCard 
      title="Scan Successful!" 
      icon={
        <div className="bg-green-100 p-3 rounded-full">
          <CheckCircle2 className="h-10 w-10 text-green-500" />
        </div>
      }
    >
      <div className="space-y-4">
        {businessName && (
          <ResultItem 
            label="Business" 
            value={businessName}
            icon={Store}
          />
        )}
        
        {pointsEarned ? (
          <ResultItem 
            label="Points Earned" 
            value={`+${pointsEarned}`}
            icon={Award}
            bgColor="bg-blue-50"
            textColor="text-blue-600"
          />
        ) : null}
        
        {discountApplied ? (
          <ResultItem 
            label="Discount Applied" 
            value={`${discountApplied}%`}
            icon={QrCode}
            bgColor="bg-green-50"
            textColor="text-green-600"
          />
        ) : null}
        
        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={onScanAgain} variant="outline">
            Scan Another Code
          </Button>
          <Button onClick={() => navigate('/dashboard')}>
            View Dashboard
          </Button>
        </div>
      </div>
    </ResultCard>
  );
};

export default SuccessResult;
