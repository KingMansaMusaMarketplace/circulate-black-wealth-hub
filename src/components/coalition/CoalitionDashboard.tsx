import { useCoalition } from '@/hooks/use-coalition';
import { TierProgressCard } from './TierProgressCard';
import { CoalitionPointsCard } from './CoalitionPointsCard';
import { CoalitionRewardsGrid } from './CoalitionRewardsGrid';
import { CoalitionTransactionsList } from './CoalitionTransactionsList';
import { CoalitionMembersGrid } from './CoalitionMembersGrid';
import { CoalitionStatsCard } from './CoalitionStatsCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';

export function CoalitionDashboard() {
  const { 
    points, 
    transactions, 
    rewards, 
    members, 
    stats,
    loading, 
    redeemReward,
    getTierInfo,
    getProgressToNextTier,
  } = useCoalition();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[hsl(45,93%,58%)]" />
      </div>
    );
  }

  const tierInfo = points ? getTierInfo(points.tier) : getTierInfo('bronze');
  const progress = getProgressToNextTier();

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <CoalitionPointsCard 
          points={points?.points || 0}
          lifetimePoints={points?.lifetime_earned || 0}
          tier={points?.tier || 'bronze'}
          tierInfo={tierInfo}
        />
        <TierProgressCard 
          currentTier={points?.tier || 'bronze'}
          progress={progress.progress}
          pointsNeeded={progress.pointsNeeded}
          tierInfo={tierInfo}
        />
      </div>

      {/* Stats Overview */}
      {stats && <CoalitionStatsCard stats={stats} />}

      {/* Main Content Tabs */}
      <Tabs defaultValue="rewards" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 bg-white/10 border border-white/20">
          <TabsTrigger 
            value="rewards" 
            className="data-[state=active]:bg-[hsl(45,93%,47%)] data-[state=active]:text-[hsl(222,47%,11%)] text-white/70"
          >
            Rewards
          </TabsTrigger>
          <TabsTrigger 
            value="history"
            className="data-[state=active]:bg-[hsl(45,93%,47%)] data-[state=active]:text-[hsl(222,47%,11%)] text-white/70"
          >
            History
          </TabsTrigger>
          <TabsTrigger 
            value="businesses"
            className="data-[state=active]:bg-[hsl(45,93%,47%)] data-[state=active]:text-[hsl(222,47%,11%)] text-white/70"
          >
            Businesses
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rewards" className="space-y-4">
          <CoalitionRewardsGrid 
            rewards={rewards} 
            userPoints={points?.points || 0}
            onRedeem={redeemReward}
          />
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <CoalitionTransactionsList transactions={transactions} />
        </TabsContent>

        <TabsContent value="businesses" className="space-y-4">
          <CoalitionMembersGrid members={members} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
