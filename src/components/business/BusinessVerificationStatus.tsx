import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, Clock, XCircle, AlertTriangle, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface BusinessVerificationStatusProps {
  isVerified: boolean;
  businessId: string;
  businessName: string;
}

export const BusinessVerificationStatus: React.FC<BusinessVerificationStatusProps> = ({
  isVerified,
  businessId,
  businessName
}) => {
  const navigate = useNavigate();

  if (isVerified) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle className="h-5 w-5 text-green-600" />
        <AlertTitle className="text-green-900">Verified Business ✓</AlertTitle>
        <AlertDescription className="text-green-800">
          Your business is verified and visible in the marketplace directory.
          <div className="mt-3">
            <Button
              onClick={() => navigate(`/business/${businessId}`)}
              variant="outline"
              size="sm"
              className="gap-2 border-green-600 text-green-700 hover:bg-green-100"
            >
              <Eye className="h-4 w-4" />
              View Your Public Profile
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="bg-yellow-50 border-yellow-300">
      <Clock className="h-5 w-5 text-yellow-600" />
      <AlertTitle className="text-yellow-900">Verification Pending</AlertTitle>
      <AlertDescription className="text-yellow-800 space-y-3">
        <p>
          <strong>{businessName}</strong> is currently under review. Our team typically completes 
          verification within 24-48 hours.
        </p>
        
        <div className="bg-yellow-100 rounded-lg p-3 space-y-2">
          <p className="font-semibold text-yellow-900">While you wait, you can:</p>
          <ul className="space-y-1 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 mt-0.5">•</span>
              <span>Complete your business profile with photos and details</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 mt-0.5">•</span>
              <span>Add your services and pricing</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 mt-0.5">•</span>
              <span>Generate your QR codes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 mt-0.5">•</span>
              <span>Set your business hours and availability</span>
            </li>
          </ul>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            onClick={() => navigate(`/business/${businessId}`)}
            variant="outline"
            size="sm"
            className="gap-2 border-yellow-600 text-yellow-700 hover:bg-yellow-100"
          >
            <Eye className="h-4 w-4" />
            Preview Your Profile
          </Button>
        </div>

        <p className="text-xs text-yellow-700">
          Note: Your business will be visible to customers once verification is complete.
        </p>
      </AlertDescription>
    </Alert>
  );
};
