import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { AlertTriangle, Clock, TrendingDown, Unlink } from 'lucide-react';

const PitchSlide2Problem: React.FC = () => {
  const problems = [
    {
      icon: Clock,
      stat: '6 Hours',
      title: 'Dollar Circulation Time',
      description: 'Money leaves Black communities in just 6 hours, compared to 20 days in other communities'
    },
    {
      icon: TrendingDown,
      stat: '$1.6T',
      title: 'Spending Power Lost',
      description: 'Massive economic potential with minimal internal recirculation'
    },
    {
      icon: Unlink,
      stat: 'Fragmented',
      title: 'No Economic Infrastructure',
      description: 'Existing directories are marketing tools, not economic systems'
    }
  ];

  return (
    <div className="h-full flex items-center justify-center px-8 py-12">
      <div className="max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-400 px-4 py-2 rounded-full mb-6">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-semibold">The Problem</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            The Black Dollar Doesn't <span className="text-red-400">Circulate</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Despite $1.6 trillion in annual spending power, Black communities lack the economic infrastructure to keep wealth circulating internally
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
            >
              <Card className="p-8 bg-black/80 border-2 border-red-500/50 hover:border-red-400 transition-all h-full">
                <div className="w-16 h-16 bg-red-500/30 rounded-2xl flex items-center justify-center mb-6">
                  <problem.icon className="w-8 h-8 text-red-400" />
                </div>
                <div className="text-4xl font-black text-red-400 mb-2">{problem.stat}</div>
                <h3 className="text-xl font-bold text-white mb-3">{problem.title}</h3>
                <p className="text-white/80 font-medium">{problem.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <Card className="inline-block p-6 bg-black/80 border-2 border-red-500">
            <p className="text-xl text-white font-semibold">
              <span className="text-red-400 font-bold">Current solutions</span> are just directories — 
              they don't capture transactions, don't build business credit, and don't create data moats.
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PitchSlide2Problem;
