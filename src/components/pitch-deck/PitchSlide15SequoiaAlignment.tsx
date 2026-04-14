import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { 
  Mail, 
  Globe, 
  
  ArrowRight,
  Sparkles,
  CheckCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import neuralBrainLogo from '@/assets/1325-neural-brain-logo.jpeg';

const PitchSlide15Contact: React.FC = () => {
  return (
    <div className="h-full flex items-center justify-center px-8 py-12">
      <div className="max-w-4xl mx-auto w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Logo */}
          <motion.div 
            className="w-24 h-24 mx-auto mb-6 rounded-2xl overflow-hidden shadow-2xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <img 
              src={neuralBrainLogo} 
              alt="1325.AI Neural Brain Logo" 
              className="w-full h-full object-contain"
            />
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Let's Build the <span className="text-mansagold">Future</span>
          </h2>
          <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
            The economic operating system for the Black economy is live, patented, and ready to scale.
          </p>

          {/* Key Highlights */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {[
              '$1.6T market',
              '27 patent claims',
              '8 revenue streams',
              '0 direct competitors',
              'Live production platform',
            ].map((item, i) => (
              <Badge 
                key={i}
                className="bg-white/10 text-white border-white/20 text-sm py-2 px-4"
              >
                <CheckCircle className="w-3 h-3 mr-1.5 text-green-400" />
                {item}
              </Badge>
            ))}
          </div>

          {/* Contact Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-8 bg-black/80 border-2 border-mansagold inline-block">
              <h3 className="text-2xl font-bold text-white mb-6">Thomas D. Bowling</h3>
              <p className="text-mansagold font-semibold mb-6">Founder & CEO, 1325.AI</p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                <a 
                  href="mailto:Thomas@1325.AI"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-mansagold to-mansagold-light text-mansablue-dark font-bold px-8 py-4 rounded-xl hover:shadow-xl hover:shadow-mansagold/30 transition-all"
                >
                  <Mail className="w-5 h-5" />
                  Thomas@1325.AI
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>

              <div className="flex items-center justify-center gap-4 text-white/50">
                <a href="https://1325.ai" className="flex items-center gap-1 hover:text-mansagold transition-colors">
                  <Globe className="w-4 h-4" />
                  <span className="font-mono">1325.AI</span>
                </a>
              </div>
            </Card>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-white/40 text-sm flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Confidential — For Investor Use Only
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default PitchSlide15Contact;
