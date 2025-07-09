
import { useState } from 'react';
import { toast } from 'sonner';
import { generatePartnershipGuide } from '@/components/sponsorship/services/pdfGenerationService';

export const useSponsorshipActions = () => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleLearnMore = (tierName: string) => {
    // Scroll to the sponsorship form and pre-select the tier
    const formElement = document.getElementById('sponsorship-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
      
      // Show a toast to guide the user
      toast.success(`Great choice! The ${tierName} tier is pre-selected in the form below.`);
      
      // Pre-select the tier in the form after a small delay
      setTimeout(() => {
        const tierSelect = document.querySelector('[data-tier-select]') as HTMLSelectElement;
        if (tierSelect) {
          const tierValue = tierName.toLowerCase().includes('silver') ? 'silver' : 
                           tierName.toLowerCase().includes('gold') ? 'gold' : 'platinum';
          tierSelect.value = tierValue;
        }
      }, 1000);
    }
  };

  const handleContactPartnership = () => {
    const subject = 'Partnership Inquiry - Mansa Musa Marketplace';
    const body = `Hello,\n\nI am interested in exploring corporate sponsorship opportunities with Mansa Musa Marketplace.\n\nPlease contact me to discuss:\n- Available partnership tiers\n- Custom sponsorship opportunities\n- Partnership benefits and ROI\n- Next steps in the process\n\nI look forward to hearing from you.\n\nBest regards`;
    
    const mailtoUrl = `mailto:contact@mansamusamarketplace.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  const handleDownloadGuide = async () => {
    setIsGeneratingPDF(true);
    
    try {
      await generatePartnershipGuide();
    } catch (error) {
      console.error('Error downloading partnership guide:', error);
      toast.error('Failed to download partnership guide. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return {
    isGeneratingPDF,
    handleLearnMore,
    handleContactPartnership,
    handleDownloadGuide
  };
};
