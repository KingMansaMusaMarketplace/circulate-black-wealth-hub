
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CommunityEvents from '@/components/community/CommunityEvents';
import ActivityFeed from '@/components/community/ActivityFeed';
import SmartBusinessRecommendations from '@/components/discovery/SmartBusinessRecommendations';
import { Calendar, TrendingUp, Activity } from 'lucide-react';

const CommunityPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-mansablue/30 to-blue-600/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-[32rem] h-[32rem] bg-gradient-to-br from-mansagold/25 to-amber-500/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-gradient-to-br from-blue-700/20 to-mansablue/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>

      {/* Hero Header */}
      <div className="relative z-10 pt-12 pb-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="relative overflow-hidden rounded-3xl bg-slate-800/60 backdrop-blur-xl border border-white/10 shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-mansablue/20 via-blue-600/20 to-mansagold/20" />
            
            {/* Animated decorative elements */}
            <div className="absolute top-8 right-10 w-32 h-32 bg-mansagold/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-8 left-10 w-40 h-40 bg-mansablue/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            
            <div className="relative px-8 py-12">
              <h1 className="text-5xl font-bold mb-4 animate-fade-in-up text-white">
                Community <span className="bg-gradient-to-r from-blue-400 via-mansagold to-amber-400 bg-clip-text text-transparent">Hub</span>
              </h1>
              <p className="text-xl text-blue-100/90 max-w-2xl animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                Connect, discover, and grow with the Black business community
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pb-12">
        <Tabs defaultValue="activity" className="w-full">
          <div className="relative mb-8">
            <TabsList className="relative grid w-full grid-cols-3 bg-slate-800/60 backdrop-blur-xl border border-white/10 p-2 rounded-2xl shadow-lg">
              <TabsTrigger value="activity" className="flex items-center gap-2 text-blue-200/70 data-[state=active]:bg-gradient-to-r data-[state=active]:from-mansablue data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-xl transition-all hover:text-white">
                <Activity className="h-4 w-4" />
                <span>Activity</span>
              </TabsTrigger>
              <TabsTrigger value="discover" className="flex items-center gap-2 text-blue-200/70 data-[state=active]:bg-gradient-to-r data-[state=active]:from-mansablue data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-xl transition-all hover:text-white">
                <TrendingUp className="h-4 w-4" />
                <span>Discover</span>
              </TabsTrigger>
              <TabsTrigger value="events" className="flex items-center gap-2 text-blue-200/70 data-[state=active]:bg-gradient-to-r data-[state=active]:from-mansablue data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-xl transition-all hover:text-white">
                <Calendar className="h-4 w-4" />
                <span>Events</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="activity" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ActivityFeed limit={20} />
              </div>
              <div className="space-y-6">
                <div className="relative">
                  <div className="bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-lg hover:border-mansagold/30 transition-all duration-300">
                    <h3 className="text-lg font-bold text-white mb-4">Today's Impact</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 rounded-lg bg-slate-900/60 border border-white/5">
                        <span className="text-blue-200/70 font-medium">Active Today</span>
                        <span className="font-bold text-white">24 members</span>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-lg bg-slate-900/60 border border-white/5">
                        <span className="text-blue-200/70 font-medium">QR Scans Today</span>
                        <span className="font-bold text-green-400">47</span>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-lg bg-slate-900/60 border border-white/5">
                        <span className="text-blue-200/70 font-medium">Wealth Circulated</span>
                        <span className="font-bold bg-gradient-to-r from-mansagold to-amber-400 bg-clip-text text-transparent">$2,340</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="discover" className="space-y-6 animate-fade-in">
            <SmartBusinessRecommendations />
          </TabsContent>
          
          <TabsContent value="events" className="space-y-6 animate-fade-in">
            <CommunityEvents />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CommunityPage;
