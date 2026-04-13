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
  Lock,
  QrCode,
  Users
} from 'lucide-react';

const PitchSlide4Technology: React.FC = () => {
  const technologies = [
    {
      icon: Cpu,
      name: 'CMAL',
      fullName: 'Circulatory Multiplier Attribution Logic',
      description: 'Proprietary algorithm tracking how each dollar circulates through the Black business ecosystem, attributing economic impact in real-time.',
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
      description: 'ML model trained on transaction data to match consumers with businesses and businesses with B2B suppliers.',
      color: 'green'
    },
    {
      icon: QrCode,
      name: 'Atomic QR-to-Loyalty Pipeline',
      fullName: 'Claim 5 — Single-Transaction Loyalty',
      description: 'Single-scan loyalty processing preventing double-spend with atomic transaction guarantees across the entire reward lifecycle.',
      color: 'orange'
    },
    {
      icon: Users,
      name: 'Partner Revenue Attribution',
      fullName: 'Claims 21-27 — Multi-Tier Commissions',
      description: 'Multi-tier partner commission and referral tracking with automated revenue attribution across agent networks.',
      color: 'pink'
    },
  ];

  const claimCategories = [
    { category: 'Fraud Detection', claims: 4 },
    { category: 'Loyalty', claims: 5 },
    { category: 'Attribution', claims: 7 },
    { category: 'Partner System', claims: 7 },
    { category: 'Infrastructure', claims: 4 },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'mansagold': return { bg: 'bg-mansagold/20', text: 'text-mansagold', border: 'border-mansagold/30' };
      case 'blue': return { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-400/30' };
      case 'purple': return { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-400/30' };
      case 'green': return { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-400/30' };
      case 'orange': return { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-400/30' };
      case 'pink': return { bg: 'bg-pink-500/20', text: 'text-pink-400', border: 'border-pink-400/30' };
      default: return { bg: 'bg-white/20', text: 'text-white', border: 'border-white/30' };
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
          <div className="flex items-center justify-center gap-4 mb-4">
            <Badge className="bg-mansagold/20 text-mansagold border-mansagold/30 text-base px-5 py-2">
              <Lock className="w-4 h-4 mr-2" />
              USPTO 63/969,202
            </Badge>
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-400/30 text-base px-5 py-2">
              27 Patent Claims Filed
            </Badge>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Proprietary <span className="text-mansagold">Technology</span>
          </h2>
          <p className="text-lg text-white/70 max-w-3xl mx-auto">
            Patent-pending innovations creating a defensible technology moat — $15–20M and 3–4 years to replicate
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4 mb-4">
          {technologies.map((tech, index) => {
            const colors = getColorClasses(tech.color);
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
              >
                <Card className={`p-4 bg-black/80 border-2 ${colors.border} hover:border-mansagold transition-all h-full`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <tech.icon className={`w-5 h-5 ${colors.text}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 mb-0.5">
                        <h3 className={`text-sm font-bold ${colors.text}`}>{tech.name}</h3>
                        <Sparkles className={`w-3 h-3 ${colors.text}`} />
                      </div>
                      <p className="text-white/60 text-xs mb-1">{tech.fullName}</p>
                      <p className="text-white/90 text-xs font-medium">{tech.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Claim Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-4 bg-black/80 border-2 border-mansagold">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                {claimCategories.map((cat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-xl font-black text-mansagold">{cat.claims}</div>
                    <div className="text-xs text-white/70 font-medium">{cat.category}</div>
                  </div>
                ))}
              </div>
              <div className="text-right">
                <p className="text-sm text-white font-semibold">
                  Strategic Amendment filed Jan 30, 2026
                </p>
                <p className="text-xs text-white/60">Claims 21-27: Partner Revenue Attribution System</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PitchSlide4Technology;
