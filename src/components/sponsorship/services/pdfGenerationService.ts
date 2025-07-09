
import { toast } from 'sonner';
import { generatePDF } from '../utils/pdfGenerator';
import { getPartnershipGuideContent } from '../templates/partnershipGuideTemplate';
import { getBrandAssetsContent } from '../templates/brandAssetsTemplate';
import { getImpactReportContent } from '../templates/impactReportTemplate';
import { getMediaKitContent } from '../templates/mediaKitTemplate';

export const generatePartnershipGuide = async (): Promise<void> => {
  try {
    toast.info('Generating Partnership Guide...');
    await generatePDF({
      filename: 'Mansa-Musa-Partnership-Guide.pdf',
      content: getPartnershipGuideContent()
    });
    toast.success('Partnership guide downloaded successfully!');
  } catch (error) {
    console.error('Error generating partnership guide:', error);
    toast.error('Failed to generate partnership guide. Please try again.');
    throw error;
  }
};

export const generateBrandAssets = async (): Promise<void> => {
  try {
    toast.info('Generating Brand Assets...');
    await generatePDF({
      filename: 'Mansa-Musa-Brand-Assets.pdf',
      content: getBrandAssetsContent()
    });
    toast.success('Brand assets guide downloaded successfully!');
  } catch (error) {
    console.error('Error generating brand assets PDF:', error);
    toast.error('Failed to generate brand assets guide. Please try again.');
    throw error;
  }
};

export const generateImpactReport = async (): Promise<void> => {
  try {
    toast.info('Generating Impact Report...');
    await generatePDF({
      filename: 'Mansa-Musa-Impact-Report.pdf',
      content: getImpactReportContent()
    });
    toast.success('Impact report downloaded successfully!');
  } catch (error) {
    console.error('Error generating impact report PDF:', error);
    toast.error('Failed to generate impact report. Please try again.');
    throw error;
  }
};

export const generateMediaKit = async (): Promise<void> => {
  try {
    toast.info('Generating Media Kit...');
    await generatePDF({
      filename: 'Mansa-Musa-Media-Kit.pdf',
      content: getMediaKitContent()
    });
    toast.success('Media kit downloaded successfully!');
  } catch (error) {
    console.error('Error generating media kit PDF:', error);
    toast.error('Failed to generate media kit. Please try again.');
    throw error;
  }
};
