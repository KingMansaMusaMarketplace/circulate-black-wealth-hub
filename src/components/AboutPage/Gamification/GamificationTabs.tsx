
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Award, Trophy, Star } from 'lucide-react';
import RewardsTab from './RewardsTab';
import BadgesTab from './BadgesTab';
import ChallengesTab from './ChallengesTab';

const GamificationTabs = () => {
  return (
    <Tabs defaultValue="rewards" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-8 bg-white/80 backdrop-blur-sm p-2 rounded-xl border-2 border-pink-200">
        <TabsTrigger 
          value="rewards" 
          className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white rounded-lg font-bold transition-all duration-300"
        >
          <Award className="h-5 w-5" />
          <span>Rewards</span>
        </TabsTrigger>
        <TabsTrigger 
          value="badges" 
          className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-lg font-bold transition-all duration-300"
        >
          <Trophy className="h-5 w-5" />
          <span>Achievement Badges</span>
        </TabsTrigger>
        <TabsTrigger 
          value="challenges" 
          className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-lg font-bold transition-all duration-300"
        >
          <Star className="h-5 w-5" />
          <span>Challenges</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="rewards">
        <RewardsTab />
      </TabsContent>
      
      <TabsContent value="badges">
        <BadgesTab />
      </TabsContent>
      
      <TabsContent value="challenges">
        <ChallengesTab />
      </TabsContent>
    </Tabs>
  );
};

export default GamificationTabs;
