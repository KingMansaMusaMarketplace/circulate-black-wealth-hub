
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TestAccountForm } from './TestAccountForm';
import { VerificationForm } from './VerificationForm';

interface RegistrationVerifierTabsProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  verifyEmail: string;
  setVerifyEmail: (email: string) => void;
  verificationResult: any;
  setVerificationResult: (result: any) => void;
  verificationStatus: 'idle' | 'loading' | 'success' | 'error';
  setVerificationStatus: (status: 'idle' | 'loading' | 'success' | 'error') => void;
}

export const RegistrationVerifierTabs: React.FC<RegistrationVerifierTabsProps> = ({
  loading,
  setLoading,
  verifyEmail,
  setVerifyEmail,
  verificationResult,
  setVerificationResult,
  verificationStatus,
  setVerificationStatus
}) => {
  return (
    <Tabs defaultValue="create">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="create">Create Test Account</TabsTrigger>
        <TabsTrigger value="verify">Verify Registration</TabsTrigger>
      </TabsList>
      
      <TabsContent value="create" className="space-y-4 mt-4">
        <TestAccountForm 
          loading={loading}
          setLoading={setLoading}
        />
      </TabsContent>
      
      <TabsContent value="verify" className="space-y-4 mt-4">
        <VerificationForm
          verifyEmail={verifyEmail}
          setVerifyEmail={setVerifyEmail}
          verificationResult={verificationResult}
          setVerificationResult={setVerificationResult}
          verificationStatus={verificationStatus}
          setVerificationStatus={setVerificationStatus}
        />
      </TabsContent>
    </Tabs>
  );
};
