import React from 'react';
import { Helmet } from 'react-helmet-async';
import MasterAppleReviewTest from '@/components/testing/MasterAppleReviewTest';

const MasterAppleReviewTestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Helmet>
        <title>Master Apple Review Test | Mansa Musa Marketplace</title>
        <meta name="description" content="Comprehensive Apple App Store submission validation" />
      </Helmet>

      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white py-12 shadow-2xl">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-3">🍎 Master Apple Review Test</h1>
          <p className="text-blue-100 text-lg">
            Complete validation of all frontend, backend, and native iOS features
          </p>
          <p className="text-blue-200 text-sm mt-2">
            ✅ Tests all previous rejection issues: Demo Account, Video Playback, Screenshots, Privacy Policy, Native Differentiation
          </p>
          <p className="text-blue-200 text-sm">
            🔍 Covers 22 critical tests across Compliance, Frontend, Backend, and Native categories
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <MasterAppleReviewTest />
      </main>

      <footer className="text-center py-8 text-sm text-gray-600 border-t">
        <p className="font-semibold">📋 Pre-Submission Checklist</p>
        <p className="mt-2">✅ Run this test on multiple pages (Login, About, Dashboard, etc.)</p>
        <p>✅ Deploy to iOS device with <code className="bg-gray-200 px-2 py-1 rounded">npx cap run ios</code> to test native features</p>
        <p>✅ Ensure all CRITICAL issues are resolved before submission</p>
        <p className="mt-3 text-xs text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
      </footer>
    </div>
  );
};

export default MasterAppleReviewTestPage;
