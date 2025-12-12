
import { toast } from 'sonner';
import { generatePDF } from '../utils/pdfGenerator';
import { getPartnershipGuideContent } from '../templates/partnershipGuideTemplate';
import { getBriefPartnershipOverviewContent } from '../templates/briefPartnershipOverviewTemplate';
import { getBrandAssetsContent } from '../templates/brandAssetsTemplate';
import { getImpactReportContent } from '../templates/impactReportTemplate';
import { getMediaKitContent } from '../templates/mediaKitTemplate';
import { getInvestorAnalysisContent } from '../templates/investorAnalysisTemplate';
import { getDirectoryPartnershipProposalContent } from '../templates/directoryPartnershipProposalTemplate';
import { generateInvestorAnalysisWord } from '../utils/wordGenerator';

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

export const generateBriefPartnershipOverview = async (): Promise<void> => {
  try {
    toast.info('Generating Brief Partnership Overview...');
    await generatePDF({
      filename: 'Brief-Partnership-Overview.pdf',
      content: getBriefPartnershipOverviewContent()
    });
    toast.success('Brief partnership overview downloaded successfully!');
  } catch (error) {
    console.error('Error generating brief partnership overview:', error);
    toast.error('Failed to generate brief partnership overview. Please try again.');
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

export const generateInvestorAnalysisPDF = async (): Promise<void> => {
  try {
    toast.info('Generating Investor Analysis PDF...');
    await generatePDF({
      filename: 'Mansa-Musa-Billion-Dollar-Analysis.pdf',
      content: getInvestorAnalysisContent()
    });
    toast.success('Investor analysis PDF downloaded successfully!');
  } catch (error) {
    console.error('Error generating investor analysis PDF:', error);
    toast.error('Failed to generate investor analysis PDF. Please try again.');
    throw error;
  }
};

export const generateInvestorAnalysisWordDoc = async (): Promise<void> => {
  try {
    toast.info('Generating Investor Analysis Word Document...');
    await generateInvestorAnalysisWord({
      filename: 'Mansa-Musa-Billion-Dollar-Analysis.docx'
    });
    toast.success('Investor analysis Word document downloaded successfully!');
  } catch (error) {
    console.error('Error generating investor analysis Word doc:', error);
    toast.error('Failed to generate investor analysis Word document. Please try again.');
    throw error;
  }
};

export const generateDirectoryPartnershipProposal = async (): Promise<void> => {
  try {
    toast.info('Generating Directory Partnership Proposal...');
    await generatePDF({
      filename: 'Mansa-Musa-Directory-Partnership-Proposal.pdf',
      content: getDirectoryPartnershipProposalContent()
    });
    toast.success('Directory partnership proposal downloaded successfully!');
  } catch (error) {
    console.error('Error generating directory partnership proposal:', error);
    toast.error('Failed to generate directory partnership proposal. Please try again.');
    throw error;
  }
};
