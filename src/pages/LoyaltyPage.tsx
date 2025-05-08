
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLoyaltyRewards } from '@/hooks/loyalty-qr-code/use-loyalty-rewards';
import LoyaltyPointsCard from '@/components/LoyaltyPointsCard';
import LoyaltyHistory from '@/components/loyalty/LoyaltyHistory';
import LoyaltyRewardsCard from '@/components/loyalty/LoyaltyRewardsCard';
import { useLoyaltyHistory } from '@/hooks/use-loyalty-history';
import { Card, CardContent } from '@/components/ui/card';
import { Award, Gift, BarChart2, QrCode, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import LeaderboardCard from '@/components/loyalty/LeaderboardCard';
import NotificationsPopover from '@/components/loyalty/NotificationsPopover';

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
        <h1 className="text-3xl font-semibold">My Loyalty Rewards</h1>
        <NotificationsPopover />
      </div>
      
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <div className="w-full md:w-1/3">
          <LoyaltyPointsCard 
            points={totalPoints}
            target={500}
            saved={savedAmount}
          />
        </div>
        
        <Card className="flex-1">
          <CardContent className="p-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-mansablue">{totalPoints}</h2>
              <p className="text-gray-500">Total Points</p>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <Button variant="outline" className="flex items-center gap-2" asChild>
                  <Link to="/scan">
                    <QrCode size={16} />
                    Scan for Points
                  </Link>
                </Button>
                <Button variant="outline" className="flex items-center gap-2" asChild>
                  <Link to="/loyalty-history">
                    <BarChart2 size={16} />
                    View History
                  </Link>
                </Button>
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-sm font-medium mb-3">Your Points by Business</h3>
                {loyaltyPoints.length > 0 ? (
                  <div className="space-y-2">
                    {loyaltyPoints.map((biz, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="font-medium">{biz.businessName}</span>
                        <Badge className="bg-mansablue">{biz.points} pts</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">
                    Visit businesses and scan QR codes to earn points
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="rewards" className="w-full">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="rewards" className="flex items-center gap-2">
            <Gift size={16} />
            Available Rewards
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="flex items-center gap-2">
            <Users size={16} />
            Leaderboard
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
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
