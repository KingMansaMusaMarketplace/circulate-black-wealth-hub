import React, { useState, useEffect } from 'react';
import { Geolocation, GeolocationPosition } from '@capacitor/geolocation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useCapacitor } from '@/hooks/use-capacitor';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLocation } from '@/hooks/use-location';

const CapacitorTestPage = () => {
  const [testResults, setTestResults] = useState<{
    step: string;
    status: 'pending' | 'success' | 'error';
    message: string;
  }[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const { isCapacitor, platform, isNative } = useCapacitor();
  
  // Use our location hook
  const { 
    getCurrentPosition, 
    location,
    loading,
    error,
    permissionStatus,
    requestPermission,
    clearCache
  } = useLocation();

  // Function to add a test result
  const addResult = (step: string, status: 'pending' | 'success' | 'error', message: string) => {
    setTestResults(prev => [...prev, { step, status, message }]);
  };

  // Run all tests
  const runTests = async () => {
    setIsRunningTests(true);
    setTestResults([]);

    // Test 1: Check Capacitor environment
    addResult('Checking Capacitor environment', 'pending', 'Detecting Capacitor environment...');
    
    if (window.Capacitor) {
      addResult('Checking Capacitor environment', 'success', 
        `Capacitor detected: Platform: ${platform}, Native: ${isNative ? 'Yes' : 'No'}`);
    } else {
      addResult('Checking Capacitor environment', 'error', 
        'Capacitor not detected. Make sure Capacitor is properly installed and configured.');
    }

    // Test 2: Check Geolocation plugin
    addResult('Checking Geolocation plugin', 'pending', 'Testing Geolocation plugin...');
    
    try {
      // Check if we can access the Geolocation plugin
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
      // Clear the location cache first
      clearCache();
      
      // Get position using our hook
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

    // Test 5: Test direct Geolocation API
    addResult('Testing direct Geolocation API', 'pending', 'Testing direct Capacitor Geolocation API...');
    
    try {
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000
      });
      
      addResult('Testing direct Geolocation API', 'success', 
        `Direct API location: Lat ${position.coords.latitude.toFixed(6)}, Lng ${position.coords.longitude.toFixed(6)}`);
    } catch (error) {
      addResult('Testing direct Geolocation API', 'error', 
        `Direct API error: ${error instanceof Error ? error.message : String(error)}`);
    }

    // Test 6: Test watch position
    let watchId: string | null = null;
    addResult('Testing watch position', 'pending', 'Testing watch position functionality...');
    
    try {
      watchId = await Geolocation.watchPosition(
        { enableHighAccuracy: true },
        (position) => {
          if (position) {
            addResult('Testing watch position', 'success', 
              `Watch position update: Lat ${position.coords.latitude.toFixed(6)}, Lng ${position.coords.longitude.toFixed(6)}`);
            
            // Clear the watch after receiving one update
            if (watchId) {
              Geolocation.clearWatch({ id: watchId });
            }
          }
        }
      );
      
      // Set a timeout to stop the watch if we don't get a position update
      setTimeout(() => {
        if (watchId) {
          Geolocation.clearWatch({ id: watchId });
          addResult('Testing watch position', 'error', 'Watch position timed out without updates');
        }
      }, 15000);
      
    } catch (error) {
      addResult('Testing watch position', 'error', 
        `Watch position error: ${error instanceof Error ? error.message : String(error)}`);
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

  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Capacitor Geolocation Test</h1>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Environment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Capacitor Detected:</span> {isCapacitor ? 'Yes' : 'No'}
                </div>
                <div>
                  <span className="font-medium">Platform:</span> {platform}
                </div>
                <div>
                  <span className="font-medium">Native Platform:</span> {isNative ? 'Yes' : 'No'}
                </div>
                <div>
                  <span className="font-medium">Permission Status:</span> {permissionStatus}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4 mb-6">
            <Button 
              onClick={runTests} 
              disabled={isRunningTests}
              className="bg-mansablue hover:bg-mansablue/90"
            >
              {isRunningTests ? 'Running Tests...' : 'Run All Tests'}
            </Button>
            <Button 
              onClick={requestLocationPermission} 
              variant="outline"
            >
              Request Location Permission
            </Button>
            <Button 
              onClick={() => clearCache()} 
              variant="outline"
            >
              Clear Location Cache
            </Button>
          </div>

          
          {testResults.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Test Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {testResults.map((result, index) => (
                    <div 
                      key={index}
                      className="p-3 rounded-md border"
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          result.status === 'success' ? 'bg-green-500' : 
                          result.status === 'error' ? 'bg-red-500' : 
                          'bg-yellow-500'
                        }`} />
                        <span className="font-medium">{result.step}</span>
                      </div>
                      <p className={`mt-1 text-sm ${
                        result.status === 'success' ? 'text-green-700' : 
                        result.status === 'error' ? 'text-red-700' : 
                        'text-yellow-700'
                      }`}>
                        {result.message}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          
          {location && (
            <Card>
              <CardHeader>
                <CardTitle>Current Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">Latitude:</span> {location.lat.toFixed(6)}
                  </div>
                  <div>
                    <span className="font-medium">Longitude:</span> {location.lng.toFixed(6)}
                  </div>
                  <div>
                    <span className="font-medium">Accuracy:</span> {location.accuracy ? `${location.accuracy.toFixed(1)}m` : 'Unknown'}
                  </div>
                  <div>
                    <span className="font-medium">Last Updated:</span> {new Date(location.timestamp).toLocaleString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          
          <Card>
            <CardHeader>
              <CardTitle>Troubleshooting</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>Make sure <code>@capacitor/geolocation</code> is installed.</li>
                <li>Check that permissions are properly configured in <code>capacitor.config.ts</code>.</li>
                <li>On Android, verify the manifest has the location permissions.</li>
                <li>On iOS, verify Info.plist contains the location usage descriptions.</li>
                <li>Test on a real device, as emulators may have simulated location services.</li>
                <li>After making changes, run <code>npx cap sync</code> to update native projects.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CapacitorTestPage;
