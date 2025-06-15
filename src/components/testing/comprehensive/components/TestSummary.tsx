
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Settings } from 'lucide-react';
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          System Health Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{passedCritical}</div>
            <div className="text-sm text-gray-600">Critical Systems Pass</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{failedCritical}</div>
            <div className="text-sm text-gray-600">Critical Failures</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{tests.filter(t => t.status === 'success').length}</div>
            <div className="text-sm text-gray-600">Total Passed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">{tests.length}</div>
            <div className="text-sm text-gray-600">Total Tests</div>
          </div>
        </div>
        
        {isRunning && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Running tests...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full" />
            {currentTest && (
              <div className="text-sm text-gray-600">Testing: {currentTest}</div>
            )}
          </div>
        )}
        
        <div className="flex gap-2 mt-4">
          <Button onClick={onRunAllTests} disabled={isRunning}>
            {isRunning ? 'Running Tests...' : 'Run All Tests'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
