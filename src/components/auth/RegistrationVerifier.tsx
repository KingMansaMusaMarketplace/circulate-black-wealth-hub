
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

type VerificationResult = {
  success: boolean;
  message: string;
  details?: Record<string, any>;
};

type VerificationStep = {
  name: string;
  status: 'idle' | 'loading' | 'success' | 'error';
  result?: VerificationResult;
};

export const RegistrationVerifier: React.FC = () => {
  const [email, setEmail] = useState<string>(`test${Date.now().toString().slice(-6)}@example.com`);
  const [password, setPassword] = useState<string>('Password123!');
  const [isCustomer, setIsCustomer] = useState<boolean>(true);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [steps, setSteps] = useState<VerificationStep[]>([
    { name: 'User Registration', status: 'idle' },
    { name: 'Profile Creation', status: 'idle' },
    { name: 'Metadata Verification', status: 'idle' },
    { name: 'Subscription Status', status: 'idle' }
  ]);

  const updateStepStatus = (index: number, status: VerificationStep['status'], result?: VerificationResult) => {
    setSteps(prev => prev.map((step, i) => 
      i === index ? { ...step, status, result } : step
    ));
  };

  const runVerification = async () => {
    // Reset all steps
    setSteps(prev => prev.map(step => ({ ...step, status: 'idle', result: undefined })));
    setIsRunning(true);
    
    try {
      // Step 1: Register test user
      updateStepStatus(0, 'loading');
      
      const userMetadata = isCustomer 
        ? { 
            userType: 'customer',
            fullName: 'Test Customer',
            subscription_status: 'active',
            subscription_start_date: new Date().toISOString()
          }
        : { 
            userType: 'business',
            businessName: 'Test Business',
            businessType: 'retail',
            businessAddress: '123 Test St',
            subscription_status: 'trial',
            subscription_start_date: new Date().toISOString()
          };

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userMetadata
        }
      });
      
      if (error) throw error;
      
      if (!data.user) {
        throw new Error('User registration failed - no user returned');
      }
      
      const userId = data.user.id;
      
      updateStepStatus(0, 'success', { 
        success: true, 
        message: 'User registered successfully',
        details: { userId, email }
      });
      
      // Step 2: Check if profile was created
      updateStepStatus(1, 'loading');
      
      // Wait a bit for potential triggers to complete
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (profileError) {
        updateStepStatus(1, 'error', { 
          success: false, 
          message: `Profile creation error: ${profileError.message}`
        });
      } else {
        updateStepStatus(1, 'success', { 
          success: true, 
          message: 'Profile created successfully',
          details: profileData
        });
      }
      
      // Step 3: Verify metadata is saved correctly
      updateStepStatus(2, 'loading');
      
      const expectedType = isCustomer ? 'customer' : 'business';
      const actualType = profileData?.user_type;
      
      const metadataMatches = actualType === expectedType;
      
      if (metadataMatches) {
        updateStepStatus(2, 'success', { 
          success: true, 
          message: `User type is correctly set to "${actualType}"`,
          details: { expected: expectedType, actual: actualType }
        });
      } else {
        updateStepStatus(2, 'error', { 
          success: false, 
          message: `User type mismatch: expected "${expectedType}", got "${actualType}"`,
          details: { expected: expectedType, actual: actualType }
        });
      }
      
      // Step 4: Check subscription status
      updateStepStatus(3, 'loading');
      
      const expectedStatus = isCustomer ? 'active' : 'trial';
      const actualStatus = profileData?.subscription_status;
      
      if (actualStatus === expectedStatus) {
        updateStepStatus(3, 'success', { 
          success: true, 
          message: `Subscription status is correctly set to "${actualStatus}"`,
          details: { expected: expectedStatus, actual: actualStatus }
        });
      } else {
        updateStepStatus(3, 'error', { 
          success: false, 
          message: `Subscription status mismatch: expected "${expectedStatus}", got "${actualStatus}"`,
          details: { expected: expectedStatus, actual: actualStatus } 
        });
      }
      
      // Clean up by signing out
      await supabase.auth.signOut();
      
    } catch (error: any) {
      // Handle any errors that weren't caught in the steps
      console.error('Verification error:', error);
      const failedStepIndex = steps.findIndex(step => step.status === 'loading');
      
      if (failedStepIndex >= 0) {
        updateStepStatus(failedStepIndex, 'error', {
          success: false,
          message: `Error: ${error.message || 'Unknown error occurred'}`
        });
      }
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="border rounded-lg p-5 max-w-xl mx-auto my-8">
      <h2 className="text-xl font-bold mb-4">Registration Verification Tool</h2>
      <p className="text-sm text-gray-600 mb-4">
        This tool tests the registration flow by creating a temporary test user and verifying that all backend processes work correctly.
        The test data will persist in your database but uses clearly marked test emails.
      </p>
      
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Test Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            disabled={isRunning}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Test Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            disabled={isRunning}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <input 
            type="radio" 
            id="customer" 
            checked={isCustomer} 
            onChange={() => setIsCustomer(true)}
            disabled={isRunning}
          />
          <label htmlFor="customer">Test Customer Registration</label>
          
          <input 
            type="radio" 
            id="business" 
            checked={!isCustomer} 
            onChange={() => setIsCustomer(false)}
            className="ml-4"
            disabled={isRunning}
          />
          <label htmlFor="business">Test Business Registration</label>
        </div>
      </div>
      
      <Button 
        onClick={runVerification} 
        disabled={isRunning}
        className="mb-6 w-full"
      >
        {isRunning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isRunning ? "Running Tests..." : "Start Verification"}
      </Button>
      
      <div className="space-y-3">
        {steps.map((step, index) => (
          <div key={index} className="border rounded p-3">
            <div className="flex justify-between items-center">
              <span className="font-medium">{step.name}</span>
              {step.status === 'idle' && <span className="text-gray-400">Waiting</span>}
              {step.status === 'loading' && <Loader2 className="animate-spin h-5 w-5 text-blue-500" />}
              {step.status === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
              {step.status === 'error' && <AlertCircle className="h-5 w-5 text-red-500" />}
            </div>
            
            {step.result && (
              <div className="mt-2">
                <Alert variant={step.result.success ? "default" : "destructive"}>
                  <AlertTitle>{step.result.success ? "Success" : "Error"}</AlertTitle>
                  <AlertDescription>{step.result.message}</AlertDescription>
                </Alert>
                
                {step.result.details && (
                  <div className="mt-2 text-xs bg-gray-50 p-2 rounded overflow-auto max-h-32">
                    <pre>{JSON.stringify(step.result.details, null, 2)}</pre>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {steps.some(step => step.status === 'success') && (
        <Alert className="mt-6">
          <AlertTitle>Testing Complete</AlertTitle>
          <AlertDescription>
            {steps.every(step => step.status === 'success') 
              ? "All tests passed! Your registration flow appears to be working correctly."
              : "Some tests failed. Please check the errors above."}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
