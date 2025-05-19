
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Award, Trophy, Star } from 'lucide-react';
import RewardsTab from './RewardsTab';
import BadgesTab from './BadgesTab';
import ChallengesTab from './ChallengesTab';

const GamificationTabs = () => {
  return (
    <Tabs defaultValue="rewards" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-8">
        <TabsTrigger value="rewards" className="flex items-center gap-2">
          <Award className="h-4 w-4" />
          <span>Rewards</span>
        </TabsTrigger>
        <TabsTrigger value="badges" className="flex items-center gap-2">
          <Trophy className="h-4 w-4" />
          <span>Achievement Badges</span>
        </TabsTrigger>
        <TabsTrigger value="challenges" className="flex items-center gap-2">
          <Star className="h-4 w-4" />
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
