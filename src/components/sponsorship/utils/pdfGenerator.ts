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
    const marginLeft = 25;
    const marginRight = 25;
    const marginTop = 25;
    const marginBottom = 30; // Extra space for footer
    const contentWidth = pageWidth - marginLeft - marginRight;
    let yPosition = marginTop;
    const lineHeight = 5;
    const paragraphSpacing = 3;
    let pageNumber = 1;

    // Set default font
    pdf.setFont('times', 'normal');
    pdf.setFontSize(11);

    // Helper function to add page footer
    const addPageFooter = () => {
      const footerY = pageHeight - 15;
      pdf.setFontSize(8);
      pdf.setFont('times', 'normal');
      pdf.setTextColor(100, 100, 100);
      
      // Don't draw a line - just add text
      const footerText = `Page ${pageNumber} - CONFIDENTIAL - Attorney-Client Work Product`;
      const footerWidth = pdf.getTextWidth(footerText);
      pdf.text(footerText, (pageWidth - footerWidth) / 2, footerY);
      
      // Reset text color
      pdf.setTextColor(0, 0, 0);
    };

    // Helper function to add new page if needed
    const checkPageBreak = (requiredSpace: number = lineHeight): boolean => {
      if (yPosition + requiredSpace > pageHeight - marginBottom) {
        addPageFooter();
        pdf.addPage();
        pageNumber++;
        yPosition = marginTop;
        return true;
      }
      return false;
    };

    // Helper function to add wrapped text with proper line breaks
    const addWrappedText = (text: string, fontSize: number = 11, fontStyle: string = 'normal', indent: number = 0) => {
      pdf.setFontSize(fontSize);
      pdf.setFont('times', fontStyle);
      
      const effectiveWidth = contentWidth - indent;
      const lines = pdf.splitTextToSize(text, effectiveWidth);
      
      lines.forEach((line: string) => {
        checkPageBreak(lineHeight);
        pdf.text(line, marginLeft + indent, yPosition);
        yPosition += lineHeight;
      });
    };

    // Helper function to add a header
    const addHeader = (text: string, level: number = 1) => {
      const headerSpacing = level === 1 ? 12 : level === 2 ? 10 : 8;
      checkPageBreak(headerSpacing + lineHeight);
      
      yPosition += level === 1 ? 8 : 6;
      
      const fontSize = level === 1 ? 14 : level === 2 ? 12 : 11;
      pdf.setFontSize(fontSize);
      pdf.setFont('times', 'bold');
      
      // Wrap long headers
      const headerLines = pdf.splitTextToSize(text, contentWidth);
      headerLines.forEach((line: string, index: number) => {
        if (index > 0) checkPageBreak(lineHeight);
        pdf.text(line, marginLeft, yPosition);
        yPosition += lineHeight + 1;
      });
      
      // Add underline only for h1 and h2, but not touching text
      if (level <= 2) {
        pdf.setLineWidth(0.3);
        pdf.setDrawColor(150, 150, 150);
        pdf.line(marginLeft, yPosition, pageWidth - marginRight, yPosition);
        pdf.setDrawColor(0, 0, 0);
        yPosition += 4;
      }
    };

    // Helper function to render a table with proper text wrapping
    const renderTable = (headers: string[], rows: string[][]) => {
      if (headers.length === 0 && rows.length === 0) return;
      
      const numCols = Math.max(headers.length, rows[0]?.length || 0);
      if (numCols === 0) return;
      
      const colWidth = contentWidth / numCols;
      const cellPadding = 2;
      const cellContentWidth = colWidth - (cellPadding * 2);
      
      pdf.setFontSize(9);
      
      // Calculate row heights based on content
      const calculateRowHeight = (cells: string[], isBold: boolean = false): number => {
        pdf.setFont('times', isBold ? 'bold' : 'normal');
        let maxLines = 1;
        cells.forEach(cell => {
          const lines = pdf.splitTextToSize(cell, cellContentWidth);
          maxLines = Math.max(maxLines, lines.length);
        });
        return maxLines * 4 + cellPadding * 2;
      };

      // Draw headers
      if (headers.length > 0) {
        const headerHeight = calculateRowHeight(headers, true);
        checkPageBreak(headerHeight + 10);
        
        pdf.setFont('times', 'bold');
        pdf.setFillColor(240, 240, 240);
        pdf.rect(marginLeft, yPosition - 1, contentWidth, headerHeight, 'F');
        
        headers.forEach((header, i) => {
          const cellX = marginLeft + (i * colWidth) + cellPadding;
          const lines = pdf.splitTextToSize(header, cellContentWidth);
          let cellY = yPosition + 3;
          lines.forEach((line: string) => {
            pdf.text(line, cellX, cellY);
            cellY += 4;
          });
        });
        
        yPosition += headerHeight;
        
        // Draw header bottom border
        pdf.setLineWidth(0.5);
        pdf.line(marginLeft, yPosition, marginLeft + contentWidth, yPosition);
      }
      
      // Draw data rows
      pdf.setFont('times', 'normal');
      rows.forEach((row) => {
        const rowHeight = calculateRowHeight(row, false);
        checkPageBreak(rowHeight);
        
        row.forEach((cell, i) => {
          const cellX = marginLeft + (i * colWidth) + cellPadding;
          const lines = pdf.splitTextToSize(cell, cellContentWidth);
          let cellY = yPosition + 3;
          lines.forEach((line: string) => {
            pdf.text(line, cellX, cellY);
            cellY += 4;
          });
        });
        
        yPosition += rowHeight;
        
        // Draw row bottom border (light)
        pdf.setLineWidth(0.1);
        pdf.setDrawColor(200, 200, 200);
        pdf.line(marginLeft, yPosition, marginLeft + contentWidth, yPosition);
        pdf.setDrawColor(0, 0, 0);
      });
      
      // Draw table borders
      pdf.setLineWidth(0.3);
      const tableHeight = yPosition - marginTop;
      
      // Vertical column lines
      for (let i = 0; i <= numCols; i++) {
        const x = marginLeft + (i * colWidth);
        // We don't draw vertical lines to keep it cleaner
      }
      
      yPosition += 6;
    };

    // Parse HTML content and convert to PDF
    const allElements = element.querySelectorAll('h1, h2, h3, h4, p, li, ol, ul, table, pre, hr, div.footer, div.claim-box');
    
    // Process tables separately
    const tables = element.querySelectorAll('table');
    const tablePositions = new Map<Element, { headers: string[], rows: string[][] }>();
    
    tables.forEach(table => {
      const headers: string[] = [];
      const rows: string[][] = [];
      
      const headerCells = table.querySelectorAll('th');
      headerCells.forEach(th => {
        headers.push(th.textContent?.trim() || '');
      });
      
      const bodyRows = table.querySelectorAll('tr');
      bodyRows.forEach(tr => {
        const cells = tr.querySelectorAll('td');
        if (cells.length > 0) {
          const rowData: string[] = [];
          cells.forEach(td => {
            rowData.push(td.textContent?.trim() || '');
          });
          rows.push(rowData);
        }
      });
      
      tablePositions.set(table, { headers, rows });
    });

    // Track processed tables
    const processedTables = new Set<Element>();

    // Process each element
    const processElement = (el: Element) => {
      const tagName = el.tagName.toLowerCase();
      const text = el.textContent?.trim() || '';
      
      if (!text && tagName !== 'hr') return;
      
      // Skip if this is a cell inside a table (we handle tables separately)
      if (el.closest('table') && (tagName === 'th' || tagName === 'td')) {
        return;
      }
      
      switch (tagName) {
        case 'h1':
          addHeader(text, 1);
          break;
          
        case 'h2':
          addHeader(text, 2);
          break;
          
        case 'h3':
        case 'h4':
          addHeader(text, 3);
          break;
          
        case 'p':
          // Check if it's inside a claim-box for special formatting
          if (el.closest('.claim-box')) {
            pdf.setFont('times', 'normal');
            addWrappedText(text, 10, 'normal', 5);
          } else {
            addWrappedText(text, 11, 'normal');
          }
          yPosition += paragraphSpacing;
          break;
          
        case 'li':
          checkPageBreak(lineHeight);
          pdf.setFontSize(11);
          pdf.setFont('times', 'normal');
          
          // Check if parent is ol or ul
          const parent = el.parentElement;
          const isOrdered = parent?.tagName.toLowerCase() === 'ol';
          const siblings = parent ? Array.from(parent.children) : [];
          const index = siblings.indexOf(el) + 1;
          
          const bullet = isOrdered ? `${index}. ` : '• ';
          const listText = bullet + text;
          const bulletIndent = 5;
          const textIndent = isOrdered ? 8 : 5;
          
          const listLines = pdf.splitTextToSize(text, contentWidth - bulletIndent - textIndent);
          
          // First line with bullet
          pdf.text(bullet, marginLeft + bulletIndent, yPosition);
          pdf.text(listLines[0], marginLeft + bulletIndent + textIndent, yPosition);
          yPosition += lineHeight;
          
          // Subsequent lines indented
          for (let i = 1; i < listLines.length; i++) {
            checkPageBreak(lineHeight);
            pdf.text(listLines[i], marginLeft + bulletIndent + textIndent, yPosition);
            yPosition += lineHeight;
          }
          break;
          
        case 'table':
          if (!processedTables.has(el)) {
            processedTables.add(el);
            const tableData = tablePositions.get(el);
            if (tableData) {
              yPosition += 4;
              renderTable(tableData.headers, tableData.rows);
            }
          }
          break;
          
        case 'pre':
          checkPageBreak(lineHeight * 2);
          pdf.setFontSize(8);
          pdf.setFont('courier', 'normal');
          
          const codeWidth = contentWidth - 10;
          const codeLines = pdf.splitTextToSize(text, codeWidth);
          
          // Calculate code block height
          const codeBlockHeight = codeLines.length * 3.5 + 8;
          checkPageBreak(codeBlockHeight);
          
          // Draw code background
          pdf.setFillColor(248, 248, 248);
          pdf.setDrawColor(220, 220, 220);
          pdf.rect(marginLeft + 2, yPosition - 2, contentWidth - 4, codeBlockHeight, 'FD');
          
          yPosition += 4;
          codeLines.forEach((line: string) => {
            checkPageBreak(3.5);
            pdf.text(line, marginLeft + 5, yPosition);
            yPosition += 3.5;
          });
          yPosition += 6;
          
          // Reset font
          pdf.setFont('times', 'normal');
          pdf.setFontSize(11);
          break;
          
        case 'hr':
          checkPageBreak(10);
          yPosition += 5;
          pdf.setLineWidth(0.5);
          pdf.setDrawColor(200, 200, 200);
          pdf.line(marginLeft, yPosition, pageWidth - marginRight, yPosition);
          pdf.setDrawColor(0, 0, 0);
          yPosition += 5;
          break;
      }
    };

    // Walk through all elements in order
    const walkDOM = (node: Element) => {
      // Process this element
      const tagName = node.tagName?.toLowerCase();
      
      if (['h1', 'h2', 'h3', 'h4', 'p', 'li', 'pre', 'hr', 'table'].includes(tagName)) {
        processElement(node);
      }
      
      // Process children (but not for elements we handle specially)
      if (!['table', 'pre', 'p', 'li', 'h1', 'h2', 'h3', 'h4'].includes(tagName)) {
        Array.from(node.children).forEach(child => {
          walkDOM(child);
        });
      }
    };

    // Start walking from the body/root
    Array.from(element.children).forEach(child => {
      walkDOM(child);
    });

    // Add footer to last page
    addPageFooter();

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
