
import React from 'react';
import { BusinessVerification } from '@/lib/types/verification';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline" className="bg-gray-100 text-gray-600">
              <AlertCircle className="h-3 w-3 mr-1" /> Not Verified
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm">This business has not submitted verification documents</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  switch (verification.verification_status) {
    case 'pending':
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                <Clock className="h-3 w-3 mr-1" /> Verification Pending
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <div className="space-y-2">
                <p className="text-sm font-medium">Verification documents submitted</p>
                <p className="text-xs text-gray-500">
                  <Calendar className="h-3 w-3 inline mr-1" />
                  {new Date(verification.submitted_at).toLocaleDateString()}
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    
    case 'approved':
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" /> Verified Business
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <div className="space-y-2">
                <p className="text-sm font-medium">This business has been verified</p>
                {verification.verified_at && (
                  <p className="text-xs text-gray-500">
                    <Calendar className="h-3 w-3 inline mr-1" />
                    Verified on {new Date(verification.verified_at).toLocaleDateString()}
                  </p>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    
    case 'rejected':
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="bg-red-100 text-red-800">
                <XCircle className="h-3 w-3 mr-1" /> Verification Rejected
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <div className="space-y-2">
                <p className="text-sm font-medium">Verification was rejected</p>
                {verification.rejection_reason && (
                  <p className="text-xs">{verification.rejection_reason}</p>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    
    default:
      return <Badge variant="outline">Unknown Status</Badge>;
  }
};

export default VerificationStatus;
