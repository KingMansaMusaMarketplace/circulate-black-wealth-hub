
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Star, Trophy } from 'lucide-react';

const ChallengesTab = () => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center">
            <Star className="mr-2 h-5 w-5 text-mansagold" />
            Current Challenges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-bold text-lg">Weekend Explorer</h4>
                <Badge>Active</Badge>
              </div>
              <p className="text-gray-600 mb-3">
                Visit 3 different Black-owned businesses this weekend
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Progress: 1/3 completed</span>
                  <span>2 days left</span>
                </div>
                <Progress value={33} className="h-2" />
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="font-medium">Reward:</div>
                <div className="font-bold text-mansablue">100 bonus points</div>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-bold text-lg">Foodie Tour</h4>
                <Badge>Active</Badge>
              </div>
              <p className="text-gray-600 mb-3">
                Visit 5 different Black-owned restaurants this month
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Progress: 3/5 completed</span>
                  <span>12 days left</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="font-medium">Reward:</div>
                <div className="font-bold text-mansablue">$15 gift card</div>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-bold text-lg">Circulation Champion</h4>
                <Badge className="bg-amber-500">Special</Badge>
              </div>
              <p className="text-gray-600 mb-3">
                Spend a total of $200 at Black-owned businesses within 7 days
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Progress: $125/$200</span>
                  <span>3 days left</span>
                </div>
                <Progress value={62.5} className="h-2" />
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="font-medium">Reward:</div>
                <div className="font-bold text-mansablue">250 bonus points + exclusive badge</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center">
            <Trophy className="mr-2 h-5 w-5 text-mansagold" />
            Community Challenges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            <div className="bg-mansablue text-white p-5 rounded-lg">
              <h3 className="text-xl font-bold mb-2">72-Hour Challenge</h3>
              <p className="text-white/80 mb-4">
                Our community goal is to reach $100,000 in total circulation within 72 hours!
              </p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Community Progress: $78,492/$100,000</span>
                  <span>24 hours left</span>
                </div>
                <div className="h-4 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-mansagold" 
                    style={{ width: '78%' }}
                  ></div>
                </div>
              </div>
              
              <div className="space-y-1 mb-4">
                <div className="text-sm font-medium">Your Contribution:</div>
                <div className="text-2xl font-bold">$325</div>
              </div>
              
              <div className="bg-white/10 p-3 rounded-lg">
                <div className="font-medium mb-1">Community Reward:</div>
                <p className="text-sm">
                  When we reach our goal, 5% of the total will be donated to 
                  Black youth entrepreneurship programs!
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-3">Upcoming Challenges</h3>
              
              <div className="space-y-3">
                <div className="border p-3 rounded-lg">
                  <div className="flex justify-between">
                    <h4 className="font-medium">Juneteenth Celebration</h4>
                    <Badge variant="outline">Starts in 2 weeks</Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    Special challenges and double points during Juneteenth weekend
                  </p>
                </div>
                
                <div className="border p-3 rounded-lg">
                  <div className="flex justify-between">
                    <h4 className="font-medium">Back to School</h4>
                    <Badge variant="outline">Starts in 6 weeks</Badge>
                  </div>
                  <p className="text-sm text-gray-600">
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
