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
            <div 
              style={{ 
                padding: '32px', 
                backgroundColor: '#000814', 
                border: '2px solid #FFB300', 
                borderRadius: '12px', 
                display: 'inline-block' 
              }}
            >
              <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#FFFFFF', marginBottom: '24px' }}>Thomas D. Bowling</h3>
              <p style={{ color: '#FFB300', fontWeight: '600', marginBottom: '24px', fontSize: '16px' }}>Founder & CEO, 1325.AI</p>
              
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                <a 
                  href="mailto:Thomas@1325.AI"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: '#FFB300',
                    color: '#001a33',
                    fontWeight: 'bold',
                    padding: '16px 32px',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    fontSize: '16px',
                  }}
                >
                  <span>✉</span>
                  Thomas@1325.AI
                  <span>→</span>
                </a>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', alignItems: 'center' }}>
                <span style={{ color: '#FFFFFF', opacity: 0.7, fontSize: '14px', fontFamily: 'monospace' }}>🌐 1325.AI</span>
              </div>
            </div>
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
