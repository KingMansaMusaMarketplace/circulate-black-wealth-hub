
import React, { useState, useEffect } from 'react';
import { Database, Smartphone } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { toast } from 'sonner';
import { TestResult } from './types';
import { TestRunner } from './utils/testFunctions';
import { TestSummary } from './components/TestSummary';
import { TestSection } from './components/TestSection';
import { MobileReadiness } from './components/MobileReadiness';
import { initialTests } from './constants/testConfig';

const ComprehensiveSystemTest: React.FC = () => {
  const { user } = useAuth();
  const { subscriptionInfo } = useSubscription();
  const [tests, setTests] = useState<TestResult[]>([]);
  const [currentTest, setCurrentTest] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    setTests(initialTests);
  }, []);

  const updateTest = (name: string, updates: Partial<TestResult>) => {
    setTests(prev => prev.map(test => 
      test.name === name ? { ...test, ...updates } : test
    ));
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setProgress(0);
    
    const testRunner = new TestRunner(updateTest, user, subscriptionInfo);
    
    for (let i = 0; i < tests.length; i++) {
      setCurrentTest(tests[i].name);
      await testRunner.runTest(tests[i].name);
      setProgress(((i + 1) / tests.length) * 100);
      // Small delay to show progress
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setCurrentTest(null);
    setIsRunning(false);
    toast.success('System test completed');
  };

  const criticalTests = tests.filter(test => test.critical);
  const nonCriticalTests = tests.filter(test => !test.critical);
  const failedCritical = criticalTests.filter(test => test.status === 'error').length;
  const passedCritical = criticalTests.filter(test => test.status === 'success').length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <TestSummary
        tests={tests}
        passedCritical={passedCritical}
        failedCritical={failedCritical}
        isRunning={isRunning}
        progress={progress}
        currentTest={currentTest}
        onRunAllTests={runAllTests}
      />

      <TestSection
        title="Critical Systems (Must Pass for Mobile)"
        tests={criticalTests}
        icon={Database}
      />

      <TestSection
        title="Mobile Features"
        tests={nonCriticalTests}
        icon={Smartphone}
      />

      <MobileReadiness />
    </div>
  );
};

export default ComprehensiveSystemTest;
