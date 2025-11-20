
import React from 'react';
import CommunityImpactDashboard from '@/components/community-impact/CommunityImpactDashboard';
import { DashboardLayout } from '@/components/dashboard';
import { TrendingUp } from 'lucide-react';

const CommunityImpactPage: React.FC = () => {
  return (
    <DashboardLayout 
      title="Community Impact" 
      icon={<TrendingUp className="h-6 w-6" />}
    >
      <div className="space-y-6 bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 min-h-screen relative overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
        
        {/* Decorative Banner */}
        <div className="relative overflow-hidden rounded-2xl h-32 z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800" />
          <div className="absolute top-4 right-10 w-24 h-24 bg-yellow-400/10 rounded-full blur-2xl animate-pulse" />
          <div className="absolute bottom-4 left-10 w-32 h-32 bg-yellow-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="relative h-full flex items-center px-8">
            <div className="text-white">
              <h2 className="text-2xl font-bold mb-1">Community Impact</h2>
              <p className="text-white/90 text-sm">See how your support builds community wealth</p>
            </div>
          </div>
        </div>
        
        <div className="relative z-10">
          <CommunityImpactDashboard />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CommunityImpactPage;
