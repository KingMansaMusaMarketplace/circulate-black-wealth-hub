
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, Trophy, Star, Gift, UserCircle, TrendingUp } from 'lucide-react';

const BadgesTab = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold">Your Achievement Badges</h3>
          <p className="text-gray-500">
            Collect badges as you support Black-owned businesses and reach important milestones
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-mansagold/20 flex items-center justify-center mb-2">
              <Award className="h-10 w-10 text-mansagold" />
            </div>
            <h4 className="font-medium">Early Adopter</h4>
            <p className="text-xs text-gray-500">Joined during beta</p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-mansablue/20 flex items-center justify-center mb-2">
              <Trophy className="h-10 w-10 text-mansablue" />
            </div>
            <h4 className="font-medium">First Purchase</h4>
            <p className="text-xs text-gray-500">Made first purchase</p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-mansablue/20 flex items-center justify-center mb-2">
              <Star className="h-10 w-10 text-mansablue" />
            </div>
            <h4 className="font-medium">Reviewer</h4>
            <p className="text-xs text-gray-500">Left 5+ reviews</p>
          </div>
          
          <div className="flex flex-col items-center text-center opacity-50">
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-2">
              <Gift className="h-10 w-10 text-gray-400" />
            </div>
            <h4 className="font-medium">Big Spender</h4>
            <p className="text-xs text-gray-500">Spent $1,000 total</p>
          </div>
          
          <div className="flex flex-col items-center text-center opacity-50">
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-2">
              <UserCircle className="h-10 w-10 text-gray-400" />
            </div>
            <h4 className="font-medium">Influencer</h4>
            <p className="text-xs text-gray-500">Referred 5+ friends</p>
          </div>
          
          <div className="flex flex-col items-center text-center opacity-50">
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-2">
              <TrendingUp className="h-10 w-10 text-gray-400" />
            </div>
            <h4 className="font-medium">Circulation Pro</h4>
            <p className="text-xs text-gray-500">Visited 20+ businesses</p>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            You've earned 3 out of 12 possible badges. Keep supporting Black-owned businesses to earn more!
          </p>
          <Button variant="outline">View All Badges</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BadgesTab;
