
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import VerificationForm from './VerificationForm';
import VerificationStatus from './VerificationStatus';

const VerificationTab: React.FC = () => {
  const { user } = useAuth();

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
          <VerificationStatus />
          <VerificationForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default VerificationTab;
