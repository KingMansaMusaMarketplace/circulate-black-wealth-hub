
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, CheckCircle, AlertCircle, UserPlus, Building } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

export const RegistrationVerifier: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [testPassword, setTestPassword] = useState('Test123!');
  const [verifyEmail, setVerifyEmail] = useState('');
  const [testBusinessName, setTestBusinessName] = useState('');
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Create a test user account
  const handleCreateTestUser = async (userType: 'customer' | 'business') => {
    if (!testEmail.trim()) {
      toast.error('Please enter a test email address');
      return;
    }

    // Add a test indicator to the email to ensure it's clearly marked as a test account
    const formattedEmail = testEmail.includes('test') ? testEmail : `test_${testEmail}`;

    try {
      setLoading(true);
      
      const metadata = {
        user_type: userType,
        full_name: userType === 'business' ? testBusinessName || 'Test Business' : 'Test Customer',
      };

      const { data, error } = await supabase.auth.signUp({
        email: formattedEmail,
        password: testPassword,
        options: {
          data: metadata,
        }
      });

      if (error) throw error;

      // Success!
      toast.success(`Test ${userType} account created successfully`);
      console.log('Test account created:', data);
      
    } catch (error: any) {
      console.error('Error creating test account:', error);
      toast.error(`Failed to create test account: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

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
      
      // Set the complete verification result
      setVerificationResult({
        exists: true,
        authUser: authUser[0],
        profile: profileData && profileData.length > 0 ? profileData[0] : null,
        business: businessData && businessData.length > 0 ? businessData[0] : null,
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
    <Card>
      <CardHeader>
        <CardTitle>Registration Verification Tool</CardTitle>
        <CardDescription>
          Test user registration and verify database records are correctly created
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="create">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Create Test Account</TabsTrigger>
            <TabsTrigger value="verify">Verify Registration</TabsTrigger>
          </TabsList>
          
          <TabsContent value="create" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="testEmail">Test Email</Label>
                <Input 
                  id="testEmail" 
                  type="email"
                  placeholder="test_user@example.com"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  Will be prefixed with "test_" if not already containing "test"
                </p>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="testPassword">Test Password</Label>
                <Input 
                  id="testPassword" 
                  type="password"
                  value={testPassword}
                  onChange={(e) => setTestPassword(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="testBusinessName">Business Name (for business accounts)</Label>
                <Input 
                  id="testBusinessName" 
                  placeholder="Test Business Name"
                  value={testBusinessName}
                  onChange={(e) => setTestBusinessName(e.target.value)}
                />
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  onClick={() => handleCreateTestUser('customer')}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create Test Customer
                </Button>
                
                <Button 
                  onClick={() => handleCreateTestUser('business')}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Building className="mr-2 h-4 w-4" />
                  Create Test Business
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="verify" className="space-y-4 mt-4">
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
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="border-t p-4 bg-gray-50">
        <p className="text-xs text-gray-500">
          These test accounts are created with real database entries for testing purposes.
          Use only for authorized testing.
        </p>
      </CardFooter>
    </Card>
  );
};
