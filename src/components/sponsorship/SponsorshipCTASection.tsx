
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
    <section className="py-16 bg-mansablue">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-6">
          Ready to Make an Impact?
        </h2>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Contact our partnership team to discuss custom sponsorship opportunities 
          that align with your company's values and goals.
        </p>
        <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <Button 
            size="lg" 
            className="bg-mansagold hover:bg-mansagold-dark text-mansablue"
            onClick={onContactPartnership}
          >
            Contact Partnership Team
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-mansablue"
            onClick={onDownloadGuide}
            disabled={isGeneratingPDF}
          >
            {isGeneratingPDF ? 'Generating...' : 'Download Partnership Guide'}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SponsorshipCTASection;
