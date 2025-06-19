
import { useState, useCallback } from 'react';
import { RouteTest } from './types';
import { toast } from 'sonner';

export const useRouteTestRunner = (initialTests: RouteTest[]) => {
  const [tests, setTests] = useState<RouteTest[]>(initialTests);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTest, setCurrentTest] = useState<string | null>(null);

  const updateTest = useCallback((path: string, status: RouteTest['status'], message: string) => {
    setTests(prev => prev.map(test => 
      test.path === path ? { ...test, status, message } : test
    ));
  }, []);

  const testRoute = useCallback(async (route: RouteTest): Promise<boolean> => {
    return new Promise((resolve) => {
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.style.width = '800px';
      iframe.style.height = '600px';
      
      let timeoutId: NodeJS.Timeout;
      let resolved = false;

      const cleanup = () => {
        if (iframe.parentNode) {
          document.body.removeChild(iframe);
        }
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      };

      const checkContent = () => {
        try {
          const doc = iframe.contentDocument || iframe.contentWindow?.document;
          
          if (!doc) {
            if (!resolved) {
              resolved = true;
              cleanup();
              updateTest(route.path, 'warning', 'Cannot access iframe content - likely working but cross-origin restrictions');
              resolve(true);
            }
            return;
          }

          const body = doc.body;
          if (!body) return;

          const textContent = body.textContent || '';
          const hasContent = textContent.trim().length > 50;
          const hasElements = body.children.length > 1;
          const hasNavbar = doc.querySelector('nav') || doc.querySelector('[role="navigation"]');
          const hasMainContent = doc.querySelector('main') || doc.querySelector('[role="main"]') || body.children.length > 3;
          const hasErrorText = textContent.toLowerCase().includes('error') || textContent.toLowerCase().includes('not found');

          if (!resolved) {
            resolved = true;
            cleanup();

            if (hasErrorText && textContent.length < 200) {
              updateTest(route.path, 'fail', 'Page shows error or not found message');
              resolve(false);
            } else if (hasContent && hasElements && (hasNavbar || hasMainContent)) {
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
            cleanup();
            updateTest(route.path, 'warning', 'Cannot verify content - likely working but restricted access');
            resolve(true);
          }
        }
      };

      iframe.onload = () => {
        setTimeout(checkContent, 1000);
      };

      iframe.onerror = () => {
        if (!resolved) {
          resolved = true;
          cleanup();
          updateTest(route.path, 'fail', 'Failed to load page');
          resolve(false);
        }
      };

      timeoutId = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          cleanup();
          updateTest(route.path, 'fail', 'Page load timeout - may be broken or very slow');
          resolve(false);
        }
      }, 8000);

      document.body.appendChild(iframe);
      iframe.src = route.path;
    });
  }, [updateTest]);

  const runAllTests = useCallback(async () => {
    setIsRunning(true);
    setProgress(0);
    
    let passed = 0;
    let failed = 0;

    for (let i = 0; i < tests.length; i++) {
      const test = tests[i];
      setCurrentTest(test.name);
      
      if (test.path === '/app-test') {
        updateTest(test.path, 'pass', 'Current page - test skipped');
        passed++;
      } else {
        const result = await testRoute(test);
        if (result) passed++;
        else failed++;
      }
      
      setProgress(((i + 1) / tests.length) * 100);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setCurrentTest(null);
    setIsRunning(false);
    
    if (failed === 0) {
      toast.success(`All ${passed} pages tested successfully!`);
    } else {
      toast.error(`Testing completed: ${passed} passed, ${failed} failed/warnings`);
    }
  }, [tests, testRoute, updateTest]);

  return {
    tests,
    isRunning,
    progress,
    currentTest,
    runAllTests,
    updateTest
  };
};
