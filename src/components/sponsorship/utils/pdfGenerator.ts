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
      format: 'letter' // US Letter size for USPTO
    });

    // PDF dimensions - US Letter
    const pageWidth = pdf.internal.pageSize.getWidth(); // 215.9mm
    const pageHeight = pdf.internal.pageSize.getHeight(); // 279.4mm
    const marginLeft = 25.4; // 1 inch
    const marginRight = 25.4; // 1 inch
    const marginTop = 25.4; // 1 inch
    const marginBottom = 35; // Extra space for footer
    const contentWidth = pageWidth - marginLeft - marginRight; // ~165mm usable
    let yPosition = marginTop;
    const lineHeight = 5;
    const paragraphSpacing = 3;
    let pageNumber = 1;

    // Set default font
    pdf.setFont('times', 'normal');
    pdf.setFontSize(11);

    // Helper: Clean text - remove excessive whitespace and convert special chars
    // Helper: Clean text - remove excessive whitespace and convert special chars
    const cleanText = (text: string): string => {
      return text
        .replace(/\s+/g, ' ')
        .replace(/[\u200B-\u200D\uFEFF]/g, '') // Remove zero-width chars
        .replace(/\u03A3/g, 'SUM') // Replace Greek Sigma
        .replace(/\u0394/g, 'delta_') // Replace Greek Delta
        .replace(/\u00D7/g, '*') // Replace multiplication sign
        .replace(/\u00A3/g, 'GBP ') // Replace pound sign
        .replace(/\u20AC/g, 'EUR ') // Replace euro sign
        .replace(/\u2013/g, '-') // En dash
        .replace(/\u2014/g, '-') // Em dash
        .replace(/\u201C/g, '"') // Left double quote
        .replace(/\u201D/g, '"') // Right double quote
        .replace(/\u2018/g, "'") // Left single quote
        .replace(/\u2019/g, "'") // Right single quote
        .replace(/\u2026/g, '...') // Ellipsis
        .replace(/[^\x00-\x7F]/g, '') // Remove remaining non-ASCII
        .trim();
    };

    // Helper function to add page footer
    const addPageFooter = () => {
      const footerY = pageHeight - 12;
      pdf.setFontSize(8);
      pdf.setFont('times', 'normal');
      pdf.setTextColor(100, 100, 100);
      
      const footerText = `Page ${pageNumber} - CONFIDENTIAL - Attorney-Client Work Product`;
      const footerWidth = pdf.getTextWidth(footerText);
      const footerX = Math.max(marginLeft, (pageWidth - footerWidth) / 2);
      pdf.text(footerText, footerX, footerY);
      
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

    // Helper function to safely wrap text - NEVER exceeds content width
    const safeWrapText = (text: string, maxWidth: number, fontSize: number): string[] => {
      pdf.setFontSize(fontSize);
      // Ensure maxWidth is at least 20mm to prevent infinite loops
      const safeWidth = Math.max(20, Math.min(maxWidth, contentWidth));
      const cleanedText = cleanText(text);
      
      if (!cleanedText) return [];
      
      return pdf.splitTextToSize(cleanedText, safeWidth);
    };

    // Helper function to add wrapped text with proper line breaks
    const addWrappedText = (text: string, fontSize: number = 11, fontStyle: string = 'normal', indent: number = 0) => {
      pdf.setFontSize(fontSize);
      pdf.setFont('times', fontStyle);
      
      // Calculate effective width accounting for indent
      const effectiveWidth = Math.max(40, contentWidth - indent);
      const lines = safeWrapText(text, effectiveWidth, fontSize);
      
      lines.forEach((line: string) => {
        checkPageBreak(lineHeight);
        // Ensure text starts within margins
        const xPos = Math.min(marginLeft + indent, pageWidth - marginRight - 20);
        pdf.text(line, xPos, yPosition);
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
      
      // Wrap long headers - use full content width
      const headerLines = safeWrapText(text, contentWidth, fontSize);
      headerLines.forEach((line: string, index: number) => {
        if (index > 0) checkPageBreak(lineHeight);
        pdf.text(line, marginLeft, yPosition);
        yPosition += lineHeight + 1;
      });
      
      // Add underline only for h1 and h2
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
      
      // Calculate column widths - distribute evenly but ensure minimum
      const minColWidth = 25;
      const colWidth = Math.max(minColWidth, contentWidth / numCols);
      const actualTableWidth = Math.min(colWidth * numCols, contentWidth);
      const cellPadding = 2;
      const cellContentWidth = colWidth - (cellPadding * 2) - 2; // Extra 2mm buffer
      const cellLineHeight = 3.5;
      
      pdf.setFontSize(9);
      
      // Calculate row height based on wrapped content
      const calculateRowHeight = (cells: string[], isBold: boolean = false): number => {
        pdf.setFont('times', isBold ? 'bold' : 'normal');
        pdf.setFontSize(9);
        let maxLines = 1;
        cells.forEach(cell => {
          const wrappedLines = safeWrapText(cell, cellContentWidth, 9);
          maxLines = Math.max(maxLines, wrappedLines.length);
        });
        return Math.max(8, maxLines * cellLineHeight + cellPadding * 2);
      };

      // Draw headers
      if (headers.length > 0) {
        const headerHeight = calculateRowHeight(headers, true);
        checkPageBreak(headerHeight + 10);
        
        pdf.setFont('times', 'bold');
        pdf.setFontSize(9);
        pdf.setFillColor(240, 240, 240);
        pdf.rect(marginLeft, yPosition - 1, actualTableWidth, headerHeight, 'F');
        
        headers.forEach((header, i) => {
          if (i >= numCols) return; // Safety check
          const cellX = marginLeft + (i * colWidth) + cellPadding;
          const lines = safeWrapText(header, cellContentWidth, 9);
          let cellY = yPosition + 3;
          lines.forEach((line: string) => {
            pdf.text(line, cellX, cellY);
            cellY += cellLineHeight;
          });
        });
        
        yPosition += headerHeight;
        
        // Draw header bottom border
        pdf.setLineWidth(0.5);
        pdf.line(marginLeft, yPosition, marginLeft + actualTableWidth, yPosition);
      }
      
      // Draw data rows
      pdf.setFont('times', 'normal');
      pdf.setFontSize(9);
      
      rows.forEach((row) => {
        const rowHeight = calculateRowHeight(row, false);
        
        // Check if we need a new page - if so, redraw header on new page
        if (yPosition + rowHeight > pageHeight - marginBottom) {
          addPageFooter();
          pdf.addPage();
          pageNumber++;
          yPosition = marginTop;
          
          // Redraw headers on new page
          if (headers.length > 0) {
            const newHeaderHeight = calculateRowHeight(headers, true);
            pdf.setFont('times', 'bold');
            pdf.setFontSize(9);
            pdf.setFillColor(240, 240, 240);
            pdf.rect(marginLeft, yPosition - 1, actualTableWidth, newHeaderHeight, 'F');
            
            headers.forEach((header, i) => {
              if (i >= numCols) return;
              const cellX = marginLeft + (i * colWidth) + cellPadding;
              const lines = safeWrapText(header, cellContentWidth, 9);
              let cellY = yPosition + 3;
              lines.forEach((line: string) => {
                pdf.text(line, cellX, cellY);
                cellY += cellLineHeight;
              });
            });
            
            yPosition += newHeaderHeight;
            pdf.setLineWidth(0.5);
            pdf.line(marginLeft, yPosition, marginLeft + actualTableWidth, yPosition);
            pdf.setFont('times', 'normal');
            pdf.setFontSize(9);
          }
        }
        
        row.forEach((cell, i) => {
          if (i >= numCols) return; // Safety check
          const cellX = marginLeft + (i * colWidth) + cellPadding;
          const lines = safeWrapText(cell, cellContentWidth, 9);
          let cellY = yPosition + 3;
          lines.forEach((line: string) => {
            pdf.text(line, cellX, cellY);
            cellY += cellLineHeight;
          });
        });
        
        yPosition += rowHeight;
        
        // Draw row bottom border (light)
        pdf.setLineWidth(0.1);
        pdf.setDrawColor(200, 200, 200);
        pdf.line(marginLeft, yPosition, marginLeft + actualTableWidth, yPosition);
        pdf.setDrawColor(0, 0, 0);
      });
      
      yPosition += 6;
    };

    // Parse tables first
    const tables = element.querySelectorAll('table');
    const tablePositions = new Map<Element, { headers: string[], rows: string[][] }>();
    
    tables.forEach(table => {
      const headers: string[] = [];
      const rows: string[][] = [];
      
      const headerCells = table.querySelectorAll('th');
      headerCells.forEach(th => {
        headers.push(cleanText(th.textContent || ''));
      });
      
      const bodyRows = table.querySelectorAll('tr');
      bodyRows.forEach(tr => {
        const cells = tr.querySelectorAll('td');
        if (cells.length > 0) {
          const rowData: string[] = [];
          cells.forEach(td => {
            rowData.push(cleanText(td.textContent || ''));
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
      const text = cleanText(el.textContent || '');
      
      if (!text && tagName !== 'hr') return;
      
      // Skip if this is inside a table
      if (el.closest('table') && (tagName === 'th' || tagName === 'td' || tagName === 'tr')) {
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
          const bulletWidth = pdf.getTextWidth(bullet);
          const bulletIndent = 5;
          const textIndent = bulletWidth + 2;
          
          // Calculate available width for list text
          const listTextWidth = contentWidth - bulletIndent - textIndent - 2;
          const listLines = safeWrapText(text, listTextWidth, 11);
          
          if (listLines.length > 0) {
            // First line with bullet
            pdf.text(bullet, marginLeft + bulletIndent, yPosition);
            pdf.text(listLines[0], marginLeft + bulletIndent + textIndent, yPosition);
            yPosition += lineHeight;
            
            // Subsequent lines indented to match text start
            for (let i = 1; i < listLines.length; i++) {
              checkPageBreak(lineHeight);
              pdf.text(listLines[i], marginLeft + bulletIndent + textIndent, yPosition);
              yPosition += lineHeight;
            }
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
          pdf.setFontSize(7); // Smaller font for code
          pdf.setFont('courier', 'normal');
          
          // Use narrower width for code blocks
          const codeWidth = contentWidth - 15;
          const codeLines = safeWrapText(text, codeWidth, 7);
          
          // Calculate code block height
          const codeLineHeight = 3;
          const codeBlockHeight = Math.min(codeLines.length * codeLineHeight + 10, pageHeight - marginTop - marginBottom);
          checkPageBreak(Math.min(codeBlockHeight, 50)); // At least first part fits
          
          // Draw code background
          pdf.setFillColor(248, 248, 248);
          pdf.setDrawColor(220, 220, 220);
          
          const bgHeight = Math.min(codeLines.length * codeLineHeight + 8, pageHeight - yPosition - marginBottom);
          pdf.rect(marginLeft + 3, yPosition - 2, contentWidth - 6, bgHeight, 'FD');
          
          yPosition += 4;
          codeLines.forEach((line: string) => {
            if (checkPageBreak(codeLineHeight)) {
              // Continue code block on new page
              pdf.setFontSize(7);
              pdf.setFont('courier', 'normal');
            }
            pdf.text(line, marginLeft + 6, yPosition);
            yPosition += codeLineHeight;
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

    // Save the PDF with explicit blob creation for better browser compatibility
    const pdfBlob = pdf.output('blob');
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.type = 'application/pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
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
