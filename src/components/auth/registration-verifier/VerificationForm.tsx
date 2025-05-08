
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
      
      // First check auth.users
      const { data: authUser, error: authError } = await supabase.rpc('exec_sql', {
        query: `SELECT id, email, raw_user_meta_data FROM auth.users WHERE email = '${verifyEmail}' LIMIT 1`
      });
      
      if (authError) throw authError;
      
      if (!authUser || authUser.length === 0) {
        setVerificationResult({
          exists: false,
          message: 'User not found in auth.users table',
        });
        setVerificationStatus('error');
        return;
      }

      // If auth user exists, check for profile record
      const userId = authUser[0].id;
      const { data: profileData, error: profileError } = await supabase.rpc('exec_sql', {
        query: `SELECT * FROM profiles WHERE id = '${userId}' LIMIT 1`
      });
      
      if (profileError) throw profileError;
      
      // Check for business record if user is a business
      let businessData = null;
      const userMetadata = authUser[0].raw_user_meta_data;
      
      if (userMetadata && userMetadata.user_type === 'business') {
        const { data: business, error: businessError } = await supabase.rpc('exec_sql', {
          query: `SELECT * FROM businesses WHERE owner_id = '${userId}' LIMIT 1`
        });
        
        if (businessError) throw businessError;
        businessData = business;
      }

      // Check for MFA factors
      const { data: mfaData, error: mfaError } = await supabase.rpc('exec_sql', {
        query: `SELECT * FROM auth.mfa_factors WHERE user_id = '${userId}'`
      });
      
      if (mfaError) throw mfaError;
      
      // Set the complete verification result
      setVerificationResult({
        exists: true,
        authUser: authUser[0],
        profile: profileData && profileData.length > 0 ? profileData[0] : null,
        business: businessData && businessData.length > 0 ? businessData[0] : null,
        mfaFactors: mfaData || [],
        hasMFA: mfaData && mfaData.length > 0
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
                  User has {verificationResult.mfaFactors.length} MFA factor(s) configured
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
