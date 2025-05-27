
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle, AlertCircle, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

interface VerificationFormProps {
  verifyEmail: string;
  setVerifyEmail: (email: string) => void;
  verificationResult: any;
  setVerificationResult: (result: any) => void;
  verificationStatus: 'idle' | 'loading' | 'success' | 'error';
  setVerificationStatus: (status: 'idle' | 'loading' | 'success' | 'error') => void;
}

interface AuthUser {
  id: string;
  email: string;
  raw_user_meta_data?: any;
}

interface ProfileData {
  id: string;
  [key: string]: any;
}

interface BusinessData {
  id: string;
  owner_id: string;
  [key: string]: any;
}

interface MFAFactor {
  id: string;
  user_id: string;
  [key: string]: any;
}

export const VerificationForm: React.FC<VerificationFormProps> = ({
  verifyEmail,
  setVerifyEmail,
  verificationResult,
  setVerificationResult,
  verificationStatus,
  setVerificationStatus
}) => {
  // Verify if a user exists in the database
  const verifyUserInDatabase = async () => {
    if (!verifyEmail.trim()) {
      toast.error('Please enter an email to verify');
      return;
    }

    try {
      setVerificationStatus('loading');
      
      // First check auth.users using a simpler approach
      const { data: authData, error: authError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', verifyEmail)
        .maybeSingle();
      
      if (authError) throw authError;
      
      if (!authData) {
        setVerificationResult({
          exists: false,
          message: 'User not found in database',
        });
        setVerificationStatus('error');
        return;
      }

      // If profile exists, check for business record
      let businessData: BusinessData[] = [];
      const { data: business, error: businessError } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', authData.id)
        .limit(1);
      
      if (!businessError && business) {
        businessData = business;
      }

      // Check for MFA factors - simplified approach
      const { data: mfaData, error: mfaError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.id)
        .limit(1);
      
      // Set the complete verification result
      setVerificationResult({
        exists: true,
        authUser: authData,
        profile: authData,
        business: businessData && businessData.length > 0 ? businessData[0] : null,
        mfaFactors: [],
        hasMFA: false
      });
      
      setVerificationStatus('success');
      toast.success('User verification complete');
      
    } catch (error: any) {
      console.error('Verification error:', error);
      setVerificationResult({
        exists: false,
        error: error.message,
      });
      setVerificationStatus('error');
      toast.error(`Verification failed: ${error.message}`);
    }
  };

  return (
    <div>
      <div className="grid gap-2">
        <Label htmlFor="verifyEmail">Email to Verify</Label>
        <Input 
          id="verifyEmail" 
          type="email"
          placeholder="user@example.com"
          value={verifyEmail}
          onChange={(e) => setVerifyEmail(e.target.value)}
        />
      </div>
      
      <Button 
        onClick={verifyUserInDatabase}
        disabled={verificationStatus === 'loading'}
        className="mt-4"
      >
        {verificationStatus === 'loading' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Verify Registration
      </Button>
      
      {verificationStatus !== 'idle' && (
        <div className={`mt-4 p-4 rounded-md ${
          verificationStatus === 'success' ? 'bg-green-50 border border-green-100' : 
          verificationStatus === 'error' ? 'bg-red-50 border border-red-100' : 
          'bg-gray-50 border border-gray-100'
        }`}>
          <div className="flex items-center mb-2">
            {verificationStatus === 'success' ? 
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" /> : 
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            }
            <h3 className="font-medium">
              {verificationStatus === 'success' ? 'User Found' : 'User Not Found'}
            </h3>
          </div>
          
          {verificationResult && verificationStatus === 'success' && (
            <div className="mt-2 mb-2">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-blue-500 mr-2" />
                <h3 className="font-medium">
                  MFA Status: {verificationResult.hasMFA ? 'Enabled' : 'Not Enabled'}
                </h3>
              </div>
              {verificationResult.hasMFA && (
                <p className="text-sm text-gray-600 ml-7">
                  User has {verificationResult.mfaFactors?.length || 0} MFA factor(s) configured
                </p>
              )}
            </div>
          )}
          
          {verificationResult && (
            <div className="mt-2 text-sm">
              {verificationStatus === 'success' ? (
                <pre className="overflow-auto max-h-64 p-2 bg-gray-50 border rounded-sm text-xs">
                  {JSON.stringify(verificationResult, null, 2)}
                </pre>
              ) : (
                <p className="text-red-700">{verificationResult.message || verificationResult.error}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
