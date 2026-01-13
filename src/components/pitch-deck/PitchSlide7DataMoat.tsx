import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { 
  Lock, 
  Database, 
  Users, 
  TrendingUp,
  ArrowRight,
  Shield
} from 'lucide-react';

const PitchSlide7DataMoat: React.FC = () => {
  const moatLayers = [
    {
      title: 'Social Capital',
      description: 'Reviews, ratings, followers — portable nowhere else',
      icon: Users,
      examples: ['1,000+ followers', '4.8 star rating', '50+ reviews']
    },
    {
      title: 'Financial History',
      description: 'Complete accounting records creating business credit',
      icon: Database,
      examples: ['3 years of invoices', 'Expense tracking', 'Cash flow data']
    },
    {
      title: 'Network Effects',
      description: 'B2B connections and supplier relationships',
      icon: TrendingUp,
      examples: ['Verified suppliers', 'Trade credit', 'Wholesale deals']
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
          <div className="inline-flex items-center gap-2 bg-mansagold/20 text-mansagold px-4 py-2 rounded-full mb-6">
            <Lock className="w-5 h-5" />
            <span className="font-semibold">The Data Moat</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            They <span className="text-mansagold">Can't Leave</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Once a business has built their presence on our platform, leaving means abandoning years of accumulated value
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {moatLayers.map((layer, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
            >
              <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10 hover:border-mansagold/30 transition-all h-full">
                <div className="w-14 h-14 bg-mansagold/20 rounded-xl flex items-center justify-center mb-4">
                  <layer.icon className="w-7 h-7 text-mansagold" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{layer.title}</h3>
                <p className="text-white/60 mb-4">{layer.description}</p>
                <div className="space-y-2">
                  {layer.examples.map((example, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-mansagold">
                      <div className="w-1.5 h-1.5 rounded-full bg-mansagold" />
                      {example}
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-8 bg-white border-2 border-mansagold/30">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Shield className="w-10 h-10 text-mansablue" />
              <h3 className="text-2xl font-bold text-foreground">The Vendor Lock-In Effect</h3>
            </div>
            <blockquote className="text-xl text-center text-foreground/80 italic max-w-3xl mx-auto">
              "Once a business owner has 1,000 followers, a high rating, and their entire accounting history on our platform, 
              <span className="text-mansagold font-bold not-italic"> they will never leave</span>."
            </blockquote>
            <div className="flex items-center justify-center gap-8 mt-8 pt-6 border-t border-foreground/10">
              <div className="text-center">
                <div className="text-2xl font-bold text-mansablue">Reputation</div>
                <div className="text-sm text-foreground/60">Non-portable</div>
              </div>
              <ArrowRight className="w-6 h-6 text-mansagold" />
              <div className="text-center">
                <div className="text-2xl font-bold text-mansagold">Data</div>
                <div className="text-sm text-foreground/60">Locked In</div>
              </div>
              <ArrowRight className="w-6 h-6 text-mansagold" />
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">Retention</div>
                <div className="text-sm text-foreground/60">Guaranteed</div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PitchSlide7DataMoat;
