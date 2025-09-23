
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/auth';
import { 
  testHBCUVerificationAPI, 
  getHBCUVerificationStatus, 
  uploadHBCUVerificationDocument 
} from '@/lib/api/hbcu-verification';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

const HBCUTestPage: React.FC = () => {
  const { user } = useAuth();
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<any>(null);

  const addTestResult = (test: string, passed: boolean, details?: string) => {
    setTestResults(prev => [...prev, { test, passed, details, timestamp: new Date() }]);
    console.log(`${passed ? '✅' : '❌'} ${test}${details ? ': ' + details : ''}`);
  };

  const runComprehensiveTests = async () => {
    setIsRunningTests(true);
    setTestResults([]);
    
    try {
      console.log('🧪 Starting comprehensive HBCU verification tests...');
      
      // Test 1: Authentication
      addTestResult('User Authentication', !!user, user ? `User ID: ${user.id}` : 'Not authenticated');
      
      // Test 2: API Connectivity
      try {
        const apiTest = await testHBCUVerificationAPI();
        addTestResult('API Connectivity', apiTest, 'HBCU verification API responded');
      } catch (error) {
        addTestResult('API Connectivity', false, (error as Error).message);
      }
      
      // Test 3: Database Connection (using secure function)
      try {
        const { data, error } = await supabase.rpc('get_user_hbcu_status');
        addTestResult('Database Connection', !error, error ? error.message : 'Successfully connected to HBCU verification system');
      } catch (error) {
        addTestResult('Database Connection', false, (error as Error).message);
      }
      
      // Test 4: Storage Bucket Access
      try {
        const { data: buckets, error } = await supabase.storage.listBuckets();
        const hbcuBucket = buckets?.find(b => b.id === 'hbcu-verification');
        addTestResult('Storage Bucket Access', !!hbcuBucket && !error, 
          hbcuBucket ? 'HBCU verification bucket found' : 'HBCU verification bucket not found');
      } catch (error) {
        addTestResult('Storage Bucket Access', false, (error as Error).message);
      }
      
      // Test 5: User Verification Status
      if (user) {
        try {
          const status = await getHBCUVerificationStatus();
          setVerificationStatus(status);
          addTestResult('User Verification Status', true, 
            status ? `Status: ${status.status}` : 'No verification record found');
        } catch (error) {
          addTestResult('User Verification Status', false, (error as Error).message);
        }
      }
      
      // Test 6: Profiles Table HBCU Fields
      if (user) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('is_hbcu_member, hbcu_verification_status')
            .eq('id', user.id)
            .single();
          
          addTestResult('Profile HBCU Fields', !error, 
            error ? error.message : `HBCU Member: ${data?.is_hbcu_member}, Status: ${data?.hbcu_verification_status}`);
        } catch (error) {
          addTestResult('Profile HBCU Fields', false, (error as Error).message);
        }
      }
      
      console.log('🏁 All tests completed');
      
    } catch (error) {
      console.error('Test execution failed:', error);
      addTestResult('Test Execution', false, (error as Error).message);
    } finally {
      setIsRunningTests(false);
    }
  };

  const testFileUpload = async () => {
    if (!user) {
      addTestResult('File Upload Test', false, 'User not authenticated');
      return;
    }

    // Create a test file
    const testContent = 'This is a test HBCU verification document';
    const testFile = new File([testContent], 'test-hbcu-doc.txt', { type: 'text/plain' });
    
    try {
      const result = await uploadHBCUVerificationDocument(user.id, {
        documentType: 'test_document',
        file: testFile
      });
      
      addTestResult('File Upload Test', result.success, 
        result.success ? 'Test file uploaded successfully' : result.error);
    } catch (error) {
      addTestResult('File Upload Test', false, (error as Error).message);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>HBCU Verification System Test Suite</CardTitle>
          <CardDescription>
            Comprehensive testing for the HBCU verification functionality
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Test Controls */}
          <div className="flex gap-4">
            <Button 
              onClick={runComprehensiveTests} 
              disabled={isRunningTests}
            >
              {isRunningTests ? 'Running Tests...' : 'Run All Tests'}
            </Button>
            <Button 
              onClick={testFileUpload} 
              variant="outline"
              disabled={!user}
            >
              Test File Upload
            </Button>
          </div>

          {/* Current User Info */}
          {user && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Current User:</strong> {user.email} (ID: {user.id})
              </AlertDescription>
            </Alert>
          )}

          {/* Verification Status */}
          {verificationStatus && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Current Verification Status:</strong> {verificationStatus.status}
                {verificationStatus.verified_at && ` (Verified: ${new Date(verificationStatus.verified_at).toLocaleDateString()})`}
              </AlertDescription>
            </Alert>
          )}

          {/* Test Results */}
          {testResults.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold">Test Results:</h3>
              {testResults.map((result, index) => (
                <Alert key={index} variant={result.passed ? "default" : "destructive"}>
                  {result.passed ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <AlertDescription>
                    <strong>{result.test}:</strong> {result.passed ? 'PASSED' : 'FAILED'}
                    {result.details && ` - ${result.details}`}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          )}

          {/* Testing Instructions */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Testing Instructions:</strong>
              <ul className="list-disc ml-4 mt-2">
                <li>Run "All Tests" to verify system components are working</li>
                <li>Test file upload with a sample document</li>
                <li>Check console logs for detailed debugging information</li>
                <li>Verify that files appear in Supabase storage bucket</li>
                <li>Test the signup flow at /signup to verify integration</li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default HBCUTestPage;
