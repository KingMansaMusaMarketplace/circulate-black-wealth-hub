
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface UserImpactMetrics {
  total_spending: number;
  wealth_circulated: number;
  circulation_multiplier: number;
}

interface MultiplierEffectCardProps {
  userMetrics: UserImpactMetrics | null;
  formatCurrency: (amount: number) => string;
  onShareImpact: () => void;
}

const MultiplierEffectCard: React.FC<MultiplierEffectCardProps> = ({
  userMetrics,
  formatCurrency,
  onShareImpact
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">The Multiplier Effect</CardTitle>
              <CardDescription className="text-blue-100">
                How your spending creates exponential community impact
              </CardDescription>
            </div>
            <Button 
              onClick={onShareImpact}
              variant="outline" 
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share Impact
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-blue-100 mb-2">
                When you spend {formatCurrency(userMetrics?.total_spending || 0)} at Black-owned businesses:
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Direct spending:</span>
                  <span className="font-bold">{formatCurrency(userMetrics?.total_spending || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Community circulation:</span>
                  <span className="font-bold text-yellow-300">
                    {formatCurrency(userMetrics?.wealth_circulated || 0)}
                  </span>
                </div>
                <div className="text-xs text-blue-200 mt-2">
                  Black-owned businesses recirculate 67% more money in the community compared to non-Black businesses
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-300 mb-1">
                  {userMetrics?.circulation_multiplier}x
                </div>
                <div className="text-sm text-blue-100">
                  Economic Impact Multiplier
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MultiplierEffectCard;
