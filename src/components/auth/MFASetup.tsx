
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Shield, ShieldCheck, ShieldAlert, Key } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

interface MFASetupProps {
  onComplete?: () => void;
}

export const MFASetup: React.FC<MFASetupProps> = ({ onComplete }) => {
  const [loading, setLoading] = useState(false);
  const [factorId, setFactorId] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [verifyCode, setVerifyCode] = useState('');
  const [enrolledFactors, setEnrolledFactors] = useState<any[]>([]);
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [setupStep, setSetupStep] = useState<'enroll' | 'verify'>('enroll');

  // Load enrolled factors on mount
  useEffect(() => {
    fetchEnrolledFactors();
  }, []);

  const fetchEnrolledFactors = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.mfa.listFactors();
      
      if (error) throw error;
      
      if (data?.all && data.all.length > 0) {
        setEnrolledFactors(data.all);
      }
    } catch (error: any) {
      console.error('Error fetching MFA factors:', error);
      toast.error('Failed to load MFA settings');
    } finally {
      setLoading(false);
    }
  };

  // Start enrollment process for TOTP
  const enrollTotp = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp'
      });
      
      if (error) throw error;
      
      if (data) {
        setFactorId(data.id);
        setQrCode(data.totp.qr_code);
        setSecret(data.totp.secret);
        setSetupStep('verify');
      }
    } catch (error: any) {
      console.error('Error enrolling in MFA:', error);
      toast.error('Failed to start MFA enrollment');
    } finally {
      setLoading(false);
    }
  };

  // Verify the TOTP code to complete enrollment
  const verifyTotp = async () => {
    if (!factorId || !verifyCode.trim()) {
      toast.error('Please enter the verification code');
      return;
    }
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.mfa.challenge({
        factorId
      });
      
      if (error) throw error;
      
      if (data) {
        setChallengeId(data.id);
        
        const { data: verifyData, error: verifyError } = await supabase.auth.mfa.verify({
          factorId,
          challengeId: data.id,
          code: verifyCode
        });
        
        if (verifyError) throw verifyError;
        
        if (verifyData) {
          toast.success('MFA successfully set up!');
          fetchEnrolledFactors();
          setSetupStep('enroll');
          setVerifyCode('');
          setFactorId(null);
          setQrCode(null);
          setSecret(null);
          setChallengeId(null);
          if (onComplete) onComplete();
        }
      }
    } catch (error: any) {
      console.error('Error verifying MFA code:', error);
      toast.error('Invalid verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Remove an MFA factor
  const removeFactor = async (id: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.mfa.unenroll({
        factorId: id
      });
      
      if (error) throw error;
      
      toast.success('MFA factor removed successfully');
      fetchEnrolledFactors();
    } catch (error: any) {
      console.error('Error removing MFA factor:', error);
      toast.error('Failed to remove MFA factor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Multi-Factor Authentication</CardTitle>
        <CardDescription>
          Secure your account with an additional layer of protection
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="setup" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="setup">Setup MFA</TabsTrigger>
            <TabsTrigger value="manage">Manage Factors</TabsTrigger>
          </TabsList>
          
          <TabsContent value="setup" className="space-y-4 mt-4">
            {setupStep === 'enroll' ? (
              <div className="space-y-4">
                <div className="flex items-start space-x-4 border p-4 rounded-md bg-gray-50">
                  <Shield className="h-8 w-8 text-mansablue" />
                  <div>
                    <h3 className="font-medium">Authenticator App</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Use an authenticator app like Google Authenticator, Authy, or 1Password to
                      scan a QR code and generate verification codes.
                    </p>
                    <Button 
                      onClick={enrollTotp} 
                      className="mt-3"
                      disabled={loading}
                    >
                      {loading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Key className="mr-2 h-4 w-4" />
                      )}
                      Set Up Authenticator
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium text-center mb-2">Scan QR Code</h3>
                  {qrCode && (
                    <div className="flex justify-center mb-4">
                      <img src={qrCode} alt="QR Code" className="h-48 w-48" />
                    </div>
                  )}
                  
                  {secret && (
                    <div className="mb-4">
                      <p className="text-sm text-center text-gray-600 mb-1">
                        If you can't scan the QR code, enter this code manually:
                      </p>
                      <p className="text-center font-mono bg-gray-100 p-2 rounded">
                        {secret}
                      </p>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="verifyCode">Enter verification code</Label>
                    <Input 
                      id="verifyCode"
                      value={verifyCode}
                      onChange={(e) => setVerifyCode(e.target.value)}
                      placeholder="000000"
                      maxLength={6}
                    />
                  </div>
                  
                  <div className="flex justify-between mt-4">
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setSetupStep('enroll');
                        setVerifyCode('');
                        setFactorId(null);
                        setQrCode(null);
                        setSecret(null);
                      }}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={verifyTotp}
                      disabled={loading || verifyCode.length !== 6}
                    >
                      {loading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <ShieldCheck className="mr-2 h-4 w-4" />
                      )}
                      Verify
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="manage" className="space-y-4 mt-4">
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-mansablue" />
              </div>
            ) : enrolledFactors.length > 0 ? (
              <div className="space-y-3">
                {enrolledFactors.map((factor) => (
                  <div key={factor.id} className="flex justify-between items-center border p-3 rounded-md">
                    <div className="flex items-center space-x-3">
                      <ShieldCheck className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">
                          {factor.friendly_name || (factor.factor_type === 'totp' ? 'Authenticator App' : factor.factor_type)}
                        </p>
                        <p className="text-xs text-gray-500">
                          Added on {new Date(factor.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => removeFactor(factor.id)}
                      disabled={loading}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 border rounded-md bg-gray-50">
                <ShieldAlert className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                <h3 className="font-medium">No MFA Factors Enrolled</h3>
                <p className="text-sm text-gray-600 mt-1">
                  You haven't set up any multi-factor authentication methods yet.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="border-t p-4 bg-gray-50">
        <p className="text-xs text-gray-500">
          Multi-factor authentication adds an extra layer of security to your account 
          by requiring a second verification step when you sign in.
        </p>
      </CardFooter>
    </Card>
  );
};
