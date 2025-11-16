
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CommunityEvents from '@/components/community/CommunityEvents';
import ActivityFeed from '@/components/community/ActivityFeed';
import SmartBusinessRecommendations from '@/components/discovery/SmartBusinessRecommendations';
import { Calendar, TrendingUp, Activity } from 'lucide-react';

const CommunityPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-mansablue/10 via-background to-purple-500/10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-mansablue/20 via-transparent to-transparent" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-mansablue/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Hero Header */}
      <div className="relative z-10 pt-12 pb-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="relative overflow-hidden rounded-3xl">
            <div className="absolute inset-0 bg-gradient-to-r from-mansablue via-purple-600 to-mansagold" />
            
            {/* Animated decorative elements */}
            <div className="absolute top-8 right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-8 left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            
            <div className="relative px-8 py-12 text-white">
              <h1 className="text-5xl font-bold mb-4 animate-fade-in-up">Community Hub</h1>
              <p className="text-xl text-white/90 max-w-2xl animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
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
            <div className="absolute inset-0 bg-gradient-to-r from-mansablue/20 to-purple-500/20 rounded-2xl blur-xl" />
            <TabsList className="relative grid w-full grid-cols-3 bg-card/95 backdrop-blur-sm border-2 border-border/40 p-2 rounded-2xl">
              <TabsTrigger value="activity" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-mansablue data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-xl transition-all">
                <Activity className="h-4 w-4" />
                <span>Activity</span>
              </TabsTrigger>
              <TabsTrigger value="discover" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-mansablue data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-xl transition-all">
                <TrendingUp className="h-4 w-4" />
                <span>Discover</span>
              </TabsTrigger>
              <TabsTrigger value="events" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-mansablue data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-xl transition-all">
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
                  <div className="absolute inset-0 bg-gradient-to-br from-mansablue/20 to-purple-500/20 rounded-2xl blur-xl" />
                  <div className="relative bg-card/95 backdrop-blur-sm border-2 border-border/40 p-6 rounded-2xl shadow-xl">
                    <h3 className="font-bold text-lg mb-4 bg-gradient-to-r from-mansablue to-purple-600 bg-clip-text text-transparent">Quick Stats</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                        <span className="text-muted-foreground font-medium">Active Today</span>
                        <span className="font-bold text-foreground">24 members</span>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                        <span className="text-muted-foreground font-medium">QR Scans Today</span>
                        <span className="font-bold text-green-600">47</span>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                        <span className="text-muted-foreground font-medium">Wealth Circulated</span>
                        <span className="font-bold text-mansagold">$2,340</span>
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
