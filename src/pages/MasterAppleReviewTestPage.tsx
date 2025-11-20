import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Shield, CheckCircle2, Sparkles } from 'lucide-react';
import MasterAppleReviewTest from '@/components/testing/MasterAppleReviewTest';

const MasterAppleReviewTestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-br from-yellow-500/15 to-amber-500/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-40 right-10 w-64 h-64 bg-gradient-to-br from-cyan-400/15 to-blue-400/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '0.5s' }} />
      </div>

      <Helmet>
        <title>Master Apple Review Test | Mansa Musa Marketplace</title>
        <meta name="description" content="Comprehensive Apple App Store submission validation" />
      </Helmet>

      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 via-yellow-500 to-purple-600 text-white py-12 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-yellow-400/20"></div>
        <div className="max-w-6xl mx-auto px-6 relative z-10 animate-fade-in">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm border-2 border-white/30 shadow-xl">
              <Shield className="h-12 w-12 drop-shadow-lg" />
            </div>
            <h1 className="text-5xl font-bold drop-shadow-lg">🍎 Master Apple Review Test</h1>
          </div>
          <p className="text-white text-xl font-medium mb-2">
            Complete validation of all frontend, backend, and native iOS features
          </p>
          <p className="text-white text-base font-medium mb-2">
            ✅ Tests all previous rejection issues: Demo Account, Video Playback, Screenshots, Privacy Policy, Native Differentiation
          </p>
          <p className="text-white text-base font-medium">
            🔍 Covers 22 critical tests across Compliance, Frontend, Backend, and Native categories
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 relative z-10">
        <MasterAppleReviewTest />
      </main>

      <footer className="text-center py-8 bg-slate-800/50 backdrop-blur-xl border-t-2 border-white/10 relative z-10">
        <div className="max-w-4xl mx-auto space-y-3 px-6">
          <p className="font-bold text-2xl bg-gradient-to-r from-blue-400 to-yellow-400 bg-clip-text text-transparent">📋 Pre-Submission Checklist</p>
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div className="p-4 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-xl shadow-lg">
              <CheckCircle2 className="h-6 w-6 text-purple-400 mx-auto mb-2" />
              <p className="text-base font-bold text-purple-300">✅ Run this test on multiple pages</p>
              <p className="text-sm text-purple-400">(Login, About, Dashboard, etc.)</p>
            </div>
            <div className="p-4 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-xl shadow-lg">
              <Sparkles className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
              <p className="text-base font-bold text-yellow-300">✅ Deploy to iOS device</p>
              <p className="text-sm text-yellow-400"><code className="bg-slate-700/50 px-2 py-1 rounded">npx cap run ios</code></p>
            </div>
            <div className="p-4 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-xl shadow-lg">
              <Shield className="h-6 w-6 text-blue-400 mx-auto mb-2" />
              <p className="text-base font-bold text-blue-300">✅ Resolve all CRITICAL issues</p>
              <p className="text-sm text-blue-400">before submission</p>
            </div>
          </div>
          <p className="text-sm text-white/60 mt-4">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </footer>
    </div>
  );
};

export default MasterAppleReviewTestPage;
