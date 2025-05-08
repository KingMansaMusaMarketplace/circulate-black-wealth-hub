
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

interface MFAEnrollmentStepsProps {
  qrCodeUrl: string | null;
  secret: string | null;
  verificationCode: string;
  setVerificationCode: (code: string) => void;
  isLoading: boolean;
  onVerify: () => void;
}

export const MFAEnrollmentSteps: React.FC<MFAEnrollmentStepsProps> = ({
  qrCodeUrl,
  secret,
  verificationCode,
  setVerificationCode,
  isLoading,
  onVerify
}) => {
  if (!qrCodeUrl) return null;
  
  return (
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
          onClick={onVerify}
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
  );
};
