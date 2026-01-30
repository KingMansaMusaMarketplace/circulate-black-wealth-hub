import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Cpu, 
  Shield, 
  MapPin, 
  Brain,
  Sparkles,
  Lock
} from 'lucide-react';

const PitchSlide4Technology: React.FC = () => {
  const technologies = [
    {
      icon: Cpu,
      name: 'CMAL',
      fullName: 'Circulatory Multiplier Attribution Logic',
      description: 'Proprietary algorithm that tracks how each dollar circulates through the Black business ecosystem, attributing economic impact in real-time.',
      color: 'mansagold'
    },
    {
      icon: Shield,
      name: 'Temporal Immutability Engine',
      fullName: 'Blockchain-Inspired Audit Trail',
      description: 'Creates an immutable record of all transactions, enabling verifiable business credit scores and fraud-resistant financial history.',
      color: 'blue'
    },
    {
      icon: MapPin,
      name: 'Geospatial Velocity Detection',
      fullName: 'Location-Based Fraud Prevention',
      description: 'Detects impossible transaction patterns based on time and location, preventing points fraud and ensuring system integrity.',
      color: 'purple'
    },
    {
      icon: Brain,
      name: 'AI Recommendation Engine',
      fullName: 'Predictive Business Matching',
      description: 'Machine learning model trained on transaction data to match consumers with businesses and businesses with B2B suppliers.',
      color: 'green'
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'mansagold': return { bg: 'bg-mansagold/20', text: 'text-mansagold', border: 'border-mansagold/30' };
      case 'blue': return { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-400/30' };
      case 'purple': return { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-400/30' };
      case 'green': return { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-400/30' };
      default: return { bg: 'bg-white/20', text: 'text-white', border: 'border-white/30' };
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
          <Badge className="mb-6 bg-mansagold/20 text-mansagold border-mansagold/30 text-lg px-6 py-2">
            <Lock className="w-4 h-4 mr-2" />
            U.S. Patent Pending 63/969,202
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Proprietary <span className="text-mansagold">Technology</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Our patent-pending innovations create a defensible technology moat that competitors cannot easily replicate
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {technologies.map((tech, index) => {
            const colors = getColorClasses(tech.color);
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.15 }}
              >
                <Card className={`p-6 bg-black/80 border-2 ${colors.border} hover:border-mansagold transition-all h-full`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 ${colors.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <tech.icon className={`w-7 h-7 ${colors.text}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`text-xl font-bold ${colors.text}`}>{tech.name}</h3>
                        <Sparkles className={`w-4 h-4 ${colors.text}`} />
                      </div>
                      <p className="text-white/80 text-sm font-medium mb-2">{tech.fullName}</p>
                      <p className="text-white font-medium">{tech.description}</p>
                    </div>
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
          className="mt-8 text-center"
        >
          <Card className="inline-block p-4 bg-black/80 border-2 border-mansagold">
            <p className="text-lg text-white font-semibold flex items-center gap-2">
              <Lock className="w-5 h-5 text-mansagold" />
              <span className="text-mansagold font-bold">USPTO Patent Application</span> filed — creating 18-month first-mover protection
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PitchSlide4Technology;
