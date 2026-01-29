import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Book, Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import { ALL_USER_GUIDE_SECTIONS } from '@/lib/user-guide-content';
import neuralBrainLogo from '@/assets/1325-neural-brain-logo.jpeg';

interface UserGuideExportProps {
  onBack?: () => void;
}

// Helper to load image as base64
const loadImageAsBase64 = (src: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/jpeg'));
      } else {
        reject(new Error('Could not get canvas context'));
      }
    };
    img.onerror = reject;
    img.src = src;
  });
};

// Standalone export function for use outside the component
export const exportUserGuideToPDF = async () => {
  try {
    // Load logo first
    let logoData: string | null = null;
    try {
      logoData = await loadImageAsBase64(neuralBrainLogo);
    } catch (e) {
      console.warn('Could not load logo for PDF:', e);
    }

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let yPosition = margin;

    const addPageFooter = () => {
      const pageNum = pdf.getNumberOfPages();
      pdf.setFontSize(7);
      pdf.setTextColor(100, 100, 100);
      pdf.text('1325.AI Platform User Guide - Comprehensive Documentation', pageWidth / 2, pageHeight - 15, { align: 'center' });
      pdf.setFontSize(8);
      pdf.setTextColor(128, 128, 128);
      pdf.text(`Page ${pageNum}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    };

    const checkNewPage = (requiredSpace: number = 30) => {
      if (yPosition + requiredSpace > pageHeight - 25) {
        addPageFooter();
        pdf.addPage();
        yPosition = margin;
        return true;
      }
      return false;
    };

    // COVER PAGE
    pdf.setFillColor(26, 54, 93);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');

    // Add logo at top center
    if (logoData) {
      const logoSize = 50;
      pdf.addImage(logoData, 'JPEG', (pageWidth - logoSize) / 2, 25, logoSize, logoSize);
    }

    pdf.setFillColor(214, 158, 46);
    pdf.rect(0, pageHeight * 0.45, pageWidth, 8, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(42);
    pdf.setFont('helvetica', 'bold');
    pdf.text('1325.AI PLATFORM', pageWidth / 2, pageHeight * 0.35, { align: 'center' });
    pdf.setFontSize(48);
    pdf.setTextColor(214, 158, 46);
    pdf.text('USER GUIDE', pageWidth / 2, pageHeight * 0.43, { align: 'center' });
    pdf.setFontSize(18);
    pdf.setTextColor(200, 200, 200);
    pdf.setFont('helvetica', 'italic');
    pdf.text('Comprehensive Platform Documentation', pageWidth / 2, pageHeight * 0.55, { align: 'center' });
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Version 1.0 | ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`, pageWidth / 2, pageHeight * 0.62, { align: 'center' });
    pdf.setFontSize(10);
    pdf.setTextColor(150, 150, 150);
    pdf.text('Building the Future of Digital Commerce | AI', pageWidth / 2, pageHeight - 30, { align: 'center' });
    pdf.text('www.1325.AI', pageWidth / 2, pageHeight - 22, { align: 'center' });

    // TABLE OF CONTENTS
    pdf.addPage();
    yPosition = margin;
    pdf.setTextColor(26, 54, 93);
    pdf.setFontSize(28);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Table of Contents', margin, yPosition);
    yPosition += 15;
    pdf.setDrawColor(214, 158, 46);
    pdf.setLineWidth(1);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 15;

    let pageCounter = 3;

    ALL_USER_GUIDE_SECTIONS.forEach((category) => {
      checkNewPage(20);
      pdf.setTextColor(214, 158, 46);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text(category.category, margin, yPosition);
      yPosition += 8;

      category.sections.forEach((section) => {
        checkNewPage(12);
        pdf.setTextColor(60, 60, 60);
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        const title = section.title;
        const pageNum = pageCounter.toString();
        const titleWidth = pdf.getTextWidth(title);
        const pageNumWidth = pdf.getTextWidth(pageNum);
        const dotsWidth = contentWidth - titleWidth - pageNumWidth - 4;
        const dotCount = Math.floor(dotsWidth / pdf.getTextWidth('.'));
        const dots = '.'.repeat(Math.max(dotCount, 3));
        pdf.text(title, margin + 8, yPosition);
        pdf.text(dots, margin + 8 + titleWidth + 2, yPosition);
        pdf.text(pageNum, pageWidth - margin, yPosition, { align: 'right' });
        yPosition += 7;
        pageCounter++;
      });
      yPosition += 5;
    });

    addPageFooter();

    // CONTENT SECTIONS
    ALL_USER_GUIDE_SECTIONS.forEach((category) => {
      pdf.addPage();
      yPosition = margin;
      pdf.setFillColor(240, 245, 250);
      pdf.rect(margin - 5, yPosition - 5, contentWidth + 10, 25, 'F');
      pdf.setTextColor(26, 54, 93);
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text(category.category, margin, yPosition + 12);
      yPosition += 30;

      category.sections.forEach((section) => {
        checkNewPage(50);
        pdf.setFillColor(214, 158, 46);
        pdf.rect(margin, yPosition, 5, 18, 'F');
        pdf.setTextColor(26, 54, 93);
        pdf.setFontSize(18);
        pdf.setFont('helvetica', 'bold');
        pdf.text(section.title, margin + 10, yPosition + 12);
        yPosition += 8;
        pdf.setTextColor(100, 100, 100);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'italic');
        pdf.text(section.description, margin + 10, yPosition + 12);
        yPosition += 25;

        section.content.forEach((content, contentIdx) => {
          checkNewPage(60);
          pdf.setTextColor(50, 50, 50);
          pdf.setFontSize(14);
          pdf.setFont('helvetica', 'bold');
          pdf.text(`${contentIdx + 1}. ${content.title}`, margin, yPosition);
          yPosition += 6;

          pdf.setTextColor(80, 80, 80);
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'italic');
          const summaryLines = pdf.splitTextToSize(content.summary, contentWidth);
          pdf.text(summaryLines, margin, yPosition);
          yPosition += summaryLines.length * 5 + 5;

          checkNewPage(30);
          pdf.setTextColor(60, 60, 60);
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'normal');
          const detailLines = pdf.splitTextToSize(content.details, contentWidth);
          detailLines.forEach((line: string) => {
            checkNewPage(6);
            pdf.text(line, margin, yPosition);
            yPosition += 5;
          });
          yPosition += 5;

          if (content.steps && content.steps.length > 0) {
            checkNewPage(20);
            pdf.setTextColor(26, 54, 93);
            pdf.setFontSize(11);
            pdf.setFont('helvetica', 'bold');
            pdf.text('Steps:', margin, yPosition);
            yPosition += 6;
            content.steps.forEach((step, stepIdx) => {
              checkNewPage(8);
              pdf.setTextColor(60, 60, 60);
              pdf.setFontSize(9);
              pdf.setFont('helvetica', 'normal');
              const stepLines = pdf.splitTextToSize(`${stepIdx + 1}. ${step}`, contentWidth - 5);
              stepLines.forEach((line: string) => {
                checkNewPage(5);
                pdf.text(line, margin + 5, yPosition);
                yPosition += 4.5;
              });
            });
            yPosition += 5;
          }

          if (content.tips && content.tips.length > 0) {
            checkNewPage(20);
            const tipsHeight = 8 + (content.tips.length * 5);
            pdf.setFillColor(255, 250, 240);
            pdf.setDrawColor(214, 158, 46);
            pdf.setLineWidth(0.5);
            pdf.rect(margin, yPosition - 2, contentWidth, tipsHeight + 4, 'FD');
            pdf.setTextColor(180, 130, 30);
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'bold');
            pdf.text('Pro Tips:', margin + 3, yPosition + 4);
            yPosition += 8;
            content.tips.forEach((tip) => {
              checkNewPage(6);
              pdf.setTextColor(120, 90, 20);
              pdf.setFontSize(9);
              pdf.setFont('helvetica', 'normal');
              const tipLines = pdf.splitTextToSize(`- ${tip}`, contentWidth - 10);
              tipLines.forEach((line: string) => {
                pdf.text(line, margin + 5, yPosition);
                yPosition += 4.5;
              });
            });
            yPosition += 8;
          }

          yPosition += 8;
        });

        yPosition += 10;
        addPageFooter();
      });
    });

    // FINAL PAGE
    pdf.addPage();
    yPosition = margin;
    pdf.setFillColor(26, 54, 93);
    pdf.rect(0, 0, pageWidth, 60, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Need More Help?', pageWidth / 2, 35, { align: 'center' });
    yPosition = 80;
    pdf.setTextColor(60, 60, 60);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    const supportInfo = [
      'Visit our Help Center: www.1325.AI/help',
      'Email Support: Thomas@1325.AI',
      'Contact Form: www.1325.AI/contact',
      '',
      'Our support team typically responds within 24 hours.',
      '',
      'For business inquiries:',
      '- Partner Program: www.1325.AI/partner-portal',
      '- Developer APIs: www.1325.AI/developers',
      '- Corporate Sponsorship: www.1325.AI/corporate-sponsorship'
    ];
    supportInfo.forEach((line) => {
      pdf.text(line, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 8;
    });
    yPosition += 20;
    pdf.setTextColor(214, 158, 46);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Thank you for being part of the 1325.AI community!', pageWidth / 2, yPosition, { align: 'center' });
    addPageFooter();

    pdf.save('1325AI_User_Guide.pdf');
    toast.success('User Guide PDF generated successfully!');
  } catch (error) {
    console.error('Error generating PDF:', error);
    toast.error('Failed to generate PDF. Please try again.');
  }
};

