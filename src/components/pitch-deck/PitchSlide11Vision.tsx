import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Building2, 
  DollarSign, 
  CreditCard,
  Globe,
  Users
} from 'lucide-react';

const PitchSlide11Vision: React.FC = () => {
  const vision2030 = [
    { icon: Building2, value: '100,000+', label: 'Businesses on Platform' },
    { icon: DollarSign, value: '$1B+', label: 'Circulated Annually' },
    { icon: Users, value: '1M+', label: 'Active Users' },
    { icon: Globe, value: 'Pan-African', label: 'Geographic Reach' },
  ];

  const futureProducts = [
    {
      name: 'Mansa Credit',
      description: 'Business credit scores built on platform data',
      status: 'In Development'
    },
    {
      name: 'Mansa Capital',
      description: 'Micro-lending using transaction history as underwriting',
      status: 'Planned 2026'
    },
    {
      name: 'Mansa Card',
      description: 'Branded debit card with automatic community rewards',
      status: 'Planned 2027'
    },
    {
      name: 'Mansa Pay',
      description: 'P2P payments within the ecosystem',
      status: 'Roadmap'
    },
  ];

  return (
    <div className="h-full flex items-center justify-center px-8 py-12">
      <div className="max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <Badge className="mb-6 bg-purple-500/20 text-purple-400 border-purple-400/30 text-lg px-6 py-2">
            <Sparkles className="w-4 h-4 mr-2" />
            Vision 2030
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            The <span className="text-mansagold">Endgame</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            From marketplace to full-stack financial infrastructure for the Black economy
          </p>
        </motion.div>

        {/* 2030 Goals */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {vision2030.map((goal, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 bg-gradient-to-br from-mansagold/20 to-purple-500/20 backdrop-blur-sm border-mansagold/30 text-center">
                <goal.icon className="w-8 h-8 text-mansagold mx-auto mb-3" />
                <div className="text-3xl font-black text-white mb-1">{goal.value}</div>
                <div className="text-sm text-white/60">{goal.label}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Future Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-mansagold" />
              Future Product Roadmap
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {futureProducts.map((product, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-start gap-4"
                >
                  <div className="w-10 h-10 bg-mansagold/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-5 h-5 text-mansagold" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-white">{product.name}</h4>
                      <Badge variant="outline" className="text-xs border-mansagold/30 text-mansagold">
                        {product.status}
                      </Badge>
                    </div>
                    <p className="text-white/60 text-sm">{product.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-6 text-center"
        >
          <Card className="inline-block p-4 bg-gradient-to-r from-mansagold/20 to-purple-500/20 border-mansagold/30">
            <p className="text-lg text-white">
              Vision: Become the <span className="text-mansagold font-bold">Stripe + Square + Shopify</span> of the Black economy
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PitchSlide11Vision;
