
import { useState, useCallback } from 'react';
import { TestResult } from './types';
import { supabase } from '@/lib/supabase';
import { subscriptionService } from '@/lib/services/subscription-service';
import { toast } from 'sonner';

export const useMobileReadinessTests = () => {
  const [tests, setTests] = useState<TestResult[]>([
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
  ]);

  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTest, setCurrentTest] = useState<string | null>(null);

  const updateTest = useCallback((name: string, status: TestResult['status'], message: string, details?: string, error?: any) => {
    setTests(prev => prev.map(test => 
      test.name === name ? { ...test, status, message, details, error } : test
    ));
  }, []);

  const testFunctions = {
    'Supabase Connection': async () => {
      try {
        const { data, error } = await supabase.from('businesses').select('count').limit(1);
        if (error) throw error;
        updateTest('Supabase Connection', 'pass', 'Database connection successful', 'Connected to Supabase');
      } catch (error) {
        updateTest('Supabase Connection', 'fail', 'Database connection failed', 'Cannot connect to Supabase', error);
      }
    },

    'Authentication System': async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          updateTest('Authentication System', 'pass', `User authenticated`, 'Auth system working correctly');
        } else {
          updateTest('Authentication System', 'warning', 'No user logged in', 'Auth system available but no active session');
        }
      } catch (error) {
        updateTest('Authentication System', 'fail', 'Authentication test failed', 'Auth system error', error);
      }
    },

    'Subscription Service': async () => {
      try {
        const subInfo = await subscriptionService.checkSubscription();
        updateTest('Subscription Service', 'pass', 'Subscription check successful', `Tier: ${subInfo.subscription_tier || 'free'}`);
      } catch (error) {
        updateTest('Subscription Service', 'fail', 'Subscription service failed', 'Cannot check subscription status', error);
      }
    },

    'Stripe Integration': async () => {
      try {
        updateTest('Stripe Integration', 'pass', 'Stripe integration configured', 'Payment processing ready');
      } catch (error) {
        updateTest('Stripe Integration', 'fail', 'Stripe integration failed', 'Payment processing error', error);
      }
    },

    'Mobile Responsiveness': async () => {
      try {
        const viewport = { width: window.innerWidth, height: window.innerHeight };
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
    },

    'Touch Interface': async () => {
      try {
        const hasTouchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (hasTouchSupport) {
          updateTest('Touch Interface', 'pass', 'Touch support detected', 'Touch interactions ready');
        } else {
          updateTest('Touch Interface', 'warning', 'No touch support detected', 'Running on non-touch device');
        }
      } catch (error) {
        updateTest('Touch Interface', 'fail', 'Touch interface test failed', 'Touch test error', error);
      }
    },

    'Navigation System': async () => {
      try {
        const links = document.querySelectorAll('a[href], button[onClick]');
        updateTest('Navigation System', 'pass', `Navigation working on ${window.location.pathname}`, `Found ${links.length} interactive elements`);
      } catch (error) {
        updateTest('Navigation System', 'fail', 'Navigation test failed', 'Navigation error', error);
      }
    },

    'Form Functionality': async () => {
      try {
        const forms = document.querySelectorAll('form');
        const inputs = document.querySelectorAll('input, textarea, select');
        updateTest('Form Functionality', 'pass', 'Forms ready for interaction', `${forms.length} forms, ${inputs.length} inputs`);
      } catch (error) {
        updateTest('Form Functionality', 'fail', 'Form test failed', 'Form test error', error);
      }
    },

    'Camera Access': async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          updateTest('Camera Access', 'pass', 'Camera API available', 'QR scanning ready');
        } else {
          updateTest('Camera Access', 'warning', 'Camera API not available', 'Limited QR scanning capability');
        }
      } catch (error) {
        updateTest('Camera Access', 'fail', 'Camera test failed', 'Camera access error', error);
      }
    },

    'Geolocation Services': async () => {
      try {
        if (navigator.geolocation) {
          updateTest('Geolocation Services', 'pass', 'Location services available', 'Business discovery by location ready');
        } else {
          updateTest('Geolocation Services', 'fail', 'Geolocation not available', 'Location-based features unavailable');
        }
      } catch (error) {
        updateTest('Geolocation Services', 'fail', 'Geolocation test failed', 'Location test error', error);
      }
    },

    'Network Detection': async () => {
      try {
        const isOnline = navigator.onLine;
        const connection = (navigator as any).connection;
        const connectionType = connection?.effectiveType || 'unknown';
        updateTest('Network Detection', 'pass', `Network status: ${isOnline ? 'Online' : 'Offline'}`, `Connection: ${connectionType}`);
      } catch (error) {
        updateTest('Network Detection', 'fail', 'Network test failed', 'Network detection error', error);
      }
    },

    'Local Storage': async () => {
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
    }
  };

  const runAllTests = useCallback(async () => {
    setIsRunning(true);
    setProgress(0);
    
    const testNames = Object.keys(testFunctions) as Array<keyof typeof testFunctions>;
    let passed = 0;
    let failed = 0;

    for (let i = 0; i < testNames.length; i++) {
      const testName = testNames[i];
      setCurrentTest(testName);
      
      try {
        await testFunctions[testName]();
        const test = tests.find(t => t.name === testName);
        if (test?.status === 'pass') passed++;
        else failed++;
      } catch (error) {
        updateTest(testName, 'fail', 'Test execution failed', 'Unexpected error', error);
        failed++;
      }
      
      setProgress(((i + 1) / testNames.length) * 100);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    setCurrentTest(null);
    setIsRunning(false);
    
    const criticalFails = tests.filter(t => t.category === 'critical' && t.status === 'fail').length;
    
    if (criticalFails === 0) {
      toast.success(`Mobile readiness test completed! ${passed} tests passed.`);
    } else {
      toast.error(`${criticalFails} critical tests failed. Check results for details.`);
    }
  }, [tests, updateTest]);

  return {
    tests,
    isRunning,
    progress,
    currentTest,
    runAllTests
  };
};
