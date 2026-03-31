import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Trophy, RefreshCw, DollarSign, Users, Handshake, Star, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useBusinessImpactScore, TIER_CONFIG } from '@/hooks/useBusinessImpactScore';

interface BusinessImpactScorecardProps {
  businessId: string;
  businessName?: string;
  compact?: boolean;
  showRecalculate?: boolean;
}

const DIMENSIONS = [
  { key: 'wealth_circulation_score', label: 'Wealth Circulation', icon: DollarSign, color: 'text-green-400' },
  { key: 'jobs_supported_score', label: 'Jobs Supported', icon: Users, color: 'text-blue-400' },
  { key: 'community_engagement_score', label: 'Community Engagement', icon: Zap, color: 'text-purple-400' },
  { key: 'b2b_connections_score', label: 'B2B Connections', icon: Handshake, color: 'text-cyan-400' },
  { key: 'reviews_reputation_score', label: 'Reviews & Reputation', icon: Star, color: 'text-yellow-400' },
] as const;

const BusinessImpactScorecard: React.FC<BusinessImpactScorecardProps> = ({
  businessId,
  businessName,
  compact = false,
  showRecalculate = false,
}) => {
  const { scorecard, loading, recalculate } = useBusinessImpactScore(businessId);

  if (loading) {
    return (
      <Card className="animate-pulse bg-slate-900/40 border-white/10">
        <CardContent className="p-4">
          <div className="h-20 bg-slate-700 rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  const score = scorecard?.overall_score ?? 0;
  const tier = TIER_CONFIG[scorecard?.tier ?? 'seed'];
  const scorePercent = Math.min((score / 1000) * 100, 100);

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10 overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${tier.color} flex items-center justify-center text-sm`}>
                  {tier.emoji}
                </div>
                <div>
                  <p className="text-xs text-blue-300">Community Impact</p>
                  <p className="text-lg font-bold text-white">{score}<span className="text-xs text-blue-400">/1000</span></p>
                </div>
              </div>
              <Badge className={`bg-gradient-to-r ${tier.color} text-white border-0 text-xs`}>
                {tier.label}
              </Badge>
            </div>
            <Progress value={scorePercent} className="h-1.5" />
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10 overflow-hidden">
        {/* Tier gradient header */}
        <div className={`h-1.5 bg-gradient-to-r ${tier.color}`} />
        
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-white text-base">
              <Trophy className="h-5 w-5 text-yellow-400" />
              Community Impact Scorecard
            </CardTitle>
            {showRecalculate && (
              <Button
                variant="ghost"
                size="sm"
                onClick={recalculate}
                className="text-blue-300 hover:text-white"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Refresh
              </Button>
            )}
          </div>
          {businessName && (
            <p className="text-sm text-blue-300">{businessName}</p>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Score ring */}
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 flex-shrink-0">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
                <circle
                  cx="40" cy="40" r="34" fill="none"
                  stroke="url(#scoreGradient)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${scorePercent * 2.136} 213.6`}
                />
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#facc15" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-white">{score}</span>
                <span className="text-[10px] text-blue-400">/ 1000</span>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{tier.emoji}</span>
                <Badge className={`bg-gradient-to-r ${tier.color} text-white border-0`}>
                  {tier.label} Tier
                </Badge>
              </div>
              <p className="text-xs text-blue-300">
                {score < 50 ? 'Start supporting your community to grow your score!' :
                 score < 200 ? 'Your impact is growing — keep building!' :
                 score < 400 ? 'Solid contributor to community wealth.' :
                 score < 600 ? 'Top-tier community economic leader!' :
                 score < 800 ? 'Elite impact — you\'re building generational wealth.' :
                 'Diamond impact — legendary community builder! 💎'}
              </p>
            </div>
          </div>

          {/* Dimension breakdown */}
          <div className="space-y-2">
            {DIMENSIONS.map(({ key, label, icon: Icon, color }) => {
              const dimScore = (scorecard as any)?.[key] ?? 0;
              return (
                <div key={key} className="flex items-center gap-2">
                  <Icon className={`h-3.5 w-3.5 ${color} flex-shrink-0`} />
                  <span className="text-xs text-blue-200 w-32 flex-shrink-0">{label}</span>
                  <div className="flex-1">
                    <Progress value={(dimScore / 200) * 100} className="h-1.5" />
                  </div>
                  <span className="text-xs text-white w-10 text-right font-mono">{dimScore}</span>
                </div>
              );
            })}
          </div>

          {/* Key stats */}
          {scorecard && (
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10">
              <div className="text-center">
                <p className="text-sm font-bold text-white">${Math.round(scorecard.total_revenue_circulated).toLocaleString()}</p>
                <p className="text-[10px] text-blue-400">Circulated</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-white">{scorecard.jobs_created_equivalent?.toFixed(1)}</p>
                <p className="text-[10px] text-blue-400">Jobs Created</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-white">{scorecard.total_reviews}</p>
                <p className="text-[10px] text-blue-400">Reviews</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BusinessImpactScorecard;
