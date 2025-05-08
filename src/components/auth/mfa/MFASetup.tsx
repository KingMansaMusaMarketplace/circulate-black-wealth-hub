
import React from 'react';
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from '@/components/ui/card';
import { MFASetupStatus } from './MFASetupStatus';
import { MFAEnrollmentSteps } from './MFAEnrollmentSteps';
import { MFAError } from './MFAError';
import { useMFASetup } from './hooks/useMFASetup';

export const MFASetup = () => {
  const {
    isLoading,
    qrCodeUrl,
    secret,
    verificationCode,
    setVerificationCode,
    isEnrolled,
    error,
    startMFAEnrollment,
    verifyAndEnableMFA,
    disableMFA
  } = useMFASetup();

  return (
    <Card>
      {isEnrolled ? (
        <MFASetupStatus 
          isEnrolled={isEnrolled}
          isLoading={isLoading}
          onStartMFAEnrollment={startMFAEnrollment}
          onDisableMFA={disableMFA}
        />
      ) : (
        <>
          <CardHeader>
            <CardTitle>Set Up Two-Factor Authentication</CardTitle>
            <CardDescription>
              Add an extra layer of security to your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <MFAError error={error} />

            {!qrCodeUrl ? (
              <MFASetupStatus 
                isEnrolled={isEnrolled}
                isLoading={isLoading}
                onStartMFAEnrollment={startMFAEnrollment}
                onDisableMFA={disableMFA}
              />
            ) : (
              <MFAEnrollmentSteps
                qrCodeUrl={qrCodeUrl}
                secret={secret}
                verificationCode={verificationCode}
                setVerificationCode={setVerificationCode}
                isLoading={isLoading}
                onVerify={verifyAndEnableMFA}
              />
            )}
          </CardContent>
        </>
      )}
    </Card>
  );
};

export default MFASetup;
