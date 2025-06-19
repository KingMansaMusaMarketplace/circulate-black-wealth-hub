
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Navbar } from '@/components/navbar';
import Footer from '@/components/Footer';
import { 
  TestControlPanel,
  DeviceInfoCard,
  TestResultsSections,
  DeploymentStatus,
  useMobileReadinessTests,
  TestStats
} from '@/components/testing/mobile-readiness';

const MobileReadinessTestPage: React.FC = () => {
  const { tests, isRunning, progress, currentTest, runAllTests } = useMobileReadinessTests();

  const stats: TestStats = {
    passCount: tests.filter(t => t.status === 'pass').length,
    failCount: tests.filter(t => t.status === 'fail').length,
    warningCount: tests.filter(t => t.status === 'warning').length,
    criticalFailCount: tests.filter(t => t.category === 'critical' && t.status === 'fail').length
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Mobile Readiness Test | Mansa Musa Marketplace</title>
        <meta name="description" content="Complete mobile deployment readiness test" />
      </Helmet>

      <Navbar />
      
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-3xl font-bold mb-2">Mobile Readiness Test</h1>
          <p className="text-blue-100">
            Comprehensive testing for mobile deployment readiness
          </p>
        </div>
      </div>

      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        <TestControlPanel
          isRunning={isRunning}
          progress={progress}
          currentTest={currentTest}
          stats={stats}
          onRunTests={runAllTests}
        />

        <DeviceInfoCard />

        <TestResultsSections tests={tests} />

        <DeploymentStatus criticalFailCount={stats.criticalFailCount} />
      </main>
      
      <Footer />
    </div>
  );
};

export default MobileReadinessTestPage;
