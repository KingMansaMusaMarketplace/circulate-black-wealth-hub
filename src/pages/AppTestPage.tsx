
import React from 'react';
import { Helmet } from 'react-helmet-async';
import ResponsiveLayout from '@/components/layouts/ResponsiveLayout';
import AppFunctionalityTest from '@/components/testing/app-functionality/AppFunctionalityTest';

const AppTestPage: React.FC = () => {
  return (
    <ResponsiveLayout
      title="App Functionality Test"
      description="Comprehensive testing of all app features"
    >
      <Helmet>
        <title>App Test | Mansa Musa Marketplace</title>
        <meta name="description" content="Test all app functionality and features" />
      </Helmet>

      <AppFunctionalityTest />
    </ResponsiveLayout>
  );
};

export default AppTestPage;
