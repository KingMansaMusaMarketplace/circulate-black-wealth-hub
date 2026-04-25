import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Download, Phone } from 'lucide-react';

interface SponsorshipCTASectionProps {
  onContactPartnership: () => void;
  onDownloadGuide: () => void;
  isGeneratingPDF: boolean;
}

const SponsorshipCTASection: React.FC<SponsorshipCTASectionProps> = ({
  onContactPartnership,
  onDownloadGuide,
  isGeneratingPDF,
}) => {
  return (
    <section className="py-24 relative z-10">
      <div className="container mx-auto px-4">
        <motion.div
          className="relative max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative bg-black border border-mansagold/30 rounded-2xl overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-mansagold to-transparent" />

            <div className="relative p-12 md:p-16 text-center">
              <p className="text-[11px] text-mansagold tracking-[0.3em] uppercase mb-6">
                By invitation and review
              </p>

              <h2 className="font-playfair text-3xl md:text-5xl font-semibold text-white tracking-tight mb-6">
                Begin a conversation.
              </h2>

              <p className="text-white/85 mb-12 max-w-xl mx-auto leading-relaxed">
                Our partnerships team will respond within one business day to schedule
                an introductory call.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="group bg-mansagold hover:bg-mansagold/90 text-slate-900 font-semibold text-base px-8 py-6 rounded-md"
                  onClick={onContactPartnership}
                >
                  <Phone className="mr-2 w-4 h-4" />
                  Request Partnership Brief
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="group border border-white/20 text-white hover:bg-white/5 hover:border-white/40 font-medium text-base px-8 py-6 rounded-md"
                  onClick={onDownloadGuide}
                  disabled={isGeneratingPDF}
                >
                  <Download className="mr-2 w-4 h-4" />
                  {isGeneratingPDF ? 'Preparing…' : 'Download Media Kit'}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SponsorshipCTASection;
