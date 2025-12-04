
import React from 'react';
import CommunityImpactTest from '@/components/testing/community-impact/CommunityImpactTest';

const CommunityImpactTestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl animate-float"></div>
      <div className="absolute top-40 right-20 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="py-8 px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2 text-white">Community Impact Test Suite</h1>
            <p className="text-blue-200">
              Comprehensive testing for Community Impact tracking functionality
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="py-8">
          <CommunityImpactTest />
        </div>
      </div>
    </div>
  );
};

export default CommunityImpactTestPage;
