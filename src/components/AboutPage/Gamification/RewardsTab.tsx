
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Gift, TrendingUp } from 'lucide-react';

const RewardsTab = () => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="border-2 border-amber-200 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
        <CardHeader className="pb-2 bg-gradient-to-r from-amber-50 to-orange-50">
          <CardTitle className="flex items-center">
            <Gift className="mr-2 h-6 w-6 text-amber-600" />
            <span className="text-gray-900 font-bold">
              Points Rewards System
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-5 rounded-xl border-2 border-amber-200 shadow-md">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-gray-900">Your Points Balance</h4>
                <span className="text-4xl font-bold text-gray-900">
                  1,250
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium text-gray-800">
                  <span>Next reward at 1,500 points</span>
                  <span>250 points to go</span>
                </div>
                <Progress value={83} className="h-3 bg-white" />
              </div>
            </div>
            
            <h3 className="mt-4 text-base font-semibold text-white">
              How to Earn Points
            </h3>
            <ul className="space-y-3">
              {[
                { points: '10 points', text: 'for each business visit' },
                { points: '1 point', text: 'for each dollar spent' },
                { points: '25 points', text: 'for each review submitted' },
                { points: '50 points', text: 'for referring a friend' }
              ].map((item, idx) => (
                <li key={idx} className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-amber-500/10">
                    <TrendingUp className="h-5 w-5 text-amber-400" />
                  </div>
                  <span className="text-white text-sm md:text-base">
                    <strong className="font-semibold">{item.points}</strong> {item.text}
                  </span>
                </li>
              ))}
            </ul>
            
            <div className="pt-2">
              <Button className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold py-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                View Available Rewards
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600 rounded-2xl p-6 text-white shadow-2xl border-2 border-purple-300 hover:scale-105 transition-all duration-300">
          <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
            🏆 Weekly Leaderboard
          </h3>
          <p className="text-white/90 text-sm mb-5 font-medium">
            Top supporters this week by points earned
          </p>
          
          <div className="space-y-3">
            {[
              { rank: '1', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&crop=face', name: 'Michael J.', fallback: 'MJ', pts: '785 pts', gradient: 'from-yellow-400 to-amber-500' },
              { rank: '2', avatar: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=150&auto=format&fit=crop&crop=face', name: 'Sarah K.', fallback: 'SK', pts: '720 pts', gradient: 'from-gray-300 to-gray-400' },
              { rank: '3', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&crop=face', name: 'James D.', fallback: 'JD', pts: '685 pts', gradient: 'from-orange-400 to-amber-600' }
            ].map((user) => (
              <div key={user.rank} className={`flex items-center justify-between bg-gradient-to-r ${user.gradient} p-4 rounded-xl shadow-lg hover:scale-105 transition-transform`}>
                <div className="flex items-center space-x-3">
                  <div className="font-bold text-2xl text-white drop-shadow-md">{user.rank}</div>
                  <Avatar className="h-10 w-10 ring-2 ring-white shadow-md">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-white text-gray-800 font-bold">{user.fallback}</AvatarFallback>
                  </Avatar>
                  <div className="font-bold text-white drop-shadow-md">{user.name}</div>
                </div>
                <div className="font-bold text-xl text-white drop-shadow-md">{user.pts}</div>
              </div>
            ))}
            
            <div className="flex items-center justify-between bg-white/20 backdrop-blur-sm p-4 rounded-xl mt-4 border-2 border-white/40 hover:scale-105 transition-transform">
              <div className="flex items-center space-x-3">
                <div className="font-bold text-xl text-white">12</div>
                <Avatar className="h-10 w-10 ring-2 ring-white shadow-md">
                  <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&crop=face" alt="You" />
                  <AvatarFallback className="bg-white text-gray-800 font-bold">YOU</AvatarFallback>
                </Avatar>
                <div className="font-bold text-white">You</div>
              </div>
              <div className="font-bold text-xl text-white">320 pts</div>
            </div>
          </div>
          
          <div className="mt-5 text-center">
            <p className="text-sm text-white/90 font-medium bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full inline-block">
              🎁 Weekly prizes for top 3 supporters
            </p>
          </div>
        </div>
        
        <Card className="border-2 border-mansablue/30 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
          <CardContent className="p-6">
            <h3 className="font-bold text-xl mb-2 bg-gradient-to-r from-mansablue to-blue-700 bg-clip-text text-transparent">
              Milestone Rewards
            </h3>
            <p className="text-gray-600 text-sm mb-5 font-medium">
              Earn special rewards when you hit these milestones
            </p>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center p-4 border-2 border-mansablue/30 rounded-xl bg-blue-50 hover:scale-105 transition-transform">
                <div>
                  <div className="font-bold text-gray-800">First Purchase</div>
                  <div className="text-sm text-gray-600 font-medium">Make your first purchase</div>
                </div>
                <Badge className="bg-gradient-to-r from-mansablue to-blue-700 text-white font-bold px-4 py-1 shadow-md">
                  ✓ Completed
                </Badge>
              </div>
              
              <div className="flex justify-between items-center p-4 border-2 border-mansablue/30 rounded-xl bg-blue-50 hover:scale-105 transition-transform">
                <div>
                  <div className="font-bold text-gray-800">5 Different Businesses</div>
                  <div className="text-sm text-gray-600 font-medium">Visit 5 different businesses</div>
                </div>
                <Badge className="bg-gradient-to-r from-mansablue to-blue-700 text-white font-bold px-4 py-1 shadow-md">
                  ✓ Completed
                </Badge>
              </div>
              
              <div className="flex justify-between items-center p-4 border-2 border-amber-200 rounded-xl bg-amber-50 hover:scale-105 transition-transform">
                <div>
                  <div className="font-bold text-gray-800">$500 Total Spent</div>
                  <div className="text-sm text-gray-600 font-medium">Spend $500 total</div>
                </div>
                <div>
                  <Progress value={72} className="h-3 w-28 mb-2 bg-white" />
                  <div className="text-xs text-center font-bold text-amber-700">$358 / $500</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RewardsTab;
