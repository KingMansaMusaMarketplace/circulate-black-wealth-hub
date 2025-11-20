import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Apple, Sparkles } from 'lucide-react';
import AppleAppStoreComplianceTest from '@/components/testing/AppleAppStoreComplianceTest';

const AppleComplianceTestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-yellow-400/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-40 right-10 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '0.5s' }} />
      </div>

      <Helmet>
        <title>Apple App Store Compliance Test | Mansa Musa Marketplace</title>
        <meta name="description" content="iOS App Store submission compliance testing" />
      </Helmet>

      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 via-yellow-500 to-purple-600 text-white py-12 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-yellow-400/20"></div>
        <div className="max-w-5xl mx-auto px-6 relative z-10 animate-fade-in">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm border-2 border-white/30 shadow-xl">
              <Apple className="h-12 w-12 drop-shadow-lg" />
            </div>
            <h1 className="text-5xl font-bold drop-shadow-lg text-white">🍎 Apple App Store Compliance Test</h1>
          </div>
          <p className="text-white text-xl font-medium mb-2">
            Comprehensive pre-submission testing for iOS App Store requirements
          </p>
          <p className="text-yellow-100 text-base font-medium">
            ✨ This test verifies all fixes for previous rejections (Video Playback, Demo Account, Screenshot Metadata)
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 relative z-10">
        <AppleAppStoreComplianceTest />
      </main>

      <footer className="text-center py-6 text-base font-medium bg-slate-800/50 backdrop-blur-xl border-t-2 border-white/10 relative z-10">
        <p className="text-blue-300">📱 Run this test before resubmitting to Apple App Store Connect</p>
        <p className="mt-2 text-yellow-300">🧪 Navigate to different pages to test videos, pricing text, and other features</p>
      </footer>
    </div>
  );
};

export default AppleComplianceTestPage;
