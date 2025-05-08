
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { CheckCircle2, Store, Award, QrCode } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  
  if (!result.success) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-red-500">Scan Failed</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4">We couldn't process this QR code. It may be invalid or expired.</p>
          <Button onClick={onScanAgain}>Try Again</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 p-3 rounded-full">
            <CheckCircle2 className="h-10 w-10 text-green-500" />
          </div>
        </div>
        <CardTitle>Scan Successful!</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {result.businessName && (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Store className="h-5 w-5 mr-2 text-gray-600" />
                <span className="text-sm font-medium">Business</span>
              </div>
              <span className="font-medium">{result.businessName}</span>
            </div>
          )}
          
          {result.pointsEarned ? (
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <Award className="h-5 w-5 mr-2 text-blue-600" />
                <span className="text-sm font-medium">Points Earned</span>
              </div>
              <span className="font-medium text-blue-600">+{result.pointsEarned}</span>
            </div>
          ) : null}
          
          {result.discountApplied ? (
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <QrCode className="h-5 w-5 mr-2 text-green-600" />
                <span className="text-sm font-medium">Discount Applied</span>
              </div>
              <span className="font-medium text-green-600">{result.discountApplied}%</span>
            </div>
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
      </CardContent>
    </Card>
  );
}

export default ScanResult;
