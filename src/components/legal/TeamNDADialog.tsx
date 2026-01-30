import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Download, FileText, Printer, Shield } from 'lucide-react';
import TeamNDADocument from './TeamNDADocument';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface TeamNDADialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TeamNDADialog: React.FC<TeamNDADialogProps> = ({ open, onOpenChange }) => {
  const [recipientName, setRecipientName] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);
  const pdfContainerRef = useRef<HTMLDivElement>(null);

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
      // Create a temporary container for PDF generation
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0';
      tempContainer.style.width = '8.5in';
      tempContainer.style.backgroundColor = '#ffffff';
      tempContainer.style.padding = '0.5in';
      document.body.appendChild(tempContainer);

      // Clone the document content
      const docElement = pdfContainerRef.current;
      if (!docElement) {
        throw new Error("Document element not found");
      }
      
      const clonedContent = docElement.cloneNode(true) as HTMLElement;
      tempContainer.appendChild(clonedContent);

      // Use html2canvas + jsPDF
      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: tempContainer.scrollWidth,
        height: tempContainer.scrollHeight
      });

      // Clean up temp container
      document.body.removeChild(tempContainer);

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'in',
        format: 'letter'
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 0.5;
      const contentWidth = pageWidth - (margin * 2);
      
      const imgWidth = contentWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Handle multi-page PDF
      let yPosition = margin;
      const availableHeight = pageHeight - (margin * 2);
      
      if (imgHeight <= availableHeight) {
        // Single page
        pdf.addImage(imgData, 'JPEG', margin, margin, imgWidth, imgHeight);
      } else {
        // Multi-page - split the image
        let remainingHeight = imgHeight;
        let sourceY = 0;
        
        while (remainingHeight > 0) {
          const sliceHeight = Math.min(availableHeight, remainingHeight);
          const sourceSliceHeight = (sliceHeight / imgHeight) * canvas.height;
          
          // Create a canvas for this page slice
          const pageCanvas = document.createElement('canvas');
          pageCanvas.width = canvas.width;
          pageCanvas.height = sourceSliceHeight;
          const ctx = pageCanvas.getContext('2d');
          
          if (ctx) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
            ctx.drawImage(
              canvas,
              0, sourceY, canvas.width, sourceSliceHeight,
              0, 0, canvas.width, sourceSliceHeight
            );
            
            const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.98);
            
            if (sourceY > 0) {
              pdf.addPage();
            }
            
            pdf.addImage(pageImgData, 'JPEG', margin, margin, imgWidth, sliceHeight);
          }
          
          sourceY += sourceSliceHeight;
          remainingHeight -= sliceHeight;
        }
      }

      const filename = `1325AI_Team_NDA_${recipientName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(filename);
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
              <Button variant="outline" onClick={handlePrint} disabled={!recipientName.trim() || !acknowledged}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <div ref={pdfContainerRef}>
            <TeamNDADocument 
              recipientName={recipientName || "[RECIPIENT NAME]"}
            />
          </div>
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
