
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Target } from 'lucide-react';
import { motion } from 'framer-motion';

interface UserImpactMetrics {
  total_spending: number;
  businesses_supported: number;
  estimated_jobs_created: number;
  wealth_circulated: number;
}

interface ImpactGoalsProps {
  userMetrics: UserImpactMetrics | null;
  formatCurrency: (amount: number) => string;
}

const ImpactGoals: React.FC<ImpactGoalsProps> = ({ userMetrics, formatCurrency }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
    >
      <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Target className="h-5 w-5 mr-2 text-yellow-400" />
            Your Impact Goals
          </CardTitle>
          <CardDescription className="text-blue-200">
            Milestones to increase your community impact
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border border-white/10 rounded-lg bg-slate-800/30">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-white">Support 10 Different Businesses</span>
                <Badge variant={userMetrics?.businesses_supported >= 10 ? "default" : "secondary"} className="bg-yellow-400 text-slate-900">
                  {userMetrics?.businesses_supported || 0}/10
                </Badge>
              </div>
              <Progress 
                value={Math.min(((userMetrics?.businesses_supported || 0) / 10) * 100, 100)} 
                className="h-2"
              />
            </div>

            <div className="p-4 border border-white/10 rounded-lg bg-slate-800/30">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-white">Create 1 Full-Time Job Equivalent</span>
                <Badge variant={userMetrics?.estimated_jobs_created >= 1 ? "default" : "secondary"} className="bg-yellow-400 text-slate-900">
                  {userMetrics?.estimated_jobs_created?.toFixed(1) || '0.0'}/1.0
                </Badge>
              </div>
              <Progress 
                value={Math.min(((userMetrics?.estimated_jobs_created || 0) / 1) * 100, 100)} 
                className="h-2"
              />
              <div className="text-xs text-blue-300 mt-1">
                Spend {formatCurrency(10000 - (userMetrics?.total_spending || 0))} more to reach this goal
              </div>
            </div>

            <div className="p-4 border border-white/10 rounded-lg bg-slate-800/30">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-white">Circulate $25K in Community Wealth</span>
                <Badge variant={userMetrics?.wealth_circulated >= 25000 ? "default" : "secondary"} className="bg-yellow-400 text-slate-900">
                  {formatCurrency(userMetrics?.wealth_circulated || 0)}/25K
                </Badge>
              </div>
              <Progress 
                value={Math.min(((userMetrics?.wealth_circulated || 0) / 25000) * 100, 100)} 
                className="h-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ImpactGoals;
