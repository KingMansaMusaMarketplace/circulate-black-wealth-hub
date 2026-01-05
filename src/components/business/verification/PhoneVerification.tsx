import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Phone, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

interface PhoneVerificationProps {
  businessId: string;
  userId: string;
  businessPhone?: string;
  isVerified: boolean;
  onVerified: () => void;
}

const PhoneVerification: React.FC<PhoneVerificationProps> = ({
  businessId,
  userId,
  businessPhone,
  isVerified,
  onVerified
}) => {
  const [phoneNumber, setPhoneNumber] = useState(businessPhone || '');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  // Format phone number
  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (match) {
      return [match[1], match[2], match[3]].filter(Boolean).join('-');
    }
    return value;
  };

  // Send OTP
  const handleSendOtp = async () => {
    if (!phoneNumber || phoneNumber.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('send-phone-otp', {
        body: {
          businessId,
          userId,
          phoneNumber: phoneNumber.replace(/\D/g, '')
        }
      });

      if (fnError) throw fnError;

      if (data?.success) {
        setOtpSent(true);
        toast.success('Verification code sent to your phone');
        
        // Start countdown
        setCountdown(60);
        const timer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        throw new Error(data?.error || 'Failed to send OTP');
      }
    } catch (err: any) {
      console.error('Error sending OTP:', err);
      setError(err.message || 'Failed to send verification code');
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    if (otpCode.length !== 6) {
      setError('Please enter the 6-digit code');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('verify-phone-otp', {
        body: {
          businessId,
          userId,
          otpCode
        }
      });

      if (fnError) throw fnError;

      if (data?.success) {
        toast.success('Phone number verified successfully!');
        onVerified();
      } else {
        throw new Error(data?.error || 'Invalid verification code');
      }
    } catch (err: any) {
      console.error('Error verifying OTP:', err);
      setError(err.message || 'Failed to verify code');
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerified) {
    return (
      <Card className="border-green-200 bg-green-50/50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-green-100">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-green-800">Phone Verified</p>
              <p className="text-sm text-green-600">
                Your business phone number has been verified
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-primary/10">
            <Phone className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Phone Verification</CardTitle>
            <CardDescription>
              Verify you have access to the business phone number
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!otpSent ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Business Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="555-123-4567"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                maxLength={12}
              />
              <p className="text-xs text-muted-foreground">
                Enter the phone number listed on your business documents
              </p>
            </div>

            <Button 
              onClick={handleSendOtp} 
              disabled={isLoading || !phoneNumber}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Phone className="mr-2 h-4 w-4" />
                  Send Verification Code
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Enter the 6-digit code sent to
              </p>
              <p className="font-medium">{phoneNumber}</p>
            </div>

            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otpCode}
                onChange={setOtpCode}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button 
              onClick={handleVerifyOtp} 
              disabled={isLoading || otpCode.length !== 6}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Verify Code
                </>
              )}
            </Button>

            <div className="flex justify-between items-center text-sm">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setOtpSent(false);
                  setOtpCode('');
                }}
              >
                Change Number
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSendOtp}
                disabled={countdown > 0 || isLoading}
              >
                {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PhoneVerification;
