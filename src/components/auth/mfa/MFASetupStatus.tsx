
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2 } from 'lucide-react';

interface MFASetupStatusProps {
  isEnrolled: boolean;
  isLoading: boolean;
  onStartMFAEnrollment: () => void;
  onDisableMFA: () => void;
}

export const MFASetupStatus: React.FC<MFASetupStatusProps> = ({
  isEnrolled,
  isLoading,
  onStartMFAEnrollment,
  onDisableMFA
}) => {
  if (isEnrolled) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>
            Your account is protected with two-factor authentication
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2 bg-green-50 p-3 rounded-md">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <p className="text-sm text-green-700">MFA is currently enabled on your account</p>
          </div>
          
          <p className="text-sm text-gray-600">
            With 2FA enabled, you'll need to enter a verification code from your authenticator app
            when you sign in, even if you know your password. This adds an extra layer of security
            to your account.
          </p>
          
          <Button 
            onClick={onDisableMFA}
            variant="destructive"
            disabled={isLoading}
            className="w-full mt-4"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Disabling...
              </>
            ) : (
              'Disable Two-Factor Authentication'
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Set Up Two-Factor Authentication</CardTitle>
        <CardDescription>
          Add an extra layer of security to your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          Two-factor authentication adds an extra layer of security to your account. 
          In addition to your password, you'll need a verification code from an authenticator app.
        </p>
        <Button 
          onClick={onStartMFAEnrollment}
          className="w-full mt-4"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Setting up...
            </>
          ) : (
            'Set Up Two-Factor Authentication'
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
