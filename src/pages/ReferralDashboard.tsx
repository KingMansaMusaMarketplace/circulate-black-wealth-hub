import React from 'react';
import { useReferrals } from '@/hooks/use-referrals';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Users, 
  Gift, 
  Copy, 
  TrendingUp, 
  Award,
  DollarSign,
  Crown,
  Sparkles,
  CheckCircle2,
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
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl animate-float" />
          <div className="absolute top-40 right-20 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        </div>
        <div className="container mx-auto px-4 py-12 space-y-6 relative z-10">
          <Skeleton className="h-32 w-full rounded-3xl bg-white/10" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-48 rounded-3xl bg-white/10" />
            <Skeleton className="h-48 rounded-3xl bg-white/10" />
            <Skeleton className="h-48 rounded-3xl bg-white/10" />
          </div>
        </div>
      </div>
    );
  }

  const referralLink = getReferralLink();
  const progressToNextTier = nextTier 
    ? ((stats?.successful_referrals || 0) / nextTier.min_referrals) * 100
    : 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl animate-float" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-40 right-10 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '0.5s' }} />
      </div>

      <div className="container mx-auto px-4 py-12 space-y-8 relative z-10">
        {/* Enhanced Header */}
        <div className="mb-10 animate-fade-in">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl shadow-lg">
                <Gift className="h-10 w-10 text-slate-900" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Referral <span className="text-yellow-400">Rewards</span> Program 🎁
              </h1>
            </div>
            <p className="text-blue-200 text-xl font-medium ml-16">
              Earn rewards by inviting friends to join Mansa Musa Marketplace 🚀
            </p>
          </div>
        </div>

        {/* Referral Link Card */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="bg-blue-500/20 border-b border-white/10 p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                <Gift className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-white">Your Referral Link</span>
            </div>
            <p className="text-blue-200 text-sm mt-1 ml-11">Share this link with friends to earn rewards</p>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex gap-2">
              <div className="flex-1 bg-white/10 p-3 rounded-md font-mono text-sm break-all text-blue-200 border border-white/10">
                {referralLink}
              </div>
              <Button onClick={copyReferralLink} variant="outline" size="icon" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
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
              <Button variant="outline" className="flex-1 border-white/20 bg-white/5 text-white hover:bg-white/10">
                <ExternalLink className="w-4 h-4 mr-2" />
                Share via Email
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="backdrop-blur-xl bg-purple-500/20 border border-purple-400/30 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full shadow-md">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-purple-300 font-medium">Total Referrals</p>
                <p className="text-2xl font-bold text-white">{stats?.total_referrals || 0}</p>
              </div>
            </div>
          </div>

          <div className="backdrop-blur-xl bg-green-500/20 border border-green-400/30 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-full shadow-md">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-green-300 font-medium">Successful</p>
                <p className="text-2xl font-bold text-white">{stats?.successful_referrals || 0}</p>
              </div>
            </div>
          </div>

          <div className="backdrop-blur-xl bg-yellow-500/20 border border-yellow-400/30 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full shadow-md">
                <Sparkles className="w-6 h-6 text-slate-900" />
              </div>
              <div>
                <p className="text-sm text-yellow-300 font-medium">Points Earned</p>
                <p className="text-2xl font-bold text-white">{stats?.total_points_earned || 0}</p>
              </div>
            </div>
          </div>

          <div className="backdrop-blur-xl bg-emerald-500/20 border border-emerald-400/30 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full shadow-md">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-emerald-300 font-medium">Cash Earned</p>
                <p className="text-2xl font-bold text-white">${stats?.total_cash_earned || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Tier */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <div className="bg-yellow-500/20 border-b border-white/10 p-4">
                <div className="flex items-center gap-2">
                  <Crown className="w-5 h-5" style={{ color: currentTier?.tier_color || '#FFD700' }} />
                  <span className="font-bold text-white">Current Tier: {currentTier?.tier_name}</span>
                </div>
                <p className="text-blue-200 text-sm mt-1">
                  {nextTier 
                    ? `${nextTier.min_referrals - (stats?.successful_referrals || 0)} more referrals to reach ${nextTier.tier_name}`
                    : 'You\'ve reached the highest tier!'}
                </p>
              </div>
              <div className="p-6 space-y-4">
                {nextTier && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-blue-200">
                      <span>{stats?.successful_referrals || 0} / {nextTier.min_referrals} referrals</span>
                      <span>{Math.round(progressToNextTier)}%</span>
                    </div>
                    <Progress value={progressToNextTier} className="bg-white/10" />
                  </div>
                )}

                <div className="space-y-2">
                  <p className="text-sm font-medium text-yellow-400">Current Benefits:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Badge variant="secondary" className="bg-white/10 text-blue-200 border-white/20">
                      {currentTier?.points_per_referral} pts/referral
                    </Badge>
                    <Badge variant="secondary" className="bg-white/10 text-blue-200 border-white/20">
                      ${currentTier?.cash_bonus} bonus
                    </Badge>
                  </div>
                  <div className="space-y-1 mt-2">
                    {(currentTier?.special_perks as string[])?.map((perk, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-blue-200">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                        {perk}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* My Referrals */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <div className="bg-purple-500/20 border-b border-white/10 p-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-400" />
                  <span className="font-bold text-white">My Referrals ({myReferrals.length})</span>
                </div>
              </div>
              <div className="p-6">
                {myReferrals.length === 0 ? (
                  <p className="text-center text-blue-200 py-8">
                    No referrals yet. Start sharing your link!
                  </p>
                ) : (
                  <div className="space-y-3">
                    {myReferrals.map((referral) => (
                      <div key={referral.id} className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg">
                        <div>
                          <p className="font-medium text-white">
                            {referral.profiles?.full_name || referral.referred_email || 'Pending'}
                          </p>
                          <p className="text-sm text-blue-200">
                            {new Date(referral.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={referral.status === 'rewarded' ? 'default' : 'secondary'} className={referral.status === 'rewarded' ? 'bg-green-500/20 text-green-400 border-green-400/30' : 'bg-white/10 text-blue-200'}>
                          {referral.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Pending Rewards */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <div className="bg-green-500/20 border-b border-white/10 p-4">
                <div className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-green-400" />
                  <span className="font-bold text-white">Your Rewards</span>
                </div>
              </div>
              <div className="p-6">
                {rewards.filter(r => r.status === 'pending').length === 0 ? (
                  <p className="text-center text-blue-200 py-8">
                    No pending rewards
                  </p>
                ) : (
                  <div className="space-y-3">
                    {rewards
                      .filter(r => r.status === 'pending')
                      .map((reward) => (
                        <div key={reward.id} className="flex items-center justify-between p-4 bg-yellow-500/10 border border-yellow-400/30 rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium text-white">{reward.reward_description}</p>
                            <p className="text-2xl font-bold text-yellow-400">
                              {reward.reward_type === 'points' 
                                ? `${reward.reward_value} points`
                                : `$${reward.reward_value}`}
                            </p>
                            <p className="text-xs text-blue-200 mt-1">
                              Expires: {new Date(reward.expires_at).toLocaleDateString()}
                            </p>
                          </div>
                          <Button
                            onClick={() => claimReward(reward.id)}
                            disabled={claiming}
                            size="sm"
                            className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-slate-900 font-bold"
                          >
                            Claim
                          </Button>
                        </div>
                    ))}
                  </div>
                )}

                {rewards.filter(r => r.status === 'claimed').length > 0 && (
                  <>
                    <Separator className="my-4 bg-white/10" />
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-blue-200">Claimed Rewards</p>
                      {rewards
                        .filter(r => r.status === 'claimed')
                        .slice(0, 3)
                        .map((reward) => (
                          <div key={reward.id} className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/10">
                            <p className="text-sm text-blue-200">{reward.reward_description}</p>
                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                          </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Leaderboard */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <div className="bg-blue-500/20 border-b border-white/10 p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                  <span className="font-bold text-white">Top Referrers</span>
                </div>
                <p className="text-blue-200 text-sm mt-1">This month's leaders</p>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {leaderboard.map((entry, idx) => (
                    <div key={entry.id} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        idx === 0 ? 'bg-yellow-500/30 text-yellow-400' :
                        idx === 1 ? 'bg-gray-400/30 text-gray-300' :
                        idx === 2 ? 'bg-orange-500/30 text-orange-400' :
                        'bg-white/10 text-blue-200'
                      }`}>
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm text-white">
                          {entry.profiles?.full_name || 'Anonymous'}
                        </p>
                        <p className="text-xs text-blue-200">
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
              </div>
            </div>

            {/* All Tiers */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <div className="bg-yellow-500/20 border-b border-white/10 p-4">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-400" />
                  <span className="font-bold text-white">Reward Tiers</span>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {tiers.map((tier) => {
                    const isCurrentTier = tier.tier_name === currentTier?.tier_name;
                    return (
                      <div
                        key={tier.id}
                        className={`p-3 rounded-lg border ${
                          isCurrentTier
                            ? 'border-yellow-400/50 bg-yellow-500/10'
                            : 'border-white/10 bg-white/5'
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
                            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-400/30">Current</Badge>
                          )}
                        </div>
                        <p className="text-xs text-blue-200 mb-2">
                          {tier.min_referrals}+ referrals
                        </p>
                        <div className="flex gap-2 text-xs">
                          <Badge variant="secondary" className="bg-white/10 text-blue-200 border-white/20">{tier.points_per_referral} pts</Badge>
                          <Badge variant="secondary" className="bg-white/10 text-blue-200 border-white/20">${tier.cash_bonus}</Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralDashboard;
