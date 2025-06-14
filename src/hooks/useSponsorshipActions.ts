
import { useState } from 'react';
import { toast } from 'sonner';
import { generatePartnershipGuide } from '@/components/sponsorship/services/pdfGenerationService';

export const useSponsorshipActions = () => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleLearnMore = (tierName: string) => {
    const subject = `Interest in ${tierName} Sponsorship`;
    const body = `Hello,\n\nI would like to learn more about the ${tierName} sponsorship tier and how our organization can get involved.\n\nPlease provide additional details about:\n- Specific benefits and opportunities\n- Partnership process and timeline\n- Available customization options\n\nThank you for your time.\n\nBest regards`;
    
    const mailtoUrl = `mailto:contact@mansamusamarketplace.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
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
