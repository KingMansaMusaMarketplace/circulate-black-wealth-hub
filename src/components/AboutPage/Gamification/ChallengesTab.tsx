
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Star, Trophy } from 'lucide-react';

const ChallengesTab = () => {
  const currentChallenges = [
    { title: 'Weekend Explorer', desc: 'Visit 3 different Black-owned businesses this weekend', progress: 33, current: '1/3', timeLeft: '2 days left', reward: '100 bonus points', badge: 'Active', badgeColor: 'bg-mansablue', gradient: 'from-mansablue to-blue-700' },
    { title: 'Foodie Tour', desc: 'Visit 5 different Black-owned restaurants this month', progress: 60, current: '3/5', timeLeft: '12 days left', reward: '$15 gift card', badge: 'Active', badgeColor: 'bg-blue-600', gradient: 'from-blue-600 to-blue-800' },
    { title: 'Circulation Champion', desc: 'Spend a total of $200 at Black-owned businesses within 7 days', progress: 62.5, current: '$125/$200', timeLeft: '3 days left', reward: '250 bonus points + exclusive badge', badge: 'Special', badgeColor: 'bg-mansagold', gradient: 'from-mansagold to-amber-600' }
  ];

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="border-2 border-amber-200 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
        <CardHeader className="pb-3 bg-gradient-to-r from-amber-50 to-yellow-50">
          <CardTitle className="flex items-center">
            <Star className="mr-2 h-6 w-6 text-mansagold" />
            <span className="bg-gradient-to-r from-mansagold to-amber-600 bg-clip-text text-transparent">
              Current Challenges
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentChallenges.map((challenge, idx) => (
              <div key={idx} className={`border-2 border-${idx === 2 ? 'amber' : idx === 1 ? 'blue' : 'emerald'}-200 rounded-xl p-5 bg-gradient-to-br from-white to-${idx === 2 ? 'amber' : idx === 1 ? 'blue' : 'emerald'}-50 hover:scale-105 transition-all duration-300 shadow-md`}>
                <div className="flex justify-between items-center mb-3">
                  <h4 className={`font-bold text-lg bg-gradient-to-r ${challenge.gradient} bg-clip-text text-transparent`}>
                    {challenge.title}
                  </h4>
                  <Badge className={`${challenge.badgeColor} text-white font-bold px-3 py-1 shadow-md`}>
                    {challenge.badge}
                  </Badge>
                </div>
                <p className="text-gray-700 mb-4 font-medium">
                  {challenge.desc}
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm font-bold text-gray-700">
                    <span>Progress: {challenge.current} completed</span>
                    <span>{challenge.timeLeft}</span>
                  </div>
                  <Progress value={challenge.progress} className="h-3 bg-white" />
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="font-bold text-gray-700">Reward:</div>
                  <div className={`font-bold bg-gradient-to-r ${challenge.gradient} bg-clip-text text-transparent`}>
                    {challenge.reward}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-2 border-blue-200 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
        <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-mansablue-light/20">
          <CardTitle className="flex items-center">
            <Trophy className="mr-2 h-6 w-6 text-mansablue" />
            <span className="bg-gradient-to-r from-mansablue to-blue-700 bg-clip-text text-transparent">
              Community Challenges
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            <div className="bg-gradient-to-br from-mansablue via-blue-700 to-blue-800 text-white p-6 rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300">
              <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                ⚡ 72-Hour Challenge
              </h3>
              <p className="text-white/90 mb-5 font-medium">
                Our community goal is to reach $100,000 in total circulation within 72 hours!
              </p>
              
              <div className="space-y-2 mb-5 bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                <div className="flex justify-between text-sm font-bold">
                  <span>Community Progress: $78,492/$100,000</span>
                  <span>24 hours left</span>
                </div>
                <div className="h-4 bg-white/20 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-mansagold via-amber-500 to-yellow-500 shadow-lg animate-pulse"
                    style={{ width: '78%' }}
                  ></div>
                </div>
              </div>
              
              <div className="space-y-1 mb-5">
                <div className="text-sm font-bold">Your Contribution:</div>
                <div className="text-4xl font-bold">$325</div>
              </div>
              
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl border border-white/40">
                <div className="font-bold mb-2 text-lg">🎁 Community Reward:</div>
                <p className="text-sm font-medium">
                  When we reach our goal, 5% of the total will be donated to 
                  Black youth entrepreneurship programs!
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-xl mb-4 bg-gradient-to-r from-mansablue to-blue-700 bg-clip-text text-transparent">
                Upcoming Challenges
              </h3>
              
              <div className="space-y-3">
                <div className="border-2 border-blue-200 p-4 rounded-xl bg-gradient-to-br from-white to-blue-50 hover:scale-105 transition-all duration-300 shadow-md">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold text-gray-800">Juneteenth Celebration</h4>
                    <Badge variant="outline" className="border-mansablue text-mansablue font-bold">
                      Starts in 2 weeks
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700 font-medium">
                    Special challenges and double points during Juneteenth weekend
                  </p>
                </div>
                
                <div className="border-2 border-amber-200 p-4 rounded-xl bg-gradient-to-br from-white to-amber-50 hover:scale-105 transition-all duration-300 shadow-md">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold text-gray-800">Back to School</h4>
                    <Badge variant="outline" className="border-mansagold text-mansagold font-bold">
                      Starts in 6 weeks
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700 font-medium">
                    Support Black-owned businesses for back-to-school shopping
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChallengesTab;
