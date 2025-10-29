import React from 'react';
import { Helmet } from 'react-helmet-async';
import AppleAppStoreComplianceTest from '@/components/testing/AppleAppStoreComplianceTest';

const AppleComplianceTestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Helmet>
        <title>Apple App Store Compliance Test | Mansa Musa Marketplace</title>
        <meta name="description" content="iOS App Store submission compliance testing" />
      </Helmet>

      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white py-12 shadow-lg">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-3">🍎 Apple App Store Compliance Test</h1>
          <p className="text-blue-100 text-lg">
            Comprehensive pre-submission testing for iOS App Store requirements
          </p>
          <p className="text-blue-200 text-sm mt-2">
            This test verifies all fixes for previous rejections (Video Playback, Demo Account, Screenshot Metadata)
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <AppleAppStoreComplianceTest />
      </main>

      <footer className="text-center py-6 text-sm text-gray-500">
        <p>Run this test before resubmitting to Apple App Store Connect</p>
        <p className="mt-1">Navigate to different pages to test videos, pricing text, and other features</p>
      </footer>
    </div>
  );
};

export default AppleComplianceTestPage;
