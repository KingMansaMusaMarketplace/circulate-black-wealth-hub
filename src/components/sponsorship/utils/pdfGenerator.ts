
import jsPDF from 'jspdf';
import html2pdf from 'html2pdf.js';
import { toast } from 'sonner';

interface PDFOptions {
  filename: string;
  content: string;
}

export const generatePDF = async ({ filename, content }: PDFOptions): Promise<void> => {
  try {
    // Create a temporary div element with the content
    const element = document.createElement('div');
    element.innerHTML = content;
    element.style.width = '210mm';
    element.style.minHeight = '297mm';
    element.style.padding = '20mm';
    element.style.margin = '0';
    element.style.backgroundColor = 'white';
    element.style.fontFamily = 'Arial, sans-serif';
    
    // Temporarily add to DOM for proper rendering
    element.style.position = 'absolute';
    element.style.left = '-9999px';
    document.body.appendChild(element);

    const opt = {
      margin: 0.5,
      filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        allowTaint: true
      },
      jsPDF: { 
        unit: 'in', 
        format: 'letter', 
        orientation: 'portrait' 
      }
    };

    // Generate and download the PDF
    await html2pdf().set(opt).from(element).save();
    
    // Clean up
    document.body.removeChild(element);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    toast.error('Failed to generate PDF. Please try again.');
    throw error;
  }
};
