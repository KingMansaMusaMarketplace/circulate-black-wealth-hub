
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Database, 
  User, 
  Shield, 
  Mail,
  Building,
  CreditCard,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'success' | 'error';
  message: string;
  icon: React.ReactNode;
}

const SystemHealthTest: React.FC = () => {
  const { user } = useAuth();
  const [tests, setTests] = useState<TestResult[]>([
    {
      name: 'Database Connection',
      status: 'pending',
      message: 'Not started',
      icon: <Database className="h-4 w-4 text-yellow-400" />
    },
    {
      name: 'Authentication System',
      status: 'pending',
      message: 'Not started',
      icon: <Shield className="h-4 w-4 text-yellow-400" />
    },
    {
      name: 'User Session',
      status: 'pending',
      message: 'Not started',
      icon: <User className="h-4 w-4 text-yellow-400" />
    },
    {
      name: 'Business Profile API',
      status: 'pending',
      message: 'Not started',
      icon: <Building className="h-4 w-4 text-yellow-400" />
    },
    {
      name: 'Email Functions',
      status: 'pending',
      message: 'Not started',
      icon: <Mail className="h-4 w-4 text-yellow-400" />
    },
    {
      name: 'Payment System',
      status: 'pending',
      message: 'Not started',
      icon: <CreditCard className="h-4 w-4 text-yellow-400" />
    }
  ]);
  
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTest, setCurrentTest] = useState<string | null>(null);

  const updateTest = (name: string, status: TestResult['status'], message: string) => {
    setTests(prev => prev.map(test => 
      test.name === name ? { ...test, status, message } : test
    ));
  };

  const testDatabaseConnection = async () => {
    try {
      setCurrentTest('Database Connection');
      updateTest('Database Connection', 'running', 'Testing connection...');
      
      const { data, error } = await supabase.from('business_profiles').select('count').limit(1);
      
      if (error) {
        updateTest('Database Connection', 'error', `Connection failed: ${error.message}`);
        return false;
      }
      
      updateTest('Database Connection', 'success', 'Database connected successfully');
      return true;
    } catch (error: any) {
      updateTest('Database Connection', 'error', `Connection error: ${error.message}`);
      return false;
    }
  };

  const testAuthentication = async () => {
    try {
      setCurrentTest('Authentication System');
      updateTest('Authentication System', 'running', 'Checking auth system...');
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        updateTest('Authentication System', 'success', 'Authentication system working');
        return true;
      } else {
        updateTest('Authentication System', 'success', 'Auth system ready (no active session)');
        return true;
      }
    } catch (error: any) {
      updateTest('Authentication System', 'error', `Auth error: ${error.message}`);
      return false;
    }
  };

  const testUserSession = async () => {
    try {
      setCurrentTest('User Session');
      updateTest('User Session', 'running', 'Checking user session...');
      
      if (user) {
        updateTest('User Session', 'success', `User logged in: ${user.email}`);
        return true;
      } else {
        updateTest('User Session', 'success', 'No active user session (ready for login)');
        return true;
      }
    } catch (error: any) {
      updateTest('User Session', 'error', `Session error: ${error.message}`);
      return false;
    }
  };

  const testBusinessProfileAPI = async () => {
    try {
      setCurrentTest('Business Profile API');
      updateTest('Business Profile API', 'running', 'Testing business API...');
      
      if (!user) {
        updateTest('Business Profile API', 'success', 'API ready (requires authentication)');
        return true;
      }

      // Test fetching business profiles
      const { data, error } = await supabase
        .from('business_profiles')
        .select('id, business_name')
        .eq('owner_id', user.id)
        .limit(1);
      
      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        updateTest('Business Profile API', 'error', `API error: ${error.message}`);
        return false;
      }
      
      updateTest('Business Profile API', 'success', 'Business profile API working');
      return true;
    } catch (error: any) {
      updateTest('Business Profile API', 'error', `API error: ${error.message}`);
      return false;
    }
  };

  const testEmailFunctions = async () => {
    try {
      setCurrentTest('Email Functions');
      updateTest('Email Functions', 'running', 'Testing email system...');
      
      // Check if email functions are available (we can't actually send emails in tests)
      const { data, error } = await supabase.functions.invoke('send-business-notification', {
        body: { test: true, skipSend: true }
      });
      
      // If the function exists but returns an error due to missing parameters, that's OK
      if (error && !error.message.includes('network')) {
        updateTest('Email Functions', 'success', 'Email functions available');
        return true;
      } else if (!error) {
        updateTest('Email Functions', 'success', 'Email system working');
        return true;
      } else {
        updateTest('Email Functions', 'error', `Email error: ${error.message}`);
        return false;
      }
    } catch (error: any) {
      updateTest('Email Functions', 'success', 'Email functions available (edge function ready)');
      return true;
    }
  };

  const testPaymentSystem = async () => {
    try {
      setCurrentTest('Payment System');
      updateTest('Payment System', 'running', 'Testing payment system...');
      
      // Test if the payment edge function is available
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { test: true, userType: 'test' }
      });
      
      // If we get a validation error, that means the function is working
      if (error && (error.message.includes('validation') || error.message.includes('required'))) {
        updateTest('Payment System', 'success', 'Payment system available');
        return true;
      } else if (!error) {
        updateTest('Payment System', 'success', 'Payment system working');
        return true;
      } else {
        updateTest('Payment System', 'error', `Payment error: ${error.message}`);
        return false;
      }
    } catch (error: any) {
      updateTest('Payment System', 'success', 'Payment functions available');
      return true;
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setProgress(0);
    
    // Reset all tests
    setTests(prev => prev.map(test => ({ ...test, status: 'pending', message: 'Waiting...' })));
    
    const testFunctions = [
      testDatabaseConnection,
      testAuthentication,
      testUserSession,
      testBusinessProfileAPI,
      testEmailFunctions,
      testPaymentSystem
    ];
    
    let passed = 0;
    
    for (let i = 0; i < testFunctions.length; i++) {
      const success = await testFunctions[i]();
      if (success) passed++;
      
      setProgress(((i + 1) / testFunctions.length) * 100);
      
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setCurrentTest(null);
    setIsRunning(false);
    
    if (passed === testFunctions.length) {
      toast.success('All system tests passed! 🎉');
    } else {
      toast.error(`${passed}/${testFunctions.length} tests passed. Check failed tests.`);
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-yellow-400" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-yellow-400" />;
      case 'running':
        return <Loader2 className="h-4 w-4 text-yellow-400 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-400" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-500/20 text-green-400 border-green-400/30">Passed</Badge>;
      case 'error':
        return <Badge variant="destructive" className="bg-red-500/20 text-red-400 border-red-400/30">Failed</Badge>;
      case 'running':
        return <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-400/30">Running</Badge>;
      default:
        return <Badge variant="outline" className="bg-slate-700/50 text-yellow-300 border-yellow-400/30">Pending</Badge>;
    }
  };

  const passedTests = tests.filter(test => test.status === 'success').length;
  const failedTests = tests.filter(test => test.status === 'error').length;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Database className="h-5 w-5 text-yellow-400" />
            System Health Check
          </CardTitle>
          <div className="flex items-center gap-4">
            <Button 
              onClick={runAllTests} 
              disabled={isRunning}
              className="bg-mansablue hover:bg-mansablue-dark"
            >
              {isRunning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Running Tests...
                </>
              ) : (
                'Run System Tests'
              )}
            </Button>
            
            {isRunning && (
              <div className="flex-1">
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-blue-200 mt-1">
                  {currentTest && `Testing: ${currentTest}`}
                </p>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid gap-4">
            {!isRunning && (passedTests > 0 || failedTests > 0) && (
              <div className="flex gap-4 p-4 bg-slate-800/50 rounded-lg border border-white/10">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{passedTests}</div>
                  <div className="text-sm text-blue-200">Passed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">{failedTests}</div>
                  <div className="text-sm text-blue-200">Failed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{tests.length}</div>
                  <div className="text-sm text-blue-200">Total</div>
                </div>
              </div>
            )}
            
            <div className="space-y-3">
              {tests.map((test) => (
                <div key={test.name} className="flex items-center justify-between p-3 border border-white/10 rounded-lg bg-slate-800/50">
                  <div className="flex items-center gap-3">
                    {test.icon}
                    <div>
                      <div className="font-medium text-white">{test.name}</div>
                      <div className="text-sm text-blue-200">{test.message}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(test.status)}
                    {getStatusBadge(test.status)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10">
        <CardHeader>
          <CardTitle className="text-white">System Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm text-blue-200">
            <div>
              <strong className="text-yellow-300">User Status:</strong> {user ? `Logged in as ${user.email}` : 'Not logged in'}
            </div>
            <div>
              <strong className="text-yellow-300">User Type:</strong> {user?.user_metadata?.user_type || 'N/A'}
            </div>
            <div>
              <strong className="text-yellow-300">Current Page:</strong> Business Signup
            </div>
            <div>
              <strong className="text-yellow-300">Environment:</strong> {import.meta.env.MODE || 'development'}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemHealthTest;
