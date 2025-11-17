import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Shield, CheckCircle2, Sparkles } from 'lucide-react';
import MasterAppleReviewTest from '@/components/testing/MasterAppleReviewTest';

const MasterAppleReviewTestPage: React.FC = () => {
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
        <title>Master Apple Review Test | Mansa Musa Marketplace</title>
        <meta name="description" content="Comprehensive Apple App Store submission validation" />
      </Helmet>

      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-blue-700 text-white py-12 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20"></div>
        <div className="max-w-6xl mx-auto px-6 relative z-10 animate-fade-in">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm border-2 border-white/30 shadow-xl">
              <Shield className="h-12 w-12 drop-shadow-lg" />
            </div>
            <h1 className="text-5xl font-bold drop-shadow-lg">🍎 Master Apple Review Test</h1>
          </div>
          <p className="text-purple-100 text-xl font-medium mb-2">
            Complete validation of all frontend, backend, and native iOS features
          </p>
          <p className="text-purple-200 text-base font-medium mb-2">
            ✅ Tests all previous rejection issues: Demo Account, Video Playback, Screenshots, Privacy Policy, Native Differentiation
          </p>
          <p className="text-pink-200 text-base font-medium">
            🔍 Covers 22 critical tests across Compliance, Frontend, Backend, and Native categories
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 relative z-10">
        <MasterAppleReviewTest />
      </main>

      <footer className="text-center py-8 bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-blue-900/20 border-t-2 border-purple-200 relative z-10">
        <div className="max-w-4xl mx-auto space-y-3 px-6">
          <p className="font-bold text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">📋 Pre-Submission Checklist</p>
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div className="p-4 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl border-2 border-purple-200/50 shadow-lg">
              <CheckCircle2 className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <p className="text-base font-bold text-purple-700 dark:text-purple-300">✅ Run this test on multiple pages</p>
              <p className="text-sm text-purple-600 dark:text-purple-400">(Login, About, Dashboard, etc.)</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-pink-100 to-blue-100 dark:from-pink-900/30 dark:to-blue-900/30 rounded-xl border-2 border-pink-200/50 shadow-lg">
              <Sparkles className="h-6 w-6 text-pink-600 mx-auto mb-2" />
              <p className="text-base font-bold text-pink-700 dark:text-pink-300">✅ Deploy to iOS device</p>
              <p className="text-sm text-pink-600 dark:text-pink-400"><code className="bg-white/50 px-2 py-1 rounded">npx cap run ios</code></p>
            </div>
            <div className="p-4 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl border-2 border-blue-200/50 shadow-lg">
              <Shield className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <p className="text-base font-bold text-blue-700 dark:text-blue-300">✅ Resolve all CRITICAL issues</p>
              <p className="text-sm text-blue-600 dark:text-blue-400">before submission</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </footer>
    </div>
  );
};

export default MasterAppleReviewTestPage;
