
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Award } from 'lucide-react';

interface LoyaltyPointsCardProps {
  points: number;
  target: number;
  saved: number;
}

const LoyaltyPointsCard = ({ points, target, saved }: LoyaltyPointsCardProps) => {
  const percentage = Math.min((points / target) * 100, 100);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Loyalty Points</CardTitle>
          <Award className="h-5 w-5 text-mansagold" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between mb-1">
          <div>
            <span className="text-3xl font-bold">{points}</span>
            <span className="text-sm text-gray-500"> / {target}</span>
          </div>
          <div className="text-sm text-mansagold font-medium">
            ${saved} saved
          </div>
        </div>
        
        <Progress value={percentage} className="h-2 mb-4" />
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-50 rounded-lg px-3 py-2 text-center">
            <div className="text-lg font-semibold">{points}</div>
            <div className="text-xs text-gray-500">Available Points</div>
          </div>
          <div className="bg-gray-50 rounded-lg px-3 py-2 text-center">
            <div className="text-lg font-semibold">{Math.round(points / 10)}</div>
            <div className="text-xs text-gray-500">Businesses Visited</div>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <Button variant="outline" size="sm" className="text-sm">
            Transfer Points
          </Button>
          <Button variant="outline" size="sm" className="text-sm">
            Redeem Points
          </Button>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <h4 className="text-sm font-medium mb-2">Rewards Progress</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-sm">Free Coffee</div>
              <div className="text-xs text-gray-500">50 points</div>
            </div>
            <Progress value={Math.min((points / 50) * 100, 100)} className="h-1" />
            
            <div className="flex items-center justify-between mt-1">
              <div className="text-sm">$10 Discount</div>
              <div className="text-xs text-gray-500">100 points</div>
            </div>
            <Progress value={Math.min((points / 100) * 100, 100)} className="h-1" />
            
            <div className="flex items-center justify-between mt-1">
              <div className="text-sm">VIP Status</div>
              <div className="text-xs text-gray-500">500 points</div>
            </div>
            <Progress value={Math.min((points / 500) * 100, 100)} className="h-1" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoyaltyPointsCard;
