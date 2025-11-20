
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Building2, Zap, Users, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

interface UserImpactMetrics {
  total_spending: number;
  businesses_supported: number;
  wealth_circulated: number;
  circulation_multiplier: number;
  estimated_jobs_created: number;
}

interface PersonalImpactCardsProps {
  userMetrics: UserImpactMetrics | null;
  formatCurrency: (amount: number) => string;
  formatNumber: (num: number) => string;
}

const PersonalImpactCards: React.FC<PersonalImpactCardsProps> = ({
  userMetrics,
  formatCurrency,
  formatNumber
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-l-4 border-l-green-500 bg-slate-800/50 backdrop-blur-sm border-white/10">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-blue-200">Total Spending</CardTitle>
              <DollarSign className="h-4 w-4 text-yellow-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white mb-2">
              {formatCurrency(userMetrics?.total_spending || 0)}
            </div>
            <div className="flex items-center text-sm text-yellow-400">
              <Heart className="h-3 w-3 mr-1" />
              <span>Supporting community wealth</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-l-4 border-l-blue-500 bg-slate-800/50 backdrop-blur-sm border-white/10">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-blue-200">Businesses Supported</CardTitle>
              <Building2 className="h-4 w-4 text-yellow-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white mb-2">
              {formatNumber(userMetrics?.businesses_supported || 0)}
            </div>
            <div className="text-sm text-blue-300">
              Unique businesses helped
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-l-4 border-l-purple-500 bg-slate-800/50 backdrop-blur-sm border-white/10">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-blue-200">Wealth Circulated</CardTitle>
              <Zap className="h-4 w-4 text-yellow-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white mb-2">
              {formatCurrency(userMetrics?.wealth_circulated || 0)}
            </div>
            <div className="text-sm text-purple-300">
              {userMetrics?.circulation_multiplier}x multiplier effect
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="border-l-4 border-l-orange-500 bg-slate-800/50 backdrop-blur-sm border-white/10">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-blue-200">Jobs Supported</CardTitle>
              <Users className="h-4 w-4 text-yellow-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white mb-2">
              {userMetrics?.estimated_jobs_created?.toFixed(1) || '0.0'}
            </div>
            <div className="text-sm text-orange-300">
              Estimated job equivalents
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default PersonalImpactCards;
