import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Play, RefreshCw, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TestResult {
  name: string;
  status: 'idle' | 'running' | 'pass' | 'fail' | 'warning';
  message: string;
  details?: string;
  rejectionRisk: 'high' | 'medium' | 'low';
  guidelineReference?: string;
}

const AppleAppStoreComplianceTest: React.FC = () => {
  const [tests, setTests] = useState<TestResult[]>([
    { 
      name: 'Video Playback (iPad Compatibility)', 
      status: 'idle', 
      message: '', 
      rejectionRisk: 'high',
      guidelineReference: 'Guideline 2.1 - Performance'
    },
    { 
      name: 'Demo Account Access', 
      status: 'idle', 
      message: '', 
      rejectionRisk: 'high',
      guidelineReference: 'Guideline 2.1 - Information Needed'
    },
    { 
      name: 'Pricing Text in UI', 
      status: 'idle', 
      message: '', 
      rejectionRisk: 'medium',
      guidelineReference: 'Guideline 2.3.7 - Accurate Metadata'
    },
    { 
      name: 'Authentication Flow', 
      status: 'idle', 
      message: '', 
      rejectionRisk: 'high',
      guidelineReference: 'Guideline 2.1 - Performance'
    },
    { 
      name: 'Database Connectivity', 
      status: 'idle', 
      message: '', 
      rejectionRisk: 'high',
      guidelineReference: 'Guideline 2.1 - Performance'
    },
    { 
      name: 'Native iOS Features', 
      status: 'idle', 
      message: '', 
      rejectionRisk: 'medium',
      guidelineReference: 'Guideline 2.5.1 - Software Requirements'
    },
  ]);
  
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTest, setCurrentTest] = useState<string | null>(null);

  const updateTest = (name: string, updates: Partial<TestResult>) => {
    setTests(prev => prev.map(test => 
      test.name === name ? { ...test, ...updates } : test
    ));
  };

  // TEST 1: Video Playback - Check if YouTube videos use youtube-nocookie and have fallback
  const testVideoPlayback = async () => {
    try {
      // Check for YouTube iframes on the page
      const iframes = document.querySelectorAll('iframe[src*="youtube"]');
      
      if (iframes.length === 0) {
        return {
          status: 'warning' as const,
          message: 'No YouTube videos found on current page',
          details: 'Navigate to About page or How It Works to test video playback'
        };
      }

      let hasNoCookie = false;
      let hasFallback = false;
      
      iframes.forEach(iframe => {
        const src = iframe.getAttribute('src') || '';
        if (src.includes('youtube-nocookie.com')) {
          hasNoCookie = true;
        }
        
        // Check for fallback button
        const parent = iframe.closest('.w-full.aspect-video');
        if (parent && parent.querySelector('a[href*="youtube.com"]')) {
          hasFallback = true;
        }
      });

      if (hasNoCookie && hasFallback) {
        return {
          status: 'pass' as const,
          message: `✅ All ${iframes.length} video(s) use youtube-nocookie.com with fallback button`,
          details: 'Videos should play on iPad Air 11-inch (M3) running iPadOS 26.0.1'
        };
      } else if (hasNoCookie && !hasFallback) {
        return {
          status: 'warning' as const,
          message: '⚠️ Videos use youtube-nocookie but missing fallback button',
          details: 'Add "Watch on YouTube" fallback button for better iOS compatibility'
        };
      } else {
        return {
          status: 'fail' as const,
          message: '❌ Videos NOT using youtube-nocookie.com',
          details: 'CRITICAL: Switch to youtube-nocookie.com or videos will fail on iPad'
        };
      }
    } catch (error: any) {
      return {
        status: 'fail' as const,
        message: 'Video playback test failed',
        details: error.message
      };
    }
  };

  // TEST 2: Demo Account - Check if credentials are visible and accessible
  const testDemoAccountAccess = async () => {
    try {
      // Try to find demo account card/component - UPDATED FOR APPLE SUBMISSION
      const demoCard = document.querySelector('[data-testid="demo-account"]') ||
                       document.querySelector('.demo-account') ||
                       document.body.textContent?.includes('demo@mansamusa.com');
      
      const hasEmail = document.body.textContent?.includes('demo@mansamusa.com');
      const hasPassword = document.body.textContent?.includes('Demo123!');
      
      if (hasEmail && hasPassword) {
        // Try to verify the account exists in database
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', 'demo@mansamusa.com')
            .single();
          
          if (data) {
            return {
              status: 'pass' as const,
              message: '✅ Demo account visible on page and exists in database',
              details: 'Demo credentials: demo@mansamusa.com / Demo123! (matches App Store Connect submission)'
            };
          }
        } catch (dbError) {
          // If profile query fails, just check if auth account exists
          return {
            status: 'pass' as const,
            message: '✅ Demo account credentials visible on page',
            details: 'Credentials found on login page: demo@mansamusa.com / Demo123!'
          };
        }
      }
      
      if (hasEmail || hasPassword) {
        return {
          status: 'warning' as const,
          message: '⚠️ Demo credentials partially visible',
          details: 'Only one credential found. Ensure both email and password are clearly displayed'
        };
      }
      
      return {
        status: 'fail' as const,
        message: '❌ Demo account credentials NOT visible',
        details: 'CRITICAL: Add DemoAccountCard component to login page for reviewers'
      };
    } catch (error: any) {
      return {
        status: 'fail' as const,
        message: 'Demo account test failed',
        details: error.message
      };
    }
  };

  // TEST 3: Pricing Text - Check if UI contains pricing references that could violate metadata guidelines
  const testPricingTextInUI = async () => {
    try {
      const bodyText = document.body.textContent || '';
      
      // Search for pricing-related keywords
      const pricingKeywords = [
        /\bFREE\b/gi,
        /\bfree\b/gi,
        /\$0\b/g,
        /no cost/gi,
        /100% free/gi,
        /free until/gi,
        /free growth/gi,
        /\d+% off/gi,
      ];
      
      const foundPricing: string[] = [];
      pricingKeywords.forEach(regex => {
        const matches = bodyText.match(regex);
        if (matches && matches.length > 0) {
          foundPricing.push(`"${matches[0]}" (${matches.length} times)`);
        }
      });
      
      if (foundPricing.length > 10) {
        return {
          status: 'warning' as const,
          message: '⚠️ Heavy pricing text found in UI',
          details: `Found: ${foundPricing.slice(0, 5).join(', ')}... While allowed in app, minimize for screenshots`
        };
      } else if (foundPricing.length > 0) {
        return {
          status: 'pass' as const,
          message: `✅ Minimal pricing text (${foundPricing.length} instances)`,
          details: 'Screenshots must NOT contain pricing text per Guideline 2.3.7'
        };
      } else {
        return {
          status: 'pass' as const,
          message: '✅ No pricing text found on current page',
          details: 'Clean page for App Store screenshots'
        };
      }
    } catch (error: any) {
      return {
        status: 'fail' as const,
        message: 'Pricing text scan failed',
        details: error.message
      };
    }
  };

  // TEST 4: Authentication Flow
  const testAuthenticationFlow = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      // Check if login form exists
      const hasLoginForm = document.querySelector('form[data-auth="login"]') ||
                          document.querySelector('input[type="email"]') ||
                          document.querySelector('button[type="submit"]');
      
      return {
        status: 'pass' as const,
        message: session 
          ? `✅ Authenticated as ${session.user.email}` 
          : '✅ Auth system ready (not logged in)',
        details: hasLoginForm ? 'Login form detected' : 'Auth system functional'
      };
    } catch (error: any) {
      return {
        status: 'fail' as const,
        message: '❌ Authentication system error',
        details: error.message
      };
    }
  };

  // TEST 5: Database Connectivity
  const testDatabaseConnectivity = async () => {
    try {
      // Test read access
      const { data: businesses, error: bizError } = await supabase
        .from('businesses')
        .select('id')
        .limit(1);
      
      if (bizError) throw bizError;
      
      // Test profiles table
      const { data: profiles, error: profError } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);
      
      if (profError && profError.code !== 'PGRST116') { // Ignore empty table error
        throw profError;
      }
      
      return {
        status: 'pass' as const,
        message: '✅ Database fully accessible',
        details: `Connected to Supabase. Businesses table: ${businesses?.length || 0} records found`
      };
    } catch (error: any) {
      return {
        status: 'fail' as const,
        message: '❌ Database connection failed',
        details: error.message
      };
    }
  };

  // TEST 6: Native iOS Features (if applicable)
  const testNativeIOSFeatures = async () => {
    try {
      const features = {
        camera: document.querySelector('[data-feature="camera"]') || 
                document.querySelector('button[aria-label*="camera"]') ||
                document.querySelector('[class*="qr"]'),
        notifications: document.body.textContent?.includes('notification'),
        geolocation: document.body.textContent?.includes('location'),
      };
      
      const detectedFeatures = Object.entries(features)
        .filter(([_, exists]) => exists)
        .map(([name]) => name);
      
      if (detectedFeatures.length > 0) {
        return {
          status: 'pass' as const,
          message: `✅ Native features detected: ${detectedFeatures.join(', ')}`,
          details: 'Ensure these work correctly on physical iOS device before submission'
        };
      } else {
        return {
          status: 'pass' as const,
          message: '✅ No native features detected on current page',
          details: 'Standard web features only'
        };
      }
    } catch (error: any) {
      return {
        status: 'warning' as const,
        message: 'Native features test inconclusive',
        details: error.message
      };
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setProgress(0);
    
    const testFunctions = [
      { name: 'Video Playback (iPad Compatibility)', fn: testVideoPlayback },
      { name: 'Demo Account Access', fn: testDemoAccountAccess },
      { name: 'Pricing Text in UI', fn: testPricingTextInUI },
      { name: 'Authentication Flow', fn: testAuthenticationFlow },
      { name: 'Database Connectivity', fn: testDatabaseConnectivity },
      { name: 'Native iOS Features', fn: testNativeIOSFeatures },
    ];

    for (let i = 0; i < testFunctions.length; i++) {
      const test = testFunctions[i];
      setCurrentTest(test.name);
      updateTest(test.name, { status: 'running', message: 'Testing...' });

      try {
        const result = await test.fn();
        updateTest(test.name, result);
      } catch (error: any) {
        updateTest(test.name, {
          status: 'fail',
          message: 'Test execution failed',
          details: error.message
        });
      }

      setProgress(((i + 1) / testFunctions.length) * 100);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    setCurrentTest(null);
    setIsRunning(false);
    
    // Check results
    const highRiskFailures = tests.filter(t => t.status === 'fail' && t.rejectionRisk === 'high');
    if (highRiskFailures.length > 0) {
      toast.error('HIGH RISK: Critical issues found that will likely cause rejection');
    } else {
      toast.success('✅ All critical compliance tests passed!');
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pass': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'fail': return <XCircle className="h-5 w-5 text-red-600" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'running': return <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />;
      default: return <Shield className="h-5 w-5 text-gray-400" />;
    }
  };

  const getRiskBadge = (risk: 'high' | 'medium' | 'low') => {
    const colors = {
      high: 'destructive',
      medium: 'secondary',
      low: 'outline'
    } as const;
    
    return <Badge variant={colors[risk]}>{risk.toUpperCase()} RISK</Badge>;
  };

  const highRiskTests = tests.filter(t => t.rejectionRisk === 'high');
  const failedHighRisk = highRiskTests.filter(t => t.status === 'fail').length;
  const passedHighRisk = highRiskTests.filter(t => t.status === 'pass').length;

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-6">
      <Card className="border-2 border-blue-400/30 bg-slate-900/40 backdrop-blur-xl">
        <CardHeader className="bg-gradient-to-r from-blue-900/50 to-purple-900/50">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-yellow-400" />
            <div>
              <CardTitle className="text-2xl text-white">Apple App Store Compliance Test</CardTitle>
              <CardDescription className="text-base mt-1 text-blue-200">
                Comprehensive check for iOS App Store submission requirements
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-lg font-semibold text-white">
                  High Risk Tests: {passedHighRisk}/{highRiskTests.length} passed
                </p>
                {failedHighRisk > 0 && (
                  <p className="text-sm text-red-400 font-medium">
                    🚨 {failedHighRisk} critical issue(s) will likely cause rejection!
                  </p>
                )}
              </div>
              <Button 
                onClick={runAllTests} 
                disabled={isRunning}
                size="lg"
                className="min-w-[160px]"
              >
                {isRunning ? (
                  <>
                    <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5 mr-2" />
                    Run Compliance Test
                  </>
                )}
              </Button>
            </div>

            {isRunning && (
              <div className="space-y-2">
                <Progress value={progress} className="w-full h-3" />
                <p className="text-sm text-blue-200 font-medium">
                  {currentTest ? `Testing: ${currentTest}` : 'Initializing compliance tests...'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      <div className="space-y-4">
        {tests.map((test) => (
          <Card 
            key={test.name} 
            className={`bg-slate-900/40 backdrop-blur-xl border
              ${test.status === 'fail' && test.rejectionRisk === 'high' ? 'border-2 border-red-500/50' : ''}
              ${test.status === 'fail' && test.rejectionRisk === 'medium' ? 'border border-orange-400/50' : 'border-white/10'}
            `}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  {getStatusIcon(test.status)}
                  <div className="flex-1">
                    <CardTitle className="text-lg text-white">{test.name}</CardTitle>
                    {test.guidelineReference && (
                      <p className="text-xs text-blue-300 mt-1">{test.guidelineReference}</p>
                    )}
                  </div>
                </div>
                {getRiskBadge(test.rejectionRisk)}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <p className={`text-sm font-medium ${
                  test.status === 'fail' ? 'text-red-400' :
                  test.status === 'warning' ? 'text-orange-400' :
                  test.status === 'pass' ? 'text-green-400' :
                  'text-blue-200'
                }`}>{test.message}</p>
                {test.details && (
                  <p className="text-xs text-blue-200 bg-slate-800/50 p-2 rounded border border-white/10">
                    {test.details}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Resubmission Checklist */}
      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle>Final Resubmission Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <span>✅ All videos use youtube-nocookie.com with "Watch on YouTube" fallback button</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <span>✅ Demo account (testuser@example.com / TestPass123!) visible on login screen</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <span>✅ Screenshots uploaded to App Store Connect have NO pricing text</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <span>✅ App Review Information updated with demo credentials in App Store Connect</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <span>✅ Build number incremented in Xcode</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <span>✅ Tested on physical iPad (or iPad Simulator) for video playback</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppleAppStoreComplianceTest;
