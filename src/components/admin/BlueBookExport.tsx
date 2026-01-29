import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Book, FileType2, Loader2, CheckCircle, Clock, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, Table, TableRow, TableCell, WidthType, ShadingType, ImageRun } from 'docx';
import jsPDF from 'jspdf';
import neuralBrainLogo from '@/assets/1325-neural-brain-logo.jpeg';

interface BlueBookExportProps {
  onBack?: () => void;
}

const BlueBookExport: React.FC<BlueBookExportProps> = ({ onBack }) => {
  const [generatingWord, setGeneratingWord] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  const manualSections = [
    { title: 'Executive Summary', pages: '1-2' },
    { title: 'Platform Architecture Overview', pages: '3-8' },
    { title: 'Database Schema and Data Model', pages: '9-18' },
    { title: 'Authentication and Security', pages: '19-24' },
    { title: 'Core Business Directory System', pages: '25-30' },
    { title: 'Coalition Loyalty Program (Claims 3, 17)', pages: '31-38' },
    { title: 'CMAL Engine (Claim 2)', pages: '39-44' },
    { title: 'Temporal Founding Member System (Claim 1)', pages: '45-48' },
    { title: 'QR Transaction Processing (Claims 9, 17)', pages: '49-54' },
    { title: 'Fraud Detection Engine (Claim 4)', pages: '55-62' },
    { title: 'Voice AI Concierge - Kayla (Claims 6, 11, 12)', pages: '63-70' },
    { title: 'B2B Matching Engine (Claim 5)', pages: '71-76' },
    { title: 'Sales Agent Network (Claim 7)', pages: '77-84' },
    { title: 'Partner Referral System (Claims 21-27)', pages: '85-92' },
    { title: 'Developer Platform & API Licensing', pages: '93-102' },
    { title: 'Susu Community Finance Protocol (Claim 15)', pages: '103-108' },
    { title: 'Economic Karma System (Claim 14)', pages: '109-112' },
    { title: 'Gamification & Achievements (Claim 8)', pages: '113-118' },
    { title: 'Corporate Sponsorship Program', pages: '119-124' },
    { title: 'AI Recommendation Engine (Claim 10)', pages: '125-130' },
    { title: 'Notification & Email Systems', pages: '131-136' },
    { title: 'Mobile Application (Capacitor)', pages: '137-142' },
    { title: 'Admin Dashboard & Tools', pages: '143-148' },
    { title: 'Frontend Component Architecture', pages: '149-156' },
    { title: 'Edge Function Reference', pages: '157-168' },
    { title: 'Deployment & Operations', pages: '169-174' },
    { title: 'Patent Claims Summary', pages: '175-180' },
  ];

  const generateWordDocument = async () => {
    setGeneratingWord(true);
    try {
      // Fetch the markdown content
      const response = await fetch('/documents/1325AI_BLUE_BOOK_TECHNICAL_MANUAL.md');
      let markdownContent = await response.text();
      
      // Sanitize for Word compatibility (same as PDF)
      markdownContent = sanitizeForPdf(markdownContent);

      // Parse markdown into sections
      const sections = markdownContent.split(/^# /gm).filter(Boolean);
      
      const children: any[] = [];

      // Title Page
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: '\n\n\n\n\n', break: 5 }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: '1325.AI PLATFORM',
              bold: true,
              size: 72,
              color: '1a365d',
            }),
          ],
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: 'BLUE BOOK',
              bold: true,
              size: 96,
              color: 'd69e2e',
            }),
          ],
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: 'Technical Reference Manual',
              size: 36,
              color: '4a5568',
              italics: true,
            }),
          ],
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          children: [new TextRun({ text: '\n\n\n', break: 3 })],
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: 'Version 1.0.0',
              size: 24,
              color: '718096',
            }),
          ],
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: 'January 29, 2026',
              size: 24,
              color: '718096',
            }),
          ],
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          children: [new TextRun({ text: '\n', break: 1 })],
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: 'Thomas D. Bowling',
              size: 28,
              bold: true,
              color: '1a365d',
            }),
          ],
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: 'Inventor & Chief Architect',
              size: 22,
              bold: true,
              color: '4a5568',
            }),
          ],
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          children: [new TextRun({ text: '\n\n', break: 2 })],
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: 'USPTO Provisional Application 63/969,202',
              size: 20,
              color: 'd69e2e',
              bold: true,
            }),
          ],
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          children: [new TextRun({ text: '\n\n\n\n\n\n\n', break: 7 })],
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: 'CONFIDENTIAL AND PROPRIETARY',
              bold: true,
              size: 20,
              color: 'c53030',
            }),
          ],
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: 'PATENT PENDING - USPTO Application 63/969,202',
              bold: true,
              size: 16,
              color: 'd69e2e',
            }),
          ],
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          children: [new TextRun({ text: '\n', break: 1 })],
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: 'This document contains trade secrets and proprietary information.',
              size: 14,
              color: '4a5568',
            }),
          ],
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: 'Unauthorized reproduction, distribution, or disclosure is strictly prohibited',
              size: 14,
              color: '4a5568',
            }),
          ],
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: 'and may result in civil and criminal penalties under applicable law.',
              size: 14,
              color: '4a5568',
            }),
          ],
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          children: [new TextRun({ text: '\n', break: 1 })],
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: '© 2024-2026 1325.AI - All Rights Reserved',
              size: 16,
              color: '718096',
            }),
          ],
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: 'Contact: Thomas@1325.AI',
              size: 14,
              color: '718096',
            }),
          ],
          alignment: AlignmentType.CENTER,
        }),
      );

      // Page break before Document Control Page
      children.push(
        new Paragraph({
          children: [],
          pageBreakBefore: true,
        })
      );

      // Document Control Page
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'DOCUMENT CONTROL',
              bold: true,
              size: 36,
              color: '1a365d',
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: 'Document Control Number: ',
              bold: true,
              size: 22,
            }),
            new TextRun({
              text: `1325-BB-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
              size: 22,
              color: '2b6cb0',
            }),
          ],
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: 'Distribution Date: ',
              bold: true,
              size: 22,
            }),
            new TextRun({
              text: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
              size: 22,
            }),
          ],
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: 'Recipient Name: _________________________________________',
              size: 22,
            }),
          ],
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: 'Recipient Organization: _________________________________________',
              size: 22,
            }),
          ],
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: 'Copy Number: _______ of _______ copies distributed',
              size: 22,
            }),
          ],
          spacing: { after: 400 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: 'RETURN/DESTRUCTION REQUIREMENTS',
              bold: true,
              size: 24,
              color: 'c53030',
            }),
          ],
          spacing: { before: 300, after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: 'This document must be returned to 1325.AI or securely destroyed upon request, termination of business relationship, or when no longer needed for its intended purpose. Destruction must be by shredding or secure digital deletion with written confirmation provided to Thomas@1325.AI.',
              size: 20,
            }),
          ],
          spacing: { after: 400 },
        }),
      );

      // Page break before NDA Page
      children.push(
        new Paragraph({
          children: [],
          pageBreakBefore: true,
        })
      );

      // NDA / Confidentiality Agreement Page
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'CONFIDENTIALITY ACKNOWLEDGMENT',
              bold: true,
              size: 36,
              color: '1a365d',
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: 'By receiving, accessing, or reviewing this document, the undersigned acknowledges and agrees to the following:',
              size: 20,
            }),
          ],
          spacing: { after: 300 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: '1. CONFIDENTIAL INFORMATION: ',
              bold: true,
              size: 20,
            }),
            new TextRun({
              text: 'This document contains confidential and proprietary information, trade secrets, and intellectual property of 1325.AI, including but not limited to technical specifications, algorithms, business methods, and patent-pending innovations.',
              size: 20,
            }),
          ],
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: '2. NON-DISCLOSURE: ',
              bold: true,
              size: 20,
            }),
            new TextRun({
              text: 'The recipient agrees not to disclose, publish, or disseminate any information contained herein to any third party without the prior written consent of 1325.AI.',
              size: 20,
            }),
          ],
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: '3. NON-USE: ',
              bold: true,
              size: 20,
            }),
            new TextRun({
              text: 'The recipient agrees not to use the information for any purpose other than the evaluation or business purpose for which it was provided.',
              size: 20,
            }),
          ],
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: '4. NO REPRODUCTION: ',
              bold: true,
              size: 20,
            }),
            new TextRun({
              text: 'The recipient shall not copy, reproduce, or duplicate this document or any portion thereof without written permission.',
              size: 20,
            }),
          ],
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: '5. PATENT RIGHTS: ',
              bold: true,
              size: 20,
            }),
            new TextRun({
              text: 'This document describes inventions protected under USPTO Provisional Application 63/969,202. No license, express or implied, is granted to any patent rights.',
              size: 20,
            }),
          ],
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: '6. GOVERNING LAW: ',
              bold: true,
              size: 20,
            }),
            new TextRun({
              text: 'This agreement shall be governed by the laws of the State of Illinois. Any disputes shall be resolved in the state or federal courts located in Cook County, Illinois.',
              size: 20,
            }),
          ],
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: '7. DURATION: ',
              bold: true,
              size: 20,
            }),
            new TextRun({
              text: 'These confidentiality obligations shall survive for a period of five (5) years from the date of disclosure or until the information becomes publicly available through no fault of the recipient.',
              size: 20,
            }),
          ],
          spacing: { after: 400 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: 'ACKNOWLEDGMENT AND SIGNATURE',
              bold: true,
              size: 24,
              color: '1a365d',
            }),
          ],
          spacing: { before: 300, after: 300 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: 'I have read, understand, and agree to be bound by the terms above.',
              size: 20,
              italics: true,
            }),
          ],
          spacing: { after: 400 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: 'Signature: _________________________________________',
              size: 22,
            }),
          ],
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: 'Printed Name: _________________________________________',
              size: 22,
            }),
          ],
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: 'Title: _________________________________________',
              size: 22,
            }),
          ],
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: 'Date: _________________________________________',
              size: 22,
            }),
          ],
          spacing: { after: 200 },
        }),
      );

      // Page break before Table of Contents
      children.push(
        new Paragraph({
          children: [],
          pageBreakBefore: true,
        })
      );

      // Process markdown content
      const lines = markdownContent.split('\n');
      let inCodeBlock = false;
      let codeContent = '';

      for (const line of lines) {
        // Handle code blocks
        if (line.startsWith('```')) {
          if (inCodeBlock) {
            // End of code block
            children.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: codeContent,
                    font: 'Courier New',
                    size: 18,
                    color: '2d3748',
                  }),
                ],
                shading: {
                  type: ShadingType.SOLID,
                  color: 'f7fafc',
                },
                spacing: { after: 200 },
              })
            );
            codeContent = '';
            inCodeBlock = false;
          } else {
            inCodeBlock = true;
          }
          continue;
        }

        if (inCodeBlock) {
          codeContent += line + '\n';
          continue;
        }

        // Handle headers
        if (line.startsWith('# ')) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: line.replace('# ', ''),
                  bold: true,
                  size: 48,
                  color: '1a365d',
                }),
              ],
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 400, after: 200 },
              pageBreakBefore: true,
            })
          );
        } else if (line.startsWith('## ')) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: line.replace('## ', ''),
                  bold: true,
                  size: 36,
                  color: '2b6cb0',
                }),
              ],
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 300, after: 150 },
            })
          );
        } else if (line.startsWith('### ')) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: line.replace('### ', ''),
                  bold: true,
                  size: 28,
                  color: '2c5282',
                }),
              ],
              heading: HeadingLevel.HEADING_3,
              spacing: { before: 200, after: 100 },
            })
          );
        } else if (line.startsWith('| ')) {
          // Skip table rows for now (complex formatting)
          continue;
        } else if (line.trim() === '---') {
          children.push(
            new Paragraph({
              border: {
                bottom: {
                  color: 'e2e8f0',
                  space: 1,
                  size: 6,
                  style: BorderStyle.SINGLE,
                },
              },
              spacing: { before: 200, after: 200 },
            })
          );
        } else if (line.startsWith('- ')) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: '• ' + line.replace('- ', ''),
                  size: 22,
                }),
              ],
              indent: { left: 720 },
              spacing: { after: 50 },
            })
          );
        } else if (line.trim()) {
          // Regular paragraph
          const textRuns: TextRun[] = [];
          
          // Handle bold text
          const parts = line.split(/(\*\*[^*]+\*\*)/);
          for (const part of parts) {
            if (part.startsWith('**') && part.endsWith('**')) {
              textRuns.push(
                new TextRun({
                  text: part.replace(/\*\*/g, ''),
                  bold: true,
                  size: 22,
                })
              );
            } else {
              textRuns.push(
                new TextRun({
                  text: part,
                  size: 22,
                })
              );
            }
          }
          
          children.push(
            new Paragraph({
              children: textRuns,
              spacing: { after: 100 },
            })
          );
        }
      }

      // Create document
      const doc = new Document({
        sections: [{
          properties: {
            page: {
              margin: {
                top: 1440,
                right: 1440,
                bottom: 1440,
                left: 1440,
              },
            },
          },
          children,
        }],
        styles: {
          default: {
            document: {
              run: {
                font: 'Calibri',
                size: 22,
              },
            },
          },
        },
      });

      // Generate blob and download
      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = '1325AI_Blue_Book_Technical_Manual.docx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Blue Book Word document generated successfully!');
    } catch (error) {
      console.error('Error generating Word document:', error);
      toast.error('Failed to generate Word document');
    } finally {
      setGeneratingWord(false);
    }
  };

  // Helper function to sanitize Unicode box-drawing characters for PDF compatibility
  const sanitizeForPdf = (text: string): string => {
    return text
      // Box-drawing corners and edges
      .replace(/┌/g, '+')
      .replace(/┐/g, '+')
      .replace(/└/g, '+')
      .replace(/┘/g, '+')
      .replace(/├/g, '+')
      .replace(/┤/g, '+')
      .replace(/┬/g, '+')
      .replace(/┴/g, '+')
      .replace(/┼/g, '+')
      // Horizontal and vertical lines
      .replace(/─/g, '-')
      .replace(/│/g, '|')
      .replace(/═/g, '=')
      .replace(/║/g, '|')
      // Double-line corners
      .replace(/╔/g, '+')
      .replace(/╗/g, '+')
      .replace(/╚/g, '+')
      .replace(/╝/g, '+')
      // Arrows
      .replace(/▼/g, 'v')
      .replace(/▲/g, '^')
      .replace(/►/g, '>')
      .replace(/◄/g, '<')
      // Other special characters
      .replace(/•/g, '*')
      .replace(/…/g, '...')
      .replace(/–/g, '-')
      .replace(/—/g, '--')
      .replace(/'/g, "'")
      .replace(/'/g, "'")
      .replace(/"/g, '"')
      .replace(/"/g, '"')
      .replace(/©/g, '(c)')
      .replace(/®/g, '(R)')
      .replace(/™/g, '(TM)')
      // Remove any remaining non-ASCII characters that might cause issues
      .replace(/[^\x00-\x7F]/g, (char) => {
        // Try to keep common accented characters, replace others with space
        const charCode = char.charCodeAt(0);
        if (charCode >= 0x00C0 && charCode <= 0x024F) {
          return char; // Keep Latin Extended characters
        }
        return ' ';
      });
  };

  const generatePDF = async () => {
    setGeneratingPdf(true);
    try {
      const response = await fetch('/documents/1325AI_BLUE_BOOK_TECHNICAL_MANUAL.md');
      let markdownContent = await response.text();
      
      // Sanitize the markdown content for PDF compatibility
      markdownContent = sanitizeForPdf(markdownContent);

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - 2 * margin;
      let y = margin;

      // Generate unique document control number
      const docControlNumber = `1325-BB-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
      
      // Helper to add watermark (using light gray for visual effect)
      const addWatermark = () => {
        pdf.setFontSize(55);
        pdf.setTextColor(230, 230, 230); // Very light gray for watermark effect
        
        // Draw watermark diagonally across page
        const centerX = pageWidth / 2;
        const centerY = pageHeight / 2;
        
        pdf.text('CONFIDENTIAL', centerX, centerY, { 
          align: 'center',
          angle: 45 
        });
      };
      
      // Helper to add page number with legal footer (no watermark - for special pages)
      const addPageNumberOnly = () => {
        const pageNum = pdf.getNumberOfPages();
        
        // Legal footer line - positioned higher
        pdf.setFontSize(7);
        pdf.setTextColor(100, 100, 100);
        pdf.text('1325.AI Blue Book - CONFIDENTIAL & PROPRIETARY - Patent Pending 63/969,202', pageWidth / 2, pageHeight - 15, { align: 'center' });
        
        // Page number - positioned below footer
        pdf.setFontSize(8);
        pdf.setTextColor(128, 128, 128);
        pdf.text(`Page ${pageNum}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
      };
      
      // Helper to add page number with watermark (default for content pages)
      const addPageNumber = () => {
        addWatermark();
        addPageNumberOnly();
      };
      
      // Alias for clarity when we specifically want watermark
      const addPageNumberWithWatermark = addPageNumber;

      // Title page with logo
      pdf.setFillColor(26, 54, 93);
      pdf.rect(0, 0, pageWidth, 60, 'F');
      
      // Add logo to PDF title page
      try {
        const logoImg = new Image();
        logoImg.crossOrigin = 'Anonymous';
        await new Promise<void>((resolve, reject) => {
          logoImg.onload = () => resolve();
          logoImg.onerror = reject;
          logoImg.src = neuralBrainLogo;
        });
        
        // Draw logo centered at top
        const logoSize = 40;
        pdf.addImage(logoImg, 'JPEG', (pageWidth - logoSize) / 2, 65, logoSize, logoSize);
      } catch (logoError) {
        console.warn('Could not add logo to PDF:', logoError);
      }
      
      pdf.setFontSize(32);
      pdf.setTextColor(255);
      pdf.text('1325.AI PLATFORM', pageWidth / 2, 35, { align: 'center' });
      
      pdf.setFontSize(48);
      pdf.setTextColor(214, 158, 46);
      pdf.text('BLUE BOOK', pageWidth / 2, 120, { align: 'center' });
      
      pdf.setFontSize(18);
      pdf.setTextColor(100);
      pdf.text('Technical Reference Manual', pageWidth / 2, 140, { align: 'center' });
      
      pdf.setFontSize(12);
      pdf.setTextColor(80);
      pdf.text('Version 1.0.0 | January 29, 2026', pageWidth / 2, 160, { align: 'center' });
      
      // Author - Thomas D. Bowling
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(26, 54, 93);
      pdf.text('Thomas D. Bowling', pageWidth / 2, 180, { align: 'center' });
      
      pdf.setFontSize(12);
      pdf.setTextColor(74, 85, 104);
      pdf.text('Inventor & Chief Architect', pageWidth / 2, 190, { align: 'center' });
      pdf.setFont('helvetica', 'normal');
      
      pdf.setFontSize(11);
      pdf.setTextColor(214, 158, 46);
      pdf.text('USPTO Provisional Application 63/969,202', pageWidth / 2, 210, { align: 'center' });
      
      // Footer on title - Enhanced Legal Protection
      pdf.setFontSize(9);
      pdf.setTextColor(197, 48, 48);
      pdf.setFont('helvetica', 'bold');
      pdf.text('CONFIDENTIAL AND PROPRIETARY - TRADE SECRET', pageWidth / 2, pageHeight - 55, { align: 'center' });
      
      pdf.setFontSize(8);
      pdf.setTextColor(214, 158, 46);
      pdf.text('PATENT PENDING - USPTO Application 63/969,202', pageWidth / 2, pageHeight - 47, { align: 'center' });
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7);
      pdf.setTextColor(100);
      pdf.text('This document contains trade secrets and proprietary information of 1325.AI.', pageWidth / 2, pageHeight - 38, { align: 'center' });
      pdf.text('Unauthorized reproduction, distribution, or disclosure is strictly prohibited', pageWidth / 2, pageHeight - 32, { align: 'center' });
      pdf.text('and may result in civil and criminal penalties under 18 U.S.C. 1832 and applicable state laws.', pageWidth / 2, pageHeight - 26, { align: 'center' });
      
      pdf.setFontSize(8);
      pdf.setTextColor(80);
      pdf.text('(c) 2024-2026 1325.AI - All Rights Reserved | Contact: Thomas@1325.AI', pageWidth / 2, pageHeight - 16, { align: 'center' });

      // Document Control Page
      pdf.addPage();
      y = margin + 10;
      
      pdf.setFontSize(22);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(26, 54, 93);
      pdf.text('DOCUMENT CONTROL', pageWidth / 2, y, { align: 'center' });
      y += 20;
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(50);
      pdf.text('Document Control Number: ', margin, y);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(43, 108, 176);
      pdf.text(docControlNumber, margin + 55, y);
      y += 12;
      
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(50);
      pdf.text('Distribution Date: ', margin, y);
      pdf.setFont('helvetica', 'normal');
      pdf.text(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), margin + 40, y);
      y += 12;
      
      pdf.setFont('helvetica', 'normal');
      pdf.text('Recipient Name: _________________________________________', margin, y);
      y += 12;
      pdf.text('Recipient Organization: _________________________________________', margin, y);
      y += 12;
      pdf.text('Copy Number: _______ of _______ copies distributed', margin, y);
      y += 25;
      
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(197, 48, 48);
      pdf.text('RETURN/DESTRUCTION REQUIREMENTS', margin, y);
      y += 10;
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(50);
      const returnText = pdf.splitTextToSize(
        'This document must be returned to 1325.AI or securely destroyed upon request, termination of business relationship, or when no longer needed for its intended purpose. Destruction must be by shredding or secure digital deletion with written confirmation provided to Thomas@1325.AI.',
        contentWidth
      );
      pdf.text(returnText, margin, y);
      
      addPageNumberWithWatermark();
      
      // NDA / Confidentiality Agreement Page
      pdf.addPage();
      y = margin + 10;
      
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(26, 54, 93);
      pdf.text('CONFIDENTIALITY ACKNOWLEDGMENT', pageWidth / 2, y, { align: 'center' });
      y += 15;
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(50);
      pdf.text('By receiving, accessing, or reviewing this document, the undersigned acknowledges and agrees to the following:', margin, y);
      y += 12;
      
      const ndaTerms = [
        { title: '1. CONFIDENTIAL INFORMATION:', text: 'This document contains confidential and proprietary information, trade secrets, and intellectual property of 1325.AI, including but not limited to technical specifications, algorithms, business methods, and patent-pending innovations.' },
        { title: '2. NON-DISCLOSURE:', text: 'The recipient agrees not to disclose, publish, or disseminate any information contained herein to any third party without the prior written consent of 1325.AI.' },
        { title: '3. NON-USE:', text: 'The recipient agrees not to use the information for any purpose other than the evaluation or business purpose for which it was provided.' },
        { title: '4. NO REPRODUCTION:', text: 'The recipient shall not copy, reproduce, or duplicate this document or any portion thereof without written permission.' },
        { title: '5. PATENT RIGHTS:', text: 'This document describes inventions protected under USPTO Provisional Application 63/969,202. No license, express or implied, is granted to any patent rights.' },
        { title: '6. GOVERNING LAW:', text: 'This agreement shall be governed by the laws of the State of Illinois. Any disputes shall be resolved in the state or federal courts located in Cook County, Illinois.' },
        { title: '7. DURATION:', text: 'These confidentiality obligations shall survive for a period of five (5) years from the date of disclosure or until the information becomes publicly available through no fault of the recipient.' },
      ];
      
      for (const term of ndaTerms) {
        pdf.setFont('helvetica', 'bold');
        pdf.text(term.title, margin, y);
        y += 5;
        pdf.setFont('helvetica', 'normal');
        const termLines = pdf.splitTextToSize(term.text, contentWidth);
        pdf.text(termLines, margin, y);
        y += termLines.length * 4 + 6;
      }
      
      y += 5;
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(26, 54, 93);
      pdf.text('ACKNOWLEDGMENT AND SIGNATURE', margin, y);
      y += 10;
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'italic');
      pdf.setTextColor(50);
      pdf.text('I have read, understand, and agree to be bound by the terms above.', margin, y);
      y += 15;
      
      pdf.setFont('helvetica', 'normal');
      pdf.text('Signature: _________________________________________', margin, y);
      y += 10;
      pdf.text('Printed Name: _________________________________________', margin, y);
      y += 10;
      pdf.text('Title: _________________________________________', margin, y);
      y += 10;
      pdf.text('Date: _________________________________________', margin, y);
      
      addPageNumberWithWatermark();

      // Table of contents page
      pdf.addPage();
      y = margin;
      
      pdf.setFontSize(24);
      pdf.setTextColor(26, 54, 93);
      pdf.text('TABLE OF CONTENTS', margin, y);
      y += 15;

      pdf.setFontSize(11);
      pdf.setTextColor(50);
      
      for (let i = 0; i < manualSections.length; i++) {
        const section = manualSections[i];
        if (y > pageHeight - 30) {
          addPageNumber();
          pdf.addPage();
          y = margin;
        }
        
        pdf.setTextColor(50);
        pdf.text(`${i + 1}. ${section.title}`, margin, y);
        pdf.setTextColor(120);
        pdf.text(section.pages, pageWidth - margin, y, { align: 'right' });
        y += 8;
      }
      
      addPageNumber();

      // Process content
      const lines = markdownContent.split('\n');
      let inCodeBlock = false;
      let skipTable = false;

      pdf.addPage();
      y = margin;

      for (const line of lines) {
        // Skip markdown frontmatter
        if (line.startsWith('---')) {
          continue;
        }

        // Handle tables - skip for PDF (too complex)
        if (line.startsWith('| ')) {
          skipTable = true;
          continue;
        }
        if (skipTable && !line.startsWith('| ') && line.trim()) {
          skipTable = false;
        }
        if (skipTable) continue;

        // Handle code blocks
        if (line.startsWith('```')) {
          inCodeBlock = !inCodeBlock;
          continue;
        }

        if (inCodeBlock) {
          if (y > pageHeight - 30) {
            addPageNumber();
            pdf.addPage();
            y = margin;
          }
          pdf.setFontSize(8);
          pdf.setTextColor(45, 55, 72);
          pdf.setFillColor(247, 250, 252);
          const codeLines = pdf.splitTextToSize(line, contentWidth - 10);
          pdf.rect(margin - 2, y - 4, contentWidth + 4, codeLines.length * 4 + 4, 'F');
          pdf.text(codeLines, margin, y);
          y += codeLines.length * 4 + 4;
          continue;
        }

        // Handle headers
        if (line.startsWith('# ')) {
          addPageNumber();
          pdf.addPage();
          y = margin;
          
          pdf.setFillColor(26, 54, 93);
          pdf.rect(0, 0, pageWidth, 20, 'F');
          
          pdf.setFontSize(20);
          pdf.setTextColor(255);
          const headerText = line.replace('# ', '').replace(/\*\*/g, '');
          pdf.text(headerText, margin, 14);
          y = 35;
        } else if (line.startsWith('## ')) {
          if (y > pageHeight - 40) {
            addPageNumber();
            pdf.addPage();
            y = margin;
          }
          pdf.setFontSize(16);
          pdf.setTextColor(43, 108, 176);
          const headerText = line.replace('## ', '').replace(/\*\*/g, '');
          pdf.text(headerText, margin, y);
          y += 10;
        } else if (line.startsWith('### ')) {
          if (y > pageHeight - 35) {
            addPageNumber();
            pdf.addPage();
            y = margin;
          }
          pdf.setFontSize(13);
          pdf.setTextColor(44, 82, 130);
          const headerText = line.replace('### ', '').replace(/\*\*/g, '');
          pdf.text(headerText, margin, y);
          y += 8;
        } else if (line.startsWith('- ')) {
          if (y > pageHeight - 25) {
            addPageNumber();
            pdf.addPage();
            y = margin;
          }
          pdf.setFontSize(10);
          pdf.setTextColor(50);
          const bulletText = line.replace('- ', '\u2022 ').replace(/\*\*/g, '');
          const splitText = pdf.splitTextToSize(bulletText, contentWidth - 10);
          pdf.text(splitText, margin + 5, y);
          y += splitText.length * 5;
        } else if (line.trim()) {
          if (y > pageHeight - 25) {
            addPageNumber();
            pdf.addPage();
            y = margin;
          }
          pdf.setFontSize(10);
          pdf.setTextColor(50);
          const cleanText = line.replace(/\*\*/g, '').replace(/`/g, '');
          const splitText = pdf.splitTextToSize(cleanText, contentWidth);
          pdf.text(splitText, margin, y);
          y += splitText.length * 5;
        } else {
          y += 3;
        }
      }

      addPageNumber();

      // Save PDF
      pdf.save('1325AI_Blue_Book_Technical_Manual.pdf');
      toast.success('Blue Book PDF generated successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    } finally {
      setGeneratingPdf(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Book className="h-7 w-7 text-mansagold" />
            1325.AI Blue Book
          </h2>
          <p className="text-white/60 mt-1">
            Comprehensive Technical Reference Manual
          </p>
        </div>
        {onBack && (
          <Button variant="outline" onClick={onBack} className="border-white/20 text-white hover:bg-white/10">
            Back to Patents
          </Button>
        )}
      </div>

      {/* Document Info Card */}
      <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-mansagold/30">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-mansagold/50 shadow-lg bg-mansablue">
                <img src={neuralBrainLogo} alt="1325.AI Neural Brain Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <CardTitle className="text-xl text-white">Platform Blue Book</CardTitle>
                <CardDescription className="text-white/60">
                  Complete technical documentation of all 27 patent claims
                </CardDescription>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="border-mansagold/50 text-mansagold">
                    v1.0.0
                  </Badge>
                  <Badge variant="outline" className="border-blue-500/50 text-blue-400">
                    USPTO 63/969,202
                  </Badge>
                  <Badge variant="outline" className="border-emerald-500/50 text-emerald-400">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Current
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 rounded-lg p-4 text-center border border-white/10">
              <p className="text-3xl font-bold text-mansagold">27</p>
              <p className="text-sm text-white/60">Patent Claims</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 text-center border border-white/10">
              <p className="text-3xl font-bold text-blue-400">90+</p>
              <p className="text-sm text-white/60">Edge Functions</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 text-center border border-white/10">
              <p className="text-3xl font-bold text-emerald-400">200+</p>
              <p className="text-sm text-white/60">Components</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 text-center border border-white/10">
              <p className="text-3xl font-bold text-purple-400">80+</p>
              <p className="text-sm text-white/60">Database Tables</p>
            </div>
          </div>

          {/* Download Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={generateWordDocument}
              disabled={generatingWord}
              className="h-auto py-4 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {generatingWord ? (
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              ) : (
                <FileType2 className="h-5 w-5 mr-2" />
              )}
              <div className="text-left">
                <p className="font-semibold">Download Word Document</p>
                <p className="text-xs text-blue-200">Microsoft Word (.docx)</p>
              </div>
            </Button>

            <Button
              onClick={generatePDF}
              disabled={generatingPdf}
              className="h-auto py-4 bg-red-600 hover:bg-red-700 text-white"
            >
              {generatingPdf ? (
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              ) : (
                <FileText className="h-5 w-5 mr-2" />
              )}
              <div className="text-left">
                <p className="font-semibold">Download PDF</p>
                <p className="text-xs text-red-200">Adobe PDF (.pdf)</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table of Contents */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-mansagold" />
            Table of Contents
          </CardTitle>
          <CardDescription className="text-white/60">
            {manualSections.length} major sections covering all platform systems
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {manualSections.map((section, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-mansagold font-mono text-sm w-6">{index + 1}.</span>
                  <span className="text-white/80 text-sm">{section.title}</span>
                </div>
                <span className="text-white/40 text-xs font-mono">{section.pages}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Document Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-mansagold/20 flex items-center justify-center border border-mansagold/30">
                <Clock className="h-5 w-5 text-mansagold" />
              </div>
              <div>
                <p className="text-sm text-white/60">Last Updated</p>
                <p className="font-semibold text-white">January 29, 2026</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                <Shield className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-white/60">Classification</p>
                <p className="font-semibold text-white">Confidential</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                <Download className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-white/60">Format</p>
                <p className="font-semibold text-white">Word & PDF</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BlueBookExport;
