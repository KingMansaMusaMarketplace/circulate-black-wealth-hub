import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Gift, Percent, ShoppingBag, Star, Sparkles } from 'lucide-react';
import { CoalitionReward } from '@/hooks/use-coalition';
import { formatDistanceToNow } from 'date-fns';

interface CoalitionRewardsGridProps {
  rewards: CoalitionReward[];
  userPoints: number;
  onRedeem: (rewardId: string) => Promise<any>;
}

const rewardTypeIcons = {
  discount: Percent,
  product: ShoppingBag,
  service: Star,
  experience: Sparkles,
};

export function CoalitionRewardsGrid({ rewards, userPoints, onRedeem }: CoalitionRewardsGridProps) {
  if (rewards.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Gift className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="font-medium mb-2">No Rewards Available</h3>
        <p className="text-sm text-muted-foreground">
          Check back soon for exciting coalition rewards!
        </p>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {rewards.map((reward) => {
        const Icon = rewardTypeIcons[reward.reward_type] || Gift;
        const canRedeem = userPoints >= reward.points_cost;
        const expiresAt = reward.expires_at 
          ? formatDistanceToNow(new Date(reward.expires_at), { addSuffix: true })
          : null;

        return (
          <Card key={reward.id} className="flex flex-col">
            <CardContent className="pt-6 flex-1">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <Badge variant={reward.valid_at_all_businesses ? "default" : "secondary"}>
                  {reward.valid_at_all_businesses ? 'All Businesses' : 'Select Locations'}
                </Badge>
              </div>

              <h3 className="font-semibold mb-1">{reward.title}</h3>
              {reward.description && (
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {reward.description}
                </p>
              )}

              {reward.discount_percentage && (
                <p className="text-2xl font-bold text-primary">
                  {reward.discount_percentage}% OFF
                </p>
              )}
              {reward.discount_amount && (
                <p className="text-2xl font-bold text-primary">
                  ${reward.discount_amount} OFF
                </p>
              )}

              {expiresAt && (
                <p className="text-xs text-muted-foreground mt-2">
                  Expires {expiresAt}
                </p>
              )}
            </CardContent>

            <CardFooter className="border-t pt-4">
              <div className="flex items-center justify-between w-full">
                <div>
                  <p className="text-lg font-bold">{reward.points_cost.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">points</p>
                </div>
                <Button 
                  onClick={() => onRedeem(reward.id)}
                  disabled={!canRedeem}
                  size="sm"
                >
                  {canRedeem ? 'Redeem' : 'Not Enough Points'}
                </Button>
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
