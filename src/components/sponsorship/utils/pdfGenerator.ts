
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
    element.style.fontSize = '14px';
    element.style.lineHeight = '1.6';
    
    // Temporarily add to DOM for proper rendering
    element.style.position = 'absolute';
    element.style.left = '-9999px';
    element.style.top = '0';
    document.body.appendChild(element);

    // Use dynamic import to load html2pdf
    const html2pdf = await import('html2pdf.js');
    
    const opt = {
      margin: [10, 10, 10, 10],
      filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait' 
      }
    };

    // Generate and download the PDF
    const pdfModule = html2pdf.default || html2pdf;
    await pdfModule().set(opt).from(element).save();
    
    // Clean up
    document.body.removeChild(element);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    
    // Fallback: create a simple text file if PDF generation fails
    try {
      const textContent = content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
      const blob = new Blob([textContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename.replace('.pdf', '.txt');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success(`${filename.replace('.pdf', '.txt')} downloaded as text file`);
    } catch (fallbackError) {
      console.error('Fallback download failed:', fallbackError);
      toast.error('Failed to generate download. Please try again.');
      throw error;
    }
  }
};
