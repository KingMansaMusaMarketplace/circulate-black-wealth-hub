import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileCode2, 
  Database, 
  Cloud, 
  Smartphone,
  Globe,
  Zap,
  BarChart3
} from 'lucide-react';

const PitchSlide5Platform: React.FC = () => {
  const platformStats = [
    { icon: FileCode2, value: '130+', label: 'Pages Built', color: 'mansagold' },
    { icon: Database, value: '110+', label: 'Database Tables', color: 'blue' },
    { icon: Cloud, value: '67+', label: 'Edge Functions', color: 'purple' },
    { icon: Smartphone, value: 'iOS + Android', label: 'Native Apps', color: 'green' },
  ];

  const features = [
    'Full accounting suite with invoicing & expenses',
    'B2B marketplace with supplier matching',
    'AI-powered business recommendations',
    'QR code loyalty system with fraud detection',
    'Corporate sponsorship management',
    'Sales agent referral network',
    'Community impact analytics',
    'Multi-location business support'
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
            <Zap className="w-4 h-4 mr-2" />
            Live Platform
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Enterprise-Grade <span className="text-mansagold">Platform</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            A fully functional production platform — not a prototype, not a mockup
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {platformStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10 text-center hover:border-mansagold/30 transition-all">
                <stat.icon className="w-8 h-8 text-mansagold mx-auto mb-3" />
                <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                <div className="text-sm text-white/60">{stat.label}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-8 bg-white/5 backdrop-blur-sm border-white/10">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-mansagold" />
              Platform Capabilities
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-2 h-2 rounded-full bg-mansagold flex-shrink-0" />
                  <span className="text-white/80">{feature}</span>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 flex justify-center gap-6"
        >
          <Card className="p-4 bg-mansablue border-mansagold/20 flex items-center gap-3">
            <Globe className="w-6 h-6 text-mansagold" />
            <span className="text-white font-semibold">mansamusamarketplace.com</span>
          </Card>
          <Card className="p-4 bg-mansablue border-mansagold/20 flex items-center gap-3">
            <Smartphone className="w-6 h-6 text-mansagold" />
            <span className="text-white font-semibold">App Store Ready</span>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PitchSlide5Platform;
