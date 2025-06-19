
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Navigation, Play, Loader2 } from 'lucide-react';
import { RouteTestResults } from './types';

interface TestHeaderProps {
  isRunning: boolean;
  progress: number;
  currentTest: string | null;
  results: RouteTestResults;
  onRunTests: () => void;
}

export const TestHeader: React.FC<TestHeaderProps> = ({
  isRunning,
  progress,
  currentTest,
  results,
  onRunTests
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Navigation className="h-5 w-5" />
          Complete App Page Test
        </CardTitle>
        <CardDescription>
          Comprehensive testing of all pages and routes using iframe testing to avoid popup blockers
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
                Testing Pages...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Test All Pages
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

          {results.total > 0 && (
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{results.passed}</div>
                <div className="text-sm text-gray-600">Passed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{results.failed}</div>
                <div className="text-sm text-gray-600">Failed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{results.warnings}</div>
                <div className="text-sm text-gray-600">Warnings</div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
