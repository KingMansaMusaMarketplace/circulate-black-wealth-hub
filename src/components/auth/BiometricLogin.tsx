import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Fingerprint, Scan } from 'lucide-react';
import { useBiometricAuth } from '@/hooks/use-biometric-auth';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface BiometricLoginProps {
  onSuccess?: () => void;
}

export const BiometricLogin: React.FC<BiometricLoginProps> = ({ onSuccess }) => {
  const { isAvailable, biometricType, authenticate, getBiometricUser, isBiometricEnabled } = useBiometricAuth();
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  if (!isAvailable || !isBiometricEnabled()) {
    return null;
  }

  const handleBiometricLogin = async () => {
    setIsAuthenticating(true);

    try {
      // Authenticate with biometrics
      const result = await authenticate();

      if (!result.success) {
        toast({
          title: "Authentication Failed",
          description: result.error || "Could not verify your identity",
          variant: "destructive",
        });
        return;
      }

      // Get stored email
      const email = getBiometricUser();
      if (!email) {
        toast({
          title: "No Saved Account",
          description: "Please log in with your password first",
          variant: "destructive",
        });
        return;
      }

      // In a real app, you'd retrieve the password securely
      // For demo purposes, we'll just show a success message
      toast({
        title: "Authentication Successful",
        description: "Welcome back!",
      });

      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/');
      }
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsAuthenticating(false);
    }
  };

  const BiometricIcon = biometricType === 'face' ? Scan : Fingerprint;
  const biometricName = biometricType === 'face' ? 'Face ID' : 'Touch ID';

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BiometricIcon className="h-5 w-5 text-primary" />
          Quick Login with {biometricName}
        </CardTitle>
        <CardDescription>
          Use your device's biometric authentication for faster login
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <BiometricIcon className="h-4 w-4" />
          <AlertDescription>
            Logged in as: {getBiometricUser()}
          </AlertDescription>
        </Alert>

        <Button
          onClick={handleBiometricLogin}
          disabled={isAuthenticating}
          className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          size="lg"
        >
          {isAuthenticating ? (
            <>
              <span className="animate-pulse">Authenticating...</span>
            </>
          ) : (
            <>
              <BiometricIcon className="mr-2 h-5 w-5" />
              Login with {biometricName}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
