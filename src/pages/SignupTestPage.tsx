
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto p-6 max-w-4xl">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl p-8 mb-8 animate-fade-in">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
          <div className="relative z-10">
            <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
              🧪 Signup Testing Dashboard
            </h1>
            <p className="text-white/90 text-lg">
              Comprehensive testing suite for signup workflows
            </p>
          </div>
        </div>
        
        <TestBanner />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <TestControls isRunning={isRunning} onRunTests={runAllTests} />
          <TestResults testResults={testResults} />
        </div>

        <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <TestLogs testLogs={testLogs} />
        </div>
        
        <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <TestWarning />
        </div>
      </div>
    </div>
  );
};

export default SignupTestPage;
