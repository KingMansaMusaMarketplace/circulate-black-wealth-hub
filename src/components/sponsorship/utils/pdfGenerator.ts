import { toast } from 'sonner';
import { Haptics, NotificationType } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';
import jsPDF from 'jspdf';

interface PDFOptions {
  filename: string;
  content: string;
}

export const generatePDF = async ({ filename, content }: PDFOptions): Promise<void> => {
  try {
    // Create a temporary div element with the content to extract text
    const element = document.createElement('div');
    element.innerHTML = content;
    
    // Create a new jsPDF instance
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // PDF dimensions
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let yPosition = margin;
    const lineHeight = 6;
    const headerHeight = 10;
    const sectionSpacing = 8;

    // Set default font
    pdf.setFont('times', 'normal');
    pdf.setFontSize(12);

    // Helper function to add new page if needed
    const checkPageBreak = (requiredSpace: number = lineHeight) => {
      if (yPosition + requiredSpace > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }
    };

    // Helper function to add wrapped text
    const addWrappedText = (text: string, fontSize: number = 12, fontStyle: string = 'normal') => {
      pdf.setFontSize(fontSize);
      pdf.setFont('times', fontStyle);
      const lines = pdf.splitTextToSize(text, contentWidth);
      lines.forEach((line: string) => {
        checkPageBreak();
        pdf.text(line, margin, yPosition);
        yPosition += lineHeight;
      });
    };

    // Helper function to add a header
    const addHeader = (text: string, level: number = 1) => {
      checkPageBreak(headerHeight + lineHeight);
      yPosition += sectionSpacing;
      const fontSize = level === 1 ? 16 : level === 2 ? 14 : 12;
      pdf.setFontSize(fontSize);
      pdf.setFont('times', 'bold');
      pdf.text(text, margin, yPosition);
      yPosition += headerHeight;
      
      if (level <= 2) {
        pdf.setLineWidth(0.5);
        pdf.line(margin, yPosition - 4, pageWidth - margin, yPosition - 4);
      }
    };

    // Parse HTML content and convert to PDF
    const sections = element.querySelectorAll('h1, h2, h3, p, li, th, td, pre');
    let inTable = false;
    let tableData: string[][] = [];
    let tableHeaders: string[] = [];

    sections.forEach((section, index) => {
      const tagName = section.tagName.toLowerCase();
      const text = section.textContent?.trim() || '';

      if (!text) return;

      switch (tagName) {
        case 'h1':
          if (index === 0) {
            // Center the main title
            pdf.setFontSize(18);
            pdf.setFont('times', 'bold');
            const titleWidth = pdf.getTextWidth(text);
            pdf.text(text, (pageWidth - titleWidth) / 2, yPosition);
            yPosition += headerHeight + 4;
          } else {
            addHeader(text, 1);
          }
          break;
        case 'h2':
          addHeader(text, 2);
          break;
        case 'h3':
          addHeader(text, 3);
          break;
        case 'p':
          addWrappedText(text, 12, 'normal');
          yPosition += 2;
          break;
        case 'li':
          checkPageBreak();
          pdf.setFontSize(12);
          pdf.setFont('times', 'normal');
          const bulletLines = pdf.splitTextToSize(`• ${text}`, contentWidth - 5);
          bulletLines.forEach((line: string, lineIndex: number) => {
            checkPageBreak();
            pdf.text(line, margin + (lineIndex === 0 ? 0 : 3), yPosition);
            yPosition += lineHeight;
          });
          break;
        case 'th':
          tableHeaders.push(text);
          inTable = true;
          break;
        case 'td':
          if (!inTable) {
            tableData.push([]);
            inTable = true;
          }
          if (tableData.length === 0) {
            tableData.push([]);
          }
          tableData[tableData.length - 1].push(text);
          break;
        case 'pre':
          checkPageBreak(lineHeight * 3);
          pdf.setFontSize(9);
          pdf.setFont('courier', 'normal');
          const codeLines = pdf.splitTextToSize(text, contentWidth - 10);
          
          // Draw code background
          const codeHeight = codeLines.length * 4.5 + 6;
          checkPageBreak(codeHeight);
          pdf.setFillColor(245, 245, 245);
          pdf.rect(margin, yPosition - 3, contentWidth, codeHeight, 'F');
          
          codeLines.forEach((line: string) => {
            checkPageBreak();
            pdf.text(line, margin + 3, yPosition);
            yPosition += 4.5;
          });
          yPosition += 4;
          pdf.setFont('times', 'normal');
          pdf.setFontSize(12);
          break;
      }

      // Check if we just finished a table row
      if (inTable && section.parentElement?.tagName.toLowerCase() === 'tr') {
        const nextSibling = section.nextElementSibling;
        if (!nextSibling || nextSibling.parentElement?.tagName.toLowerCase() !== 'tr') {
          // End of row, check if end of table
          const parentRow = section.parentElement;
          const nextRow = parentRow?.nextElementSibling;
          if (!nextRow || (nextRow.tagName.toLowerCase() !== 'tr')) {
            // End of table, render it
            if (tableHeaders.length > 0 || tableData.length > 0) {
              checkPageBreak(lineHeight * (tableData.length + 2));
              
              const colWidth = contentWidth / Math.max(tableHeaders.length, tableData[0]?.length || 1);
              
              // Draw headers
              if (tableHeaders.length > 0) {
                pdf.setFont('times', 'bold');
                pdf.setFontSize(10);
                tableHeaders.forEach((header, i) => {
                  pdf.text(header.substring(0, 20), margin + (i * colWidth), yPosition);
                });
                yPosition += lineHeight;
                pdf.line(margin, yPosition - 3, pageWidth - margin, yPosition - 3);
              }
              
              // Draw data rows
              pdf.setFont('times', 'normal');
              tableData.forEach(row => {
                checkPageBreak();
                row.forEach((cell, i) => {
                  pdf.text(cell.substring(0, 25), margin + (i * colWidth), yPosition);
                });
                yPosition += lineHeight;
              });
              
              yPosition += 4;
            }
            
            // Reset table state
            inTable = false;
            tableData = [];
            tableHeaders = [];
          }
        }
      }
    });

    // Save the PDF
    pdf.save(filename);
    
    // Trigger success haptic feedback on native platforms
    if (Capacitor.isNativePlatform()) {
      try {
        await Haptics.notification({ type: NotificationType.Success });
      } catch (error) {
        console.error('Haptic feedback error:', error);
      }
    }
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    toast.error('Failed to generate PDF. Please try again.');
    throw error;
  }
};
