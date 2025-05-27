
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';

const SignupTestPage: React.FC = () => {
  const { signUp, signIn } = useAuth();
  const [testResults, setTestResults] = useState<{ [key: string]: 'pending' | 'success' | 'error' }>({});
  const [testLogs, setTestLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const log = (message: string) => {
    console.log(message);
    setTestLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const updateTestResult = (testName: string, result: 'success' | 'error') => {
    setTestResults(prev => ({ ...prev, [testName]: result }));
  };

  const testCustomerSignup = async () => {
    const testEmail = `test-customer-${Date.now()}@example.com`;
    const testPassword = 'TestPassword123!';
    
    try {
      log(`Testing customer signup with email: ${testEmail}`);
      
      const result = await signUp(testEmail, testPassword, {
        name: 'Test Customer',
        userType: 'customer',
        user_type: 'customer'
      });
      
      if (result.error) {
        log(`Customer signup failed: ${result.error.message}`);
        updateTestResult('customerSignup', 'error');
        return false;
      }
      
      log('Customer signup successful');
      updateTestResult('customerSignup', 'success');
      return true;
    } catch (error: any) {
      log(`Customer signup error: ${error.message}`);
      updateTestResult('customerSignup', 'error');
      return false;
    }
  };

  const testBusinessSignup = async () => {
    const testEmail = `test-business-${Date.now()}@example.com`;
    const testPassword = 'TestPassword123!';
    
    try {
      log(`Testing business signup with email: ${testEmail}`);
      
      const result = await signUp(testEmail, testPassword, {
        name: 'Test Business Owner',
        userType: 'business',
        user_type: 'business',
        businessName: 'Test Business LLC',
        business_name: 'Test Business LLC',
        business_description: 'A test business for signup testing'
      });
      
      if (result.error) {
        log(`Business signup failed: ${result.error.message}`);
        updateTestResult('businessSignup', 'error');
        return false;
      }
      
      log('Business signup successful');
      updateTestResult('businessSignup', 'success');
      return true;
    } catch (error: any) {
      log(`Business signup error: ${error.message}`);
      updateTestResult('businessSignup', 'error');
      return false;
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults({});
    setTestLogs([]);
    
    log('Starting signup tests...');
    
    // Test customer signup
    updateTestResult('customerSignup', 'pending');
    await testCustomerSignup();
    
    // Wait a bit between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Test business signup
    updateTestResult('businessSignup', 'pending');
    await testBusinessSignup();
    
    log('All tests completed');
    setIsRunning(false);
  };

  const getStatusIcon = (status: 'pending' | 'success' | 'error') => {
    switch (status) {
      case 'pending':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Signup Testing Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Test Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={runAllTests} 
              disabled={isRunning}
              className="w-full"
            >
              {isRunning ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Running Tests...
                </>
              ) : (
                'Run All Signup Tests'
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Customer Signup</span>
                {getStatusIcon(testResults.customerSignup)}
              </div>
              <div className="flex items-center justify-between">
                <span>Business Signup</span>
                {getStatusIcon(testResults.businessSignup)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Test Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-100 p-4 rounded-lg max-h-96 overflow-y-auto">
            {testLogs.length === 0 ? (
              <p className="text-gray-500">No logs yet. Run tests to see detailed output.</p>
            ) : (
              testLogs.map((log, index) => (
                <div key={index} className="text-sm font-mono mb-1">
                  {log}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Alert className="mt-6">
        <AlertDescription>
          This testing page will create real test accounts in your database. 
          The tests use timestamp-based email addresses to avoid conflicts.
          Check the console and logs above for detailed error information.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default SignupTestPage;
