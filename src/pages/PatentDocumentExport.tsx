import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileText, Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import Layout from '@/components/Layout';
import { jsPDF } from 'jspdf';

const PatentDocumentExport = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

  const generatePDF = async () => {
    setIsGenerating(true);
    
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'letter'
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 72; // 1 inch margins
      const contentWidth = pageWidth - 2 * margin;
      let y = margin;

      const addText = (text: string, fontSize: number, isBold: boolean = false, align: 'left' | 'center' | 'justify' = 'left') => {
        doc.setFontSize(fontSize);
        doc.setFont('times', isBold ? 'bold' : 'normal');
        
        const lines = doc.splitTextToSize(text, contentWidth);
        const lineHeight = fontSize * 1.4;
        
        for (const line of lines) {
          if (y + lineHeight > pageHeight - margin) {
            doc.addPage();
            y = margin;
          }
          
          if (align === 'center') {
            doc.text(line, pageWidth / 2, y, { align: 'center' });
          } else {
            doc.text(line, margin, y);
          }
          y += lineHeight;
        }
      };

      const addSpace = (pts: number) => {
        y += pts;
        if (y > pageHeight - margin) {
          doc.addPage();
          y = margin;
        }
      };

      // Header
      addText('PROVISIONAL PATENT APPLICATION', 14, true, 'center');
      addSpace(10);
      addText('UNITED STATES PATENT AND TRADEMARK OFFICE', 12, true, 'center');
      addSpace(30);

      // Title
      addText('System and Method for a Multi-Tenant Vertical Marketplace Operating System Featuring Temporal Incentives, Circulatory Multiplier Attribution, Cross-Business Coalition Loyalty Networks, and Geospatial Velocity Fraud Detection', 13, true, 'center');
      addSpace(30);

      // Filing info
      addText('Filing Date: _______________', 12, false);
      addText('Application Number: _______________', 12, false);
      addText('Applicant/Inventor: _______________', 12, false);
      addText('Correspondence Address: _______________', 12, false);
      addSpace(20);

      // Field of Invention
      addText('FIELD OF THE INVENTION', 12, true);
      addSpace(10);
      addText('The present invention relates generally to electronic commerce platforms and more specifically to a comprehensive multi-tenant vertical marketplace operating system designed to support minority-owned businesses through an integrated ecosystem of temporal incentive structures, economic circulation tracking, cross-business coalition loyalty programs, AI-powered business matching, voice-enabled concierge services, gamification systems, multi-tier sales agent networks, corporate sponsorship impact attribution, and geospatial velocity-based fraud detection.', 12, false);
      addSpace(20);

      // Background
      addText('BACKGROUND OF THE INVENTION', 12, true);
      addSpace(10);
      addText('Traditional e-commerce and business directory platforms fail to address the unique economic challenges faced by minority-owned businesses, particularly Black-owned businesses in the United States. Research indicates that the "Black dollar" circulates within Black communities for only 6 hours compared to 20 days in other communities, representing a significant wealth disparity that perpetuates economic inequality.', 12, false);
      addSpace(10);
      addText('Existing marketplace solutions suffer from several deficiencies:', 12, false);
      addSpace(5);
      addText('1. Lack of Economic Circulation Awareness: No existing platform tracks, visualizes, or incentivizes economic circulation within specific communities to maximize wealth retention.', 11, false);
      addText('2. Fragmented Loyalty Programs: Current loyalty systems are siloed to individual businesses, failing to create network effects.', 11, false);
      addText('3. Insufficient Fraud Detection: Existing QR-code based transaction systems lack sophisticated geospatial and temporal analysis.', 11, false);
      addText('4. No Temporal Early-Adopter Incentives: Platforms fail to create immutable, time-based incentive structures.', 11, false);
      addText('5. Weak B2B Connectivity: Minority-owned businesses lack tools to discover and transact with other minority-owned businesses.', 11, false);
      addText('6. Limited Corporate Sponsorship Attribution: Corporate sponsors cannot accurately measure real economic impact.', 11, false);
      addSpace(20);

      // Summary
      addText('SUMMARY OF THE INVENTION', 12, true);
      addSpace(10);
      addText('The present invention provides a comprehensive marketplace operating system ("Mansa Musa Marketplace") that addresses these deficiencies through multiple novel technical innovations:', 12, false);
      addSpace(10);

      const claims = [
        'Temporal Founding Member Status System - Immutable lifetime benefits via timestamp-triggered database mechanisms',
        'Economic Circulation Multiplier Attribution Engine - Proprietary calculation applying 2.3x culturally-specific multipliers',
        'Cross-Business Coalition Loyalty Network - Tiered, cross-merchant points system with redemption portability',
        'Geospatial Velocity Fraud Detection System - AI-powered impossible travel and abuse pattern detection',
        'AI-Powered B2B Matching Engine - Intelligent supplier-buyer matching with weighted multi-factor scoring',
        'Voice-Enabled Concierge System - Natural language business discovery via voice commands',
        'Multi-Tier Sales Agent Commission Network - Hierarchical referral system with team overrides',
        'Gamification and Achievement System - Streaks, achievements, leaderboards, and group challenges',
        'QR-Code Transaction Processing Engine - 7.5% commission calculation with Stripe Connect integration',
        'Corporate Sponsorship Impact Dashboard - Real-time ROI calculation using circulation multipliers'
      ];

      claims.forEach((claim, i) => {
        addText(`${i + 1}. ${claim}`, 11, false);
      });
      addSpace(20);

      // Claims detail
      for (let i = 1; i <= 10; i++) {
        doc.addPage();
        y = margin;
        addText(`CLAIM ${i}: ${getClaimTitle(i)}`, 12, true);
        addSpace(10);
        addText(getClaimDescription(i), 12, false);
        addSpace(15);
      }

      // Abstract
      doc.addPage();
      y = margin;
      addText('ABSTRACT', 12, true);
      addSpace(10);
      addText('A comprehensive multi-tenant marketplace operating system designed to support minority-owned businesses through an integrated ecosystem of novel technical systems. The invention includes: (1) temporal founding member status assignment via database triggers; (2) economic circulation multiplier attribution using culturally-derived constants; (3) cross-business coalition loyalty networks with tiered point multipliers; (4) geospatial velocity-based fraud detection using AI pattern analysis; (5) intelligent B2B matching with weighted multi-factor scoring; (6) voice-enabled concierge services for natural language business discovery; (7) hierarchical sales agent commission networks with team overrides; (8) gamification layers including achievements, streaks, and group challenges; (9) QR-code transaction processing with integrated commission splitting; and (10) AI-powered personalized business recommendations.', 12, false);
      addSpace(30);

      // Declaration
      addText('INVENTOR DECLARATION', 12, true);
      addSpace(10);
      addText('I hereby declare that I am the original inventor of the subject matter claimed in this provisional patent application and that all statements made herein are true to the best of my knowledge.', 12, false);
      addSpace(30);
      addText('Signature: _________________________', 12, false);
      addText('Printed Name: _________________________', 12, false);
      addText('Date: _________________________', 12, false);
      addSpace(30);
      addText('© 2024-2025. All rights reserved.', 10, false, 'center');

      doc.save('USPTO_Provisional_Patent_Application_Mansa_Musa_Marketplace.pdf');
      
      setIsGenerated(true);
      toast.success('PDF generated and downloaded successfully!');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const getClaimTitle = (num: number): string => {
    const titles: Record<number, string> = {
      1: 'TEMPORAL FOUNDING MEMBER STATUS SYSTEM',
      2: 'ECONOMIC CIRCULATION MULTIPLIER ATTRIBUTION ENGINE',
      3: 'CROSS-BUSINESS COALITION LOYALTY NETWORK',
      4: 'GEOSPATIAL VELOCITY FRAUD DETECTION SYSTEM',
      5: 'AI-POWERED B2B MATCHING ENGINE',
      6: 'VOICE-ENABLED CONCIERGE SYSTEM',
      7: 'MULTI-TIER SALES AGENT COMMISSION NETWORK',
      8: 'GAMIFICATION AND ACHIEVEMENT SYSTEM',
      9: 'QR-CODE TRANSACTION PROCESSING ENGINE',
      10: 'AI-POWERED PERSONALIZED RECOMMENDATIONS'
    };
    return titles[num] || '';
  };

  const getClaimDescription = (num: number): string => {
    const descriptions: Record<number, string> = {
      1: 'The invention implements a database-level trigger mechanism that automatically and irrevocably assigns "founding member" status to users who register before a predetermined temporal cutoff (January 31, 2027, 23:59:59 UTC). Novel characteristics include: Immutability - Once the is_founding_member flag is set to TRUE, it cannot be revoked through normal application operations due to database-level constraints. Automatic Execution - The trigger executes at the database layer, ensuring consistent application regardless of client implementation. Timestamp Preservation - The founding_member_since field preserves the exact UTC moment of registration for potential future tiered benefits. Lifetime Persistence - The status persists across account modifications, password resets, email changes, and platform migrations.',
      2: 'The invention implements a proprietary economic impact calculation system that applies a culturally-derived multiplier constant (2.3x) to transaction values, representing the number of times currency circulates within the target demographic before exiting the community. Research into economic circulation patterns in Black American communities establishes that currency spent at Black-owned businesses circulates approximately 2.3 times within the community before exiting. This constant is codified into the system for sponsor impact calculations.',
      3: 'The invention implements a multi-tier loyalty points system that enables points earned at any participating business to be redeemed at any other participating business, creating network effects that benefit the entire ecosystem. Tier System: Bronze (1.0x multiplier), Silver (1.25x), Gold (1.5x), Platinum (2.0x) based on lifetime points earned.',
      4: 'The invention implements an AI-powered fraud detection engine that analyzes temporal and geospatial patterns of QR scans and transactions to identify impossible travel scenarios and coordinated abuse patterns. Detection categories include: velocity_abuse, location_mismatch, qr_scan_abuse, transaction_anomaly, account_suspicious, and review_manipulation.',
      5: 'The invention implements an intelligent business-to-business matching system that connects minority-owned businesses with suppliers and service providers within the ecosystem using multi-factor weighted scoring including category match, location proximity, service area overlap, budget compatibility, rating bonus, and lead time matching.',
      6: 'The invention implements a natural language voice interface that enables users to discover businesses, check availability, view coalition points, and initiate bookings through voice commands using integrated AI assistants.',
      7: 'The invention implements a hierarchical sales agent network with commission structures (10% base), team overrides (2.5%), recruitment bonuses ($50), and performance tracking enabling a multi-level incentive system for platform growth.',
      8: 'The invention implements a comprehensive gamification layer including achievements, streaks, leaderboards (daily, weekly, monthly, all-time), and collaborative group challenges to drive user engagement and community participation.',
      9: 'The invention implements a comprehensive QR-code based transaction system with integrated 7.5% platform commission calculation, Stripe Connect payment processing, and automatic loyalty point awarding (10 points per dollar spent).',
      10: 'The invention implements an AI-driven recommendation engine that personalizes business suggestions based on user location, stated preferences, and browsing history patterns using Google Gemini 2.5 Flash AI model integration.'
    };
    return descriptions[num] || '';
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-6 w-6" />
              USPTO Provisional Patent Application Export
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Download your complete provisional patent application as a PDF document ready for USPTO submission.
            </p>
            <Button 
              onClick={generatePDF} 
              disabled={isGenerating}
              size="lg"
              className="gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Generating PDF...
                </>
              ) : isGenerated ? (
                <>
                  <CheckCircle className="h-5 w-5" />
                  Download Again
                </>
              ) : (
                <>
                  <Download className="h-5 w-5" />
                  Download PDF
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Hidden content for PDF generation */}
        <div id="patent-content" className="bg-white text-black p-8" style={{ fontFamily: 'Times New Roman, serif', fontSize: '12pt', lineHeight: '1.6' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{ fontSize: '14pt', fontWeight: 'bold', marginBottom: '20px' }}>
              PROVISIONAL PATENT APPLICATION
            </h1>
            <h2 style={{ fontSize: '12pt', fontWeight: 'bold', marginBottom: '30px' }}>
              UNITED STATES PATENT AND TRADEMARK OFFICE
            </h2>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '40px', borderTop: '2px solid black', borderBottom: '2px solid black', padding: '20px 0' }}>
            <h2 style={{ fontSize: '13pt', fontWeight: 'bold' }}>
              System and Method for a Multi-Tenant Vertical Marketplace Operating System Featuring Temporal Incentives, Circulatory Multiplier Attribution, Cross-Business Coalition Loyalty Networks, and Geospatial Velocity Fraud Detection
            </h2>
          </div>

          <table style={{ width: '100%', marginBottom: '30px', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ padding: '8px', width: '40%' }}><strong>Filing Date:</strong></td>
                <td style={{ padding: '8px', borderBottom: '1px solid black' }}>_______________</td>
              </tr>
              <tr>
                <td style={{ padding: '8px' }}><strong>Application Number:</strong></td>
                <td style={{ padding: '8px', borderBottom: '1px solid black' }}>_______________</td>
              </tr>
              <tr>
                <td style={{ padding: '8px' }}><strong>Applicant/Inventor:</strong></td>
                <td style={{ padding: '8px', borderBottom: '1px solid black' }}>_______________</td>
              </tr>
              <tr>
                <td style={{ padding: '8px' }}><strong>Correspondence Address:</strong></td>
                <td style={{ padding: '8px', borderBottom: '1px solid black' }}>_______________</td>
              </tr>
            </tbody>
          </table>

          <h2 style={{ fontSize: '12pt', fontWeight: 'bold', marginTop: '30px', marginBottom: '15px' }}>
            FIELD OF THE INVENTION
          </h2>
          <p style={{ textAlign: 'justify', marginBottom: '20px' }}>
            The present invention relates generally to electronic commerce platforms and more specifically to a comprehensive multi-tenant vertical marketplace operating system designed to support minority-owned businesses through an integrated ecosystem of temporal incentive structures, economic circulation tracking, cross-business coalition loyalty programs, AI-powered business matching, voice-enabled concierge services, gamification systems, multi-tier sales agent networks, corporate sponsorship impact attribution, and geospatial velocity-based fraud detection.
          </p>

          <h2 style={{ fontSize: '12pt', fontWeight: 'bold', marginTop: '30px', marginBottom: '15px' }}>
            BACKGROUND OF THE INVENTION
          </h2>
          <p style={{ textAlign: 'justify', marginBottom: '15px' }}>
            Traditional e-commerce and business directory platforms fail to address the unique economic challenges faced by minority-owned businesses, particularly Black-owned businesses in the United States. Research indicates that the "Black dollar" circulates within Black communities for only 6 hours compared to 20 days in other communities, representing a significant wealth disparity that perpetuates economic inequality.
          </p>
          <p style={{ textAlign: 'justify', marginBottom: '15px' }}>
            Existing marketplace solutions suffer from several deficiencies:
          </p>
          <ol style={{ marginLeft: '30px', marginBottom: '20px' }}>
            <li style={{ marginBottom: '10px' }}><strong>Lack of Economic Circulation Awareness:</strong> No existing platform tracks, visualizes, or incentivizes economic circulation within specific communities to maximize wealth retention.</li>
            <li style={{ marginBottom: '10px' }}><strong>Fragmented Loyalty Programs:</strong> Current loyalty systems are siloed to individual businesses, failing to create network effects that benefit both consumers and business ecosystems.</li>
            <li style={{ marginBottom: '10px' }}><strong>Insufficient Fraud Detection:</strong> Existing QR-code based transaction systems lack sophisticated geospatial and temporal analysis to prevent abuse such as impossible travel scenarios or coordinated manipulation.</li>
            <li style={{ marginBottom: '10px' }}><strong>No Temporal Early-Adopter Incentives:</strong> Platforms fail to create immutable, time-based incentive structures that reward early participation with permanent benefits.</li>
            <li style={{ marginBottom: '10px' }}><strong>Weak B2B Connectivity:</strong> Minority-owned businesses lack tools to discover and transact with other minority-owned businesses for supply chain and service needs.</li>
            <li style={{ marginBottom: '10px' }}><strong>Limited Corporate Sponsorship Attribution:</strong> Corporate sponsors supporting minority communities cannot accurately measure the real economic impact of their investments.</li>
          </ol>

          <h2 style={{ fontSize: '12pt', fontWeight: 'bold', marginTop: '30px', marginBottom: '15px' }}>
            SUMMARY OF THE INVENTION
          </h2>
          <p style={{ textAlign: 'justify', marginBottom: '15px' }}>
            The present invention provides a comprehensive marketplace operating system ("Mansa Musa Marketplace") that addresses these deficiencies through multiple novel and non-obvious technical innovations:
          </p>
          <ol style={{ marginLeft: '30px', marginBottom: '20px' }}>
            <li style={{ marginBottom: '8px' }}><strong>Temporal Founding Member Status System</strong> - Immutable lifetime benefits for early registrants based on timestamp-triggered database mechanisms.</li>
            <li style={{ marginBottom: '8px' }}><strong>Economic Circulation Multiplier Attribution Engine</strong> - A proprietary calculation system that applies culturally-specific multiplier constants (2.3x) to transaction values.</li>
            <li style={{ marginBottom: '8px' }}><strong>Cross-Business Coalition Loyalty Network</strong> - A tiered, cross-merchant points system with redemption portability.</li>
            <li style={{ marginBottom: '8px' }}><strong>Geospatial Velocity Fraud Detection System</strong> - AI-powered analysis detecting impossible travel patterns and coordinated abuse.</li>
            <li style={{ marginBottom: '8px' }}><strong>AI-Powered B2B Matching Engine</strong> - Intelligent supplier-buyer matching with weighted multi-factor scoring.</li>
            <li style={{ marginBottom: '8px' }}><strong>Voice-Enabled Concierge System</strong> - Natural language business discovery and interaction through voice commands.</li>
            <li style={{ marginBottom: '8px' }}><strong>Multi-Tier Sales Agent Commission Network</strong> - A hierarchical referral system with team overrides and recruitment bonuses.</li>
            <li style={{ marginBottom: '8px' }}><strong>Gamification and Achievement System</strong> - Behavioral incentives through streaks, achievements, leaderboards, and group challenges.</li>
            <li style={{ marginBottom: '8px' }}><strong>QR-Code Transaction Processing Engine</strong> - Commission-enabled payment processing with loyalty point integration.</li>
            <li style={{ marginBottom: '8px' }}><strong>Corporate Sponsorship Impact Dashboard</strong> - Real-time calculation of sponsor ROI using circulation multipliers.</li>
          </ol>

          <div style={{ pageBreakBefore: 'always' }}></div>

          <h2 style={{ fontSize: '12pt', fontWeight: 'bold', marginTop: '30px', marginBottom: '15px' }}>
            CLAIM 1: TEMPORAL FOUNDING MEMBER STATUS SYSTEM
          </h2>
          <p style={{ textAlign: 'justify', marginBottom: '15px' }}>
            The invention implements a database-level trigger mechanism that automatically and irrevocably assigns "founding member" status to users who register before a predetermined temporal cutoff (January 31, 2027, 23:59:59 UTC).
          </p>
          <p style={{ textAlign: 'justify', marginBottom: '15px' }}>
            <strong>Novel Characteristics:</strong>
          </p>
          <ul style={{ marginLeft: '30px', marginBottom: '20px' }}>
            <li><strong>Immutability:</strong> Once the is_founding_member flag is set to TRUE, it cannot be revoked through normal application operations due to database-level constraints.</li>
            <li><strong>Automatic Execution:</strong> The trigger executes at the database layer, ensuring consistent application regardless of client implementation.</li>
            <li><strong>Timestamp Preservation:</strong> The founding_member_since field preserves the exact UTC moment of registration for potential future tiered benefits.</li>
            <li><strong>Lifetime Persistence:</strong> The status persists across account modifications, password resets, email changes, and platform migrations.</li>
          </ul>

          <h2 style={{ fontSize: '12pt', fontWeight: 'bold', marginTop: '30px', marginBottom: '15px' }}>
            CLAIM 2: ECONOMIC CIRCULATION MULTIPLIER ATTRIBUTION ENGINE
          </h2>
          <p style={{ textAlign: 'justify', marginBottom: '15px' }}>
            The invention implements a proprietary economic impact calculation system that applies a culturally-derived multiplier constant (2.3x) to transaction values, representing the number of times currency circulates within the target demographic before exiting the community.
          </p>
          <p style={{ textAlign: 'justify', marginBottom: '15px' }}>
            Research into economic circulation patterns in Black American communities establishes that currency spent at Black-owned businesses circulates approximately 2.3 times within the community before exiting. This constant is codified into the system for sponsor impact calculations.
          </p>

          <h2 style={{ fontSize: '12pt', fontWeight: 'bold', marginTop: '30px', marginBottom: '15px' }}>
            CLAIM 3: CROSS-BUSINESS COALITION LOYALTY NETWORK
          </h2>
          <p style={{ textAlign: 'justify', marginBottom: '15px' }}>
            The invention implements a multi-tier loyalty points system that enables points earned at any participating business to be redeemed at any other participating business, creating network effects that benefit the entire ecosystem.
          </p>
          <p style={{ textAlign: 'justify', marginBottom: '15px' }}>
            <strong>Tier System:</strong> Bronze (1.0x multiplier), Silver (1.25x), Gold (1.5x), Platinum (2.0x) based on lifetime points earned.
          </p>

          <h2 style={{ fontSize: '12pt', fontWeight: 'bold', marginTop: '30px', marginBottom: '15px' }}>
            CLAIM 4: GEOSPATIAL VELOCITY FRAUD DETECTION SYSTEM
          </h2>
          <p style={{ textAlign: 'justify', marginBottom: '15px' }}>
            The invention implements an AI-powered fraud detection engine that analyzes temporal and geospatial patterns of QR scans and transactions to identify impossible travel scenarios and coordinated abuse patterns. Detection categories include: velocity_abuse, location_mismatch, qr_scan_abuse, transaction_anomaly, account_suspicious, and review_manipulation.
          </p>

          <h2 style={{ fontSize: '12pt', fontWeight: 'bold', marginTop: '30px', marginBottom: '15px' }}>
            CLAIM 5: AI-POWERED B2B MATCHING ENGINE
          </h2>
          <p style={{ textAlign: 'justify', marginBottom: '15px' }}>
            The invention implements an intelligent business-to-business matching system that connects minority-owned businesses with suppliers and service providers within the ecosystem using multi-factor weighted scoring including category match, location proximity, service area overlap, budget compatibility, rating bonus, and lead time matching.
          </p>

          <h2 style={{ fontSize: '12pt', fontWeight: 'bold', marginTop: '30px', marginBottom: '15px' }}>
            CLAIM 6: VOICE-ENABLED CONCIERGE SYSTEM
          </h2>
          <p style={{ textAlign: 'justify', marginBottom: '15px' }}>
            The invention implements a natural language voice interface that enables users to discover businesses, check availability, view coalition points, and initiate bookings through voice commands using integrated AI assistants.
          </p>

          <h2 style={{ fontSize: '12pt', fontWeight: 'bold', marginTop: '30px', marginBottom: '15px' }}>
            CLAIM 7: MULTI-TIER SALES AGENT COMMISSION NETWORK
          </h2>
          <p style={{ textAlign: 'justify', marginBottom: '15px' }}>
            The invention implements a hierarchical sales agent network with commission structures (10% base), team overrides (2.5%), recruitment bonuses ($50), and performance tracking enabling a multi-level incentive system for platform growth.
          </p>

          <h2 style={{ fontSize: '12pt', fontWeight: 'bold', marginTop: '30px', marginBottom: '15px' }}>
            CLAIM 8: GAMIFICATION AND ACHIEVEMENT SYSTEM
          </h2>
          <p style={{ textAlign: 'justify', marginBottom: '15px' }}>
            The invention implements a comprehensive gamification layer including achievements, streaks, leaderboards (daily, weekly, monthly, all-time), and collaborative group challenges to drive user engagement and community participation.
          </p>

          <h2 style={{ fontSize: '12pt', fontWeight: 'bold', marginTop: '30px', marginBottom: '15px' }}>
            CLAIM 9: QR-CODE TRANSACTION PROCESSING ENGINE
          </h2>
          <p style={{ textAlign: 'justify', marginBottom: '15px' }}>
            The invention implements a comprehensive QR-code based transaction system with integrated 7.5% platform commission calculation, Stripe Connect payment processing, and automatic loyalty point awarding (10 points per dollar spent).
          </p>

          <h2 style={{ fontSize: '12pt', fontWeight: 'bold', marginTop: '30px', marginBottom: '15px' }}>
            CLAIM 10: AI-POWERED PERSONALIZED RECOMMENDATIONS
          </h2>
          <p style={{ textAlign: 'justify', marginBottom: '15px' }}>
            The invention implements an AI-driven recommendation engine that personalizes business suggestions based on user location, stated preferences, and browsing history patterns using Google Gemini 2.5 Flash AI model integration.
          </p>

          <div style={{ pageBreakBefore: 'always' }}></div>

          <h2 style={{ fontSize: '12pt', fontWeight: 'bold', marginTop: '30px', marginBottom: '15px' }}>
            ABSTRACT
          </h2>
          <p style={{ textAlign: 'justify', marginBottom: '20px' }}>
            A comprehensive multi-tenant marketplace operating system designed to support minority-owned businesses through an integrated ecosystem of novel technical systems. The invention includes: (1) temporal founding member status assignment via database triggers; (2) economic circulation multiplier attribution using culturally-derived constants; (3) cross-business coalition loyalty networks with tiered point multipliers; (4) geospatial velocity-based fraud detection using AI pattern analysis; (5) intelligent B2B matching with weighted multi-factor scoring; (6) voice-enabled concierge services for natural language business discovery; (7) hierarchical sales agent commission networks with team overrides; (8) gamification layers including achievements, streaks, and group challenges; (9) QR-code transaction processing with integrated commission splitting; and (10) AI-powered personalized business recommendations.
          </p>

          <div style={{ marginTop: '60px', borderTop: '1px solid black', paddingTop: '20px' }}>
            <h2 style={{ fontSize: '12pt', fontWeight: 'bold', marginBottom: '15px' }}>
              INVENTOR DECLARATION
            </h2>
            <p style={{ marginBottom: '30px' }}>
              I hereby declare that I am the original inventor of the subject matter claimed in this provisional patent application and that all statements made herein are true to the best of my knowledge.
            </p>
            <table style={{ width: '100%' }}>
              <tbody>
                <tr>
                  <td style={{ padding: '15px 0' }}><strong>Signature:</strong> _________________________</td>
                </tr>
                <tr>
                  <td style={{ padding: '15px 0' }}><strong>Printed Name:</strong> _________________________</td>
                </tr>
                <tr>
                  <td style={{ padding: '15px 0' }}><strong>Date:</strong> _________________________</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: '40px', textAlign: 'center', fontSize: '10pt', color: '#666' }}>
            <p>© 2024-2025. All rights reserved.</p>
            <p>This document and the systems described herein are protected intellectual property.</p>
            <p>Unauthorized replication, implementation, or distribution is strictly prohibited.</p>
          </div>
        </div>

        {/* Preview Card */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Document Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              The PDF above contains a formatted version of your provisional patent application with all 10 claims ready for USPTO submission. The full technical implementation details are available in the complete markdown document at <code>docs/USPTO_PROVISIONAL_PATENT_APPLICATION.md</code>.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PatentDocumentExport;
