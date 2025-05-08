
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Award, Sparkles, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LoyaltyPointsCardProps {
  points: number;
  target: number;
  saved: number;
}

const LoyaltyPointsCard = ({ points, target, saved }: LoyaltyPointsCardProps) => {
  const percentage = Math.min((points / target) * 100, 100);
  
  // Animate the points count with a simple effect
  const [displayPoints, setDisplayPoints] = React.useState(0);
  
  React.useEffect(() => {
    // Animate points counting up
    const duration = 1000; // 1 second animation
    const interval = 20; // Update every 20ms
    const steps = duration / interval;
    const increment = points / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= points) {
        setDisplayPoints(points);
        clearInterval(timer);
      } else {
        setDisplayPoints(Math.floor(current));
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, [points]);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3 bg-gradient-to-r from-mansablue to-blue-600 text-white">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Loyalty Points</CardTitle>
          <Award className="h-6 w-6 text-mansagold" />
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold transition-all duration-500">{displayPoints}</span>
            <span className="text-sm text-gray-500"> / {target}</span>
          </div>
          <div className="text-sm text-green-600 font-medium flex items-center">
            <TrendingUp size={14} className="mr-1" />${saved} saved
          </div>
        </div>
        
        <Progress value={percentage} className="h-2.5 mb-4 bg-gray-100">
          <div className="absolute inset-0 flex items-center justify-end px-2">
            {percentage >= 30 && (
              <div 
                className="h-5 w-5 rounded-full bg-white shadow flex items-center justify-center -mr-2.5 transform translate-y-[-50%] z-10" 
                style={{ right: `${100-percentage}%` }}
              >
                <Sparkles size={10} className="text-amber-500" />
              </div>
            )}
          </div>
        </Progress>
        
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-gray-50 rounded-lg px-3 py-2 text-center">
            <div className="text-lg font-semibold">{points}</div>
            <div className="text-xs text-gray-500">Available Points</div>
          </div>
          <div className="bg-gray-50 rounded-lg px-3 py-2 text-center">
            <div className="text-lg font-semibold">{Math.round(points / 10)}</div>
            <div className="text-xs text-gray-500">Businesses Visited</div>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-5">
          <Button variant="outline" size="sm" className="text-sm" asChild>
            <Link to="/scan">Scan for Points</Link>
          </Button>
          <Button variant="outline" size="sm" className="text-sm">
            Redeem Points
          </Button>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <h4 className="text-sm font-medium mb-2">Rewards Progress</h4>
          <div className="space-y-3">
            <RewardProgressItem name="Free Coffee" points={50} currentPoints={points} />
            <RewardProgressItem name="$10 Discount" points={100} currentPoints={points} />
            <RewardProgressItem name="VIP Status" points={500} currentPoints={points} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface RewardProgressItemProps {
  name: string;
  points: number;
  currentPoints: number;
}

const RewardProgressItem = ({ name, points, currentPoints }: RewardProgressItemProps) => {
  const progress = Math.min((currentPoints / points) * 100, 100);
  const isComplete = currentPoints >= points;
  
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <div className="text-sm flex items-center">
          {isComplete && <Award size={14} className="text-green-500 mr-1" />}
          {name}
        </div>
        <div className="text-xs text-gray-500">{points} points</div>
      </div>
      <div className="relative">
        <Progress value={progress} className="h-1.5" />
        {isComplete && (
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 -translate-x-1 h-3 w-3 bg-green-500 rounded-full flex items-center justify-center">
            <div className="h-1.5 w-1.5 bg-white rounded-full"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoyaltyPointsCard;
