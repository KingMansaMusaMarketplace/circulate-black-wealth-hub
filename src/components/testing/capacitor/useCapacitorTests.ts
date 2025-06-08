
import { useState } from 'react';
import { useCapacitor } from '@/hooks/use-capacitor';
import { useLocation } from '@/hooks/use-location';
import { toast } from 'sonner';

interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
}

export const useCapacitorTests = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  
  const { isCapacitor, platform, isNative } = useCapacitor();
  const { getCurrentPosition, requestPermission, clearCache } = useLocation();

  const runTests = async () => {
    setIsRunningTests(true);
    const results: TestResult[] = [];

    try {
      // Test 1: Capacitor Detection
      results.push({
        name: 'Capacitor Detection',
        status: isCapacitor ? 'pass' : 'warning',
        message: isCapacitor ? 'Capacitor is available' : 'Running in web mode'
      });

      // Test 2: Platform Detection
      results.push({
        name: 'Platform Detection',
        status: 'pass',
        message: `Platform: ${platform}`
      });

      // Test 3: Location Permission
      try {
        const hasPermission = await requestPermission();
        results.push({
          name: 'Location Permission',
          status: hasPermission ? 'pass' : 'fail',
          message: hasPermission ? 'Permission granted' : 'Permission denied'
        });
      } catch (error) {
        results.push({
          name: 'Location Permission',
          status: 'fail',
          message: 'Permission check failed'
        });
      }

      // Test 4: Location Retrieval
      try {
        await getCurrentPosition(true);
        results.push({
          name: 'Location Retrieval',
          status: 'pass',
          message: 'Location retrieved successfully'
        });
      } catch (error: any) {
        results.push({
          name: 'Location Retrieval',
          status: 'fail',
          message: error.message || 'Location retrieval failed'
        });
      }

      setTestResults(results);
      toast.success('Tests completed');
    } catch (error) {
      toast.error('Test suite failed');
    } finally {
      setIsRunningTests(false);
    }
  };

  const requestLocationPermission = async () => {
    try {
      const granted = await requestPermission();
      if (granted) {
        toast.success('Location permission granted');
      } else {
        toast.error('Location permission denied');
      }
    } catch (error) {
      toast.error('Failed to request permission');
    }
  };

  return {
    testResults,
    isRunningTests,
    runTests,
    requestLocationPermission,
    clearCache
  };
};
