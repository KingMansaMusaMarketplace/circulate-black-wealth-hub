import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  Target, 
  Users, 
  Rocket,
  CheckCircle,
  ArrowRight,
  TrendingUp
} from 'lucide-react';

const PitchSlide13Ask: React.FC = () => {
  const useOfFunds = [
    { category: 'AI & Protocol Engineering', percentage: 45, description: 'Agentic commerce protocol, A2A infrastructure, patent execution' },
    { category: 'Go-to-Market', percentage: 25, description: 'Mansa Musa pilot expansion, enterprise design partners' },
    { category: 'Operations & Compliance', percentage: 20, description: 'Customer success, fintech & data compliance' },
    { category: 'Reserve', percentage: 10, description: 'Runway extension, strategic opportunities' },
  ];

  const milestones = [
    { month: '6 months', milestone: '500 verified businesses on protocol', metric: '$75K MRR' },
    { month: '12 months', milestone: '2,000 businesses, 3 enterprise design partners', metric: '$250K MRR' },
    { month: '18 months', milestone: 'Series A ready — protocol category leader', metric: '$750K MRR' },
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
            The <span className="text-mansagold">Ask</span>
          </h2>
          <p className="text-white/70 text-lg max-w-3xl mx-auto">
            Funding the world's first <span className="text-mansagold font-semibold">Economic Operating System</span> — agentic commerce infrastructure with no direct competitor.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Investment Ask */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-8 bg-black/80 border-2 border-mansagold h-full">
              <div className="text-center mb-6">
                <Badge className="mb-4 bg-mansagold/30 text-mansagold border-mansagold font-bold text-lg px-6 py-2">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Seed Round
                </Badge>
                <div className="text-6xl font-black text-mansagold mb-2">$3M</div>
                <p className="text-white font-semibold">Seed @ $30M post-money</p>
                <p className="text-white/60 text-sm mt-1">10% dilution · 18-month runway</p>
                <div className="mt-3 flex items-center justify-center gap-2">
                  <TrendingUp className="w-4 h-4 text-mansagold/80" />
                  <span className="text-white/70 text-sm">$1.82B long-term TAM (see appendix)</span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-mansagold" />
                  Use of Funds
                </h3>
                {useOfFunds.map((item, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-white font-semibold">{item.category}</span>
                      <span className="text-mansagold font-bold">{item.percentage}%</span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-mansagold to-mansagold-light rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percentage}%` }}
                        transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                      />
                    </div>
                    <p className="text-white/80 text-xs">{item.description}</p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Milestones */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <Card className="p-6 bg-black/80 border-2 border-mansagold/50">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Rocket className="w-5 h-5 text-mansagold" />
                Investment Milestones
              </h3>
              <div className="space-y-4">
                {milestones.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10"
                  >
                    <div className="w-12 h-12 bg-mansagold/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-6 h-6 text-mansagold" />
                    </div>
                    <div className="flex-1">
                      <div className="text-mansagold font-bold">{item.month}</div>
                      <div className="text-white">{item.milestone}</div>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400 border-green-400/30">
                      {item.metric}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-black/80 border-2 border-mansagold/50">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-mansagold" />
                What We're Looking For
              </h3>
              <ul className="space-y-2">
                {[
                  'Strategic investors who understand community finance',
                  'Network access to corporate sponsors',
                  'Guidance on fintech regulatory navigation',
                  'Support for Series A positioning'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-white font-medium">
                    <ArrowRight className="w-4 h-4 text-mansagold mt-1 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PitchSlide13Ask;
