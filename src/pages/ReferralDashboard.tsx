import React from 'react';
import { useReferrals } from '@/hooks/use-referrals';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Users, 
  Gift, 
  Copy, 
  Share2, 
  TrendingUp, 
  Award,
  DollarSign,
  Crown,
  Sparkles,
  CheckCircle2,
  Clock,
  ExternalLink
} from 'lucide-react';
import { ShareButton } from '@/components/social-share/ShareButton';
import { Skeleton } from '@/components/ui/skeleton';

const ReferralDashboard: React.FC = () => {
  const {
    referralCode,
    stats,
    myReferrals,
    rewards,
    tiers,
    leaderboard,
    currentTier,
    nextTier,
    isLoading,
    getReferralLink,
    copyReferralLink,
    claimReward,
    claiming,
  } = useReferrals();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  const referralLink = getReferralLink();
  const progressToNextTier = nextTier 
    ? ((stats?.successful_referrals || 0) / nextTier.min_referrals) * 100
    : 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Referral Rewards Program
          </h1>
          <p className="text-muted-foreground text-lg">
            Earn rewards by inviting friends to join Mansa Musa Marketplace
          </p>
        </div>

        {/* Referral Link Card */}
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-primary" />
              Your Referral Link
            </CardTitle>
            <CardDescription>
              Share this link with friends to earn rewards
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1 bg-muted p-3 rounded-md font-mono text-sm break-all">
                {referralLink}
              </div>
              <Button onClick={copyReferralLink} variant="outline" size="icon">
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              <ShareButton
                data={{
                  title: 'Join Mansa Musa Marketplace!',
                  text: 'Join me on Mansa Musa Marketplace and support Black-owned businesses while earning rewards!',
                  url: referralLink,
                }}
                variant="default"
                showLabel
              />
              <Button variant="outline" className="flex-1">
                <ExternalLink className="w-4 h-4 mr-2" />
                Share via Email
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Referrals</p>
                  <p className="text-2xl font-bold">{stats?.total_referrals || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Successful</p>
                  <p className="text-2xl font-bold">{stats?.successful_referrals || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 rounded-full">
                  <Sparkles className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Points Earned</p>
                  <p className="text-2xl font-bold">{stats?.total_points_earned || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cash Earned</p>
                  <p className="text-2xl font-bold">${stats?.total_cash_earned || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Tier */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5" style={{ color: currentTier?.tier_color }} />
                  Current Tier: {currentTier?.tier_name}
                </CardTitle>
                <CardDescription>
                  {nextTier 
                    ? `${nextTier.min_referrals - (stats?.successful_referrals || 0)} more referrals to reach ${nextTier.tier_name}`
                    : 'You\'ve reached the highest tier!'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {nextTier && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{stats?.successful_referrals || 0} / {nextTier.min_referrals} referrals</span>
                      <span>{Math.round(progressToNextTier)}%</span>
                    </div>
                    <Progress value={progressToNextTier} />
                  </div>
                )}

                <div className="space-y-2">
                  <p className="text-sm font-medium">Current Benefits:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Badge variant="secondary">
                      {currentTier?.points_per_referral} pts/referral
                    </Badge>
                    <Badge variant="secondary">
                      ${currentTier?.cash_bonus} bonus
                    </Badge>
                  </div>
                  <div className="space-y-1 mt-2">
                    {(currentTier?.special_perks as string[])?.map((perk, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        {perk}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* My Referrals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  My Referrals ({myReferrals.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {myReferrals.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No referrals yet. Start sharing your link!
                  </p>
                ) : (
                  <div className="space-y-3">
                    {myReferrals.map((referral) => (
                      <div key={referral.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <p className="font-medium">
                            {referral.profiles?.full_name || referral.referred_email || 'Pending'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(referral.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={referral.status === 'rewarded' ? 'default' : 'secondary'}>
                          {referral.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pending Rewards */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-primary" />
                  Your Rewards
                </CardTitle>
              </CardHeader>
              <CardContent>
                {rewards.filter(r => r.status === 'pending').length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No pending rewards
                  </p>
                ) : (
                  <div className="space-y-3">
                    {rewards
                      .filter(r => r.status === 'pending')
                      .map((reward) => (
                        <div key={reward.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/5 to-transparent rounded-lg border border-primary/20">
                          <div className="flex-1">
                            <p className="font-medium">{reward.reward_description}</p>
                            <p className="text-2xl font-bold text-primary">
                              {reward.reward_type === 'points' 
                                ? `${reward.reward_value} points`
                                : `$${reward.reward_value}`}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Expires: {new Date(reward.expires_at).toLocaleDateString()}
                            </p>
                          </div>
                          <Button
                            onClick={() => claimReward(reward.id)}
                            disabled={claiming}
                            size="sm"
                          >
                            Claim
                          </Button>
                        </div>
                    ))}
                  </div>
                )}

                {rewards.filter(r => r.status === 'claimed').length > 0 && (
                  <>
                    <Separator className="my-4" />
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Claimed Rewards</p>
                      {rewards
                        .filter(r => r.status === 'claimed')
                        .slice(0, 3)
                        .map((reward) => (
                          <div key={reward.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                            <p className="text-sm">{reward.reward_description}</p>
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Leaderboard */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Top Referrers
                </CardTitle>
                <CardDescription>This month's leaders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaderboard.map((entry, idx) => (
                    <div key={entry.id} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        idx === 0 ? 'bg-yellow-100 text-yellow-700' :
                        idx === 1 ? 'bg-gray-100 text-gray-700' :
                        idx === 2 ? 'bg-orange-100 text-orange-700' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {entry.profiles?.full_name || 'Anonymous'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {entry.successful_referrals} referrals
                        </p>
                      </div>
                      {idx < 3 && (
                        <Award className="w-5 h-5" style={{
                          color: idx === 0 ? '#FFD700' : idx === 1 ? '#C0C0C0' : '#CD7F32'
                        }} />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* All Tiers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Reward Tiers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tiers.map((tier) => {
                    const isCurrentTier = tier.tier_name === currentTier?.tier_name;
                    return (
                      <div
                        key={tier.id}
                        className={`p-3 rounded-lg border ${
                          isCurrentTier
                            ? 'border-primary bg-primary/5'
                            : 'border-border'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{tier.tier_icon}</span>
                            <span className="font-bold" style={{ color: tier.tier_color }}>
                              {tier.tier_name}
                            </span>
                          </div>
                          {isCurrentTier && (
                            <Badge>Current</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          {tier.min_referrals}+ referrals
                        </p>
                        <div className="flex gap-2 text-xs">
                          <Badge variant="secondary">{tier.points_per_referral} pts</Badge>
                          <Badge variant="secondary">${tier.cash_bonus}</Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralDashboard;
