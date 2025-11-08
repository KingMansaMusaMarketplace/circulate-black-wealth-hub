import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BadgeWithProgress } from '@/types/badges';
import { getAgentBadgesWithProgress, checkAndAwardBadges } from '@/lib/api/badges-api';
import BadgeCard from './BadgeCard';
import { Trophy, Award } from 'lucide-react';
import { toast } from 'sonner';

interface BadgesShowcaseProps {
  agentId: string;
}

const BadgesShowcase: React.FC<BadgesShowcaseProps> = ({ agentId }) => {
  const [badges, setBadges] = useState<BadgeWithProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBadges();
  }, [agentId]);

  const loadBadges = async () => {
    try {
      setLoading(true);
      
      // Check and award any new badges
      await checkAndAwardBadges(agentId);
      
      // Fetch all badges with progress
      const data = await getAgentBadgesWithProgress(agentId);
      setBadges(data);
    } catch (error) {
      console.error('Error loading badges:', error);
      toast.error('Failed to load badges');
    } finally {
      setLoading(false);
    }
  };

  const earnedBadges = badges.filter(b => b.is_earned);
  const inProgressBadges = badges.filter(b => !b.is_earned && b.progress > 0);
  const lockedBadges = badges.filter(b => !b.is_earned && b.progress === 0);

  const totalPoints = earnedBadges.reduce((sum, badge) => sum + badge.points, 0);

  const getBadgesByCategory = (badgeList: BadgeWithProgress[]) => {
    return {
      referrals: badgeList.filter(b => b.category === 'referrals'),
      earnings: badgeList.filter(b => b.category === 'earnings'),
      recruitment: badgeList.filter(b => b.category === 'recruitment'),
      special: badgeList.filter(b => b.category === 'special')
    };
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">Loading badges...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Achievement Badges
            </CardTitle>
            <CardDescription>
              Track your progress and unlock achievements
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{totalPoints}</div>
            <div className="text-xs text-muted-foreground">Total Points</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="earned" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="earned">
              Earned ({earnedBadges.length})
            </TabsTrigger>
            <TabsTrigger value="progress">
              In Progress ({inProgressBadges.length})
            </TabsTrigger>
            <TabsTrigger value="locked">
              Locked ({lockedBadges.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="earned" className="space-y-6">
            {earnedBadges.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No badges earned yet. Keep working to unlock your first achievement!</p>
              </div>
            ) : (
              Object.entries(getBadgesByCategory(earnedBadges)).map(([category, categoryBadges]) => (
                categoryBadges.length > 0 && (
                  <div key={category}>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-3">
                      {category}
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      {categoryBadges.map(badge => (
                        <BadgeCard key={badge.id} badge={badge} />
                      ))}
                    </div>
                  </div>
                )
              ))
            )}
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            {inProgressBadges.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>No badges in progress. Start referring to unlock achievements!</p>
              </div>
            ) : (
              Object.entries(getBadgesByCategory(inProgressBadges)).map(([category, categoryBadges]) => (
                categoryBadges.length > 0 && (
                  <div key={category}>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-3">
                      {category}
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      {categoryBadges.map(badge => (
                        <BadgeCard key={badge.id} badge={badge} />
                      ))}
                    </div>
                  </div>
                )
              ))
            )}
          </TabsContent>

          <TabsContent value="locked" className="space-y-6">
            {Object.entries(getBadgesByCategory(lockedBadges)).map(([category, categoryBadges]) => (
              categoryBadges.length > 0 && (
                <div key={category}>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-3">
                    {category}
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {categoryBadges.map(badge => (
                      <BadgeCard key={badge.id} badge={badge} />
                    ))}
                  </div>
                </div>
              )
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default BadgesShowcase;
