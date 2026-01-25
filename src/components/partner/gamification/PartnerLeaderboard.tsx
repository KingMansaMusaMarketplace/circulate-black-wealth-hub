import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Medal, Award, Crown, TrendingUp } from 'lucide-react';

interface LeaderboardEntry {
  id: string;
  directory_name: string;
  logo_url: string | null;
  commission_tier: string;
  total_referrals: number;
  total_earnings: number;
  conversion_rate: number;
  earnings_rank: number;
}

interface PartnerLeaderboardProps {
  entries: LeaderboardEntry[];
  currentPartnerId?: string;
}

const PartnerLeaderboard: React.FC<PartnerLeaderboardProps> = ({ entries, currentPartnerId }) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-400" />;
      case 2:
        return <Medal className="h-5 w-5 text-slate-300" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-slate-500 font-medium">#{rank}</span>;
    }
  };

  const getTierBadge = (tier: string) => {
    const tierConfig: Record<string, { color: string; label: string }> = {
      platinum: { color: 'bg-purple-500', label: 'Platinum' },
      gold: { color: 'bg-yellow-500', label: 'Gold' },
      silver: { color: 'bg-slate-400', label: 'Silver' },
      bronze: { color: 'bg-amber-700', label: 'Bronze' },
    };
    const config = tierConfig[tier] || tierConfig.bronze;
    return (
      <Badge className={`${config.color} text-white text-xs`}>
        {config.label}
      </Badge>
    );
  };

  return (
    <Card className="bg-slate-800/60 backdrop-blur-xl border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-400" />
          Partner Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <Trophy className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No leaderboard data yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => {
              const isCurrentUser = entry.id === currentPartnerId;
              return (
                <div 
                  key={entry.id}
                  className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
                    isCurrentUser 
                      ? 'bg-amber-500/20 border border-amber-500/40' 
                      : 'bg-slate-900/40 border border-slate-700/30 hover:bg-slate-800/60'
                  }`}
                >
                  {/* Rank */}
                  <div className="w-8 flex justify-center">
                    {getRankIcon(entry.earnings_rank)}
                  </div>
                  
                  {/* Avatar & Name */}
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={entry.logo_url || undefined} />
                    <AvatarFallback className="bg-slate-700 text-slate-300">
                      {entry.directory_name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium truncate ${isCurrentUser ? 'text-amber-400' : 'text-white'}`}>
                        {entry.directory_name}
                        {isCurrentUser && <span className="text-xs ml-1">(You)</span>}
                      </span>
                      {getTierBadge(entry.commission_tier)}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>{entry.total_referrals} referrals</span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {entry.conversion_rate}% conv
                      </span>
                    </div>
                  </div>
                  
                  {/* Earnings */}
                  <div className="text-right">
                    <div className="text-lg font-bold text-emerald-400">
                      ${entry.total_earnings.toLocaleString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PartnerLeaderboard;
