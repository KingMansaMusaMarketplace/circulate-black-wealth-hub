
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const useSignupTests = () => {
  const { signUp } = useAuth();
  const [testResults, setTestResults] = useState<{ [key: string]: 'pending' | 'success' | 'error' }>({});
  const [testLogs, setTestLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const log = (message: string) => {
    console.log(message);
    setTestLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const updateTestResult = (testName: string, result: 'pending' | 'success' | 'error') => {
    setTestResults(prev => ({ ...prev, [testName]: result }));
  };

  const generateStrongPassword = () => {
    const timestamp = Date.now();
    const randomChars = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `SecureTest${timestamp}${randomChars}!`;
  };

  const generateTestEmail = (type: string) => {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 8);
    return `test-${type}-${timestamp}-${randomId}@testmail.com`;
  };

  const testCustomerSignup = async () => {
    const testEmail = generateTestEmail('customer');
    const testPassword = generateStrongPassword();
    
    try {
      log(`Testing customer signup with email: ${testEmail}`);
      
      const result = await signUp(testEmail, testPassword, {
        full_name: 'Test Customer',
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
    const testEmail = generateTestEmail('business');
    const testPassword = generateStrongPassword();
    
    try {
      log(`Testing business signup with email: ${testEmail}`);
      
      const result = await signUp(testEmail, testPassword, {
        full_name: 'Test Business Owner',
        user_type: 'business'
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
    
    updateTestResult('customerSignup', 'pending');
    await testCustomerSignup();
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    updateTestResult('businessSignup', 'pending');
    await testBusinessSignup();
    
    log('All tests completed');
    setIsRunning(false);
  };

  return {
    testResults,
    testLogs,
    isRunning,
    runAllTests
  };
};
