import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Rocket, 
  Users, 
  Globe,
  Sparkles,
  CheckCircle,
  ArrowRight,
  Mail
} from 'lucide-react';

const PitchSlide14Why776: React.FC = () => {
  const alignmentPoints = [
    {
      title: 'Founder-First Philosophy',
      description: '776\'s Cerebro platform and founder support aligns perfectly with our solo-founder journey',
      icon: Rocket
    },
    {
      title: 'Mission Alignment',
      description: 'Alexis Ohanian has publicly supported marginalized communities — this is that mission in action',
      icon: Heart
    },
    {
      title: '776 Foundation Synergy',
      description: 'Our platform directly advances the foundation\'s goals of community economic empowerment',
      icon: Globe
    },
    {
      title: 'Network Effects',
      description: '776\'s portfolio companies could become corporate sponsors on our platform',
      icon: Users
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
            Strategic Fit
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Why <span className="text-mansagold">Seven Seven Six</span>?
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            This isn't just an investment — it's a partnership built on shared values and complementary strengths
          </p>
        </motion.div>

        {/* Alignment Points */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {alignmentPoints.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
            >
              <Card className="p-6 bg-black/80 border-2 border-purple-500/50 hover:border-purple-400 transition-all h-full">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-500/30 rounded-xl flex items-center justify-center flex-shrink-0">
                    <point.icon className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">{point.title}</h3>
                    <p className="text-white/80 font-medium">{point.description}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-8 bg-black/80 border-2 border-mansagold">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-4">Let's Build Together</h3>
              <p className="text-white font-medium mb-6 max-w-2xl mx-auto">
                Mansa Musa Marketplace is more than a platform — it's a movement to create lasting economic 
                infrastructure for Black communities. With 776's support, we can accelerate from prototype to 
                market leader.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                {[
                  '$1.6T market opportunity',
                  'Patent-pending technology',
                  'Production-ready platform',
                  'Mission-driven founder'
                ].map((item, i) => (
                  <Badge 
                    key={i}
                    className="bg-white/10 text-white border-white/20 text-sm py-2"
                  >
                    <CheckCircle className="w-3 h-3 mr-1 text-green-400" />
                    {item}
                  </Badge>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a 
                  href="mailto:investors@mansamusamarketplace.com?subject=776%20Investment%20Inquiry"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-mansagold to-mansagold-light text-mansablue-dark font-bold px-8 py-4 rounded-xl hover:shadow-xl hover:shadow-mansagold/30 transition-all"
                >
                  <Mail className="w-5 h-5" />
                  Schedule a Call
                  <ArrowRight className="w-5 h-5" />
                </a>
                <a 
                  href="/"
                  className="inline-flex items-center gap-2 border-2 border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-all"
                >
                  <Globe className="w-5 h-5" />
                  Explore Platform
                </a>
              </div>

              <p className="mt-6 text-white/50 text-sm">
                investors@mansamusamarketplace.com • mansamusamarketplace.com
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PitchSlide14Why776;
