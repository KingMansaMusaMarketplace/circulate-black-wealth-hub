
import { useState } from 'react';
import { toast } from 'sonner';
import { generatePartnershipGuide } from '@/components/sponsorship/services/pdfGenerationService';

export const useSponsorshipActions = () => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleLearnMore = (tierName: string) => {
    const name = tierName.toLowerCase();

    // "Founding Partner" (tier VI) is invitation-only — route to leadership contact
    if (name.includes('founding partner')) {
      handleContactPartnership();
      return;
    }

    // Map tier display names → form values
    let tierValue: 'founding' | 'bronze' | 'silver' | 'gold' | 'platinum' | 'recommend' = 'recommend';
    if (name.includes('founding sponsor')) tierValue = 'founding';
    else if (name.includes('bronze')) tierValue = 'bronze';
    else if (name.includes('silver')) tierValue = 'silver';
    else if (name.includes('gold')) tierValue = 'gold';
    else if (name.includes('platinum')) tierValue = 'platinum';

    const formElement = document.getElementById('sponsorship-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
      toast.success(`Great choice! ${tierName} is pre-selected in the form below.`);

      // Notify the form to preselect the tier (Radix Select can't be set via DOM)
      window.dispatchEvent(
        new CustomEvent('sponsorship:preselect-tier', { detail: tierValue })
      );
    }
  };

  const handleContactPartnership = () => {
    const subject = 'Partnership Inquiry - 1325.AI';
    const body = `Hello,\n\nI am interested in exploring corporate sponsorship opportunities with 1325.AI.\n\nPlease contact me to discuss:\n- Available partnership tiers\n- Custom sponsorship opportunities\n- Partnership benefits and ROI\n- Next steps in the process\n\nI look forward to hearing from you.\n\nBest regards`;
    
    const mailtoUrl = `mailto:Thomas@1325.AI?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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
