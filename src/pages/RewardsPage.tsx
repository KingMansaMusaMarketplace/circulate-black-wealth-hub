import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Gift, Star, Clock, CheckCircle, ShoppingBag, Trophy, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { toast } from 'sonner';

interface Reward {
  id: string;
  title: string;
  description: string;
  points_cost: number;
  image_url?: string;
  is_global: boolean;
  business_id?: string;
  business_name?: string;
  is_active: boolean;
}

interface UserPoints {
  totalPoints: number;
  pointsSpent: number;
  availablePoints: number;
  tierLevel: string;
  nextTierPoints: number;
}

const RewardsPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [userPoints, setUserPoints] = useState<UserPoints>({
    totalPoints: 0,
    pointsSpent: 0,
    availablePoints: 0,
    tierLevel: 'Bronze',
    nextTierPoints: 500
  });
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState<string | null>(null);

  const tiers = [
    { name: 'Bronze', min: 0, max: 499, color: 'bg-gradient-to-r from-amber-600 to-orange-600', textColor: 'text-amber-600', benefits: ['5% bonus points', 'Basic rewards access'], icon: '🥉' },
    { name: 'Silver', min: 500, max: 1999, color: 'bg-gradient-to-r from-gray-400 to-gray-600', textColor: 'text-gray-500', benefits: ['10% bonus points', 'Premium rewards access'], icon: '🥈' },
    { name: 'Gold', min: 2000, max: 4999, color: 'bg-gradient-to-r from-mansagold to-yellow-400', textColor: 'text-mansagold', benefits: ['15% bonus points', 'Exclusive rewards', 'Early access'], icon: '🥇' },
    { name: 'Platinum', min: 5000, max: Infinity, color: 'bg-gradient-to-r from-purple-600 to-pink-600', textColor: 'text-purple-600', benefits: ['20% bonus points', 'VIP experiences', 'Personal concierge'], icon: '💎' }
  ];

  useEffect(() => {
    if (authLoading) return; // Wait for auth to finish loading
    
    if (user) {
      loadRewards();
      loadUserPoints();
    } else {
      setLoading(false); // User not authenticated, stop loading
    }
  }, [user, authLoading]);

  const loadRewards = async () => {
    try {
      const { data, error } = await supabase
        .from('rewards')
        .select(`
          *,
          businesses (business_name)
        `)
        .eq('is_active', true)
        .order('points_cost', { ascending: true });

      if (error) throw error;

      const formattedRewards = data?.map(reward => ({
        ...reward,
        business_name: reward.businesses?.business_name || 'Global Reward'
      })) || [];

      setRewards(formattedRewards);
    } catch (error) {
      console.error('Error loading rewards:', error);
      toast.error('Failed to load rewards');
    }
  };

  const loadUserPoints = async () => {
    if (!user) return;

    try {
      // Get total points earned from QR scans
      const { data: scans, error: scanError } = await supabase
        .from('qr_scans')
        .select('points_awarded')
        .eq('customer_id', user.id);

      if (scanError) throw scanError;

      // Get total points spent on rewards
      const { data: redeemed, error: redeemedError } = await supabase
        .from('redeemed_rewards')
        .select('points_used')
        .eq('customer_id', user.id);

      if (redeemedError) throw redeemedError;

      const totalEarned = scans?.reduce((sum, scan) => sum + (scan.points_awarded || 0), 0) || 0;
      const totalSpent = redeemed?.reduce((sum, redemption) => sum + (redemption.points_used || 0), 0) || 0;
      const available = totalEarned - totalSpent;

      // Determine tier
      const currentTier = tiers.find(tier => totalEarned >= tier.min && totalEarned <= tier.max) || tiers[0];
      const nextTier = tiers.find(tier => tier.min > totalEarned);

      setUserPoints({
        totalPoints: totalEarned,
        pointsSpent: totalSpent,
        availablePoints: available,
        tierLevel: currentTier.name,
        nextTierPoints: nextTier ? nextTier.min - totalEarned : 0
      });
    } catch (error) {
      console.error('Error loading user points:', error);
    } finally {
      setLoading(false);
    }
  };

  const redeemReward = async (reward: Reward) => {
    if (!user) {
      toast.error('Please sign in to redeem rewards');
      return;
    }

    if (userPoints.availablePoints < reward.points_cost) {
      toast.error('Not enough points to redeem this reward');
      return;
    }

    setRedeeming(reward.id);
    
    try {
      const { error } = await supabase
        .from('redeemed_rewards')
        .insert({
          reward_id: reward.id,
          customer_id: user.id,
          business_id: reward.business_id,
          points_used: reward.points_cost,
          redemption_date: new Date().toISOString(),
          expiration_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
        });

      if (error) throw error;

      toast.success(`🎉 Successfully redeemed ${reward.title}!`, {
        description: `You spent ${reward.points_cost} points. Check your email for redemption details.`,
        duration: 5000,
      });
      
      // Reload user points to reflect the redemption
      await loadUserPoints();
    } catch (error) {
      console.error('Error redeeming reward:', error);
      toast.error('Failed to redeem reward');
    } finally {
      setRedeeming(null);
    }
  };

  const currentTier = tiers.find(tier => tier.name === userPoints.tierLevel) || tiers[0];
  const progressToNextTier = userPoints.nextTierPoints > 0 
    ? ((userPoints.totalPoints % 500) / 500) * 100 
    : 100;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert className="max-w-md">
          <AlertDescription>
            Please sign in to view your rewards and points.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const globalRewards = rewards.filter(r => r.is_global);
  const businessRewards = rewards.filter(r => !r.is_global);

  return (
    <>
      <Helmet>
        <title>Rewards & Points | Mansa Musa Marketplace</title>
        <meta name="description" content="Earn and redeem points for supporting Black-owned businesses" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-mansablue via-primary to-mansagold text-white">
          <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
          <div className="container mx-auto px-4 py-12 relative">
            <div className="text-center mb-8">
              <div className="inline-block mb-4">
                <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm animate-bounce-subtle">
                  <Gift className="h-16 w-16 text-mansagold" />
                </div>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-mansagold-light to-white bg-clip-text text-transparent">
                Rewards & Points 🎁
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto font-medium">
                Earn points by supporting Black-owned businesses and unlock exclusive rewards ✨
              </p>
            </div>

            {/* Points Summary Card */}
            <Card className="max-w-4xl mx-auto bg-white/95 backdrop-blur border-2 border-white/30 shadow-2xl">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Available Points */}
                  <div className="text-center p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
                    <div className="flex items-center justify-center mb-2">
                      <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full">
                        <Zap className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <span className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent block">
                      {userPoints.availablePoints}
                    </span>
                    <p className="text-green-700 font-semibold mt-1">Available Points</p>
                  </div>

                  {/* Tier Status */}
                  <div className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
                    <div className="flex items-center justify-center mb-2">
                      <div className={`p-2 ${currentTier.color} rounded-full shadow-lg`}>
                        <Trophy className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <span className="text-2xl mb-1 block">{currentTier.icon}</span>
                    <span className={`text-3xl font-bold ${currentTier.textColor} block`}>
                      {userPoints.tierLevel}
                    </span>
                    <p className="text-purple-700 font-semibold mt-1">Current Tier</p>
                    {userPoints.nextTierPoints > 0 && (
                      <div className="mt-3">
                        <Progress value={progressToNextTier} className="h-3 bg-purple-200" />
                        <p className="text-sm text-purple-600 font-medium mt-1">
                          {userPoints.nextTierPoints} pts to next tier
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Lifetime Earned */}
                  <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
                    <div className="flex items-center justify-center mb-2">
                      <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full">
                        <Star className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent block">
                      {userPoints.totalPoints}
                    </span>
                    <p className="text-blue-700 font-semibold mt-1">Lifetime Earned</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tier Benefits */}
        <div className="container mx-auto px-4 py-8">
          <Card className="mb-8 bg-gradient-to-br from-primary/5 via-mansagold/5 to-mansablue/5 border-2 border-primary/20">
            <CardHeader className="border-b border-primary/10">
              <CardTitle className="text-center text-2xl bg-gradient-to-r from-mansablue via-primary to-mansagold bg-clip-text text-transparent">
                {currentTier.icon} Your {currentTier.name} Tier Benefits
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentTier.benefits?.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-white border border-primary/10">
                    <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
                    <span className="font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Rewards Catalog */}
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-gradient-to-r from-primary/10 via-mansagold/10 to-mansablue/10 p-1">
              <TabsTrigger value="all" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-mansablue data-[state=active]:to-primary data-[state=active]:text-white">
                🎯 All Rewards
              </TabsTrigger>
              <TabsTrigger value="global" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-mansagold data-[state=active]:text-white">
                🌍 Global
              </TabsTrigger>
              <TabsTrigger value="business" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-mansagold data-[state=active]:to-amber-500 data-[state=active]:text-white">
                🏪 Business Exclusive
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rewards.map((reward) => (
                  <RewardCard 
                    key={reward.id} 
                    reward={reward} 
                    userPoints={userPoints.availablePoints}
                    isRedeeming={redeeming === reward.id}
                    onRedeem={() => redeemReward(reward)}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="global" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {globalRewards.map((reward) => (
                  <RewardCard 
                    key={reward.id} 
                    reward={reward} 
                    userPoints={userPoints.availablePoints}
                    isRedeeming={redeeming === reward.id}
                    onRedeem={() => redeemReward(reward)}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="business" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {businessRewards.map((reward) => (
                  <RewardCard 
                    key={reward.id} 
                    reward={reward} 
                    userPoints={userPoints.availablePoints}
                    isRedeeming={redeeming === reward.id}
                    onRedeem={() => redeemReward(reward)}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {rewards.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-block p-6 bg-gradient-to-br from-primary/10 to-mansagold/10 rounded-full mb-4">
                <Gift className="h-20 w-20 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-mansablue via-primary to-mansagold bg-clip-text text-transparent">
                No Rewards Available Yet
              </h3>
              <p className="text-muted-foreground text-lg">
                Check back later for exciting rewards from our partner businesses! 🎁
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

interface RewardCardProps {
  reward: Reward;
  userPoints: number;
  isRedeeming: boolean;
  onRedeem: () => void;
}

const RewardCard: React.FC<RewardCardProps> = ({ reward, userPoints, isRedeeming, onRedeem }) => {
  const canAfford = userPoints >= reward.points_cost;

  return (
    <Card className={`hover:shadow-xl transition-all hover:scale-105 border-2 ${!canAfford ? 'opacity-60 grayscale' : 'bg-gradient-to-br from-white via-primary/5 to-mansablue/5 border-primary/20'}`}>
      {reward.image_url && (
        <div className="aspect-video overflow-hidden rounded-t-lg relative">
          <img 
            src={reward.image_url} 
            alt={reward.title}
            className="w-full h-full object-cover"
          />
          {!canAfford && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-bold text-lg">🔒 Need More Points</span>
            </div>
          )}
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg line-clamp-2">{reward.title}</CardTitle>
          <Badge 
            variant={reward.is_global ? 'default' : 'secondary'} 
            className={reward.is_global ? 'bg-gradient-to-r from-mansablue to-primary text-white' : 'bg-gradient-to-r from-mansagold to-amber-500 text-white'}
          >
            {reward.is_global ? '🌍 Global' : `🏪 ${reward.business_name}`}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
          {reward.description}
        </p>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200">
            <Star className="h-5 w-5 text-yellow-500" />
            <span className="font-bold text-yellow-700">{reward.points_cost}</span>
            <span className="text-xs text-yellow-600">points</span>
          </div>
          
          <Button
            onClick={onRedeem}
            disabled={!canAfford || isRedeeming}
            size="sm"
            className={canAfford ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white' : ''}
          >
            {isRedeeming ? (
              <>
                <LoadingSpinner />
                Redeeming...
              </>
            ) : canAfford ? (
              <>✨ Redeem Now</>
            ) : (
              '🔒 Locked'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RewardsPage;