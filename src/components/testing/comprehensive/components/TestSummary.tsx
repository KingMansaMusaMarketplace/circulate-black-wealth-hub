
import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Settings, Play } from 'lucide-react';
import { TestSummaryProps } from '../types';

export const TestSummary: React.FC<TestSummaryProps> = ({
  tests,
  passedCritical,
  failedCritical,
  isRunning,
  progress,
  currentTest,
  onRunAllTests
}) => {
  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
      <div className="p-6 border-b border-white/10">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Settings className="h-5 w-5 text-yellow-400" />
          System Health Dashboard
        </h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-green-500/10 rounded-xl border border-green-500/20">
            <div className="text-2xl font-bold text-green-400">{passedCritical}</div>
            <div className="text-sm text-green-300/80">Critical Systems Pass</div>
          </div>
          <div className="text-center p-4 bg-red-500/10 rounded-xl border border-red-500/20">
            <div className="text-2xl font-bold text-red-400">{failedCritical}</div>
            <div className="text-sm text-red-300/80">Critical Failures</div>
          </div>
          <div className="text-center p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
            <div className="text-2xl font-bold text-blue-400">{tests.filter(t => t.status === 'success').length}</div>
            <div className="text-sm text-blue-300/80">Total Passed</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="text-2xl font-bold text-white">{tests.length}</div>
            <div className="text-sm text-white/60">Total Tests</div>
          </div>
        </div>
        
        {isRunning && (
          <div className="space-y-2 mb-4 p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="flex justify-between text-sm text-white">
              <span>Running tests...</span>
              <span className="text-yellow-400">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full bg-white/10" />
            {currentTest && (
              <div className="text-sm text-blue-200">Testing: {currentTest}</div>
            )}
          </div>
        )}
        
        <Button 
          onClick={onRunAllTests} 
          disabled={isRunning}
          className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-slate-900 font-semibold"
        >
          <Play className="h-4 w-4 mr-2" />
          {isRunning ? 'Running Tests...' : 'Run All Tests'}
        </Button>
      </div>
    </div>
  );
};
