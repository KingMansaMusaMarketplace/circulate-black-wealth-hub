import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Download, FileText, Printer, Shield, Mail } from 'lucide-react';
import TeamNDADocument from './TeamNDADocument';
import NDACoverLetter from './NDACoverLetter';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface TeamNDADialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TeamNDADialog: React.FC<TeamNDADialogProps> = ({ open, onOpenChange }) => {
  const [recipientName, setRecipientName] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloadingCoverLetter, setIsDownloadingCoverLetter] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const coverLetterRef = useRef<HTMLDivElement>(null);

  const generatePDFFromElement = async (
    element: HTMLElement, 
    filename: string,
    setLoading: (loading: boolean) => void
  ) => {
    setLoading(true);

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
      const clonedContent = element.cloneNode(true) as HTMLElement;
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

      pdf.save(filename);
      return true;
    } catch (error) {
      console.error('PDF generation error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!recipientName.trim()) {
      toast.error("Please enter the recipient's name before downloading.");
      return;
    }

    if (!acknowledged) {
      toast.error("Please acknowledge the terms before downloading.");
      return;
    }

    const docElement = pdfContainerRef.current;
    if (!docElement) {
      toast.error("Document element not found");
      return;
    }

    try {
      const filename = `1325AI_Team_NDA_${recipientName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      await generatePDFFromElement(docElement, filename, setIsDownloading);
      toast.success("NDA document downloaded successfully.");
    } catch (error) {
      toast.error("Failed to generate PDF. Please try again.");
    }
  };

  const handleDownloadCoverLetter = async () => {
    if (!recipientName.trim()) {
      toast.error("Please enter the recipient's name before downloading.");
      return;
    }

    const coverElement = coverLetterRef.current;
    if (!coverElement) {
      toast.error("Cover letter element not found");
      return;
    }

    try {
      const filename = `1325AI_NDA_Cover_Letter_${recipientName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      await generatePDFFromElement(coverElement, filename, setIsDownloadingCoverLetter);
      toast.success("Cover letter downloaded successfully.");
    } catch (error) {
      toast.error("Failed to generate cover letter. Please try again.");
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
            <div className="flex items-end gap-2 flex-wrap">
              <Button 
                onClick={handleDownloadCoverLetter} 
                disabled={isDownloadingCoverLetter || !recipientName.trim()}
                variant="outline"
                className="border-primary/50 text-primary hover:bg-primary/10"
              >
                <Mail className="h-4 w-4 mr-2" />
                {isDownloadingCoverLetter ? "Generating..." : "Cover Letter"}
              </Button>
              <Button 
                onClick={handleDownloadPDF} 
                disabled={isDownloading || !recipientName.trim() || !acknowledged}
                className="bg-mansablue hover:bg-mansablue-dark"
              >
                <Download className="h-4 w-4 mr-2" />
                {isDownloading ? "Generating..." : "Download NDA"}
              </Button>
              <Button variant="outline" onClick={handlePrint} disabled={!recipientName.trim() || !acknowledged}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          {/* Hidden cover letter for PDF generation */}
          <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
            <div ref={coverLetterRef}>
              <NDACoverLetter recipientName={recipientName || "Team"} />
            </div>
          </div>
          
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