const UserGuideExport: React.FC<UserGuideExportProps> = ({ onBack }) => {
  const [generatingPdf, setGeneratingPdf] = useState(false);

  const generatePDF = async () => {
    setGeneratingPdf(true);
    await exportUserGuideToPDF();
    setGeneratingPdf(false);
  };

  return (
    <Card className="bg-slate-800/60 backdrop-blur-xl border-white/10">
      <CardHeader className="border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
            <Book className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl text-white">User Guide Export</CardTitle>
            <CardDescription className="text-blue-200/70">
              Download the comprehensive platform user guide as PDF
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="bg-slate-900/60 rounded-lg p-4 border border-white/10">
          <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4 text-mansagold" />
            Document Contents
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            {ALL_USER_GUIDE_SECTIONS.map((category) => (
              <div key={category.category} className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-blue-200/80">{category.category}</span>
                <Badge variant="outline" className="text-xs bg-mansablue/20 border-mansablue/30 text-blue-200">
                  {category.sections.length} sections
                </Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-slate-900/40 rounded-lg border border-white/5">
            <div className="text-2xl font-bold text-mansagold">
              {ALL_USER_GUIDE_SECTIONS.length}
            </div>
            <div className="text-xs text-blue-200/60">Categories</div>
          </div>
          <div className="text-center p-3 bg-slate-900/40 rounded-lg border border-white/5">
            <div className="text-2xl font-bold text-mansagold">
              {ALL_USER_GUIDE_SECTIONS.reduce((acc, cat) => acc + cat.sections.length, 0)}
            </div>
            <div className="text-xs text-blue-200/60">Sections</div>
          </div>
          <div className="text-center p-3 bg-slate-900/40 rounded-lg border border-white/5">
            <div className="text-2xl font-bold text-mansagold">
              {ALL_USER_GUIDE_SECTIONS.reduce((acc, cat) => 
                acc + cat.sections.reduce((a, s) => a + s.content.length, 0), 0
              )}
            </div>
            <div className="text-xs text-blue-200/60">Topics</div>
          </div>
        </div>

        <Button
          onClick={generatePDF}
          disabled={generatingPdf}
          className="w-full bg-gradient-to-r from-mansagold to-amber-500 hover:from-amber-500 hover:to-mansagold text-slate-900 font-bold py-4"
        >
          {generatingPdf ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Generating User Guide PDF...
            </>
          ) : (
            <>
              <Download className="h-5 w-5 mr-2" />
              Download User Guide PDF
            </>
          )}
        </Button>

        <p className="text-xs text-blue-200/50 text-center">
          The PDF includes all platform documentation with step-by-step instructions and pro tips.
        </p>
      </CardContent>
    </Card>
  );
};

export default UserGuideExport;
