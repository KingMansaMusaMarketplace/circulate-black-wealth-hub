import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, FileText } from 'lucide-react';
import { format, addYears } from 'date-fns';
import { toast } from 'sonner';
import jsPDF from 'jspdf';

interface Sponsor {
  id: string;
  company_name: string;
  tier: string;
  created_at: string;
  current_period_end: string | null;
}

interface SponsorCertificateGeneratorProps {
  sponsor: Sponsor;
}

export function SponsorCertificateGenerator({ sponsor }: SponsorCertificateGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [validFrom, setValidFrom] = useState(format(new Date(sponsor.created_at), 'yyyy-MM-dd'));
  const [validTo, setValidTo] = useState(
    sponsor.current_period_end
      ? format(new Date(sponsor.current_period_end), 'yyyy-MM-dd')
      : format(addYears(new Date(), 1), 'yyyy-MM-dd')
  );

  const generateCertificate = async () => {
    setIsGenerating(true);
    
    try {
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Background
      doc.setFillColor(15, 23, 42); // Dark blue
      doc.rect(0, 0, pageWidth, pageHeight, 'F');

      // Border
      doc.setDrawColor(212, 175, 55); // Gold
      doc.setLineWidth(2);
      doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
      doc.setLineWidth(0.5);
      doc.rect(15, 15, pageWidth - 30, pageHeight - 30);

      // Corner decorations
      const cornerSize = 20;
      doc.setDrawColor(212, 175, 55);
      doc.setLineWidth(1);
      // Top left
      doc.line(10, 30, 30, 10);
      // Top right
      doc.line(pageWidth - 30, 10, pageWidth - 10, 30);
      // Bottom left
      doc.line(10, pageHeight - 30, 30, pageHeight - 10);
      // Bottom right
      doc.line(pageWidth - 30, pageHeight - 10, pageWidth - 10, pageHeight - 30);

      // Title
      doc.setTextColor(212, 175, 55);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'normal');
      doc.text('MANSA MUSA MARKETPLACE', pageWidth / 2, 35, { align: 'center' });

      doc.setFontSize(36);
      doc.setFont('helvetica', 'bold');
      doc.text('CERTIFICATE OF SPONSORSHIP', pageWidth / 2, 55, { align: 'center' });

      // Subtitle
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      doc.text('This certifies that', pageWidth / 2, 75, { align: 'center' });

      // Company Name
      doc.setTextColor(212, 175, 55);
      doc.setFontSize(32);
      doc.setFont('helvetica', 'bold');
      doc.text(sponsor.company_name.toUpperCase(), pageWidth / 2, 95, { align: 'center' });

      // Tier Badge
      const tierColors: Record<string, string> = {
        platinum: '#a855f7',
        gold: '#eab308',
        silver: '#a1a1aa',
        bronze: '#f97316',
      };
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      doc.text('is recognized as a', pageWidth / 2, 110, { align: 'center' });

      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(tierColors[sponsor.tier] || '#ffffff');
      doc.text(`${sponsor.tier.toUpperCase()} SPONSOR`, pageWidth / 2, 125, { align: 'center' });

      // Description
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      const description = 'In recognition of their commitment to supporting Black-owned businesses and contributing to economic empowerment in our community.';
      const splitDescription = doc.splitTextToSize(description, 200);
      doc.text(splitDescription, pageWidth / 2, 145, { align: 'center' });

      // Validity Period
      doc.setFontSize(11);
      doc.setTextColor(180, 180, 180);
      doc.text(`Valid from ${format(new Date(validFrom), 'MMMM d, yyyy')} to ${format(new Date(validTo), 'MMMM d, yyyy')}`, pageWidth / 2, 170, { align: 'center' });

      // Certificate ID
      doc.setFontSize(9);
      doc.text(`Certificate ID: MMM-CERT-${sponsor.id.slice(0, 8).toUpperCase()}`, pageWidth / 2, 180, { align: 'center' });

      // Signature line
      doc.setDrawColor(180, 180, 180);
      doc.setLineWidth(0.3);
      doc.line(pageWidth / 2 - 50, 195, pageWidth / 2 + 50, 195);
      
      doc.setFontSize(10);
      doc.setTextColor(180, 180, 180);
      doc.text('Mansa Musa Marketplace', pageWidth / 2, 200, { align: 'center' });

      // Save the PDF
      doc.save(`${sponsor.company_name.replace(/\s+/g, '_')}_Sponsorship_Certificate.pdf`);
      
      toast.success('Certificate generated successfully!');
    } catch (error) {
      console.error('Error generating certificate:', error);
      toast.error('Failed to generate certificate');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateTaxLetter = async () => {
    setIsGenerating(true);
    
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 25;

      // Header
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(27, 54, 93); // Brand color
      doc.text('MANSA MUSA MARKETPLACE', margin, 30);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text('Supporting Black-Owned Businesses', margin, 37);

      // Line
      doc.setDrawColor(27, 54, 93);
      doc.setLineWidth(0.5);
      doc.line(margin, 42, pageWidth - margin, 42);

      // Date
      doc.setTextColor(50, 50, 50);
      doc.text(format(new Date(), 'MMMM d, yyyy'), margin, 55);

      // Recipient
      doc.setFont('helvetica', 'bold');
      doc.text(sponsor.company_name, margin, 70);
      doc.setFont('helvetica', 'normal');

      // Subject
      doc.setFont('helvetica', 'bold');
      doc.text('RE: Sponsorship Acknowledgment Letter', margin, 85);
      doc.setFont('helvetica', 'normal');

      // Body
      const body = `Dear ${sponsor.company_name},

Thank you for your generous support of Mansa Musa Marketplace through your ${sponsor.tier.toUpperCase()} sponsorship.

This letter acknowledges that your organization has contributed sponsorship support during the period from ${format(new Date(validFrom), 'MMMM d, yyyy')} to ${format(new Date(validTo), 'MMMM d, yyyy')}.

Your sponsorship helps us continue our mission of supporting and promoting Black-owned businesses in our community, fostering economic empowerment and creating opportunities for entrepreneurs.

Please consult with your tax advisor regarding the deductibility of your sponsorship contribution.

Sponsorship Details:
- Sponsor Level: ${sponsor.tier.toUpperCase()}
- Period: ${format(new Date(validFrom), 'MMMM d, yyyy')} - ${format(new Date(validTo), 'MMMM d, yyyy')}
- Reference ID: MMM-${sponsor.id.slice(0, 8).toUpperCase()}

We deeply appreciate your commitment to our community and look forward to our continued partnership.

With gratitude,


Mansa Musa Marketplace
Thomas@1325.AI`;

      const splitBody = doc.splitTextToSize(body, pageWidth - (margin * 2));
      doc.text(splitBody, margin, 100);

      // Save
      doc.save(`${sponsor.company_name.replace(/\s+/g, '_')}_Tax_Letter.pdf`);
      
      toast.success('Tax letter generated successfully!');
    } catch (error) {
      console.error('Error generating tax letter:', error);
      toast.error('Failed to generate tax letter');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Valid From</Label>
          <Input type="date" value={validFrom} onChange={(e) => setValidFrom(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Valid To</Label>
          <Input type="date" value={validTo} onChange={(e) => setValidTo(e.target.value)} />
        </div>
      </div>

      {/* Preview */}
      <div className="border rounded-lg p-6 bg-slate-900 text-white">
        <div className="text-center space-y-4">
          <p className="text-amber-400 text-sm tracking-wider">MANSA MUSA MARKETPLACE</p>
          <h2 className="text-2xl font-bold text-amber-400">CERTIFICATE OF SPONSORSHIP</h2>
          <p className="text-sm">This certifies that</p>
          <p className="text-xl font-bold text-amber-400">{sponsor.company_name.toUpperCase()}</p>
          <p className="text-sm">is recognized as a</p>
          <p className="text-lg font-bold capitalize">{sponsor.tier} Sponsor</p>
          <p className="text-xs text-gray-400">
            Valid from {format(new Date(validFrom), 'MMM d, yyyy')} to {format(new Date(validTo), 'MMM d, yyyy')}
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <Button onClick={generateCertificate} disabled={isGenerating} className="flex-1">
          <Download className="h-4 w-4 mr-2" />
          Download Certificate
        </Button>
        <Button onClick={generateTaxLetter} disabled={isGenerating} variant="outline" className="flex-1">
          <FileText className="h-4 w-4 mr-2" />
          Download Tax Letter
        </Button>
      </div>
    </div>
  );
}
