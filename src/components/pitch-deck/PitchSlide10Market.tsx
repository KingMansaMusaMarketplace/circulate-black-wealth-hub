import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Globe, TrendingUp, Users, Building2 } from 'lucide-react';

const PitchSlide10Market: React.FC = () => {
  const marketData = [
    {
      label: 'TAM',
      title: 'Total Addressable Market',
      value: '$1.6T',
      description: 'Annual Black consumer spending power in the US',
      color: 'mansagold'
    },
    {
      label: 'SAM',
      title: 'Serviceable Addressable Market',
      value: '$160B',
      description: 'Local service businesses and B2B transactions',
      color: 'blue'
    },
    {
      label: 'SOM',
      title: 'Serviceable Obtainable Market',
      value: '$16B',
      description: 'Platform-captured economic activity by 2030',
      color: 'green'
    },
  ];

  const expansionPhases = [
    { phase: 'Phase 1', market: 'Local (Single City)', businesses: '100-500', timeline: '2025' },
    { phase: 'Phase 2', market: 'Regional (5 Cities)', businesses: '2,500', timeline: '2026' },
    { phase: 'Phase 3', market: 'National (50 Cities)', businesses: '25,000', timeline: '2027-2028' },
    { phase: 'Phase 4', market: 'Pan-African Expansion', businesses: '100,000+', timeline: '2029-2030' },
  ];

  return (
    <div className="h-full flex items-center justify-center px-8 py-12">
      <div className="max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Market <span className="text-mansagold">Opportunity</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            The largest underserved market in American commerce
          </p>
        </motion.div>

        {/* TAM/SAM/SOM */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {marketData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
            >
              <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10 hover:border-mansagold/30 transition-all text-center h-full">
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold mb-4 ${
                  item.color === 'mansagold' ? 'bg-mansagold/20 text-mansagold' :
                  item.color === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-green-500/20 text-green-400'
                }`}>
                  {item.label}
                </div>
                <div className="text-4xl font-black text-white mb-2">{item.value}</div>
                <h3 className="text-lg font-semibold text-white/80 mb-2">{item.title}</h3>
                <p className="text-white/60 text-sm">{item.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Geographic Expansion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Globe className="w-5 h-5 text-mansagold" />
              Geographic Expansion Strategy
            </h3>
            <div className="grid md:grid-cols-4 gap-4">
              {expansionPhases.map((phase, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="p-4 rounded-xl bg-white/5 border border-white/10"
                >
                  <div className="text-mansagold font-bold mb-2">{phase.phase}</div>
                  <div className="text-white font-semibold">{phase.market}</div>
                  <div className="text-white/60 text-sm mt-2">
                    <div className="flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      {phase.businesses} businesses
                    </div>
                    <div className="text-mansagold/80">{phase.timeline}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-6 text-center"
        >
          <Card className="inline-block p-4 bg-mansagold/10 border-mansagold/30">
            <p className="text-lg text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-mansagold" />
              Network effects accelerate growth — each new business makes the platform more valuable
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PitchSlide10Market;
