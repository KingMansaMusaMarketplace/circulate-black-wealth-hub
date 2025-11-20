
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Gift, Star, ArrowRight } from 'lucide-react';
import { useLoyalty } from '@/hooks/use-loyalty';

export const MiniLoyaltyWidget: React.FC = () => {
  const { summary } = useLoyalty();

  return (
    <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2 text-white">
          <Gift className="h-5 w-5 text-yellow-400" />
          Loyalty Points
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-white">
            {summary.totalPoints}
          </div>
          <p className="text-sm text-white/80">Total Points</p>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-white/70">Level</span>
            <Badge className="bg-yellow-400/20 text-yellow-300 border border-yellow-400/40">
              <Star className="h-3 w-3 mr-1" />
              Bronze
            </Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-white/70">Available Rewards</span>
            <span className="text-sm font-medium text-white">3</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <Link to="/loyalty" className="block">
            <Button className="w-full" size="sm">
              View All Rewards
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          
          <Link to="/scanner" className="block">
            <Button variant="outline" className="w-full border-white/30 text-white hover:bg-white/10" size="sm">
              Scan to Earn Points
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
