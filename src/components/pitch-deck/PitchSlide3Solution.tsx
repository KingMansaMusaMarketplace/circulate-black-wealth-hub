import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { 
  Building2, 
  Calculator, 
  Network, 
  Heart, 
  Wallet,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const PitchSlide3Solution: React.FC = () => {
  const solutions = [
    { icon: Building2, title: 'Business Directory', description: 'Verified Black-owned business listings with full profiles' },
    { icon: Calculator, title: 'Full Accounting Suite', description: 'Invoicing, expenses, payroll — we are their QuickBooks' },
    { icon: Network, title: 'B2B Marketplace', description: 'Connect businesses for wholesale supply chain' },
    { icon: Heart, title: 'Loyalty Program', description: 'Cross-business rewards keeping dollars in community' },
    { icon: Wallet, title: 'Community Finance', description: 'Micro-lending pools and group savings' },
  ];

  return (
    <div className="h-full flex items-center justify-center px-8 py-12">
      <div className="max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full mb-6">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">The Solution</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            A Full-Stack <span className="text-mansagold">Economic OS</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Not just a directory — a complete economic operating system that captures every transaction and builds lasting vendor lock-in
          </p>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-4">
          {solutions.map((solution, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10 hover:border-mansagold/30 transition-all h-full text-center group">
                <div className="w-14 h-14 bg-mansagold/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-mansagold/30 transition-colors">
                  <solution.icon className="w-7 h-7 text-mansagold" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{solution.title}</h3>
                <p className="text-white/60 text-sm">{solution.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12"
        >
          <Card className="p-8 bg-gradient-to-r from-mansablue to-mansablue-dark border-mansagold/20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-2">The Key Insight</h3>
                <p className="text-white/80 text-lg">
                  By owning their accounting data, we know every dollar that flows through Black businesses — 
                  creating an unmatched data moat and AI training set.
                </p>
              </div>
              <div className="flex items-center gap-4 text-white">
                <div className="text-center">
                  <div className="text-3xl font-bold text-mansagold">Directory</div>
                  <div className="text-sm text-white/60">Surface Level</div>
                </div>
                <ArrowRight className="w-8 h-8 text-mansagold" />
                <div className="text-center">
                  <div className="text-3xl font-bold text-mansagold">Operating System</div>
                  <div className="text-sm text-white/60">Full Stack</div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PitchSlide3Solution;
