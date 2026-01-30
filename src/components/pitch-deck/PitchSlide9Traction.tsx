import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Building2, 
  Users, 
  DollarSign,
  Target,
  Rocket
} from 'lucide-react';

const PitchSlide9Traction: React.FC = () => {
  const goals2026 = [
    { icon: DollarSign, value: '$2.4M', label: 'Circulated Through Platform', color: 'mansagold' },
    { icon: Building2, value: '175+', label: 'Registered Businesses', color: 'blue' },
    { icon: Users, value: '5,000+', label: 'Active Users', color: 'green' },
    { icon: Target, value: '72hrs', label: 'Target Circulation Time', color: 'purple' },
  ];

  const milestones = [
    { phase: 'Q1 2025', milestone: 'Platform Launch', status: 'completed' },
    { phase: 'Q2 2025', milestone: 'First 50 Businesses', status: 'in-progress' },
    { phase: 'Q3 2025', milestone: 'Corporate Sponsor Partnership', status: 'upcoming' },
    { phase: 'Q4 2025', milestone: '100 Businesses + B2B Launch', status: 'upcoming' },
    { phase: 'Q1 2026', milestone: 'Series A Readiness', status: 'upcoming' },
  ];

  return (
    <div className="h-full flex items-center justify-center px-8 py-12">
      <div className="max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <Badge className="mb-6 bg-green-500/20 text-green-400 border-green-400/30 text-lg px-6 py-2">
            <TrendingUp className="w-4 h-4 mr-2" />
            Traction & Goals
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            2026 <span className="text-mansagold">Targets</span>
          </h2>
        </motion.div>

        {/* Goals Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {goals2026.map((goal, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 bg-black/80 border-2 border-mansagold/50 text-center hover:border-mansagold transition-all">
                <goal.icon className="w-8 h-8 text-mansagold mx-auto mb-3" />
                <div className="text-3xl font-black text-mansagold mb-1">{goal.value}</div>
                <div className="text-sm text-white font-semibold">{goal.label}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Milestone Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 bg-black/80 border-2 border-mansagold/50">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Rocket className="w-5 h-5 text-mansagold" />
              Milestone Roadmap
            </h3>
            <div className="flex items-center justify-between overflow-x-auto pb-4">
              {milestones.map((item, index) => (
                <div key={index} className="flex flex-col items-center min-w-[140px] px-2">
                  <div className={`w-4 h-4 rounded-full mb-2 ${
                    item.status === 'completed' ? 'bg-green-500' :
                    item.status === 'in-progress' ? 'bg-mansagold animate-pulse' :
                    'bg-white/30'
                  }`} />
                  <div className={`text-sm font-semibold mb-1 ${
                    item.status === 'completed' ? 'text-green-400' :
                    item.status === 'in-progress' ? 'text-mansagold' :
                    'text-white/60'
                  }`}>
                    {item.phase}
                  </div>
                  <div className="text-xs text-white/70 text-center">{item.milestone}</div>
                </div>
              ))}
            </div>
            <div className="h-1 bg-white/10 rounded-full relative -mt-[72px] mb-[60px] mx-6">
              <motion.div 
                className="h-full bg-gradient-to-r from-green-500 via-mansagold to-mansagold/30 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '25%' }}
                transition={{ delay: 0.6, duration: 0.8 }}
              />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-6 grid md:grid-cols-2 gap-4"
        >
          <Card className="p-4 bg-black/80 border-2 border-green-500">
            <p className="text-green-400 font-bold">Current: Platform Live</p>
            <p className="text-white font-medium text-sm">130+ pages, 110+ tables, native apps ready</p>
          </Card>
          <Card className="p-4 bg-black/80 border-2 border-mansagold">
            <p className="text-mansagold font-bold">Next: Business Acquisition</p>
            <p className="text-white font-medium text-sm">Sales agent network activation underway</p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PitchSlide9Traction;
