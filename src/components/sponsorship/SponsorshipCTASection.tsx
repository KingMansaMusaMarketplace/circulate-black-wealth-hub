
import React from 'react';
import { Button } from '@/components/ui/button';

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
    <section className="py-16 relative z-10">
      <div className="container mx-auto px-4">
        <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-white/10 p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-yellow-400 mb-6">
            Ready to Make an Impact?
          </h2>
          <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
            Contact our partnership team to discuss custom sponsorship opportunities 
            that align with your company's values and goals.
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Button 
              size="lg" 
              className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold"
              onClick={onContactPartnership}
            >
              Contact Partnership Team
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-yellow-400 text-yellow-400 hover:bg-yellow-400/10 font-semibold"
              onClick={onDownloadGuide}
              disabled={isGeneratingPDF}
            >
              {isGeneratingPDF ? 'Generating...' : 'Download Partnership Guide'}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SponsorshipCTASection;
