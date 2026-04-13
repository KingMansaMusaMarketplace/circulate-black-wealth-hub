import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Rocket, 
  Shield, 
  Brain,
  Globe,
  Sparkles,
  TrendingUp,
  Zap,
  Lock
} from 'lucide-react';

const PitchSlide14WhyInvest: React.FC = () => {
  const reasons = [
    {
      title: '27-Claim Patent Moat',
      description: 'USPTO 63/969,202 with strategic amendment — $15–20M and 3–4 years for any competitor to replicate',
      icon: Lock,
      color: 'mansagold'
    },
    {
      title: 'AI Maturity Inflection',
      description: 'Agentic AI is moving from experimental to production — 1325.AI has 28 deployed AI services today',
      icon: Brain,
      color: 'purple'
    },
    {
      title: 'Infrastructure Gap',
      description: '$1.6T market with zero integrated platforms — 30+ competitors analyzed, none score above 3.5/8',
      icon: Globe,
      color: 'blue'
    },
    {
      title: 'Regulatory Tailwinds',
      description: 'Growing federal and corporate mandates for supplier diversity and economic equity programs',
      icon: Shield,
      color: 'green'
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
          <Badge className="mb-6 bg-mansagold/20 text-mansagold border-mansagold/30 text-lg px-6 py-2">
            <Sparkles className="w-4 h-4 mr-2" />
            Market Timing
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Why <span className="text-mansagold">Invest Now</span>?
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Four converging forces create a once-in-a-generation opportunity
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
            >
              <Card className="p-6 bg-black/80 border-2 border-mansagold/50 hover:border-mansagold transition-all h-full">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-mansagold/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <reason.icon className="w-6 h-6 text-mansagold" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">{reason.title}</h3>
                    <p className="text-white/80 font-medium">{reason.description}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-8 bg-black/80 border-2 border-mansagold">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-6">The Defensibility Stack</h3>
              <div className="flex flex-wrap justify-center gap-4 mb-6">
                {[
                  { label: '27 Patent Claims', icon: Lock },
                  { label: 'Economic Data Graph', icon: TrendingUp },
                  { label: 'Integrated OS', icon: Zap },
                  { label: '8 Revenue Streams', icon: Rocket },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 bg-mansagold/10 border border-mansagold/30 rounded-xl px-5 py-3">
                    <item.icon className="w-5 h-5 text-mansagold" />
                    <span className="text-white font-bold">{item.label}</span>
                  </div>
                ))}
              </div>
              <p className="text-white/70 font-medium max-w-2xl mx-auto">
                First-mover advantage in a $1.6T market with patent protection, live production platform, and zero direct competitors
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PitchSlide14WhyInvest;
