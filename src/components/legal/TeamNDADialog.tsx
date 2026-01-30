import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Download, FileText, Printer, Shield } from 'lucide-react';
import TeamNDADocument from './TeamNDADocument';

interface TeamNDADialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TeamNDADialog: React.FC<TeamNDADialogProps> = ({ open, onOpenChange }) => {
  const [recipientName, setRecipientName] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);
  const documentRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    if (!recipientName.trim()) {
      toast.error("Please enter the recipient's name before downloading.");
      return;
    }

    if (!acknowledged) {
      toast.error("Please acknowledge the terms before downloading.");
      return;
    }

    setIsDownloading(true);

    try {
      const element = documentRef.current;
      if (!element) {
        throw new Error("Document element not found");
      }

      // Dynamic import for html2pdf.js (ESM compatibility)
      const html2pdfModule = await import('html2pdf.js');
      const html2pdf = html2pdfModule.default || html2pdfModule;

      const opt = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: `1325AI_Team_NDA_${recipientName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      await html2pdf().set(opt).from(element).save();
      toast.success("NDA document downloaded successfully.");
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    if (!recipientName.trim()) {
      toast.error("Please enter the recipient's name before printing.");
      return;
    }

    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Shield className="h-5 w-5 text-mansablue" />
            Team Member NDA - Full Legal Protection
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-shrink-0 border-b pb-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="recipientName">Recipient's Full Legal Name *</Label>
              <Input
                id="recipientName"
                placeholder="Enter team member's full legal name"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex items-end gap-2">
              <Button 
                onClick={handleDownloadPDF} 
                disabled={isDownloading || !recipientName.trim() || !acknowledged}
                className="bg-mansablue hover:bg-mansablue-dark"
              >
                <Download className="h-4 w-4 mr-2" />
                {isDownloading ? "Generating PDF..." : "Download PDF"}
              </Button>
              <Button variant="outline" onClick={handlePrint} disabled={!recipientName.trim()}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 border rounded-lg bg-muted/30">
            <Checkbox
              id="acknowledge"
              checked={acknowledged}
              onCheckedChange={(checked) => setAcknowledged(checked === true)}
              className="mt-0.5"
            />
            <div>
              <Label htmlFor="acknowledge" className="text-sm cursor-pointer">
                I understand this is a legally binding document that should be reviewed by an attorney 
                before execution. This NDA provides comprehensive protection for 1325.AI trade secrets 
                and intellectual property.
              </Label>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4" ref={documentRef}>
          <TeamNDADocument 
            recipientName={recipientName || "[RECIPIENT NAME]"}
          />
        </div>

        <div className="flex-shrink-0 border-t pt-4 text-xs text-muted-foreground text-center">
          <p className="flex items-center justify-center gap-1">
            <FileText className="h-3 w-3" />
            This NDA covers trade secrets, IP assignment, non-compete, non-solicitation, and includes 
            injunctive relief provisions under Illinois law.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TeamNDADialog;
