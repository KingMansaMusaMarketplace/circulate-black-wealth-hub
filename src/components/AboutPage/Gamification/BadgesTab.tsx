
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, Trophy, Star, Gift, UserCircle, TrendingUp } from 'lucide-react';

const BadgesTab = () => {
  const badges = [
    { Icon: Award, name: 'Early Adopter', desc: 'Joined during beta', color: 'from-amber-500 to-orange-500', active: true },
    { Icon: Trophy, name: 'First Purchase', desc: 'Made first purchase', color: 'from-blue-500 to-cyan-500', active: true },
    { Icon: Star, name: 'Reviewer', desc: 'Left 5+ reviews', color: 'from-purple-500 to-pink-500', active: true },
    { Icon: Gift, name: 'Big Spender', desc: 'Spent $1,000 total', color: 'from-gray-300 to-gray-400', active: false },
    { Icon: UserCircle, name: 'Influencer', desc: 'Referred 5+ friends', color: 'from-gray-300 to-gray-400', active: false },
    { Icon: TrendingUp, name: 'Circulation Pro', desc: 'Visited 20+ businesses', color: 'from-gray-300 to-gray-400', active: false }
  ];

  return (
    <Card className="border-2 border-purple-200 bg-white/80 backdrop-blur-sm">
      <CardContent className="p-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent mb-2">
            Your Achievement Badges
          </h3>
          <p className="text-gray-700 font-medium">
            Collect badges as you support Black-owned businesses and reach important milestones
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {badges.map((badge, idx) => {
            const Icon = badge.Icon;
            return (
              <div 
                key={idx}
                className={`flex flex-col items-center text-center group hover:scale-110 transition-transform ${!badge.active ? 'opacity-50' : ''}`}
              >
                <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center mb-3 shadow-lg group-hover:shadow-2xl transition-all duration-300 ${badge.active ? 'ring-4 ring-white' : ''}`}>
                  <Icon className={`h-12 w-12 ${badge.active ? 'text-white' : 'text-gray-400'}`} />
                </div>
                <h4 className="font-bold text-gray-800">{badge.name}</h4>
                <p className="text-xs text-gray-600 font-medium">{badge.desc}</p>
              </div>
            );
          })}
        </div>
        
        <div className="mt-10 text-center">
          <p className="text-gray-700 font-bold mb-5 text-lg">
            🎖️ You've earned 3 out of 12 possible badges. Keep supporting Black-owned businesses to earn more!
          </p>
          <Button 
            variant="outline" 
            className="border-2 border-purple-500 text-purple-700 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white hover:border-transparent font-bold px-8 py-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            View All Badges
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BadgesTab;
