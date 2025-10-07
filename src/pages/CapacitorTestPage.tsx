
import React from 'react';
import { useCapacitor } from '@/hooks/use-capacitor';
import { useLocation } from '@/hooks/use-location';
import {
  EnvironmentInfo,
  TestControls,
  TestResults,
  CurrentLocation,
  TroubleshootingGuide,
  useCapacitorTests
} from '@/components/testing/capacitor';

const CapacitorTestPage = () => {
  const { isCapacitor, platform, isNative } = useCapacitor();
  const { location, permissionStatus } = useLocation();
  const { 
    testResults, 
    isRunningTests, 
    runTests, 
    requestLocationPermission, 
    clearCache 
  } = useCapacitorTests();

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Capacitor Geolocation Test</h1>
        
        <div className="space-y-6">
          <EnvironmentInfo 
            isCapacitor={isCapacitor}
            platform={platform}
            isNative={isNative}
            permissionStatus={permissionStatus}
          />

          <TestControls
            isRunningTests={isRunningTests}
            onRunTests={runTests}
            onRequestPermission={requestLocationPermission}
            onClearCache={clearCache}
          />

          {testResults.length > 0 && <TestResults testResults={testResults} />}
          
          {location && (
            <CurrentLocation location={{
              ...location,
              timestamp: location.timestamp
            }} />
          )}
          
          <TroubleshootingGuide />
        </div>
      </main>
    </div>
  );
};

export default CapacitorTestPage;
