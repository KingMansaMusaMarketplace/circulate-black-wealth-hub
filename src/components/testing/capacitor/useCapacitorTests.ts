
import { useState } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import { toast } from 'sonner';
import { useLocation } from '@/hooks/use-location';

interface TestResult {
  step: string;
  status: 'pending' | 'success' | 'error';
  message: string;
}

export const useCapacitorTests = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  
  const { 
    getCurrentPosition, 
    location,
    error,
    requestPermission,
    clearCache
  } = useLocation();

  const addResult = (step: string, status: 'pending' | 'success' | 'error', message: string) => {
    setTestResults(prev => [...prev, { step, status, message }]);
  };

  const runTests = async () => {
    setIsRunningTests(true);
    setTestResults([]);

    // Test 1: Check Capacitor environment
    addResult('Checking Capacitor environment', 'pending', 'Detecting Capacitor environment...');
    
    if (window.Capacitor) {
      addResult('Checking Capacitor environment', 'success', 
        `Capacitor detected: Platform detected`);
    } else {
      addResult('Checking Capacitor environment', 'error', 
        'Capacitor not detected. Make sure Capacitor is properly installed and configured.');
    }

    // Test 2: Check Geolocation plugin
    addResult('Checking Geolocation plugin', 'pending', 'Testing Geolocation plugin...');
    
    try {
      await Geolocation.checkPermissions();
      addResult('Checking Geolocation plugin', 'success', 'Geolocation plugin is accessible.');
    } catch (error) {
      addResult('Checking Geolocation plugin', 'error', 
        `Geolocation plugin error: ${error instanceof Error ? error.message : String(error)}`);
    }

    // Test 3: Check location permissions
    addResult('Checking location permissions', 'pending', 'Checking location permissions...');
    
    try {
      const permissionStatus = await Geolocation.checkPermissions();
      addResult('Checking location permissions', 'success', 
        `Current permission status: ${permissionStatus.location}`);
    } catch (error) {
      addResult('Checking location permissions', 'error', 
        `Permission check error: ${error instanceof Error ? error.message : String(error)}`);
    }

    // Test 4: Test our useLocation hook
    addResult('Testing useLocation hook', 'pending', 'Testing our useLocation hook...');
    
    try {
      clearCache();
      await getCurrentPosition(true);
      
      if (location) {
        addResult('Testing useLocation hook', 'success', 
          `Location received: Lat ${location.lat.toFixed(6)}, Lng ${location.lng.toFixed(6)}`);
      } else if (error) {
        addResult('Testing useLocation hook', 'error', 
          `useLocation hook error: ${error}`);
      } else {
        addResult('Testing useLocation hook', 'error', 
          'No location received and no error reported. This is unexpected.');
      }
    } catch (error) {
      addResult('Testing useLocation hook', 'error', 
        `useLocation hook exception: ${error instanceof Error ? error.message : String(error)}`);
    }

    setIsRunningTests(false);
  };

  const requestLocationPermission = async () => {
    try {
      const result = await requestPermission();
      toast.success(`Permission request result: ${result ? 'Granted' : 'Denied'}`);
    } catch (error) {
      toast.error(`Error requesting permission: ${error instanceof Error ? error.message : String(error)}`);
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
