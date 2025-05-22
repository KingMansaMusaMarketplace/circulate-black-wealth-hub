
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLoyaltyRewards } from '@/hooks/loyalty-qr-code/use-loyalty-rewards';
import LoyaltyPointsCard from '@/components/LoyaltyPointsCard';
import LoyaltyHistory from '@/components/loyalty/LoyaltyHistory';
import LoyaltyRewardsCard from '@/components/loyalty/LoyaltyRewardsCard';
import { useLoyaltyHistory } from '@/hooks/use-loyalty-history';
import { Card, CardContent } from '@/components/ui/card';
import { Award, Gift, BarChart2, QrCode, Users, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import LeaderboardCard from '@/components/loyalty/LeaderboardCard';
import NotificationsPopover from '@/components/loyalty/NotificationsPopover';
import LoyaltyGuide from '@/components/loyalty/LoyaltyGuide';
import ReferralCard from '@/components/loyalty/ReferralCard';

// Define the LoyaltyTransaction type expected by LoyaltyHistory component
interface LoyaltyTransaction {
  id: number | string;
  businessName: string;
  action: string;
  points: number;
  date: string;
  time: string;
}

const LoyaltyPage = () => {
  const { totalPoints, loyaltyPoints, availableRewards, redeemReward } = useLoyaltyRewards({ autoRefresh: true });
  const { stats, transactions } = useLoyaltyHistory();
  
  // Calculate total amount saved based on reward value
  const savedAmount = Math.round(totalPoints / 100) * 5; // Simplified calculation for demo

  // Transform the data to match the expected types
  const formattedStats = {
    totalPoints: stats.totalPointsEarned || 0, // Use totalPointsEarned as totalPoints
    pointsEarned: stats.totalPointsEarned || 0,
    pointsRedeemed: stats.totalPointsRedeemed || 0,
    visitsThisMonth: stats.visitsThisMonth || 0
  };

  // Transform transactions to match expected format
  const formattedTransactions: LoyaltyTransaction[] = transactions.map(transaction => ({
    id: transaction.id,
    businessName: transaction.business?.business_name || 'Business',
    action: transaction.transaction_type || 'Scan',
    points: transaction.points_earned || -transaction.points_redeemed,
    date: new Date(transaction.transaction_date).toLocaleDateString(),
    time: new Date(transaction.transaction_date).toLocaleTimeString()
  }));

  return (
    <div className="container py-8 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold text-mansablue">My Loyalty Rewards</h1>
        <NotificationsPopover />
      </div>
      
      {/* Display the Loyalty Guide */}
      <LoyaltyGuide />
      
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="w-full md:w-1/3">
          <LoyaltyPointsCard 
            points={totalPoints}
            target={500}
            saved={savedAmount}
          />
        </div>
        
        <div className="w-full md:w-2/3 flex flex-col gap-6">
          <Card className="flex-1 overflow-hidden border border-blue-100 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6 bg-gradient-to-br from-white to-blue-50">
              <div className="text-center">
                <div className="mb-4">
                  <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-mansablue/10 mb-2">
                    <Sparkles size={28} className="text-mansablue" />
                  </span>
                  <h2 className="text-2xl font-bold text-mansablue">{totalPoints}</h2>
                  <p className="text-gray-600">Total Points</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <Button variant="default" className="flex items-center gap-2 bg-mansablue hover:bg-mansablue-dark" asChild>
                    <Link to="/scan">
                      <QrCode size={16} />
                      Scan for Points
                    </Link>
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2 text-mansablue border-mansablue hover:bg-mansablue/5" asChild>
                    <Link to="/loyalty-history">
                      <BarChart2 size={16} />
                      View History
                    </Link>
                  </Button>
                </div>
                
                <div className="mt-6 pt-6 border-t border-blue-100">
                  <h3 className="text-sm font-medium mb-3 text-mansablue">Your Points by Business</h3>
                  {loyaltyPoints.length > 0 ? (
                    <div className="space-y-2">
                      {loyaltyPoints.map((biz, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-mansablue/5 rounded hover:bg-mansablue/10 transition-colors">
                          <span className="font-medium text-gray-700">{biz.businessName}</span>
                          <Badge className="bg-mansablue hover:bg-mansablue-dark">{biz.points} pts</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm p-4 bg-blue-50 rounded-md border border-blue-100">
                      Visit businesses and scan QR codes to earn points
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <ReferralCard />
        </div>
      </div>
      
      <Tabs defaultValue="rewards" className="w-full">
        <TabsList className="grid grid-cols-3 bg-blue-50 p-1">
          <TabsTrigger value="rewards" className="flex items-center gap-2 data-[state=active]:bg-mansablue data-[state=active]:text-white">
            <Gift size={16} />
            Available Rewards
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="flex items-center gap-2 data-[state=active]:bg-mansablue data-[state=active]:text-white">
            <Users size={16} />
            Leaderboard
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2 data-[state=active]:bg-mansablue data-[state=active]:text-white">
            <BarChart2 size={16} />
            Points History
          </TabsTrigger>
        </TabsList>
        <TabsContent value="rewards" className="mt-6">
          <LoyaltyRewardsCard 
            totalPoints={totalPoints}
            availableRewards={availableRewards}
            onRedeemReward={redeemReward}
          />
        </TabsContent>
        <TabsContent value="leaderboard" className="mt-6">
          <LeaderboardCard limit={10} />
        </TabsContent>
        <TabsContent value="history" className="mt-6">
          <LoyaltyHistory 
            stats={formattedStats}
            transactions={formattedTransactions}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LoyaltyPage;
