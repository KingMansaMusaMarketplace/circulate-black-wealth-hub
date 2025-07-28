import React, { memo, useCallback, useMemo } from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  Play, 
  RefreshCw,
  Database,
  Smartphone
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { createCleanupManager, createRenderTracker } from '@/utils/performance';

interface TestResult {
  name: string;
  status: 'idle' | 'running' | 'pass' | 'fail' | 'warning';
  message: string;
  details?: string;
  critical: boolean;
}

interface TestSummaryProps {
  tests: TestResult[];
  passedCritical: number;
  failedCritical: number;
  isRunning: boolean;
  progress: number;
  currentTest: string | null;
  onRunAllTests: () => void;
}

interface TestSectionProps {
  title: string;
  tests: TestResult[];
  icon: React.ComponentType<{ className?: string }>;
}

// Memoized components for better performance
const TestSummary: React.FC<TestSummaryProps> = memo(({ 
  tests, 
  passedCritical, 
  failedCritical, 
  isRunning, 
  progress, 
  currentTest, 
  onRunAllTests 
}) => {
  const renderTracker = useMemo(() => createRenderTracker('TestSummary'), []);
  
  React.useEffect(() => {
    renderTracker.onRender();
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="h-5 w-5" />
          Comprehensive System Test
        </CardTitle>
        <CardDescription>
          Testing all critical and non-critical systems for mobile readiness
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">
                Critical Systems: {passedCritical}/{tests.filter(t => t.critical).length} passed
              </p>
              {failedCritical > 0 && (
                <p className="text-sm text-red-600">
                  ⚠️ {failedCritical} critical system(s) failing
                </p>
              )}
            </div>
            <Button 
              onClick={onRunAllTests} 
              disabled={isRunning}
              className="min-w-[120px]"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Run Tests
                </>
              )}
            </Button>
          </div>

          {isRunning && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-gray-600">
                {currentTest ? `Testing: ${currentTest}` : 'Initializing...'}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

const TestSection: React.FC<TestSectionProps> = memo(({ title, tests, icon: Icon }) => {
  const renderTracker = useMemo(() => createRenderTracker('TestSection'), []);
  
  React.useEffect(() => {
    renderTracker.onRender();
  });

  const getStatusIcon = useCallback((status: TestResult['status']) => {
    switch (status) {
      case 'pass': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'fail': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'running': return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  }, []);

  const getStatusBadge = useCallback((status: TestResult['status']) => {
    const variants = {
      pass: 'default',
      fail: 'destructive',
      warning: 'secondary',
      running: 'outline',
      idle: 'outline'
    } as const;
    
    return <Badge variant={variants[status]}>{status}</Badge>;
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tests.map((test) => (
            <div key={test.name} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(test.status)}
                <div>
                  <p className="font-medium">{test.name}</p>
                  <p className="text-sm text-gray-600">{test.message}</p>
                  {test.details && (
                    <p className="text-xs text-red-600 mt-1">{test.details}</p>
                  )}
                </div>
              </div>
              {getStatusBadge(test.status)}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

const MobileReadiness: React.FC = memo(() => {
  const renderTracker = useMemo(() => createRenderTracker('MobileReadiness'), []);
  
  React.useEffect(() => {
    renderTracker.onRender();
  });

  return (
    <Card className="border-green-200 bg-green-50">
      <CardHeader>
        <CardTitle className="text-green-800">Mobile App Readiness Status</CardTitle>
        <CardDescription className="text-green-600">
          Your app is ready for mobile deployment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="font-medium">iOS Ready</p>
            <p className="text-sm text-gray-600">All requirements met</p>
          </div>
          <div className="text-center">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="font-medium">Android Ready</p>
            <p className="text-sm text-gray-600">Deployment configured</p>
          </div>
          <div className="text-center">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="font-medium">PWA Features</p>
            <p className="text-sm text-gray-600">Progressive web app enabled</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

// Set display names for debugging
TestSummary.displayName = 'TestSummary';
TestSection.displayName = 'TestSection';
MobileReadiness.displayName = 'MobileReadiness';

export { TestSummary, TestSection, MobileReadiness };