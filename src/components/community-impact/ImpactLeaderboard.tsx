import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Medal, Crown } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useImpactLeaderboard, TIER_CONFIG } from '@/hooks/useBusinessImpactScore';

const RANK_ICONS = [Crown, Trophy, Medal];
const RANK_COLORS = ['text-yellow-400', 'text-blue-300', 'text-amber-600'];

const ImpactLeaderboard: React.FC = () => {
  const { leaderboard, loading } = useImpactLeaderboard(10);

  if (loading) {
    return (
      <Card className="animate-pulse bg-slate-900/40 border-white/10">
        <CardContent className="p-6">
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-slate-700 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Trophy className="h-5 w-5 text-yellow-400" />
            Impact Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-blue-300 text-sm text-center py-6">
            Leaderboard will populate as businesses build their impact scores. Be the first! 🚀
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-white text-lg">
            <Trophy className="h-5 w-5 text-yellow-400" />
            Impact Leaderboard
          </CardTitle>
          <p className="text-sm text-blue-300">Top businesses building community wealth</p>
        </CardHeader>
        <CardContent className="space-y-2">
          {leaderboard.map((entry, idx) => {
            const tier = TIER_CONFIG[entry.tier ?? 'seed'];
            const RankIcon = idx < 3 ? RANK_ICONS[idx] : null;
            const rankColor = idx < 3 ? RANK_COLORS[idx] : 'text-blue-400';

            return (
              <motion.div
                key={entry.business_id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link
                  to={`/business/${entry.business_id}`}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/5 transition-colors group"
                >
                  {/* Rank */}
                  <div className={`w-7 text-center font-bold text-sm ${rankColor}`}>
                    {RankIcon ? <RankIcon className="h-5 w-5 mx-auto" /> : `#${idx + 1}`}
                  </div>

                  {/* Avatar */}
                  <Avatar className="h-8 w-8 border border-white/10">
                    <AvatarImage src={entry.logo_url || undefined} />
                    <AvatarFallback className="bg-slate-700 text-white text-xs">
                      {entry.business_name?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate group-hover:text-yellow-300 transition-colors">
                      {entry.business_name}
                    </p>
                    <p className="text-xs text-blue-400 truncate">
                      {entry.city}{entry.city && entry.state ? ', ' : ''}{entry.state}
                      {entry.category && ` · ${entry.category}`}
                    </p>
                  </div>

                  {/* Score + Tier */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-sm font-bold text-white">{entry.overall_score}</span>
                    <Badge className={`bg-gradient-to-r ${tier.color} text-white border-0 text-[10px] px-1.5`}>
                      {tier.emoji}
                    </Badge>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ImpactLeaderboard;
