
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

export const MFASetup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [factorId, setFactorId] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, getMFAFactors } = useAuth();

  useEffect(() => {
    const checkMFAStatus = async () => {
      if (user) {
        const factors = await getMFAFactors();
        setIsEnrolled(factors.length > 0);
      }
    };

    checkMFAStatus();
  }, [user, getMFAFactors]);

  const startMFAEnrollment = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        issuer: 'Mansa Musa Marketplace'
      });

      if (error) throw error;

      if (data) {
        setQrCodeUrl(data.totp.qr_code);
        setSecret(data.totp.secret);
        setFactorId(data.id);
      }
    } catch (error: any) {
      console.error('Error starting MFA enrollment:', error);
      setError(error.message || 'Failed to start MFA enrollment');
      toast({
        title: 'MFA Setup Failed',
        description: error.message || 'An error occurred while setting up MFA',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyAndEnableMFA = async () => {
    if (!factorId || !verificationCode) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.mfa.challenge({
        factorId,
        code: verificationCode
      });

      if (error) throw error;

      const { data: verifyData, error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: data.id,
        code: verificationCode
      });

      if (verifyError) throw verifyError;

      // Update enrolled status
      setIsEnrolled(true);
      setQrCodeUrl(null);
      setSecret(null);
      setFactorId(null);
      setVerificationCode('');
      
      toast({
        title: 'MFA Enabled',
        description: 'Two-factor authentication has been successfully enabled',
      });
      
      // Refresh MFA factors
      await getMFAFactors();
    } catch (error: any) {
      console.error('Error verifying MFA:', error);
      setError(error.message || 'Failed to verify code');
      toast({
        title: 'Verification Failed',
        description: error.message || 'Invalid verification code',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const disableMFA = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const factors = await getMFAFactors();
      
      if (factors.length > 0) {
        const { error } = await supabase.auth.mfa.unenroll({
          factorId: factors[0].id
        });

        if (error) throw error;

        // Update enrolled status
        setIsEnrolled(false);
        toast({
          title: 'MFA Disabled',
          description: 'Two-factor authentication has been disabled',
        });
        
        // Refresh MFA factors
        await getMFAFactors();
      }
    } catch (error: any) {
      console.error('Error disabling MFA:', error);
      setError(error.message || 'Failed to disable MFA');
      toast({
        title: 'Error Disabling MFA',
        description: error.message || 'An error occurred while disabling MFA',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

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
            onClick={disableMFA}
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
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}

        {!qrCodeUrl && (
          <>
            <p className="text-sm text-gray-600">
              Two-factor authentication adds an extra layer of security to your account. 
              In addition to your password, you'll need a verification code from an authenticator app.
            </p>
            <Button 
              onClick={startMFAEnrollment}
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
          </>
        )}

        {qrCodeUrl && (
          <div className="space-y-4">
            <div>
              <h3 className="text-md font-semibold mb-2">Step 1: Scan this QR code</h3>
              <p className="text-sm text-gray-600 mb-3">
                Scan this QR code with your preferred authenticator app 
                (Google Authenticator, Authy, Microsoft Authenticator, etc.)
              </p>
              <div className="flex justify-center my-4">
                <img src={qrCodeUrl} alt="QR Code" className="max-w-full h-auto" />
              </div>
              {secret && (
                <div className="mt-3">
                  <p className="text-sm text-gray-500 mb-1">Or enter this code manually:</p>
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm break-all">{secret}</code>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-md font-semibold mb-2">Step 2: Enter the verification code</h3>
              <p className="text-sm text-gray-600 mb-3">
                Enter the 6-digit code from your authenticator app to verify setup
              </p>
              <Input
                type="text"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="mb-4"
                maxLength={6}
              />
              <Button 
                onClick={verifyAndEnableMFA}
                className="w-full"
                disabled={isLoading || verificationCode.length !== 6}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify and Enable'
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MFASetup;
