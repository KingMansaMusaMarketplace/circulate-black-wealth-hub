
import React from 'react';
import { useCommunityImpactTests } from './useCommunityImpactTests';
import TestControls from './TestControls';
import TestResults from './TestResults';
import TestLogs from './TestLogs';
import NavigationTests from './NavigationTests';

const CommunityImpactTest: React.FC = () => {
  const { testResults, isRunning, logs, runTests } = useCommunityImpactTests();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <TestControls isRunning={isRunning} onRunTests={runTests} />

      {testResults.length > 0 && (
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl p-6">
          <TestResults testResults={testResults} />
          <TestLogs logs={logs} />
        </div>
      )}

      <NavigationTests />
    </div>
  );
};

export default CommunityImpactTest;
