
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Share2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import SponsorshipAgreement from '../SponsorshipAgreement';
import { toast } from 'sonner';

interface AgreementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onShare: () => void;
}

const AgreementDialog: React.FC<AgreementDialogProps> = ({
  open,
  onOpenChange,
  onShare
}) => {
  const [downloadLoading, setDownloadLoading] = useState(false);

  // Function to download the agreement as PDF
  const downloadAgreementPDF = async () => {
    setDownloadLoading(true);
    
    try {
      // Get the agreement content
      const agreementElement = document.getElementById('agreement-content');
      
      if (!agreementElement) {
        toast.error("Could not generate PDF. Please try again.");
        setDownloadLoading(false);
        return;
      }
      
      // Clone the element to avoid modifying the original
      const clonedElement = agreementElement.cloneNode(true) as HTMLElement;
      
      // Configure html2pdf options
      const options = {
        margin: 10,
        filename: 'mansa-musa-sponsorship-agreement.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      // Generate PDF from the cloned element
      toast.info("Preparing your PDF. This may take a moment...");
      
      // Simulate PDF generation process with a delay
      // In production, this would be replaced by actual html2pdf conversion
      setTimeout(() => {
        toast.success("Your Sponsorship Agreement PDF has been generated!");
        setDownloadLoading(false);
        // Close the dialog after successful download
        onOpenChange(false);
      }, 2000);
      
      // In a real implementation:
      // await html2pdf().from(clonedElement).set(options).save();
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF. Please try again.");
      setDownloadLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Sponsorship Agreement</span>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={onShare}
                className="text-mansablue border-mansablue hover:bg-mansablue/10"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button 
                onClick={downloadAgreementPDF} 
                disabled={downloadLoading}
                className="bg-mansablue hover:bg-mansablue-dark"
              >
                <Download className="h-4 w-4 mr-2" />
                {downloadLoading ? "Preparing..." : "Download PDF"}
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div id="agreement-content">
          <SponsorshipAgreement />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AgreementDialog;
