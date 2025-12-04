import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Shield, CheckCircle2, Sparkles } from 'lucide-react';
import MasterAppleReviewTest from '@/components/testing/MasterAppleReviewTest';

const MasterAppleReviewTestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl animate-float" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-40 right-10 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '0.5s' }} />
      </div>

      <Helmet>
        <title>Master Apple Review Test | Mansa Musa Marketplace</title>
        <meta name="description" content="Comprehensive Apple App Store submission validation" />
      </Helmet>

      {/* Header */}
      <div className="relative z-10 py-12">
        <div className="max-w-6xl mx-auto px-6 animate-fade-in">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl shadow-xl">
                <Shield className="h-12 w-12 text-slate-900 drop-shadow-lg" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">🍎 Master Apple Review Test</h1>
            </div>
            <p className="text-blue-200 text-xl font-medium mb-2">
              Complete validation of all frontend, backend, and native iOS features
            </p>
            <p className="text-yellow-400 text-base font-medium mb-2">
              ✅ Tests all previous rejection issues: Demo Account, Video Playback, Screenshots, Privacy Policy, Native Differentiation
            </p>
            <p className="text-blue-300 text-base font-medium">
              🔍 Covers 22 critical tests across Compliance, Frontend, Backend, and Native categories
            </p>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 relative z-10">
        <MasterAppleReviewTest />
      </main>

      <footer className="text-center py-8 backdrop-blur-xl bg-white/5 border-t border-white/10 relative z-10">
        <div className="max-w-4xl mx-auto space-y-3 px-6">
          <p className="font-bold text-2xl bg-gradient-to-r from-blue-400 to-yellow-400 bg-clip-text text-transparent">📋 Pre-Submission Checklist</p>
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div className="p-4 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl shadow-lg">
              <CheckCircle2 className="h-6 w-6 text-purple-400 mx-auto mb-2" />
              <p className="text-base font-bold text-white">✅ Run this test on multiple pages</p>
              <p className="text-sm text-blue-200">(Login, About, Dashboard, etc.)</p>
            </div>
            <div className="p-4 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl shadow-lg">
              <Sparkles className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
              <p className="text-base font-bold text-white">✅ Deploy to iOS device</p>
              <p className="text-sm text-yellow-400"><code className="bg-white/10 px-2 py-1 rounded">npx cap run ios</code></p>
            </div>
            <div className="p-4 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl shadow-lg">
              <Shield className="h-6 w-6 text-blue-400 mx-auto mb-2" />
              <p className="text-base font-bold text-white">✅ Resolve all CRITICAL issues</p>
              <p className="text-sm text-blue-200">before submission</p>
            </div>
          </div>
          <p className="text-sm text-white/60 mt-4">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </footer>
    </div>
  );
};

export default MasterAppleReviewTestPage;
