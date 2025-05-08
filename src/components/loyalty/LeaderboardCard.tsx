
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Award, Trophy, Medal, UserRound, Share2 } from 'lucide-react';
import { useLoyaltyLeaderboard, LeaderboardUser } from '@/hooks/use-loyalty-leaderboard';
import { Skeleton } from '@/components/ui/skeleton';
import { SocialShareDialog } from './SocialShareDialog';
import { Button } from '@/components/ui/button';

interface LeaderboardCardProps {
  limit?: number;
}

const LeaderboardCard: React.FC<LeaderboardCardProps> = ({ limit = 10 }) => {
  const { leaderboard, loading, userRank, error } = useLoyaltyLeaderboard(limit);
  
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-700" />;
      default:
        return <span className="font-medium text-gray-600">{rank}</span>;
    }
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  
  const shareTitle = "Check out my rank on the Mansa Musa Loyalty Leaderboard!";
  const shareText = userRank 
    ? `I'm ranked #${userRank} on the Mansa Musa Loyalty Leaderboard with ${leaderboard.find(u => u.isCurrentUser)?.totalPoints || 0} points. Join me in supporting Black-owned businesses!` 
    : "Join me on Mansa Musa, the app that rewards you for supporting Black-owned businesses!";

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-lg font-semibold">
            <Award className="h-5 w-5 mr-2 text-mansagold" />
            Loyalty Leaderboard
          </CardTitle>
          <div className="flex items-center gap-2">
            {userRank && (
              <Badge variant="outline" className="bg-mansablue/10 text-mansablue">
                Your Rank: #{userRank}
              </Badge>
            )}
            <SocialShareDialog
              title={shareTitle}
              text={shareText}
              customPath="/loyalty"
              triggerContent={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  title="Share leaderboard"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              }
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="text-center py-8 text-red-500">
            <p>Failed to load leaderboard data</p>
          </div>
        ) : loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-28" />
                </div>
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </div>
        ) : leaderboard.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Rank</TableHead>
                <TableHead>User</TableHead>
                <TableHead className="text-right">Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboard.map((user) => (
                <TableRow 
                  key={user.id} 
                  className={user.isCurrentUser ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                >
                  <TableCell className="font-medium">
                    {getRankIcon(user.rank)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        {user.avatarUrl ? (
                          <AvatarImage src={user.avatarUrl} alt={user.username} />
                        ) : (
                          <AvatarFallback className={user.isCurrentUser ? "bg-mansablue text-white" : ""}>
                            {getInitials(user.username)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <span className={user.isCurrentUser ? "font-medium" : ""}>
                        {user.username}
                        {user.isCurrentUser && (
                          <span className="ml-2 text-xs text-blue-600">(You)</span>
                        )}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {user.totalPoints.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <UserRound className="mx-auto h-12 w-12 text-gray-300 mb-2" />
            <h3 className="text-lg font-medium">No Leaderboard Data</h3>
            <p className="text-sm mt-1">
              Start earning points to see how you rank!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LeaderboardCard;
