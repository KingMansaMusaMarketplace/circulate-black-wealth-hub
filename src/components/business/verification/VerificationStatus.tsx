
import React from 'react';
import { BusinessVerification } from '@/lib/types/verification';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, XCircle, AlertCircle, Calendar } from 'lucide-react';

interface VerificationStatusProps {
  verification: BusinessVerification | null;
  isLoading?: boolean;
}

const VerificationStatus: React.FC<VerificationStatusProps> = ({ verification, isLoading }) => {
  if (isLoading) {
    return <Badge variant="outline" className="animate-pulse">Loading...</Badge>;
  }

  if (!verification) {
    return (
      <Badge variant="outline" className="bg-gray-100 text-gray-600">
        <AlertCircle className="h-3 w-3 mr-1" /> Not Verified
      </Badge>
    );
  }

  switch (verification.verification_status) {
    case 'pending':
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
          <Clock className="h-3 w-3 mr-1" /> Verification Pending
        </Badge>
      );
    
    case 'approved':
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" /> Verified Business
        </Badge>
      );
    
    case 'rejected':
      return (
        <Badge variant="outline" className="bg-red-100 text-red-800">
          <XCircle className="h-3 w-3 mr-1" /> Verification Rejected
        </Badge>
      );
    
    default:
      return <Badge variant="outline">Unknown Status</Badge>;
  }
};

export default VerificationStatus;
