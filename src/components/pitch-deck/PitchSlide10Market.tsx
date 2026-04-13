import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Globe, TrendingUp, Users, Building2, Bot, ShoppingCart, Heart } from 'lucide-react';

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

  const adjacentMarkets = [
    { icon: Bot, name: 'AI Workforce', value: '$126B', cagr: '44% CAGR', description: 'Agentic AI replacing traditional SaaS' },
    { icon: ShoppingCart, name: 'B2B Marketplace', value: '$7.9T', cagr: '18% CAGR', description: 'Digital wholesale & supply chain' },
    { icon: Heart, name: 'Loyalty & Rewards', value: '$24B', cagr: '12% CAGR', description: 'Cross-business loyalty programs' },
  ];

  const expansionPhases = [
    { phase: 'Phase 1', market: 'Local (Single City)', businesses: '100-500', timeline: '2025' },
    { phase: 'Phase 2', market: 'Regional (5 Cities)', businesses: '2,500', timeline: '2026' },
    { phase: 'Phase 3', market: 'National (50 Cities)', businesses: '25,000', timeline: '2027-2028' },
    { phase: 'Phase 4', market: 'Pan-African Expansion', businesses: '100,000+', timeline: '2029-2030' },
  ];

  return (
    <div className="h-full flex items-center justify-center px-8 py-8">
      <div className="max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Market <span className="text-mansagold">Opportunity</span>
          </h2>
          <p className="text-lg text-white/70 max-w-3xl mx-auto">
            The largest underserved market in American commerce — intersecting three high-growth sectors
          </p>
        </motion.div>

        {/* TAM/SAM/SOM */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {marketData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-5 bg-black/80 border-2 border-mansagold/50 hover:border-mansagold transition-all text-center h-full">
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold mb-3 ${
                  item.color === 'mansagold' ? 'bg-mansagold/30 text-mansagold' :
                  item.color === 'blue' ? 'bg-blue-500/30 text-blue-400' :
                  'bg-green-500/30 text-green-400'
                }`}>
                  {item.label}
                </div>
                <div className="text-4xl font-black text-mansagold mb-1">{item.value}</div>
                <h3 className="text-base font-bold text-white mb-1">{item.title}</h3>
                <p className="text-white/80 font-medium text-sm">{item.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Adjacent Markets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <div className="grid md:grid-cols-3 gap-4">
            {adjacentMarkets.map((market, index) => (
              <Card key={index} className="p-4 bg-black/80 border border-white/10 hover:border-mansagold/50 transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-mansagold/20 rounded-lg flex items-center justify-center">
                    <market.icon className="w-4 h-4 text-mansagold" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{market.name}</h4>
                    <span className="text-xs text-green-400 font-semibold">{market.cagr}</span>
                  </div>
                </div>
                <div className="text-2xl font-black text-mansagold mb-1">{market.value}</div>
                <p className="text-xs text-white/60">{market.description}</p>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Geographic Expansion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-5 bg-black/80 border-2 border-mansagold/50">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-mansagold" />
              Geographic Expansion Strategy
            </h3>
            <div className="grid md:grid-cols-4 gap-3">
              {expansionPhases.map((phase, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="p-3 rounded-xl bg-black/50 border-2 border-mansagold/30"
                >
                  <div className="text-mansagold font-bold text-sm mb-1">{phase.phase}</div>
                  <div className="text-white font-bold text-sm">{phase.market}</div>
                  <div className="text-white/80 text-xs mt-1">
                    <div className="flex items-center gap-1 font-medium">
                      <Building2 className="w-3 h-3" />
                      {phase.businesses}
                    </div>
                    <div className="text-mansagold font-semibold">{phase.timeline}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PitchSlide10Market;
