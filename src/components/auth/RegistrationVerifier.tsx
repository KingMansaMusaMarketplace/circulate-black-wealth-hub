
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RegistrationVerifierTabs } from './registration-verifier/RegistrationVerifierTabs';

export const RegistrationVerifier: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState('');
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registration Verification Tool</CardTitle>
        <CardDescription>
          Test user registration and verify database records are correctly created
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <RegistrationVerifierTabs
          loading={loading}
          setLoading={setLoading}
          verifyEmail={verifyEmail}
          setVerifyEmail={setVerifyEmail}
          verificationResult={verificationResult}
          setVerificationResult={setVerificationResult}
          verificationStatus={verificationStatus}
          setVerificationStatus={setVerificationStatus}
        />
      </CardContent>
      
      <CardFooter className="border-t p-4 bg-gray-50">
        <p className="text-xs text-gray-500">
          These test accounts are created with real database entries for testing purposes.
          Use only for authorized testing.
        </p>
      </CardFooter>
    </Card>
  );
};
