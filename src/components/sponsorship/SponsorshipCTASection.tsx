
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Download, Phone, Sparkles } from 'lucide-react';

interface SponsorshipCTASectionProps {
  onContactPartnership: () => void;
  onDownloadGuide: () => void;
  isGeneratingPDF: boolean;
}

const SponsorshipCTASection: React.FC<SponsorshipCTASectionProps> = ({ 
  onContactPartnership, 
  onDownloadGuide, 
  isGeneratingPDF 
}) => {
  return (
    <section className="py-20 relative z-10">
      <div className="container mx-auto px-4">
        <motion.div 
          className="relative max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-mansagold/20 via-amber-500/10 to-mansagold/20 rounded-3xl blur-3xl" />
          
          <div className="relative bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-2xl rounded-3xl border border-mansagold/20 overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-mansagold to-transparent" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-mansagold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative p-8 md:p-12 lg:p-16 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mansagold/10 border border-mansagold/30 mb-6">
                  <Sparkles className="w-4 h-4 text-mansagold" />
                  <span className="text-sm font-medium text-mansagold">Start Your Partnership Journey</span>
                </div>
              </motion.div>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-playfair mb-6">
                <span className="text-white">Ready to Make a </span>
                <span className="text-gradient-gold">Lasting Impact?</span>
              </h2>
              
              <p className="text-xl text-blue-200/80 mb-10 max-w-2xl mx-auto leading-relaxed">
                Connect with our partnership team to explore how your organization 
                can drive meaningful change while achieving your business objectives.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="group bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 hover:from-amber-500 hover:via-yellow-500 hover:to-orange-500 text-slate-900 font-semibold text-lg px-8 py-6 rounded-xl shadow-lg shadow-mansagold/25 hover:shadow-xl hover:shadow-mansagold/30 transition-all duration-300"
                  onClick={onContactPartnership}
                >
                  <Phone className="mr-2 w-5 h-5" />
                  Schedule a Call
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <Button 
                  size="lg"
                  variant="outline"
                  className="group border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/40 font-semibold text-lg px-8 py-6 rounded-xl backdrop-blur-sm transition-all duration-300"
                  onClick={onDownloadGuide}
                  disabled={isGeneratingPDF}
                >
                  <Download className="mr-2 w-5 h-5" />
                  {isGeneratingPDF ? 'Generating...' : 'Download Partnership Guide'}
                </Button>
              </div>
              
              {/* Trust statement */}
              <p className="mt-10 text-sm text-blue-200/50">
                Join 50+ organizations already making an impact with Mansa Musa Marketplace
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SponsorshipCTASection;
