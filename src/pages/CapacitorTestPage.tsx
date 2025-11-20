
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      
      <main className="container mx-auto px-4 py-8 relative z-10">
        <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-yellow-400 to-purple-400 bg-clip-text text-transparent">
          Capacitor Geolocation Test
        </h1>
        
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
