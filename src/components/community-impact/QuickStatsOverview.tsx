
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, Building2, TrendingUp, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatCurrency } from './utils/formatters';

interface UserImpactMetrics {
  total_spending: number;
  businesses_supported: number;
  wealth_circulated: number;
  estimated_jobs_created: number;
}

interface QuickStatsOverviewProps {
  displayUserMetrics: UserImpactMetrics;
}

const QuickStatsOverview: React.FC<QuickStatsOverviewProps> = ({ displayUserMetrics }) => {
  const stats = [
    {
      title: "You've Spent",
      value: formatCurrency(displayUserMetrics.total_spending),
      icon: DollarSign,
      color: "green",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      borderColor: "border-l-green-500"
    },
    {
      title: "Businesses Helped",
      value: displayUserMetrics.businesses_supported.toString(),
      icon: Building2,
      color: "blue",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      borderColor: "border-l-blue-500"
    },
    {
      title: "Wealth Circulated",
      value: formatCurrency(displayUserMetrics.wealth_circulated),
      icon: TrendingUp,
      color: "purple",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      borderColor: "border-l-purple-500"
    },
    {
      title: "Jobs Supported",
      value: displayUserMetrics.estimated_jobs_created.toFixed(1),
      icon: Users,
      color: "orange",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
      borderColor: "border-l-orange-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className={`${stat.borderColor} border-l-4 hover:shadow-lg transition-shadow duration-200 bg-slate-800/50 backdrop-blur-sm border-white/10`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <p className="text-3xl font-bold text-white mb-2">{stat.value}</p>
                  <p className="text-sm font-medium text-blue-200">{stat.title}</p>
                </div>
                <div className={`p-3 rounded-full bg-${stat.color}-500/20`}>
                  <stat.icon className={`h-8 w-8 text-yellow-400`} />
                </div>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className={`bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full`} style={{width: '75%'}}></div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default QuickStatsOverview;
