import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BadgeWithProgress } from '@/types/badges';
import { getBadgeTierColor } from '@/lib/api/badges-api';
import * as Icons from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface BadgeCardProps {
  badge: BadgeWithProgress;
}

const BadgeCard: React.FC<BadgeCardProps> = ({ badge }) => {
  const IconComponent = (Icons[badge.icon_name as keyof typeof Icons] as LucideIcon) || Icons.Award;
  const tierColor = getBadgeTierColor(badge.tier);

  return (
    <Card className={`relative ${badge.is_earned ? 'border-2 shadow-md' : 'opacity-60'}`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-full ${tierColor}`}>
            <IconComponent className="h-6 w-6" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-foreground">{badge.name}</h3>
              <Badge variant={badge.is_earned ? 'default' : 'outline'} className={tierColor}>
                {badge.tier}
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground mb-3">{badge.description}</p>
            
            {badge.is_earned ? (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <Icons.Check className="h-4 w-4" />
                <span>Earned {badge.earned_at ? formatDistanceToNow(new Date(badge.earned_at), { addSuffix: true }) : ''}</span>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium text-foreground">
                    {badge.progress} / {badge.threshold_value}
                  </span>
                </div>
                <Progress value={badge.progress_percentage} className="h-2" />
              </div>
            )}
            
            <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
              <Icons.Star className="h-3 w-3" />
              <span>{badge.points} points</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BadgeCard;
