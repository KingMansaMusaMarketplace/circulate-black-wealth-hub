
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Navbar } from '@/components/navbar';
import Footer from '@/components/Footer';
import CommunityForum from '@/components/community/CommunityForum';
import CommunityEvents from '@/components/community/CommunityEvents';
import ActivityFeed from '@/components/community/ActivityFeed';
import SmartBusinessRecommendations from '@/components/discovery/SmartBusinessRecommendations';
import { MessageSquare, Calendar, TrendingUp, Activity } from 'lucide-react';

const CommunityPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="bg-gradient-to-r from-mansablue to-mansablue-dark text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4">Community Hub</h1>
          <p className="text-xl text-blue-100">
            Connect, discover, and grow with the Black business community
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <Tabs defaultValue="activity" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="activity" className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>Activity</span>
            </TabsTrigger>
            <TabsTrigger value="discover" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Discover</span>
            </TabsTrigger>
            <TabsTrigger value="forum" className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>Forum</span>
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Events</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="activity" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ActivityFeed limit={20} />
              </div>
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="font-semibold mb-4 text-mansablue">Quick Stats</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Active Today</span>
                      <span className="font-medium">24 members</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">QR Scans Today</span>
                      <span className="font-medium text-green-600">47</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Wealth Circulated</span>
                      <span className="font-medium text-mansagold">$2,340</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="discover" className="space-y-6">
            <SmartBusinessRecommendations />
          </TabsContent>

          <TabsContent value="forum" className="space-y-6">
            <CommunityForum />
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <CommunityEvents />
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
};

export default CommunityPage;
