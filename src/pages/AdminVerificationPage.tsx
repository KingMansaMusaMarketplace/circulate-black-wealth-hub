import React from 'react';
import VerificationQueue from '@/components/admin/verification/VerificationQueue';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VerificationSettings from '@/components/admin/verification/VerificationSettings';
import VerificationStatistics from '@/components/admin/verification/VerificationStatistics';
import { Activity, Settings, ClipboardList, BadgeCheck } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const AdminVerificationPage: React.FC = () => {
  return (
    <div className="min-h-screen gradient-primary relative overflow-hidden">
      <Helmet>
        <title>Business Verification - Admin Dashboard</title>
        <meta name="description" content="Review and manage business verification requests" />
      </Helmet>

      {/* Animated Gradient Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-mansagold/20 blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-mansagold/15 blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-white/5 blur-2xl animate-float" style={{ animationDelay: '4s' }}></div>
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 rounded-full bg-mansagold/10 blur-2xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/4 right-1/4 w-56 h-56 rounded-full bg-white/5 blur-2xl animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10 space-y-8">
        {/* Header */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 md:p-8 shadow-2xl animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-mansagold/20 border border-mansagold/30">
              <BadgeCheck className="h-7 w-7 text-mansagold" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white font-display">Business Verification</h1>
              <p className="text-white/70">Review and manage business verification requests</p>
            </div>
          </div>
        </div>

        {/* Tabs Content */}
        <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <Tabs defaultValue="queue">
            <TabsList className="backdrop-blur-xl bg-white/10 border border-white/20 mb-6">
              <TabsTrigger 
                value="stats" 
                className="flex items-center gap-2 data-[state=active]:bg-mansagold data-[state=active]:text-mansablue text-white/70"
              >
                <Activity className="h-4 w-4" /> Statistics
              </TabsTrigger>
              <TabsTrigger 
                value="queue" 
                className="flex items-center gap-2 data-[state=active]:bg-mansagold data-[state=active]:text-mansablue text-white/70"
              >
                <ClipboardList className="h-4 w-4" /> Verification Queue
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className="flex items-center gap-2 data-[state=active]:bg-mansagold data-[state=active]:text-mansablue text-white/70"
              >
                <Settings className="h-4 w-4" /> Settings
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="stats">
              <VerificationStatistics />
            </TabsContent>
            
            <TabsContent value="queue">
              <VerificationQueue />
            </TabsContent>
            
            <TabsContent value="settings">
              <VerificationSettings />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminVerificationPage;
