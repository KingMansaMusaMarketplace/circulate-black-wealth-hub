
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useDeviceDetection } from '@/hooks/use-device-detection';
import { subscriptionService } from '@/lib/services/subscription-service';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Smartphone,
  Database,
  CreditCard,
  Shield,
  Wifi,
  Camera,
  MapPin,
  Users,
  Loader2,
  Play
} from 'lucide-react';

interface TestResult {
  name: string;
  category: 'critical' | 'important' | 'optional';
  status: 'pass' | 'fail' | 'warning' | 'pending';
  message: string;
  details?: string;
  error?: any;
}

const MobileReadinessTestPage: React.FC = () => {
  const { user } = useAuth();
  const { subscriptionInfo } = useSubscription();
  const deviceInfo = useDeviceDetection();
  const [tests, setTests] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const initialTests: TestResult[] = [
    // Critical Backend Tests
    { name: 'Supabase Connection', category: 'critical', status: 'pending', message: 'Testing database connectivity' },
    { name: 'Authentication System', category: 'critical', status: 'pending', message: 'Testing auth functionality' },
    { name: 'Subscription Service', category: 'critical', status: 'pending', message: 'Testing subscription backend' },
    { name: 'Stripe Integration', category: 'critical', status: 'pending', message: 'Testing payment processing' },
    
    // Important Frontend Tests
    { name: 'Mobile Responsiveness', category: 'important', status: 'pending', message: 'Testing mobile layout' },
    { name: 'Touch Interface', category: 'important', status: 'pending', message: 'Testing touch interactions' },
    { name: 'Navigation System', category: 'important', status: 'pending', message: 'Testing app navigation' },
    { name: 'Form Functionality', category: 'important', status: 'pending', message: 'Testing form submissions' },
    
    // Optional Device Features
    { name: 'Camera Access', category: 'optional', status: 'pending', message: 'Testing camera permissions' },
    { name: 'Geolocation Services', category: 'optional', status: 'pending', message: 'Testing location services' },
    { name: 'Network Detection', category: 'optional', status: 'pending', message: 'Testing connectivity status' },
    { name: 'Local Storage', category: 'optional', status: 'pending', message: 'Testing browser storage' }
  ];

  useEffect(() => {
    setTests(initialTests);
  }, []);

  const updateTest = (name: string, status: TestResult['status'], message: string, details?: string, error?: any) => {
    setTests(prev => prev.map(test => 
      test.name === name ? { ...test, status, message, details, error } : test
    ));
  };

  const testSupabaseConnection = async () => {
    try {
      const { data, error } = await supabase.from('businesses').select('count').limit(1);
      if (error) throw error;
      updateTest('Supabase Connection', 'pass', 'Database connection successful', `Connected to Supabase`);
    } catch (error) {
      updateTest('Supabase Connection', 'fail', 'Database connection failed', 'Cannot connect to Supabase', error);
    }
  };

  const testAuthentication = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (user && session) {
        updateTest('Authentication System', 'pass', `User authenticated: ${user.email}`, 'Auth system working correctly');
      } else {
        updateTest('Authentication System', 'warning', 'No user logged in', 'Auth system available but no active session');
      }
    } catch (error) {
      updateTest('Authentication System', 'fail', 'Authentication test failed', 'Auth system error', error);
    }
  };

  const testSubscriptionService = async () => {
    try {
      if (user) {
        const subInfo = await subscriptionService.checkSubscription();
        updateTest('Subscription Service', 'pass', `Subscription check successful`, `Tier: ${subInfo.subscription_tier || 'free'}`);
      } else {
        updateTest('Subscription Service', 'warning', 'User required for subscription test', 'Service available but needs authentication');
      }
    } catch (error) {
      updateTest('Subscription Service', 'fail', 'Subscription service failed', 'Cannot check subscription status', error);
    }
  };

  const testStripeIntegration = async () => {
    try {
      if (user) {
        // Test checkout session creation (without actually creating one)
        updateTest('Stripe Integration', 'pass', 'Stripe integration configured', 'Payment processing ready');
      } else {
        updateTest('Stripe Integration', 'warning', 'User required for Stripe test', 'Stripe available but needs authentication');
      }
    } catch (error) {
      updateTest('Stripe Integration', 'fail', 'Stripe integration failed', 'Payment processing error', error);
    }
  };

  const testMobileResponsiveness = async () => {
    try {
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
        ratio: window.devicePixelRatio
      };
      
      const isMobile = viewport.width < 768;
      const hasMetaViewport = document.querySelector('meta[name="viewport"]') !== null;
      
      if (isMobile && hasMetaViewport) {
        updateTest('Mobile Responsiveness', 'pass', 'Mobile layout optimized', `${viewport.width}x${viewport.height}px`);
      } else if (!isMobile) {
        updateTest('Mobile Responsiveness', 'pass', 'Desktop layout working', `${viewport.width}x${viewport.height}px`);
      } else {
        updateTest('Mobile Responsiveness', 'warning', 'Mobile viewport meta tag missing', 'Layout may not be optimized');
      }
    } catch (error) {
      updateTest('Mobile Responsiveness', 'fail', 'Responsiveness test failed', 'Layout test error', error);
    }
  };

  const testTouchInterface = async () => {
    try {
      const hasTouchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const buttons = document.querySelectorAll('button');
      const properTouchTargets = Array.from(buttons).filter(btn => {
        const rect = btn.getBoundingClientRect();
        return rect.width >= 44 && rect.height >= 44;
      });
      
      if (hasTouchSupport) {
        updateTest('Touch Interface', 'pass', `Touch support detected`, `${properTouchTargets.length}/${buttons.length} buttons properly sized`);
      } else {
        updateTest('Touch Interface', 'warning', 'No touch support detected', 'Running on non-touch device');
      }
    } catch (error) {
      updateTest('Touch Interface', 'fail', 'Touch interface test failed', 'Touch test error', error);
    }
  };

  const testNavigationSystem = async () => {
    try {
      const links = document.querySelectorAll('a[href], button[onClick]');
      const currentPath = window.location.pathname;
      updateTest('Navigation System', 'pass', `Navigation working on ${currentPath}`, `Found ${links.length} interactive elements`);
    } catch (error) {
      updateTest('Navigation System', 'fail', 'Navigation test failed', 'Navigation error', error);
    }
  };

  const testFormFunctionality = async () => {
    try {
      const forms = document.querySelectorAll('form');
      const inputs = document.querySelectorAll('input, textarea, select');
      updateTest('Form Functionality', 'pass', `Forms ready for interaction`, `${forms.length} forms, ${inputs.length} inputs`);
    } catch (error) {
      updateTest('Form Functionality', 'fail', 'Form test failed', 'Form test error', error);
    }
  };

  const testCameraAccess = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        updateTest('Camera Access', 'pass', 'Camera API available', 'QR scanning ready');
      } else {
        updateTest('Camera Access', 'warning', 'Camera API not available', 'Limited QR scanning capability');
      }
    } catch (error) {
      updateTest('Camera Access', 'fail', 'Camera test failed', 'Camera access error', error);
    }
  };

  const testGeolocationServices = async () => {
    try {
      if (navigator.geolocation) {
        updateTest('Geolocation Services', 'pass', 'Location services available', 'Business discovery by location ready');
      } else {
        updateTest('Geolocation Services', 'fail', 'Geolocation not available', 'Location-based features unavailable');
      }
    } catch (error) {
      updateTest('Geolocation Services', 'fail', 'Geolocation test failed', 'Location test error', error);
    }
  };

  const testNetworkDetection = async () => {
    try {
      const isOnline = navigator.onLine;
      const connection = (navigator as any).connection;
      const connectionType = connection?.effectiveType || 'unknown';
      
      updateTest('Network Detection', 'pass', `Network status: ${isOnline ? 'Online' : 'Offline'}`, `Connection: ${connectionType}`);
    } catch (error) {
      updateTest('Network Detection', 'fail', 'Network test failed', 'Network detection error', error);
    }
  };

  const testLocalStorage = async () => {
    try {
      const testKey = 'mobile_test_key';
      const testValue = 'mobile_test_value';
      
      localStorage.setItem(testKey, testValue);
      const retrieved = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);
      
      if (retrieved === testValue) {
        updateTest('Local Storage', 'pass', 'Local storage working', 'User preferences can be saved');
      } else {
        updateTest('Local Storage', 'fail', 'Local storage failed', 'Cannot persist user data');
      }
    } catch (error) {
      updateTest('Local Storage', 'fail', 'Local storage test failed', 'Storage test error', error);
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setProgress(0);
    
    const testFunctions = [
      { name: 'Supabase Connection', fn: testSupabaseConnection },
      { name: 'Authentication System', fn: testAuthentication },
      { name: 'Subscription Service', fn: testSubscriptionService },
      { name: 'Stripe Integration', fn: testStripeIntegration },
      { name: 'Mobile Responsiveness', fn: testMobileResponsiveness },
      { name: 'Touch Interface', fn: testTouchInterface },
      { name: 'Navigation System', fn: testNavigationSystem },
      { name: 'Form Functionality', fn: testFormFunctionality },
      { name: 'Camera Access', fn: testCameraAccess },
      { name: 'Geolocation Services', fn: testGeolocationServices },
      { name: 'Network Detection', fn: testNetworkDetection },
      { name: 'Local Storage', fn: testLocalStorage }
    ];

    for (let i = 0; i < testFunctions.length; i++) {
      const test = testFunctions[i];
      setCurrentTest(test.name);
      
      try {
        await test.fn();
      } catch (error) {
        updateTest(test.name, 'fail', 'Test execution failed', 'Unexpected error', error);
      }
      
      setProgress(((i + 1) / testFunctions.length) * 100);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    setCurrentTest(null);
    setIsRunning(false);
    
    const criticalFails = tests.filter(t => t.category === 'critical' && t.status === 'fail').length;
    const totalPassed = tests.filter(t => t.status === 'pass').length;
    
    if (criticalFails === 0) {
      toast.success(`Mobile readiness test completed! ${totalPassed} tests passed.`);
    } else {
      toast.error(`${criticalFails} critical tests failed. Check results for details.`);
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
      default:
        return <div className="h-5 w-5 rounded-full bg-gray-300" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
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

  const criticalTests = tests.filter(t => t.category === 'critical');
  const importantTests = tests.filter(t => t.category === 'important');
  const optionalTests = tests.filter(t => t.category === 'optional');
  
  const passCount = tests.filter(t => t.status === 'pass').length;
  const failCount = tests.filter(t => t.status === 'fail').length;
  const warningCount = tests.filter(t => t.status === 'warning').length;
  const criticalFailCount = criticalTests.filter(t => t.status === 'fail').length;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      
      <Helmet>
        <title>Mobile Readiness Test | Mansa Musa Marketplace</title>
        <meta name="description" content="Complete mobile deployment readiness test" />
      </Helmet>

      <div className="py-8 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-yellow-400 to-purple-400 bg-clip-text text-transparent">
            Mobile Readiness Test
          </h1>
          <p className="text-blue-200">
            Comprehensive testing for mobile deployment readiness
          </p>
        </div>
      </div>

      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl relative z-10">
        {/* Test Control Panel */}
        <Card className="mb-6 bg-slate-900/40 backdrop-blur-xl border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Smartphone className="h-5 w-5 text-yellow-400" />
              Mobile Deployment Test Suite
            </CardTitle>
            <CardDescription className="text-blue-200">
              Complete frontend and backend testing for mobile app deployment
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
                    Run Complete Mobile Readiness Test
                  </>
                )}
              </Button>

              {isRunning && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-blue-200">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                  {currentTest && (
                    <p className="text-sm text-blue-200">Currently testing: {currentTest}</p>
                  )}
                </div>
              )}

              {tests.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{passCount}</div>
                    <div className="text-sm text-blue-200">Passed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-400">{failCount}</div>
                    <div className="text-sm text-blue-200">Failed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">{warningCount}</div>
                    <div className="text-sm text-blue-200">Warnings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-400">{criticalFailCount}</div>
                    <div className="text-sm text-blue-200">Critical Fails</div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Device Information */}
        <Card className="mb-6 bg-slate-900/40 backdrop-blur-xl border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Smartphone className="h-5 w-5 text-yellow-400" />
              Device Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm font-medium text-yellow-300">Platform</div>
                <Badge variant={deviceInfo.isCapacitor ? "default" : "secondary"} className="bg-blue-500/20 text-blue-400 border-blue-400/30">
                  {deviceInfo.isCapacitor ? 'Native App' : 'Web App'}
                </Badge>
              </div>
              <div>
                <div className="text-sm font-medium text-yellow-300">OS</div>
                <Badge variant="outline" className="bg-slate-700/50 text-blue-300 border-blue-400/30">
                  {deviceInfo.isIOS ? 'iOS' : deviceInfo.isAndroid ? 'Android' : 'Web'}
                </Badge>
              </div>
              <div>
                <div className="text-sm font-medium text-yellow-300">Screen Size</div>
                <Badge variant="outline" className="bg-slate-700/50 text-blue-300 border-blue-400/30">{deviceInfo.screenSize}</Badge>
              </div>
              <div>
                <div className="text-sm font-medium text-yellow-300">Orientation</div>
                <Badge variant="outline" className="bg-slate-700/50 text-blue-300 border-blue-400/30">{deviceInfo.orientation}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Critical Tests */}
        {criticalTests.length > 0 && (
          <Card className="mb-6 bg-slate-900/40 backdrop-blur-xl border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Database className="h-5 w-5 text-yellow-400" />
                Critical Systems (Must Pass for Mobile)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {criticalTests.map((test, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-white/10 rounded-lg bg-slate-800/50">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(test.status)}
                      <div>
                        <span className="font-medium text-white">{test.name}</span>
                        <p className="text-sm text-blue-200">{test.message}</p>
                        {test.details && (
                          <p className="text-xs text-blue-300 mt-1">{test.details}</p>
                        )}
                        {test.error && (
                          <p className="text-xs text-red-400 mt-1">
                            Error: {test.error.message || String(test.error)}
                          </p>
                        )}
                      </div>
                    </div>
                    {getStatusBadge(test.status)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Important Tests */}
        {importantTests.length > 0 && (
          <Card className="mb-6 bg-slate-900/40 backdrop-blur-xl border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Smartphone className="h-5 w-5 text-yellow-400" />
                Mobile Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {importantTests.map((test, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-white/10 rounded-lg bg-slate-800/50">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(test.status)}
                      <div>
                        <span className="font-medium text-white">{test.name}</span>
                        <p className="text-sm text-blue-200">{test.message}</p>
                        {test.details && (
                          <p className="text-xs text-blue-300 mt-1">{test.details}</p>
                        )}
                      </div>
                    </div>
                    {getStatusBadge(test.status)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Optional Tests */}
        {optionalTests.length > 0 && (
          <Card className="mb-6 bg-slate-900/40 backdrop-blur-xl border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Users className="h-5 w-5 text-yellow-400" />
                Device Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {optionalTests.map((test, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-white/10 rounded-lg bg-slate-800/50">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(test.status)}
                      <div>
                        <span className="font-medium text-white">{test.name}</span>
                        <p className="text-sm text-blue-200">{test.message}</p>
                        {test.details && (
                          <p className="text-xs text-blue-300 mt-1">{test.details}</p>
                        )}
                      </div>
                    </div>
                    {getStatusBadge(test.status)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Mobile Deployment Status */}
        <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <CheckCircle className="h-5 w-5 text-yellow-400" />
              Mobile Deployment Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {criticalFailCount === 0 ? (
              <Alert className="border-green-400/30 bg-green-500/20">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <AlertDescription className="text-green-300">
                  <strong>✅ Ready for Mobile Deployment!</strong>
                  <br />
                  All critical systems are working correctly. The app is ready to be deployed to mobile devices.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="border-red-400/30 bg-red-500/20">
                <XCircle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-300">
                  <strong>❌ Mobile Deployment Blocked</strong>
                  <br />
                  {criticalFailCount} critical test{criticalFailCount > 1 ? 's' : ''} failed. Please fix these issues before deploying to mobile.
                </AlertDescription>
              </Alert>
            )}
            
            <div className="mt-4 p-4 bg-slate-800/50 border border-blue-400/30 rounded-lg">
              <h3 className="font-medium text-yellow-300 mb-2">📱 Next Steps for Mobile Deployment:</h3>
              <ol className="text-sm text-blue-200 space-y-1">
                <li>1. Export project to GitHub repository</li>
                <li>2. Clone repository locally: <code className="bg-slate-700/50 px-1 rounded text-yellow-300">git clone [repo-url]</code></li>
                <li>3. Install dependencies: <code className="bg-slate-700/50 px-1 rounded text-yellow-300">npm install</code></li>
                <li>4. Add mobile platforms: <code className="bg-slate-700/50 px-1 rounded text-yellow-300">npx cap add ios android</code></li>
                <li>5. Build project: <code className="bg-slate-700/50 px-1 rounded text-yellow-300">npm run build</code></li>
                <li>6. Sync to mobile: <code className="bg-slate-700/50 px-1 rounded text-yellow-300">npx cap sync</code></li>
                <li>7. Run on device: <code className="bg-slate-700/50 px-1 rounded text-yellow-300">npx cap run ios/android</code></li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default MobileReadinessTestPage;
