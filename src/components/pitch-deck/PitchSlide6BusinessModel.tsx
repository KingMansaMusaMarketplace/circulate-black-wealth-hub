import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { 
  Building2, 
  Users, 
  DollarSign, 
  Target,
  Megaphone,
  UserPlus
} from 'lucide-react';

const PitchSlide6BusinessModel: React.FC = () => {
  const revenueStreams = [
    {
      icon: Building2,
      name: 'Business Subscriptions',
      description: 'Tiered SaaS model (Basic $0, Premium $29/mo, Enterprise custom)',
      revenue: '$174K ARR @ 500 businesses',
      color: 'mansagold'
    },
    {
      icon: Users,
      name: 'Corporate Sponsors',
      description: 'Major brands supporting Black business ecosystem',
      revenue: '$250K-1M annually',
      color: 'blue'
    },
    {
      icon: DollarSign,
      name: 'B2B Transaction Fees',
      description: '1-3% commission on marketplace transactions',
      revenue: 'Scales with volume',
      color: 'green'
    },
    {
      icon: Target,
      name: 'Featured Proximity Ads',
      description: 'Location-based promotional notifications',
      revenue: 'CPM-based pricing',
      color: 'purple'
    },
    {
      icon: UserPlus,
      name: 'Agent Commissions',
      description: 'Sales agents earn recurring commissions on referrals',
      revenue: 'Cost-effective acquisition',
      color: 'orange'
    },
    {
      icon: Megaphone,
      name: 'Premium Features',
      description: 'Advanced analytics, API access, white-label',
      revenue: 'High-margin upsells',
      color: 'pink'
    },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'mansagold': return 'bg-mansagold/20 text-mansagold';
      case 'blue': return 'bg-blue-500/20 text-blue-400';
      case 'green': return 'bg-green-500/20 text-green-400';
      case 'purple': return 'bg-purple-500/20 text-purple-400';
      case 'orange': return 'bg-orange-500/20 text-orange-400';
      case 'pink': return 'bg-pink-500/20 text-pink-400';
      default: return 'bg-white/20 text-white';
    }
  };

  return (
    <div className="h-full flex items-center justify-center px-8 py-12">
      <div className="max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="text-mansagold">6</span> Revenue Streams
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Diversified revenue model creates predictable, sustainable growth with multiple paths to monetization
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {revenueStreams.map((stream, index) => {
            const colorClasses = getColorClasses(stream.color);
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-5 bg-black/80 border-2 border-mansagold/50 hover:border-mansagold transition-all h-full">
                  <div className={`w-12 h-12 ${colorClasses.split(' ')[0]} rounded-xl flex items-center justify-center mb-4`}>
                    <stream.icon className={`w-6 h-6 ${colorClasses.split(' ')[1]}`} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{stream.name}</h3>
                  <p className="text-white/80 text-sm font-medium mb-3">{stream.description}</p>
                  <div className={`text-sm font-bold ${colorClasses.split(' ')[1]}`}>
                    {stream.revenue}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8"
        >
          <Card className="p-6 bg-black/80 border-2 border-mansagold">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Revenue Diversification = Resilience</h3>
                <p className="text-white font-medium">No single revenue stream accounts for more than 40% of projected revenue</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-mansagold">$2.4M</div>
                <div className="text-sm text-white font-semibold">2026 Target ARR</div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PitchSlide6BusinessModel;
