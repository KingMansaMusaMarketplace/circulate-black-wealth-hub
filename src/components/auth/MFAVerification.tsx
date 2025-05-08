
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface MFAVerificationProps {
  factorId: string;
  challengeId: string;
  onVerify: (factorId: string, code: string, challengeId: string) => Promise<any>;
  onCancel?: () => void;
}

export const MFAVerification: React.FC<MFAVerificationProps> = ({
  factorId,
  challengeId,
  onVerify,
  onCancel
}) => {
  const [verifyCode, setVerifyCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verifyCode || verifyCode.length !== 6) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }
    
    setLoading(true);
    try {
      const result = await onVerify(factorId, verifyCode, challengeId);
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Verification failed');
      }
      
      // Success is handled by the parent component
    } catch (error: any) {
      toast.error('Invalid verification code');
      console.error('MFA verification error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl">Security Verification</CardTitle>
        <div className="flex justify-center my-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <Shield className="h-8 w-8 text-primary" />
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Please enter the verification code from your authenticator app
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Verification Code</Label>
            <Input
              id="code"
              placeholder="000000"
              value={verifyCode}
              onChange={(e) => setVerifyCode(e.target.value)}
              maxLength={6}
              className="text-center text-lg tracking-widest"
              autoComplete="one-time-code"
              inputMode="numeric"
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={loading || verifyCode.length !== 6}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Verify
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        {onCancel && (
          <Button 
            variant="ghost" 
            className="w-full" 
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
