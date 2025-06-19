
import React, { useEffect, useMemo } from 'react';
import { Navbar } from '@/components/navbar';
import Footer from '@/components/Footer';
import { allRoutes } from '@/components/testing/app-test/routeTestData';
import { useRouteTestRunner } from '@/components/testing/app-test/useRouteTestRunner';
import { TestHeader } from '@/components/testing/app-test/TestHeader';
import { TestRoutesList } from '@/components/testing/app-test/TestRoutesList';
import { TestInstructions } from '@/components/testing/app-test/TestInstructions';

const AppTestPage: React.FC = () => {
  const { tests, isRunning, progress, currentTest, runAllTests } = useRouteTestRunner(allRoutes);

  const results = useMemo(() => {
    const passed = tests.filter(t => t.status === 'pass').length;
    const failed = tests.filter(t => t.status === 'fail').length;
    const warnings = tests.filter(t => t.status === 'warning').length;
    const total = tests.filter(t => t.status !== 'pending').length;

    return { passed, failed, warnings, total };
  }, [tests]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <TestHeader
            isRunning={isRunning}
            progress={progress}
            currentTest={currentTest}
            results={results}
            onRunTests={runAllTests}
          />

          <TestRoutesList tests={tests} />

          <TestInstructions />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AppTestPage;
