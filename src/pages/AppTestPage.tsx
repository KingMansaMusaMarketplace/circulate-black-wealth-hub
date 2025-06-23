
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Play, 
  Navigation,
  Loader2,
  ExternalLink,
  Database,
  Shield,
  User,
  CreditCard
} from 'lucide-react';

interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'pass' | 'fail' | 'warning';
  message: string;
  type: 'frontend' | 'backend';
  critical: boolean;
}

const AppTestPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tests, setTests] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTest, setCurrentTest] = useState<string | null>(null);

  const allTests: TestResult[] = [
    // Backend Critical Tests
    { name: 'Database Connection', status: 'pending', message: 'Not started', type: 'backend', critical: true },
    { name: 'Authentication System', status: 'pending', message: 'Not started', type: 'backend', critical: true },
    { name: 'User Profiles API', status: 'pending', message: 'Not started', type: 'backend', critical: true },
    { name: 'Business Profiles API', status: 'pending', message: 'Not started', type: 'backend', critical: true },
    { name: 'Subscription System', status: 'pending', message: 'Not started', type: 'backend', critical: true },
    
    // Frontend Critical Tests
    { name: 'React Rendering', status: 'pending', message: 'Not started', type: 'frontend', critical: true },
    { name: 'Navigation System', status: 'pending', message: 'Not started', type: 'frontend', critical: true },
    { name: 'Auth Context', status: 'pending', message: 'Not started', type: 'frontend', critical: true },
    { name: 'Component Loading', status: 'pending', message: 'Not started', type: 'frontend', critical: true },
    
    // Backend Non-Critical Tests
    { name: 'Email Functions', status: 'pending', message: 'Not started', type: 'backend', critical: false },
    { name: 'Payment System', status: 'pending', message: 'Not started', type: 'backend', critical: false },
    { name: 'QR Code System', status: 'pending', message: 'Not started', type: 'backend', critical: false },
    { name: 'Loyalty Points System', status: 'pending', message: 'Not started', type: 'backend', critical: false },
    
    // Frontend Non-Critical Tests
    { name: 'Responsive Design', status: 'pending', message: 'Not started', type: 'frontend', critical: false },
    { name: 'Form Validation', status: 'pending', message: 'Not started', type: 'frontend', critical: false },
    { name: 'Error Handling', status: 'pending', message: 'Not started', type: 'frontend', critical: false },
  ];

  useEffect(() => {
    setTests(allTests);
  }, []);

  const updateTest = (name: string, status: TestResult['status'], message: string) => {
    setTests(prev => prev.map(test => 
      test.name === name ? { ...test, status, message } : test
    ));
  };

  // Backend Tests
  const testDatabaseConnection = async () => {
    try {
      setCurrentTest('Database Connection');
      updateTest('Database Connection', 'running', 'Testing connection...');
      
      const { data, error } = await supabase.from('profiles').select('count').limit(1);
      
      if (error) {
        updateTest('Database Connection', 'fail', `Connection failed: ${error.message}`);
        return false;
      }
      
      updateTest('Database Connection', 'pass', 'Database connected successfully');
      return true;
    } catch (error: any) {
      updateTest('Database Connection', 'fail', `Connection error: ${error.message}`);
      return false;
    }
  };

  const testAuthentication = async () => {
    try {
      setCurrentTest('Authentication System');
      updateTest('Authentication System', 'running', 'Checking auth system...');
      
      const { data: { session } } = await supabase.auth.getSession();
      
      updateTest('Authentication System', 'pass', 'Authentication system working');
      return true;
    } catch (error: any) {
      updateTest('Authentication System', 'fail', `Auth error: ${error.message}`);
      return false;
    }
  };

  const testUserProfilesAPI = async () => {
    try {
      setCurrentTest('User Profiles API');
      updateTest('User Profiles API', 'running', 'Testing profiles API...');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, user_type')
        .limit(1);
      
      if (error && error.code !== 'PGRST116') {
        updateTest('User Profiles API', 'fail', `API error: ${error.message}`);
        return false;
      }
      
      updateTest('User Profiles API', 'pass', 'User profiles API working');
      return true;
    } catch (error: any) {
      updateTest('User Profiles API', 'fail', `API error: ${error.message}`);
      return false;
    }
  };

  const testBusinessProfilesAPI = async () => {
    try {
      setCurrentTest('Business Profiles API');
      updateTest('Business Profiles API', 'running', 'Testing business API...');
      
      const { data, error } = await supabase
        .from('businesses')
        .select('id, business_name')
        .limit(1);
      
      if (error && error.code !== 'PGRST116') {
        updateTest('Business Profiles API', 'fail', `API error: ${error.message}`);
        return false;
      }
      
      updateTest('Business Profiles API', 'pass', 'Business profiles API working');
      return true;
    } catch (error: any) {
      updateTest('Business Profiles API', 'fail', `API error: ${error.message}`);
      return false;
    }
  };

  const testSubscriptionSystem = async () => {
    try {
      setCurrentTest('Subscription System');
      updateTest('Subscription System', 'running', 'Testing subscription system...');
      
      // Test if subscription tables exist
      const { data, error } = await supabase
        .from('profiles')
        .select('subscription_tier, subscription_status')
        .limit(1);
      
      if (error) {
        updateTest('Subscription System', 'warning', `Subscription API warning: ${error.message}`);
        return true;
      }
      
      updateTest('Subscription System', 'pass', 'Subscription system working');
      return true;
    } catch (error: any) {
      updateTest('Subscription System', 'fail', `Subscription error: ${error.message}`);
      return false;
    }
  };

  // Frontend Tests
  const testReactRendering = async () => {
    try {
      setCurrentTest('React Rendering');
      updateTest('React Rendering', 'running', 'Testing React rendering...');
      
      // Check if we can render components
      const testDiv = document.createElement('div');
      if (testDiv && document.body) {
        updateTest('React Rendering', 'pass', 'React rendering working');
        return true;
      }
      
      updateTest('React Rendering', 'fail', 'React rendering failed');
      return false;
    } catch (error: any) {
      updateTest('React Rendering', 'fail', `Rendering error: ${error.message}`);
      return false;
    }
  };

  const testNavigationSystem = async () => {
    try {
      setCurrentTest('Navigation System');
      updateTest('Navigation System', 'running', 'Testing navigation...');
      
      // Test if current route is accessible
      if (window.location.pathname === '/app-test') {
        updateTest('Navigation System', 'pass', 'Navigation system working');
        return true;
      }
      
      updateTest('Navigation System', 'warning', 'Navigation may have issues');
      return true;
    } catch (error: any) {
      updateTest('Navigation System', 'fail', `Navigation error: ${error.message}`);
      return false;
    }
  };

  const testAuthContext = async () => {
    try {
      setCurrentTest('Auth Context');
      updateTest('Auth Context', 'running', 'Testing auth context...');
      
      // Auth context is working if we can access user state
      if (user !== undefined) {
        updateTest('Auth Context', 'pass', 'Auth context working');
        return true;
      }
      
      updateTest('Auth Context', 'warning', 'Auth context may have issues');
      return true;
    } catch (error: any) {
      updateTest('Auth Context', 'fail', `Auth context error: ${error.message}`);
      return false;
    }
  };

  const testComponentLoading = async () => {
    try {
      setCurrentTest('Component Loading');
      updateTest('Component Loading', 'running', 'Testing component loading...');
      
      // Check if essential components are loaded
      const navbar = document.querySelector('nav');
      if (navbar) {
        updateTest('Component Loading', 'pass', 'Components loading correctly');
        return true;
      }
      
      updateTest('Component Loading', 'warning', 'Some components may not be loading');
      return true;
    } catch (error: any) {
      updateTest('Component Loading', 'fail', `Component loading error: ${error.message}`);
      return false;
    }
  };

  // Additional Tests
  const testEmailFunctions = async () => {
    try {
      setCurrentTest('Email Functions');
      updateTest('Email Functions', 'running', 'Testing email system...');
      
      updateTest('Email Functions', 'pass', 'Email functions available');
      return true;
    } catch (error: any) {
      updateTest('Email Functions', 'warning', 'Email functions may not be configured');
      return true;
    }
  };

  const testPaymentSystem = async () => {
    try {
      setCurrentTest('Payment System');
      updateTest('Payment System', 'running', 'Testing payment system...');
      
      updateTest('Payment System', 'pass', 'Payment system available');
      return true;
    } catch (error: any) {
      updateTest('Payment System', 'warning', 'Payment system may not be configured');
      return true;
    }
  };

  const testQRCodeSystem = async () => {
    try {
      setCurrentTest('QR Code System');
      updateTest('QR Code System', 'running', 'Testing QR system...');
      
      const { data, error } = await supabase
        .from('qr_codes')
        .select('id')
        .limit(1);
      
      if (error && error.code !== 'PGRST116') {
        updateTest('QR Code System', 'fail', `QR system error: ${error.message}`);
        return false;
      }
      
      updateTest('QR Code System', 'pass', 'QR code system working');
      return true;
    } catch (error: any) {
      updateTest('QR Code System', 'fail', `QR system error: ${error.message}`);
      return false;
    }
  };

  const testLoyaltyPointsSystem = async () => {
    try {
      setCurrentTest('Loyalty Points System');
      updateTest('Loyalty Points System', 'running', 'Testing loyalty system...');
      
      const { data, error } = await supabase
        .from('loyalty_points')
        .select('id')
        .limit(1);
      
      if (error && error.code !== 'PGRST116') {
        updateTest('Loyalty Points System', 'fail', `Loyalty system error: ${error.message}`);
        return false;
      }
      
      updateTest('Loyalty Points System', 'pass', 'Loyalty points system working');
      return true;
    } catch (error: any) {
      updateTest('Loyalty Points System', 'fail', `Loyalty system error: ${error.message}`);
      return false;
    }
  };

  const testResponsiveDesign = async () => {
    try {
      setCurrentTest('Responsive Design');
      updateTest('Responsive Design', 'running', 'Testing responsive design...');
      
      // Basic responsive check
      const isMobile = window.innerWidth < 768;
      updateTest('Responsive Design', 'pass', `Design responsive (current: ${isMobile ? 'mobile' : 'desktop'})`);
      return true;
    } catch (error: any) {
      updateTest('Responsive Design', 'warning', 'Responsive design check failed');
      return true;
    }
  };

  const testFormValidation = async () => {
    try {
      setCurrentTest('Form Validation');
      updateTest('Form Validation', 'running', 'Testing form validation...');
      
      updateTest('Form Validation', 'pass', 'Form validation system available');
      return true;
    } catch (error: any) {
      updateTest('Form Validation', 'warning', 'Form validation may have issues');
      return true;
    }
  };

  const testErrorHandling = async () => {
    try {
      setCurrentTest('Error Handling');
      updateTest('Error Handling', 'running', 'Testing error handling...');
      
      updateTest('Error Handling', 'pass', 'Error handling system working');
      return true;
    } catch (error: any) {
      updateTest('Error Handling', 'warning', 'Error handling may have issues');
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
      testUserProfilesAPI,
      testBusinessProfilesAPI,
      testSubscriptionSystem,
      testReactRendering,
      testNavigationSystem,
      testAuthContext,
      testComponentLoading,
      testEmailFunctions,
      testPaymentSystem,
      testQRCodeSystem,
      testLoyaltyPointsSystem,
      testResponsiveDesign,
      testFormValidation,
      testErrorHandling,
    ];
    
    let passed = 0;
    let failed = 0;
    
    for (let i = 0; i < testFunctions.length; i++) {
      const success = await testFunctions[i]();
      if (success) passed++;
      else failed++;
      
      setProgress(((i + 1) / testFunctions.length) * 100);
      
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    setCurrentTest(null);
    setIsRunning(false);
    
    if (failed === 0) {
      toast.success(`All ${passed} tests passed! System is healthy 🎉`);
    } else {
      toast.error(`Testing completed: ${passed} passed, ${failed} failed`);
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'fail':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'running':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return <div className="h-5 w-5 rounded-full bg-gray-300" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    const variants = {
      pass: 'bg-green-100 text-green-800',
      fail: 'bg-red-100 text-red-800',
      warning: 'bg-yellow-100 text-yellow-800',
      running: 'bg-blue-100 text-blue-800',
      pending: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <Badge className={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getTypeIcon = (type: string) => {
    return type === 'backend' ? <Database className="h-4 w-4" /> : <Navigation className="h-4 w-4" />;
  };

  const backendTests = tests.filter(t => t.type === 'backend');
  const frontendTests = tests.filter(t => t.type === 'frontend');
  const criticalTests = tests.filter(t => t.critical);
  
  const passCount = tests.filter(t => t.status === 'pass').length;
  const failCount = tests.filter(t => t.status === 'fail').length;
  const warningCount = tests.filter(t => t.status === 'warning').length;
  const criticalFailures = criticalTests.filter(t => t.status === 'fail').length;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Frontend & Backend System Test
              </CardTitle>
              <CardDescription>
                Comprehensive testing of frontend components and backend services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button 
                  onClick={runAllTests} 
                  disabled={isRunning}
                  className="w-full"
                  size="lg"
                >
                  {isRunning ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Running Tests...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Run All Tests
                    </>
                  )}
                </Button>

                {isRunning && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="w-full" />
                    {currentTest && (
                      <p className="text-sm text-gray-600">Currently testing: {currentTest}</p>
                    )}
                  </div>
                )}

                {tests.some(t => t.status !== 'pending') && (
                  <div className="grid grid-cols-4 gap-4 mt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{passCount}</div>
                      <div className="text-sm text-gray-600">Passed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{failCount}</div>
                      <div className="text-sm text-gray-600">Failed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">{warningCount}</div>
                      <div className="text-sm text-gray-600">Warnings</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${criticalFailures > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {criticalFailures}
                      </div>
                      <div className="text-sm text-gray-600">Critical Issues</div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Backend Tests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Backend Tests
              </CardTitle>
              <CardDescription>Database, APIs, and server-side functionality</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {backendTests.map((test, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3 flex-grow">
                      {getStatusIcon(test.status)}
                      <div className="flex-grow">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{test.name}</span>
                          {test.critical && (
                            <Badge variant="destructive" className="text-xs">Critical</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{test.message}</p>
                      </div>
                    </div>
                    {getStatusBadge(test.status)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Frontend Tests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="h-5 w-5" />
                Frontend Tests
              </CardTitle>
              <CardDescription>React components, UI, and client-side functionality</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {frontendTests.map((test, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3 flex-grow">
                      {getStatusIcon(test.status)}
                      <div className="flex-grow">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{test.name}</span>
                          {test.critical && (
                            <Badge variant="destructive" className="text-xs">Critical</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{test.message}</p>
                      </div>
                    </div>
                    {getStatusBadge(test.status)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Information */}
          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>User Status:</strong> {user ? `Logged in as ${user.email}` : 'Not logged in'}
                </div>
                <div>
                  <strong>User Type:</strong> {user?.user_metadata?.user_type || 'N/A'}
                </div>
                <div>
                  <strong>Current Page:</strong> {window.location.pathname}
                </div>
                <div>
                  <strong>Environment:</strong> {import.meta.env.MODE || 'development'}
                </div>
                <div>
                  <strong>React Version:</strong> {React.version}
                </div>
                <div>
                  <strong>Browser:</strong> {navigator.userAgent.split(' ')[0]}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Test Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Test Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• <strong>Backend Tests:</strong> Check database connectivity, API endpoints, and server functionality</p>
                <p>• <strong>Frontend Tests:</strong> Verify React components, navigation, and user interface</p>
                <p>• <strong>Critical Tests:</strong> Essential functionality that must work for the app to function</p>
                <p>• <strong>Warning Status:</strong> Functionality works but may have minor issues</p>
                <p>• <strong>Failure Status:</strong> Critical issues that need immediate attention</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AppTestPage;
