import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard';
import { Award } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import LoyaltyHistory from '@/components/loyalty/LoyaltyHistory';
import RewardsTab from '@/components/loyalty/RewardsTab';
import { useLoyalty } from '@/hooks/use-loyalty';
import { supabase } from '@/lib/supabase';
import Loading from '@/components/ui/loading';

interface Transaction {
  id: number | string;
  businessName: string;
  action: string;
  points: number;
  date: string;
  time: string;
}

interface Reward {
  id: number | string;
  title: string;
  description: string;
  pointsCost: number;
  category: string;
  expiresAt?: string;
}

const LoyaltyPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('history');
  
  // Use the loyalty hook for real data
  const { summary, loading: loyaltyLoading, refreshData } = useLoyalty();
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const fetchLoyaltyHistory = useCallback(async () => {
    if (!user) return;

    try {
      setLoadingData(true);

      // Fetch QR scan history for transactions
      const { data: scansData, error: scansError } = await supabase
        .from('qr_scans')
        .select(`
          id,
          scanned_at,
          points_awarded,
          qr_codes!inner(
            business_id,
            code_type,
            businesses!inner(business_name)
          )
        `)
        .eq('user_id', user.id)
        .order('scanned_at', { ascending: false })
        .limit(20);

      if (scansError) {
        console.error('Error fetching scan history:', scansError);
      } else {
        const formattedTransactions: Transaction[] = (scansData || []).map((scan: any, index: number) => ({
          id: scan.id || index,
          businessName: scan.qr_codes?.businesses?.business_name || 'Unknown Business',
          action: scan.qr_codes?.code_type === 'loyalty' ? 'Scan' : 'Discount',
          points: scan.points_awarded || 0,
          date: new Date(scan.scanned_at).toLocaleDateString(),
          time: new Date(scan.scanned_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));
        setTransactions(formattedTransactions);
      }

      // Fetch redeemed rewards
      const { data: redemptionsData, error: redemptionsError } = await supabase
        .from('redeemed_rewards')
        .select(`
          id,
          points_used,
          redemption_date,
          rewards!inner(title)
        `)
        .eq('customer_id', user.id)
        .order('redemption_date', { ascending: false })
        .limit(10);

      if (!redemptionsError && redemptionsData) {
        const redemptionTransactions: Transaction[] = redemptionsData.map((redemption: any) => ({
          id: `redemption-${redemption.id}`,
          businessName: 'Rewards Program',
          action: 'Redemption',
          points: -(redemption.points_used || 0),
          date: new Date(redemption.redemption_date).toLocaleDateString(),
          time: new Date(redemption.redemption_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));

        // Merge and sort all transactions
        const allTransactions = [...transactions, ...redemptionTransactions]
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 20);

        setTransactions(prev => {
          const combined = [...prev.filter(t => !String(t.id).startsWith('redemption-')), ...redemptionTransactions];
          return combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 20);
        });
      }

      // Fetch available rewards
      const { data: rewardsData, error: rewardsError } = await supabase
        .from('rewards')
        .select('*')
        .eq('is_active', true)
        .order('points_cost', { ascending: true });

      if (rewardsError) {
        console.error('Error fetching rewards:', rewardsError);
      } else {
        const formattedRewards: Reward[] = (rewardsData || []).map((reward: any) => ({
          id: reward.id,
          title: reward.title,
          description: reward.description || '',
          pointsCost: reward.points_cost,
          category: reward.category || 'General',
          expiresAt: reward.expires_at
        }));
        setRewards(formattedRewards);
      }
    } catch (error) {
      console.error('Error fetching loyalty data:', error);
    } finally {
      setLoadingData(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      refreshData();
      fetchLoyaltyHistory();
    }
  }, [user, refreshData, fetchLoyaltyHistory]);

  // Handle reward redemption
  const handleRedeemReward = async (rewardId: number | string, pointsCost: number) => {
    if (!user) {
      toast.error('Please log in to redeem rewards');
      return;
    }

    // Check if user has enough points
    if (summary.totalPoints < pointsCost) {
      toast.error("Not enough points to redeem this reward");
      return;
    }

    try {
      // Record the redemption
      const { error: redemptionError } = await supabase
        .from('redeemed_rewards')
        .insert({
          customer_id: user.id,
          reward_id: String(rewardId),
          points_used: pointsCost,
          redemption_date: new Date().toISOString()
        });

      if (redemptionError) {
        console.error('Error recording redemption:', redemptionError);
        toast.error('Failed to redeem reward');
        return;
      }

      // Deduct points from loyalty_points records
      const { data: loyaltyRecords, error: fetchError } = await supabase
        .from('loyalty_points')
        .select('*')
        .eq('customer_id', user.id)
        .order('points', { ascending: false });

      if (!fetchError && loyaltyRecords?.length) {
        let remainingToDeduct = pointsCost;
        for (const record of loyaltyRecords) {
          if (remainingToDeduct <= 0) break;

          const deduction = Math.min(record.points, remainingToDeduct);
          const newPoints = record.points - deduction;

          await supabase
            .from('loyalty_points')
            .update({ points: newPoints })
            .eq('id', record.id);

          remainingToDeduct -= deduction;
        }
      }

      // Find the reward to show in the toast
      const redeemedReward = rewards.find(r => r.id === rewardId);

      // Add transaction for this redemption
      const newTransaction: Transaction = {
        id: Date.now(),
        businessName: "Rewards Program",
        action: "Redemption",
        points: -pointsCost,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setTransactions(prev => [newTransaction, ...prev]);

      toast.success("Reward Redeemed", {
        description: `You've redeemed "${redeemedReward?.title}". ${pointsCost} points have been deducted.`
      });

      // Refresh data
      refreshData();
    } catch (error) {
      console.error('Error redeeming reward:', error);
      toast.error('Failed to redeem reward');
    }
  };

  // Calculate stats from real data
  const loyaltyStats = {
    totalPoints: summary.totalPoints,
    pointsEarned: transactions.filter(t => t.points > 0).reduce((sum, t) => sum + t.points, 0),
    pointsRedeemed: Math.abs(transactions.filter(t => t.points < 0).reduce((sum, t) => sum + t.points, 0)),
    visitsThisMonth: transactions.filter(t => {
      const txDate = new Date(t.date);
      const now = new Date();
      return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
    }).length,
  };

  // Show loading state while checking auth status
  if (authLoading || loyaltyLoading || loadingData) {
    return (
      <DashboardLayout title="Loyalty History" location="">
        <Loading text="Loading loyalty rewards..." />
      </DashboardLayout>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <DashboardLayout 
      title="Loyalty Program" 
      icon={<Award className="mr-2 h-5 w-5" />}
    >
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 -m-6 p-6 relative overflow-hidden">
        {/* Animated Gradient Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        <div className="relative z-10 space-y-6">
          {/* Decorative Banner */}
          <div className="relative overflow-hidden rounded-2xl h-32 backdrop-blur-xl bg-white/5 border border-white/10">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-blue-500/20" />
            <div className="absolute top-4 right-10 w-24 h-24 bg-yellow-400/20 rounded-full blur-2xl animate-pulse" />
            <div className="absolute bottom-4 left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="relative h-full flex items-center px-8">
              <div className="text-white">
                <h2 className="text-2xl font-bold mb-1">Your Rewards</h2>
                <p className="text-blue-200 text-sm">Earn points and redeem exclusive rewards</p>
              </div>
              <div className="ml-auto text-right">
                <div className="text-3xl font-bold text-yellow-400">{loyaltyStats.totalPoints}</div>
                <div className="text-sm text-white/70">Total Points</div>
              </div>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-8 backdrop-blur-xl bg-white/5 border border-white/10">
              <TabsTrigger 
                value="history" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-yellow-600 data-[state=active]:text-slate-900 text-blue-200"
              >
                History
              </TabsTrigger>
              <TabsTrigger 
                value="rewards"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-yellow-600 data-[state=active]:text-slate-900 text-blue-200"
              >
                Redeem Rewards
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="history" className="space-y-6">
              <LoyaltyHistory stats={loyaltyStats} transactions={transactions} />
            </TabsContent>
            
            <TabsContent value="rewards">
              <RewardsTab 
                availablePoints={loyaltyStats.totalPoints}
                rewards={rewards}
                onRedeem={handleRedeemReward}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LoyaltyPage;
