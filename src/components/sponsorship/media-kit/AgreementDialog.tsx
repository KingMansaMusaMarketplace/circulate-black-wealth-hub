
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import SocialShareButtons from '@/components/common/SocialShareButtons';
import { toast } from 'sonner';
import { Download, Share2 } from 'lucide-react';
import { generatePDF } from '../utils/pdfGenerator';

interface AgreementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onShare: () => void;
}

const AgreementDialog: React.FC<AgreementDialogProps> = ({ open, onOpenChange, onShare }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  
  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const agreementHTML = `
        <h1>1325.AI SPONSORSHIP AGREEMENT</h1>
        <p>Last Updated: May 20, 2025</p>
        <h2>1. PARTIES</h2>
        <p>This Sponsorship Agreement (the "Agreement") is entered into between 1325.AI, a corporation organized and existing under the laws of [State] ("1325.AI"), and the sponsor identified in the Sponsorship Application ("Sponsor").</p>
        <h2>2. SPONSORSHIP BENEFITS</h2>
        <p>1325.AI agrees to provide Sponsor with the benefits associated with the sponsorship level selected by Sponsor in the Sponsorship Application. These benefits may include, but are not limited to, logo placement, promotional activities, distribution of materials, and digital marketing exposure.</p>
        <h2>3. TERM</h2>
        <p>This Agreement shall commence on the Effective Date and continue for the duration specified in the Sponsorship Application, unless terminated earlier in accordance with this Agreement.</p>
        <h2>4. SPONSORSHIP FEE</h2>
        <p>Sponsor agrees to pay 1325.AI the fee associated with the selected sponsorship level, as set forth in the Sponsorship Application. Unless otherwise specified, all fees are due within thirty (30) days of the Effective Date.</p>
        <h2>5. INTELLECTUAL PROPERTY</h2>
        <p>Each party retains all rights to its respective intellectual property. Sponsor hereby grants 1325.AI a non-exclusive, royalty-free license to use Sponsor's name, logo, and other materials provided by Sponsor for the purpose of fulfilling this Agreement.</p>
        <h2>6. TERMINATION</h2>
        <p>Either party may terminate this Agreement for material breach by the other party, if such breach remains uncured for thirty (30) days after written notice. In the event of such termination, Sponsor shall be entitled to a prorated refund of any prepaid sponsorship fees.</p>
        <h2>7. LIMITATION OF LIABILITY</h2>
        <p>Neither party shall be liable to the other for any indirect, incidental, special, or consequential damages arising out of this Agreement, even if advised of the possibility of such damages.</p>
        <h2>8. MISCELLANEOUS</h2>
        <p>This Agreement constitutes the entire agreement between the parties with respect to the subject matter hereof and supersedes all prior and contemporaneous agreements or communications. This Agreement may only be modified by a written amendment signed by both parties.</p>
      `;
      await generatePDF({ filename: '1325AI-Sponsorship-Agreement.pdf', content: agreementHTML });
      toast.success("Agreement PDF downloaded successfully.");
    } catch (error) {
      console.error('Error generating agreement PDF:', error);
      toast.error('Failed to download agreement PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">Sponsorship Agreement</DialogTitle>
        </DialogHeader>
        
        <div className="py-6">
          <div className="prose max-w-none">
            <h2>1325.AI SPONSORSHIP AGREEMENT</h2>
            <p className="text-gray-600">Last Updated: May 20, 2025</p>
            
            <h3>1. PARTIES</h3>
            <p>
              This Sponsorship Agreement (the "Agreement") is entered into between 1325.AI, 
              a corporation organized and existing under the laws of [State] ("1325.AI"), 
              and the sponsor identified in the Sponsorship Application ("Sponsor").
            </p>
            
            <h3>2. SPONSORSHIP BENEFITS</h3>
            <p>
              1325.AI agrees to provide Sponsor with the benefits associated with the sponsorship level 
              selected by Sponsor in the Sponsorship Application. These benefits may include, but are not limited to, 
              logo placement, promotional activities, distribution of materials, and digital marketing exposure.
            </p>
            
            <h3>3. TERM</h3>
            <p>
              This Agreement shall commence on the Effective Date and continue for the duration specified in the 
              Sponsorship Application, unless terminated earlier in accordance with this Agreement.
            </p>
            
            <h3>4. SPONSORSHIP FEE</h3>
            <p>
              Sponsor agrees to pay 1325.AI the fee associated with the selected sponsorship level, 
              as set forth in the Sponsorship Application. Unless otherwise specified, all fees are due within 
              thirty (30) days of the Effective Date.
            </p>
            
            <h3>5. INTELLECTUAL PROPERTY</h3>
            <p>
              Each party retains all rights to its respective intellectual property. Sponsor hereby grants 1325.AI 
              a non-exclusive, royalty-free license to use Sponsor's name, logo, and other materials provided by Sponsor 
              for the purpose of fulfilling this Agreement.
            </p>
            
            <h3>6. TERMINATION</h3>
            <p>
              Either party may terminate this Agreement for material breach by the other party, if such breach remains 
              uncured for thirty (30) days after written notice. In the event of such termination, Sponsor shall be 
              entitled to a prorated refund of any prepaid sponsorship fees.
            </p>
            
            <h3>7. LIMITATION OF LIABILITY</h3>
            <p>
              Neither party shall be liable to the other for any indirect, incidental, special, or consequential damages 
              arising out of this Agreement, even if advised of the possibility of such damages.
            </p>
            
            <h3>8. MISCELLANEOUS</h3>
            <p>
              This Agreement constitutes the entire agreement between the parties with respect to the subject matter hereof 
              and supersedes all prior and contemporaneous agreements or communications. This Agreement may only be modified 
              by a written amendment signed by both parties.
            </p>
          </div>
          
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between items-center border-t pt-6">
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              <Button 
                onClick={handleDownloadPDF} 
                className="bg-mansablue hover:bg-mansablue-dark"
                disabled={isDownloading}
              >
                <Download className="h-4 w-4 mr-2" />
                {isDownloading ? "Downloading..." : "Download PDF"}
              </Button>
              
              <Button variant="outline" onClick={onShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
            
            <div>
              <SocialShareButtons
                title="1325.AI Sponsorship Agreement"
                text="Join our sponsorship program and make a difference in our community."
                url="https://1325.ai/sponsorship/agreement"
                showLabels={false}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AgreementDialog;
