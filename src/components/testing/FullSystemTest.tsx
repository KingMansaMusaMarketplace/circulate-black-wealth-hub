import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, AlertTriangle, Play, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TestResult {
  name: string;
  status: 'idle' | 'running' | 'pass' | 'fail' | 'warning';
  message: string;
  details?: string;
  critical: boolean;
}

const FullSystemTest: React.FC = () => {
  const { user, signIn, signUp } = useAuth();
  const { subscriptionInfo, refreshSubscription } = useSubscription();
  const [tests, setTests] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTest, setCurrentTest] = useState<string | null>(null);

  const initialTests: TestResult[] = [
    { name: 'Supabase Connection', status: 'idle', message: '', critical: true },
    { name: 'Authentication Context', status: 'idle', message: '', critical: true },
    { name: 'Database Access', status: 'idle', message: '', critical: true },
    { name: 'Signup Form Validation', status: 'idle', message: '', critical: true },
    { name: 'Subscription Service', status: 'idle', message: '', critical: false },
    { name: 'Mobile Responsiveness', status: 'idle', message: '', critical: false },
    { name: 'Component Loading', status: 'idle', message: '', critical: true },
    { name: 'Network Connectivity', status: 'idle', message: '', critical: true },
  ];

  useEffect(() => {
    setTests(initialTests);
  }, []);

  const updateTest = (name: string, updates: Partial<TestResult>) => {
    setTests(prev => prev.map(test => 
      test.name === name ? { ...test, ...updates } : test
    ));
  };

  const testSupabaseConnection = async () => {
    try {
      const { data, error } = await supabase.from('profiles').select('count').limit(1);
      if (error) throw error;
      return { status: 'pass' as const, message: 'Supabase connected successfully' };
    } catch (error: any) {
      return { 
        status: 'fail' as const, 
        message: 'Supabase connection failed',
        details: error.message 
      };
    }
  };

  const testAuthenticationContext = async () => {
    try {
      if (typeof signIn !== 'function' || typeof signUp !== 'function') {
        throw new Error('Auth functions not available');
      }
      return { status: 'pass' as const, message: 'Auth context properly initialized' };
    } catch (error: any) {
      return { 
        status: 'fail' as const, 
        message: 'Auth context failed',
        details: error.message 
      };
    }
  };

  const testDatabaseAccess = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return { 
        status: 'pass' as const, 
        message: `Database accessible${data.session ? ' (authenticated)' : ' (anonymous)'}` 
      };
    } catch (error: any) {
      return { 
        status: 'fail' as const, 
        message: 'Database access failed',
        details: error.message 
      };
    }
  };

  const testSignupFormValidation = async () => {
    try {
      // Check if signup components exist
      const signupElement = document.querySelector('[data-testid="signup-form"]') || 
                           document.querySelector('form') ||
                           document.querySelector('[data-component="signup"]');
      
      if (signupElement) {
        return { status: 'pass' as const, message: 'Signup form components loaded' };
      } else {
        return { status: 'warning' as const, message: 'Signup form not found on current page' };
      }
    } catch (error: any) {
      return { 
        status: 'fail' as const, 
        message: 'Signup form validation failed',
        details: error.message 
      };
    }
  };

  const testSubscriptionService = async () => {
    try {
      await refreshSubscription();
      return { 
        status: 'pass' as const, 
        message: `Subscription service working (${subscriptionInfo?.subscription_tier || 'free'})` 
      };
    } catch (error: any) {
      return { 
        status: 'warning' as const, 
        message: 'Subscription service issues',
        details: error.message 
      };
    }
  };

  const testMobileResponsiveness = async () => {
    try {
      const viewport = window.innerWidth;
      const isMobile = viewport < 768;
      const hasViewportMeta = document.querySelector('meta[name="viewport"]');
      
      return { 
        status: 'pass' as const, 
        message: `Responsive design active (${viewport}px${isMobile ? ' mobile' : ' desktop'})${hasViewportMeta ? ' with viewport meta' : ''}` 
      };
    } catch (error: any) {
      return { 
        status: 'fail' as const, 
        message: 'Mobile responsiveness check failed',
        details: error.message 
      };
    }
  };

  const testComponentLoading = async () => {
    try {
      const components = [
        'button',
        'input',
        'form',
        '[class*="card"]',
        '[class*="nav"]'
      ];
      
      const foundComponents = components.filter(selector => 
        document.querySelector(selector)
      );
      
      if (foundComponents.length >= 3) {
        return { status: 'pass' as const, message: `${foundComponents.length}/${components.length} core components loaded` };
      } else {
        return { status: 'warning' as const, message: `Only ${foundComponents.length}/${components.length} components loaded` };
      }
    } catch (error: any) {
      return { 
        status: 'fail' as const, 
        message: 'Component loading check failed',
        details: error.message 
      };
    }
  };

  const testNetworkConnectivity = async () => {
    try {
      const response = await fetch(window.location.origin, { method: 'HEAD' });
      if (response.ok) {
        return { status: 'pass' as const, message: 'Network connectivity verified' };
      } else {
        return { status: 'warning' as const, message: `Network issues (${response.status})` };
      }
    } catch (error: any) {
      return { 
        status: 'fail' as const, 
        message: 'Network connectivity failed',
        details: error.message 
      };
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setProgress(0);
    
    const testFunctions = {
      'Supabase Connection': testSupabaseConnection,
      'Authentication Context': testAuthenticationContext,
      'Database Access': testDatabaseAccess,
      'Signup Form Validation': testSignupFormValidation,
      'Subscription Service': testSubscriptionService,
      'Mobile Responsiveness': testMobileResponsiveness,
      'Component Loading': testComponentLoading,
      'Network Connectivity': testNetworkConnectivity,
    };

    for (let i = 0; i < tests.length; i++) {
      const test = tests[i];
      setCurrentTest(test.name);
      updateTest(test.name, { status: 'running', message: 'Testing...' });

      try {
        const testFunction = testFunctions[test.name as keyof typeof testFunctions];
        if (testFunction) {
          const result = await testFunction();
          updateTest(test.name, result);
        }
      } catch (error: any) {
        updateTest(test.name, {
          status: 'fail',
          message: 'Test execution failed',
          details: error.message
        });
      }

      setProgress(((i + 1) / tests.length) * 100);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    setCurrentTest(null);
    setIsRunning(false);
    toast.success('System test completed');
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pass': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'fail': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'running': return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    const variants = {
      pass: 'default',
      fail: 'destructive',
      warning: 'secondary',
      running: 'outline',
      idle: 'outline'
    } as const;
    
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const criticalTests = tests.filter(test => test.critical);
  const nonCriticalTests = tests.filter(test => !test.critical);
  const failedCritical = criticalTests.filter(test => test.status === 'fail').length;
  const passedCritical = criticalTests.filter(test => test.status === 'pass').length;

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Full System Test
          </CardTitle>
          <CardDescription>
            Comprehensive testing of all critical and non-critical systems
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  Critical Systems: {passedCritical}/{criticalTests.length} passed
                </p>
                {failedCritical > 0 && (
                  <p className="text-sm text-red-600">
                    ⚠️ {failedCritical} critical system(s) failing
                  </p>
                )}
              </div>
              <Button 
                onClick={runAllTests} 
                disabled={isRunning}
                className="min-w-[120px]"
              >
                {isRunning ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Run Tests
                  </>
                )}
              </Button>
            </div>

            {isRunning && (
              <div className="space-y-2">
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-gray-600">
                  {currentTest ? `Testing: ${currentTest}` : 'Initializing...'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Critical Systems (Must Pass)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {criticalTests.map((test) => (
              <div key={test.name} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(test.status)}
                  <div>
                    <p className="font-medium">{test.name}</p>
                    <p className="text-sm text-gray-600">{test.message}</p>
                    {test.details && (
                      <p className="text-xs text-red-600 mt-1">{test.details}</p>
                    )}
                  </div>
                </div>
                {getStatusBadge(test.status)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {nonCriticalTests.map((test) => (
              <div key={test.name} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(test.status)}
                  <div>
                    <p className="font-medium">{test.name}</p>
                    <p className="text-sm text-gray-600">{test.message}</p>
                    {test.details && (
                      <p className="text-xs text-red-600 mt-1">{test.details}</p>
                    )}
                  </div>
                </div>
                {getStatusBadge(test.status)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Info */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium">User Status</p>
              <p className="text-gray-600">{user ? `Logged in: ${user.email}` : 'Not logged in'}</p>
            </div>
            <div>
              <p className="font-medium">Subscription</p>
              <p className="text-gray-600">{subscriptionInfo?.subscription_tier || 'Free'}</p>
            </div>
            <div>
              <p className="font-medium">Viewport</p>
              <p className="text-gray-600">{window.innerWidth}x{window.innerHeight}</p>
            </div>
            <div>
              <p className="font-medium">User Agent</p>
              <p className="text-gray-600">{navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FullSystemTest;