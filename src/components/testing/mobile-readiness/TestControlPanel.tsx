
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Smartphone, Play, Loader2 } from 'lucide-react';
import { TestStats } from './types';

interface TestControlPanelProps {
  isRunning: boolean;
  progress: number;
  currentTest: string | null;
  stats: TestStats;
  onRunTests: () => void;
}

export const TestControlPanel: React.FC<TestControlPanelProps> = ({
  isRunning,
  progress,
  currentTest,
  stats,
  onRunTests
}) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="h-5 w-5" />
          Mobile Deployment Test Suite
        </CardTitle>
        <CardDescription>
          Complete frontend and backend testing for mobile app deployment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button 
            onClick={onRunTests} 
            disabled={isRunning}
            className="w-full"
            size="lg"
          >
            {isRunning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running Tests...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Run Complete Mobile Readiness Test
              </>
            )}
          </Button>

          {isRunning && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
              {currentTest && (
                <p className="text-sm text-gray-600">Currently testing: {currentTest}</p>
              )}
            </div>
          )}

          {stats.passCount + stats.failCount + stats.warningCount > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.passCount}</div>
                <div className="text-sm text-gray-600">Passed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.failCount}</div>
                <div className="text-sm text-gray-600">Failed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.warningCount}</div>
                <div className="text-sm text-gray-600">Warnings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.criticalFailCount}</div>
                <div className="text-sm text-gray-600">Critical Fails</div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
