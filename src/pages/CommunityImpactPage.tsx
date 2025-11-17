
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
      <div className="space-y-6">
        {/* Decorative Banner */}
        <div className="relative overflow-hidden rounded-2xl h-32">
          <div className="absolute inset-0 bg-gradient-to-r from-mansablue via-blue-700 to-blue-800" />
          <div className="absolute top-4 right-10 w-24 h-24 bg-mansagold/10 rounded-full blur-2xl animate-pulse" />
          <div className="absolute bottom-4 left-10 w-32 h-32 bg-mansagold/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="relative h-full flex items-center px-8">
            <div className="text-white">
              <h2 className="text-2xl font-bold mb-1">Community Impact</h2>
              <p className="text-white/90 text-sm">See how your support builds community wealth</p>
            </div>
          </div>
        </div>
        
        <CommunityImpactDashboard />
      </div>
    </DashboardLayout>
  );
};

export default CommunityImpactPage;
