
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import VerificationForm from './VerificationForm';
import VerificationStatus from './VerificationStatus';
import { useVerification } from '@/hooks/use-verification';

const VerificationTab: React.FC = () => {
  const { user } = useAuth();
  
  // Mock business ID and user ID for now - in a real app these would come from context or props
  const businessId = user?.id || '';
  const userId = user?.id || '';
  
  const { verificationStatus, isLoading } = useVerification(businessId, userId);

  if (!user) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Business Verification</CardTitle>
            <CardDescription>
              Please log in to access business verification
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Business Verification</CardTitle>
          <CardDescription>
            Verify your business to gain customer trust and access premium features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VerificationStatus verification={verificationStatus} isLoading={isLoading} />
          <VerificationForm businessId={businessId} userId={userId} />
        </CardContent>
      </Card>
    </div>
  );
};

export default VerificationTab;
