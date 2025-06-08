
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CommunityForum from '@/components/community/CommunityForum';
import CommunityEvents from '@/components/community/CommunityEvents';
import SmartBusinessRecommendations from '@/components/discovery/SmartBusinessRecommendations';
import { MessageSquare, Calendar, TrendingUp } from 'lucide-react';

const CommunityPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-mansablue to-mansablue-dark text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4">Community Hub</h1>
          <p className="text-xl text-blue-100">
            Connect, discover, and grow with the Black business community
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <Tabs defaultValue="discover" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
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
    </div>
  );
};

export default CommunityPage;
