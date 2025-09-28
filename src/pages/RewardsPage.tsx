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
    { name: 'Bronze', min: 0, max: 499, color: 'bg-amber-600', benefits: ['5% bonus points', 'Basic rewards access'] },
    { name: 'Silver', min: 500, max: 1999, color: 'bg-gray-400', benefits: ['10% bonus points', 'Premium rewards access'] },
    { name: 'Gold', min: 2000, max: 4999, color: 'bg-yellow-500', benefits: ['15% bonus points', 'Exclusive rewards', 'Early access'] },
    { name: 'Platinum', min: 5000, max: Infinity, color: 'bg-purple-600', benefits: ['20% bonus points', 'VIP experiences', 'Personal concierge'] }
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

      toast.success(`Successfully redeemed ${reward.title}!`);
      
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
        <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
          <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Rewards & Points
              </h1>
              <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
                Earn points by supporting Black-owned businesses and unlock exclusive rewards
              </p>
            </div>

            {/* Points Summary Card */}
            <Card className="max-w-4xl mx-auto bg-white/10 backdrop-blur border-white/20">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Available Points */}
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Zap className="h-8 w-8 mr-2" />
                      <span className="text-3xl font-bold">{userPoints.availablePoints}</span>
                    </div>
                    <p className="text-primary-foreground/80">Available Points</p>
                  </div>

                  {/* Tier Status */}
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Trophy className="h-8 w-8 mr-2" />
                      <span className="text-3xl font-bold">{userPoints.tierLevel}</span>
                    </div>
                    <p className="text-primary-foreground/80">Current Tier</p>
                    {userPoints.nextTierPoints > 0 && (
                      <div className="mt-2">
                        <Progress value={progressToNextTier} className="h-2 bg-white/20" />
                        <p className="text-sm text-primary-foreground/70 mt-1">
                          {userPoints.nextTierPoints} points to next tier
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Lifetime Earned */}
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Star className="h-8 w-8 mr-2" />
                      <span className="text-3xl font-bold">{userPoints.totalPoints}</span>
                    </div>
                    <p className="text-primary-foreground/80">Lifetime Earned</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tier Benefits */}
        <div className="container mx-auto px-4 py-8">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Your {userPoints.tierLevel} Benefits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {currentTier.benefits?.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Rewards Catalog */}
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All Rewards</TabsTrigger>
              <TabsTrigger value="global">Global Rewards</TabsTrigger>
              <TabsTrigger value="business">Business Rewards</TabsTrigger>
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
            <div className="text-center py-12">
              <Gift className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Rewards Available</h3>
              <p className="text-muted-foreground">
                Check back later for exciting rewards from our partner businesses!
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
    <Card className={`hover:shadow-lg transition-shadow ${!canAfford ? 'opacity-60' : ''}`}>
      {reward.image_url && (
        <div className="aspect-video overflow-hidden rounded-t-lg">
          <img 
            src={reward.image_url} 
            alt={reward.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg line-clamp-2">{reward.title}</CardTitle>
          <Badge variant={reward.is_global ? 'default' : 'secondary'} className="ml-2">
            {reward.is_global ? 'Global' : reward.business_name}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
          {reward.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="font-semibold">{reward.points_cost} points</span>
          </div>
          
          <Button
            onClick={onRedeem}
            disabled={!canAfford || isRedeeming}
            size="sm"
            className="shrink-0"
          >
            {isRedeeming ? (
              <>
                <LoadingSpinner />
                Redeeming...
              </>
            ) : canAfford ? (
              'Redeem'
            ) : (
              'Need More Points'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RewardsPage;