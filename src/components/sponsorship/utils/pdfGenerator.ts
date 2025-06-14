
import jsPDF from 'jspdf';
import * as html2pdf from 'html2pdf.js';
import { toast } from 'sonner';

// Make jsPDF available globally for html2pdf
if (typeof window !== 'undefined') {
  (window as any).jsPDF = jsPDF;
}

interface PDFOptions {
  filename: string;
  content: string;
}

export const generatePDF = async ({ filename, content }: PDFOptions): Promise<void> => {
  try {
    const element = document.createElement('div');
    element.innerHTML = content;
    
    const opt = {
      margin: 1,
      filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    await html2pdf().set(opt).from(element).save();
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
