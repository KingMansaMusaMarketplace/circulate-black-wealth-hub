import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { getHBCUVerificationStatus } from '@/lib/api/hbcu-verification';
import { CheckCircle, Clock, XCircle, Upload, FileText } from 'lucide-react';
import { toast } from 'sonner';

const HBCUVerificationStatus: React.FC = () => {
  const { user } = useAuth();
  const [verificationStatus, setVerificationStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      if (!user) return;
      
      try {
        const status = await getHBCUVerificationStatus(user.id);
        setVerificationStatus(status);
      } catch (error) {
        console.error('Failed to fetch HBCU verification status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [user]);

  const getStatusBadge = () => {
    if (!verificationStatus) {
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          <FileText className="h-3 w-3" />
          Not Submitted
        </Badge>
      );
    }

    switch (verificationStatus.verification_status) {
      case 'pending':
        return (
          <Badge variant="outline" className="flex items-center gap-1 bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="h-3 w-3" />
            Under Review
          </Badge>
        );
      case 'approved':
        return (
          <Badge variant="outline" className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3" />
            Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="outline" className="flex items-center gap-1 bg-red-50 text-red-700 border-red-200">
            <XCircle className="h-3 w-3" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            Unknown Status
          </Badge>
        );
    }
  };

  const getStatusMessage = () => {
    if (!verificationStatus) {
      return "You haven't submitted HBCU verification documents yet. Upload your student ID, transcript, or staff credentials to get verified.";
    }

    switch (verificationStatus.verification_status) {
      case 'pending':
        return `Your HBCU verification documents (${verificationStatus.document_type}) were submitted on ${new Date(verificationStatus.created_at).toLocaleDateString()} and are currently under review. We'll notify you once the review is complete.`;
      case 'approved':
        return "🎉 Congratulations! Your HBCU status has been verified. You're now eligible for exclusive benefits and free membership features.";
      case 'rejected':
        return "Your HBCU verification was not approved. Please check the reason below and feel free to submit new documents if needed.";
      default:
        return "There was an issue retrieving your verification status. Please try again later.";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            HBCU Verification Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">Loading verification status...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            HBCU Verification Status
          </span>
          {getStatusBadge()}
        </CardTitle>
        <CardDescription>
          Track your HBCU membership verification status
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertDescription>
            {getStatusMessage()}
          </AlertDescription>
        </Alert>

        {verificationStatus?.verification_status === 'rejected' && verificationStatus.rejection_reason && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Rejection Reason:</strong> {verificationStatus.rejection_reason}
            </AlertDescription>
          </Alert>
        )}

        {verificationStatus?.verification_status === 'approved' && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>Benefits Unlocked:</strong>
              <ul className="list-disc ml-4 mt-2">
                <li>Free membership access</li>
                <li>Exclusive HBCU community features</li>
                <li>Special discounts from HBCU-owned businesses</li>
                <li>Priority customer support</li>
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {!verificationStatus && (
          <div className="pt-4">
            <Button asChild>
              <a href="/signup">
                <Upload className="h-4 w-4 mr-2" />
                Submit Verification Documents
              </a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HBCUVerificationStatus;
