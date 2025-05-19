import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Gamepad, Award, Gift, TrendingUp, Star, Trophy, UserCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const GamificationFeatures = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="heading-md text-mansablue mb-4">Earn While You Support</h2>
          <div className="w-24 h-1 bg-mansagold mx-auto mb-6"></div>
          <div className="flex justify-center items-center gap-2 mb-4">
            <Gamepad className="h-5 w-5 text-mansagold" />
            <p className="text-lg font-medium text-mansablue-dark">Making Economic Empowerment Fun</p>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover how our gamified platform rewards you for supporting Black-owned businesses 
            and participating in economic circulation.
          </p>
        </div>
        
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
                          <AvatarImage src="/placeholder.svg" />
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
                          <AvatarImage src="/placeholder.svg" />
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
                          <AvatarImage src="/placeholder.svg" />
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
                          <AvatarImage src="/placeholder.svg" />
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
          </TabsContent>
          
          <TabsContent value="badges">
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
          </TabsContent>
          
          <TabsContent value="challenges">
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
          </TabsContent>
        </Tabs>
        
        <div className="mt-10 text-center">
          <Link to="/signup">
            <Button className="bg-mansablue hover:bg-mansablue-dark text-white px-6 py-2">
              Start Earning Rewards
            </Button>
          </Link>
          <p className="mt-3 text-sm text-gray-500">
            Join the movement and get rewarded for supporting Black-owned businesses
          </p>
        </div>
      </div>
    </section>
  );
};

export default GamificationFeatures;
