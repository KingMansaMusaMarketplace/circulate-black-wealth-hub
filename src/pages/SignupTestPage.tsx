
import React from 'react';
import {
  TestControls,
  TestResults,
  TestLogs,
  TestBanner,
  TestWarning,
  useSignupTests
} from '@/components/testing/signup';

const SignupTestPage: React.FC = () => {
  const { testResults, testLogs, isRunning, runAllTests } = useSignupTests();

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Signup Testing Dashboard</h1>
      
      <TestBanner />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TestControls isRunning={isRunning} onRunTests={runAllTests} />
        <TestResults testResults={testResults} />
      </div>

      <TestLogs testLogs={testLogs} />
      <TestWarning />
    </div>
  );
};

export default SignupTestPage;
