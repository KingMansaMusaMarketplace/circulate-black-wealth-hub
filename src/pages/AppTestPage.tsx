
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Play, 
  Navigation,
  Loader2,
  ExternalLink
} from 'lucide-react';

interface RouteTest {
  path: string;
  name: string;
  status: 'pending' | 'pass' | 'fail' | 'warning';
  message: string;
  requiresAuth?: boolean;
}

const AppTestPage: React.FC = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState<RouteTest[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTest, setCurrentTest] = useState<string | null>(null);

  const allRoutes: RouteTest[] = [
    { path: '/', name: 'Home Page', status: 'pending', message: 'Testing home page' },
    { path: '/directory', name: 'Directory Page', status: 'pending', message: 'Testing business directory' },
    { path: '/login', name: 'Login Page', status: 'pending', message: 'Testing login functionality' },
    { path: '/signup', name: 'Signup Page', status: 'pending', message: 'Testing signup functionality' },
    { path: '/dashboard', name: 'Dashboard Page', status: 'pending', message: 'Testing dashboard', requiresAuth: true },
    { path: '/scanner', name: 'QR Scanner Page', status: 'pending', message: 'Testing QR scanner' },
    { path: '/loyalty', name: 'Loyalty Page', status: 'pending', message: 'Testing loyalty system' },
    { path: '/business-form', name: 'Business Form Page', status: 'pending', message: 'Testing business registration' },
    { path: '/sponsorship', name: 'Sponsorship Page', status: 'pending', message: 'Testing corporate sponsorship' },
    { path: '/corporate-sponsorship', name: 'Corporate Sponsorship Page', status: 'pending', message: 'Testing corporate sponsorship (alt route)' },
    { path: '/community-impact', name: 'Community Impact Page', status: 'pending', message: 'Testing community impact' },
    { path: '/system-test', name: 'System Test Page', status: 'pending', message: 'Testing system diagnostics' },
    { path: '/mobile-test', name: 'Mobile Test Page', status: 'pending', message: 'Testing mobile features' },
    { path: '/comprehensive-test', name: 'Comprehensive Test Page', status: 'pending', message: 'Testing comprehensive diagnostics' },
    { path: '/signup-test', name: 'Signup Test Page', status: 'pending', message: 'Testing signup validation' },
    { path: '/new-password', name: 'New Password Page', status: 'pending', message: 'Testing password reset' },
    { path: '/password-reset-request', name: 'Password Reset Request Page', status: 'pending', message: 'Testing password reset request' },
    { path: '/mobile-readiness-test', name: 'Mobile Readiness Test Page', status: 'pending', message: 'Testing mobile readiness' },
    { path: '/app-test', name: 'App Test Page', status: 'pending', message: 'Testing app functionality (current page)' }
  ];

  useEffect(() => {
    setTests(allRoutes);
  }, []);

  const updateTest = (path: string, status: RouteTest['status'], message: string) => {
    setTests(prev => prev.map(test => 
      test.path === path ? { ...test, status, message } : test
    ));
  };

  const testRoute = async (route: RouteTest): Promise<boolean> => {
    return new Promise((resolve) => {
      const testWindow = window.open(route.path, '_blank', 'width=800,height=600');
      
      if (!testWindow) {
        updateTest(route.path, 'fail', 'Popup blocked - cannot test route');
        resolve(false);
        return;
      }

      let timeoutId: NodeJS.Timeout;
      let resolved = false;

      const checkContent = () => {
        try {
          if (testWindow.closed) {
            if (!resolved) {
              resolved = true;
              updateTest(route.path, 'warning', 'Window was closed before test completed');
              resolve(false);
            }
            return;
          }

          const doc = testWindow.document;
          const body = doc.body;
          
          if (!body) {
            return; // Still loading
          }

          // Check if page has meaningful content
          const textContent = body.textContent || '';
          const hasContent = textContent.trim().length > 50; // At least 50 characters
          const hasElements = body.children.length > 1; // More than just script tags
          const hasNavbar = doc.querySelector('nav') || doc.querySelector('[role="navigation"]');
          const hasMainContent = doc.querySelector('main') || doc.querySelector('[role="main"]') || body.children.length > 3;

          if (!resolved) {
            resolved = true;
            clearTimeout(timeoutId);
            testWindow.close();

            if (hasContent && hasElements && (hasNavbar || hasMainContent)) {
              updateTest(route.path, 'pass', `Page loaded successfully - ${Math.round(textContent.length / 100) * 100}+ characters`);
              resolve(true);
            } else if (hasContent && hasElements) {
              updateTest(route.path, 'warning', 'Page loaded but may be missing navigation or main content');
              resolve(true);
            } else {
              updateTest(route.path, 'fail', 'Page appears to be blank or has minimal content');
              resolve(false);
            }
          }
        } catch (error) {
          if (!resolved) {
            resolved = true;
            clearTimeout(timeoutId);
            testWindow.close();
            updateTest(route.path, 'fail', `Cross-origin error - likely working but cannot verify: ${error.message}`);
            resolve(false);
          }
        }
      };

      // Start checking after a short delay to allow page to load
      setTimeout(() => {
        const interval = setInterval(() => {
          if (resolved) {
            clearInterval(interval);
            return;
          }
          checkContent();
        }, 500);

        // Timeout after 10 seconds
        timeoutId = setTimeout(() => {
          clearInterval(interval);
          if (!resolved) {
            resolved = true;
            testWindow.close();
            updateTest(route.path, 'fail', 'Page load timeout - may be broken or very slow');
            resolve(false);
          }
        }, 10000);
      }, 1000);
    });
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setProgress(0);
    
    let passed = 0;
    let failed = 0;

    for (let i = 0; i < tests.length; i++) {
      const test = tests[i];
      setCurrentTest(test.name);
      
      if (test.path === '/app-test') {
        // Skip testing current page
        updateTest(test.path, 'pass', 'Current page - test skipped');
        passed++;
      } else {
        const result = await testRoute(test);
        if (result) passed++;
        else failed++;
      }
      
      setProgress(((i + 1) / tests.length) * 100);
      
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    setCurrentTest(null);
    setIsRunning(false);
    
    if (failed === 0) {
      toast.success(`All ${passed} pages tested successfully!`);
    } else {
      toast.error(`Testing completed: ${passed} passed, ${failed} failed/warnings`);
    }
  };

  const getStatusIcon = (status: RouteTest['status']) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'fail':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      default:
        return <div className="h-5 w-5 rounded-full bg-gray-300" />;
    }
  };

  const getStatusBadge = (status: RouteTest['status']) => {
    const variants = {
      pass: 'bg-green-100 text-green-800',
      fail: 'bg-red-100 text-red-800',
      warning: 'bg-yellow-100 text-yellow-800',
      pending: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <Badge className={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const navigateToRoute = (path: string) => {
    navigate(path);
  };

  const passCount = tests.filter(t => t.status === 'pass').length;
  const failCount = tests.filter(t => t.status === 'fail').length;
  const warningCount = tests.filter(t => t.status === 'warning').length;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="h-5 w-5" />
                Complete App Page Test
              </CardTitle>
              <CardDescription>
                Comprehensive testing of all pages and routes to identify blank or broken pages
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
                      Testing Pages...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Test All Pages
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
                  <div className="grid grid-cols-3 gap-4 mt-6">
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
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>All App Pages</CardTitle>
              <CardDescription>Click any page name to navigate there directly</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tests.map((test, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3 flex-grow">
                      {getStatusIcon(test.status)}
                      <div className="flex-grow">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigateToRoute(test.path)}
                            className="font-medium text-mansablue hover:underline text-left"
                          >
                            {test.name}
                          </button>
                          <ExternalLink className="h-3 w-3 text-gray-400" />
                          {test.requiresAuth && (
                            <Badge variant="outline" className="text-xs">Auth Required</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{test.message}</p>
                        <p className="text-xs text-gray-400">{test.path}</p>
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
              <CardTitle>Test Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• This test opens each page in a new window to check for content</p>
                <p>• Pages with sufficient content and proper structure will pass</p>
                <p>• Blank or minimal pages will be flagged as failures</p>
                <p>• Some pages may require authentication to display properly</p>
                <p>• Click on any page name above to navigate there directly</p>
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
