
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
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-40 right-20 w-80 h-80 bg-yellow-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
      
      <div className="container mx-auto p-6 max-w-4xl relative z-10">
        {/* Header */}
        <div className="relative overflow-hidden backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl p-8 mb-8 animate-fade-in">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-yellow-500/20" />
          <div className="relative z-10">
            <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
              🧪 Signup Testing Dashboard
            </h1>
            <p className="text-blue-200 text-lg">
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
