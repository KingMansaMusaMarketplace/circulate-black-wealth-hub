import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Apple, Sparkles } from 'lucide-react';
import AppleAppStoreComplianceTest from '@/components/testing/AppleAppStoreComplianceTest';

const AppleComplianceTestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-40 right-10 w-64 h-64 bg-cyan-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      <Helmet>
        <title>Apple App Store Compliance Test | Mansa Musa Marketplace</title>
        <meta name="description" content="iOS App Store submission compliance testing" />
      </Helmet>

      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white py-12 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20"></div>
        <div className="max-w-5xl mx-auto px-6 relative z-10 animate-fade-in">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm border-2 border-white/30 shadow-xl">
              <Apple className="h-12 w-12 drop-shadow-lg" />
            </div>
            <h1 className="text-5xl font-bold drop-shadow-lg">🍎 Apple App Store Compliance Test</h1>
          </div>
          <p className="text-blue-100 text-xl font-medium mb-2">
            Comprehensive pre-submission testing for iOS App Store requirements
          </p>
          <p className="text-blue-200 text-base font-medium">
            ✨ This test verifies all fixes for previous rejections (Video Playback, Demo Account, Screenshot Metadata)
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 relative z-10">
        <AppleAppStoreComplianceTest />
      </main>

      <footer className="text-center py-6 text-base font-medium bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 border-t-2 border-blue-200 relative z-10">
        <p className="text-blue-700 dark:text-blue-300">📱 Run this test before resubmitting to Apple App Store Connect</p>
        <p className="mt-2 text-purple-700 dark:text-purple-300">🧪 Navigate to different pages to test videos, pricing text, and other features</p>
      </footer>
    </div>
  );
};

export default AppleComplianceTestPage;
