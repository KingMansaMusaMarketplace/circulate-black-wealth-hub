
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
import { generateUSPTOPatentWord } from '../utils/usptoWordGenerator';
import { getUSPTOPatentContent } from '../templates/usptoPatentTemplate';
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

export const generateUSPTOPatentWordDoc = async (): Promise<void> => {
  try {
    toast.info('Generating USPTO Patent Filing Package (Word)...');
    const date = new Date().toISOString().split('T')[0];
    await generateUSPTOPatentWord({
      filename: `USPTO-Provisional-Patent-Application-${date}.docx`
    });
    toast.success('USPTO Patent Word document downloaded successfully!');
  } catch (error) {
    console.error('Error generating USPTO patent Word doc:', error);
    toast.error('Failed to generate USPTO patent document. Please try again.');
    throw error;
  }
};

export const generateUSPTOPatentPDF = async (): Promise<void> => {
  try {
    toast.info('Generating USPTO Patent Filing Package (PDF)...');
    const content = getUSPTOPatentContent();
    
    const styles = `
      <style>
        body { font-family: 'Times New Roman', serif; line-height: 1.5; color: #000; }
        h1 { font-size: 18pt; text-align: center; margin-bottom: 10px; }
        h2 { font-size: 14pt; margin-top: 24px; margin-bottom: 12px; border-bottom: 1px solid #333; padding-bottom: 4px; }
        h3 { font-size: 12pt; margin-top: 16px; margin-bottom: 8px; }
        p { margin-bottom: 10px; text-align: justify; }
        ul, ol { margin-left: 20px; margin-bottom: 10px; }
        li { margin-bottom: 6px; }
        .center { text-align: center; }
        .header { margin-bottom: 24px; }
        .claim-box { background: #f9f9f9; padding: 12px; margin: 10px 0; border-left: 3px solid #333; }
        .table { width: 100%; border-collapse: collapse; margin: 12px 0; }
        .table th, .table td { border: 1px solid #333; padding: 8px; text-align: left; font-size: 10pt; }
        .table th { background: #f0f0f0; }
        .footer { margin-top: 24px; text-align: center; font-size: 10pt; color: #666; }
        .page-footer { font-size: 9pt; color: #666; text-align: center; margin-top: 20px; }
      </style>
    `;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>${styles}</head>
      <body>
        <div class="header">
          <h1>USPTO PROVISIONAL PATENT APPLICATION</h1>
          <h1 style="font-size: 14pt;">COMPLETE USPTO PROVISIONAL PATENT FILING PACKAGE</h1>
          <h2 style="font-size: 11pt; border: none; text-align: center;">UNITED STATES PATENT AND TRADEMARK OFFICE</h2>
          <p class="center" style="font-size: 11pt; font-weight: bold;">${content.title}</p>
          <p class="center"><strong>Filing Date:</strong> ${content.filingDate}</p>
          <p class="center"><strong>Application Number:</strong> _______________</p>
          <p class="center"><strong>Applicant/Inventor:</strong> ${content.applicantName}</p>
          <p class="center"><strong>Commercial Name(s):</strong> ${content.commercialNames}</p>
          <p class="center"><strong>Correspondence Address:</strong> ${content.correspondenceAddress}</p>
          <p class="center"><strong>Contact:</strong> ${content.contact}</p>
        </div>

        <h2>TABLE OF CONTENTS</h2>
        <ol>
          <li>Abstract</li>
          <li>Cross-Reference to Related Applications</li>
          <li>Field of the Invention</li>
          <li>Background of the Invention</li>
          <li>Summary of the Invention</li>
          <li>Formal Claims (1-14)</li>
          <li>Key Protected Constants</li>
          <li>Technology Equivalents Matrix</li>
          <li>PCT Preservation Language</li>
          <li>Legal Safeguard Clauses</li>
          <li>Inventor Declaration</li>
          <li>Filing Checklist</li>
        </ol>

        <h2>ABSTRACT</h2>
        <p>${content.abstract.replace(/\n/g, '<br/>')}</p>

        <h2>FIELD OF THE INVENTION</h2>
        <p>${content.fieldOfInvention.replace(/\n/g, '<br/>')}</p>

        <h2>BACKGROUND OF THE INVENTION</h2>
        <h3>Problem Statement</h3>
        <p>${content.background.problemStatement}</p>
        <h3>Deficiencies in Existing Systems</h3>
        <ol>
          ${content.background.deficiencies.map(d => `<li>${d}</li>`).join('')}
        </ol>

        <h2>SUMMARY OF THE INVENTION</h2>
        <h3>System Architecture</h3>
        ${content.summary.architectureTiers.map(tier => `
          <h4>${tier.name}</h4>
          <p><em>${tier.description}</em></p>
          <ul>
            ${tier.features.map(f => `<li>${f}</li>`).join('')}
          </ul>
        `).join('')}

        <h2>FORMAL CLAIMS (14 Independent + 25+ Dependent)</h2>
        ${content.claims.map(c => `
          <h3>CLAIM ${c.number}: ${c.title}</h3>
          <div class="claim-box">
            <p><strong>Independent Claim ${c.number}:</strong></p>
            <p>${c.independentClaim.replace(/\n/g, '<br/>')}</p>
          </div>
          ${c.dependentClaims.map(d => `
            <p><strong>Dependent Claim ${d.id}:</strong> ${d.text}</p>
          `).join('')}
          ${c.technicalImplementation ? `
            <p><strong>Technical Implementation:</strong></p>
            <pre style="background: #f5f5f5; padding: 10px; font-size: 9pt; overflow-x: auto;">${c.technicalImplementation}</pre>
          ` : ''}
        `).join('')}

        <h2>KEY PROTECTED CONSTANTS</h2>
        <table class="table">
          <tr>
            <th>Constant</th>
            <th>Value</th>
            <th>Location</th>
            <th>Claim</th>
          </tr>
          ${content.keyConstants.map(k => `
            <tr>
              <td>${k.constant}</td>
              <td>${k.value}</td>
              <td>${k.location}</td>
              <td>${k.claim}</td>
            </tr>
          `).join('')}
        </table>

        <h2>TECHNOLOGY EQUIVALENTS MATRIX</h2>
        <table class="table">
          <tr>
            <th>Technology</th>
            <th>Covered Equivalents</th>
          </tr>
          ${content.technologyMatrix.map(t => `
            <tr>
              <td>${t.technology}</td>
              <td>${t.equivalents}</td>
            </tr>
          `).join('')}
        </table>

        <h2>PCT PRESERVATION LANGUAGE</h2>
        <p>${content.pctLanguage}</p>
        <h3>Target Countries for PCT Filing</h3>
        <p>${content.pctCountries.join(', ')}</p>

        <h2>LEGAL SAFEGUARD CLAUSES</h2>
        <h3>Broad Interpretation</h3>
        <ul>
          ${content.legalSafeguards.broadInterpretation.map(b => `<li>${b}</li>`).join('')}
        </ul>
        <h3>Doctrine of Equivalents</h3>
        <p>${content.legalSafeguards.doctrineOfEquivalents}</p>

        <h2>INVENTOR DECLARATION</h2>
        <p>I, <strong>${content.applicantName}</strong>, hereby declare that:</p>
        <ol>
          <li>I am the original inventor of the subject matter claimed in this provisional patent application.</li>
          <li>I have reviewed and understand the contents of this application.</li>
          <li>I acknowledge my duty to disclose to the USPTO all information known to me to be material to patentability.</li>
          <li>I understand that willful false statements may jeopardize the validity of the application or any patent issued thereon.</li>
        </ol>
        <p style="margin-top: 30px;">
          <strong>Signature:</strong> ________________________________<br/>
          <strong>Date:</strong> ________________________________<br/>
          <strong>Name:</strong> ${content.applicantName}
        </p>

        <h2>FILING CHECKLIST</h2>
        <table class="table">
          <tr>
            <th>Document</th>
            <th>Status</th>
          </tr>
          ${content.filingChecklist.map(f => `
            <tr>
              <td>${f.document}</td>
              <td>${f.status}</td>
            </tr>
          `).join('')}
        </table>

        <h3>Filing Fees (Provisional Application)</h3>
        <table class="table">
          <tr>
            <th>Entity Type</th>
            <th>Fee</th>
          </tr>
          ${content.filingFees.map(f => `
            <tr>
              <td>${f.entityType}</td>
              <td>${f.fee}</td>
            </tr>
          `).join('')}
        </table>

        <div class="footer">
          <hr/>
          <p>CONFIDENTIAL - Attorney-Client Work Product</p>
          <p>© 2024-2026 ${content.applicantName}. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;
    
    await generatePDF({
      filename: `USPTO-Provisional-Patent-Application-${new Date().toISOString().split('T')[0]}.pdf`,
      content: htmlContent
    });
    toast.success('USPTO Patent PDF downloaded successfully!');
  } catch (error) {
    console.error('Error generating USPTO patent PDF:', error);
    toast.error('Failed to generate USPTO patent PDF. Please try again.');
    throw error;
  }
};
