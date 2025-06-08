
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
        <Card>
          <CardContent className="p-6">
            <TestResults testResults={testResults} />
            <TestLogs logs={logs} />
          </CardContent>
        </Card>
      )}

      <NavigationTests />
    </div>
  );
};

export default CommunityImpactTest;
