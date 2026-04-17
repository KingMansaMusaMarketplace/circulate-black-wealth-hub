import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { 
  Building2, 
  Users, 
  DollarSign, 
  Target,
  Megaphone,
  UserPlus,
  Bot,
  Layers
} from 'lucide-react';

const PitchSlide6BusinessModel: React.FC = () => {
  const revenueStreams = [
    {
      icon: Building2,
      name: 'Business Subscriptions',
      description: 'Essentials $19/mo · Starter $79/mo · Pro $299/mo · Enterprise $899/mo + $50/user',
      revenue: '$355 Blended ARPU',
      color: 'mansagold'
    },
    {
      icon: Bot,
      name: 'Kayla AI Subscriptions',
      description: '28 agentic AI employees replacing $12K+/mo overhead per business',
      revenue: 'Embedded in tiers',
      color: 'cyan'
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
      icon: Layers,
      name: 'White-Label Licensing',
      description: 'Full tenant-branded deployments with custom domains, subdomain routing, branded CSS & APIs',
      revenue: 'High-margin B2B licensing',
      color: 'pink'
    },
    {
      icon: Megaphone,
      name: 'Premium Features',
      description: 'Advanced analytics, API access, developer platform',
      revenue: 'High-margin upsells',
      color: 'yellow'
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
      case 'cyan': return 'bg-cyan-500/20 text-cyan-400';
      case 'yellow': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-white/20 text-white';
    }
  };

  return (
    <div className="h-full flex items-center justify-center px-8 py-8">
      <div className="max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">
            <span className="text-mansagold">8</span> Revenue Streams
          </h2>
          <p className="text-lg text-white/70 max-w-3xl mx-auto">
            Diversified revenue model with enterprise pricing & white-label licensing
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
          {revenueStreams.map((stream, index) => {
            const colorClasses = getColorClasses(stream.color);
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
              >
                <Card className="p-4 bg-black/80 border-2 border-mansagold/50 hover:border-mansagold transition-all h-full">
                  <div className={`w-10 h-10 ${colorClasses.split(' ')[0]} rounded-lg flex items-center justify-center mb-3`}>
                    <stream.icon className={`w-5 h-5 ${colorClasses.split(' ')[1]}`} />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1">{stream.name}</h3>
                  <p className="text-white/70 text-xs font-medium mb-2">{stream.description}</p>
                  <div className={`text-xs font-bold ${colorClasses.split(' ')[1]}`}>
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
          transition={{ delay: 0.6 }}
          className="mt-4"
        >
          <Card className="p-4 bg-black/80 border-2 border-mansagold">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Revenue Diversification = Resilience</h3>
                <p className="text-white/80 font-medium text-sm">86% Gross Margin · 142% NRR · 2.8-month CAC Payback</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-3xl font-black text-mansagold">$2.4M</div>
                  <div className="text-xs text-white font-semibold">2026 Target ARR</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-white">$225</div>
                  <div className="text-xs text-white/60 font-semibold">Blended ARPU</div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PitchSlide6BusinessModel;
