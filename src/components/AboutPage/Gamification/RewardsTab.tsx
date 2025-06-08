
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
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <Gift className="mr-2 h-5 w-5 text-mansagold" />
            Points Rewards System
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Your Points Balance</h4>
                <span className="text-2xl font-bold text-mansablue">1,250</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Next reward at 1,500 points</span>
                  <span>250 points to go</span>
                </div>
                <Progress value={83} className="h-2" />
              </div>
            </div>
            
            <h3 className="font-medium text-lg mt-4">How to Earn Points</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <div className="p-1 bg-mansablue/10 rounded-full">
                  <TrendingUp className="h-4 w-4 text-mansablue" />
                </div>
                <span><strong>10 points</strong> for each business visit</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="p-1 bg-mansablue/10 rounded-full">
                  <TrendingUp className="h-4 w-4 text-mansablue" />
                </div>
                <span><strong>1 point</strong> for each dollar spent</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="p-1 bg-mansablue/10 rounded-full">
                  <TrendingUp className="h-4 w-4 text-mansablue" />
                </div>
                <span><strong>25 points</strong> for each review submitted</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="p-1 bg-mansablue/10 rounded-full">
                  <TrendingUp className="h-4 w-4 text-mansablue" />
                </div>
                <span><strong>50 points</strong> for referring a friend</span>
              </li>
            </ul>
            
            <div className="pt-2">
              <Button className="w-full bg-mansablue hover:bg-mansablue-dark text-white">
                View Available Rewards
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-6">
        <div className="bg-mansablue rounded-lg p-6 text-white">
          <h3 className="text-xl font-bold mb-2">Weekly Leaderboard</h3>
          <p className="text-white/80 text-sm mb-4">Top supporters this week by points earned</p>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-white/10 p-3 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="font-bold text-lg">1</div>
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&crop=face" alt="Michael J." />
                  <AvatarFallback>MJ</AvatarFallback>
                </Avatar>
                <div>Michael J.</div>
              </div>
              <div className="font-bold">785 pts</div>
            </div>
            
            <div className="flex items-center justify-between bg-white/10 p-3 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="font-bold text-lg">2</div>
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&auto=format&fit=crop&crop=face" alt="Sarah K." />
                  <AvatarFallback>SK</AvatarFallback>
                </Avatar>
                <div>Sarah K.</div>
              </div>
              <div className="font-bold">720 pts</div>
            </div>
            
            <div className="flex items-center justify-between bg-white/10 p-3 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="font-bold text-lg">3</div>
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&crop=face" alt="James D." />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>James D.</div>
              </div>
              <div className="font-bold">685 pts</div>
            </div>
            
            <div className="flex items-center justify-between bg-mansagold/20 p-3 rounded-lg mt-2">
              <div className="flex items-center space-x-3">
                <div className="font-bold text-lg">12</div>
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&crop=face" alt="You" />
                  <AvatarFallback>YOU</AvatarFallback>
                </Avatar>
                <div>You</div>
              </div>
              <div className="font-bold">320 pts</div>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-white/80">
              Weekly prizes for top 3 supporters
            </p>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-2">Milestone Rewards</h3>
            <p className="text-gray-500 text-sm mb-4">
              Earn special rewards when you hit these milestones
            </p>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <div className="font-medium">First Purchase</div>
                  <div className="text-sm text-gray-500">Make your first purchase</div>
                </div>
                <Badge className="bg-green-500">Completed</Badge>
              </div>
              
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <div className="font-medium">5 Different Businesses</div>
                  <div className="text-sm text-gray-500">Visit 5 different businesses</div>
                </div>
                <Badge className="bg-green-500">Completed</Badge>
              </div>
              
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <div className="font-medium">$500 Total Spent</div>
                  <div className="text-sm text-gray-500">Spend $500 total</div>
                </div>
                <div>
                  <Progress value={72} className="h-2 w-24" />
                  <div className="text-xs text-center mt-1">$358 / $500</div>
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
