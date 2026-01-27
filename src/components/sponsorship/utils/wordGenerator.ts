
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle, HeadingLevel } from 'docx';

interface WordGeneratorOptions {
  filename: string;
}

export const generateInvestorAnalysisWord = async (options: WordGeneratorOptions): Promise<void> => {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // Title
        new Paragraph({
          children: [
            new TextRun({
              text: "MANSA MUSA MARKETPLACE",
              bold: true,
              size: 48,
              color: "1a1a2e",
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "Billion-Dollar Business Analysis",
              size: 36,
              color: "d4af37",
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Investment Opportunity Assessment | ${currentDate}`,
              size: 24,
              color: "666666",
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 800 },
        }),

        // Executive Summary
        new Paragraph({
          text: "EXECUTIVE SUMMARY",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "Mansa Musa Marketplace is a comprehensive digital ecosystem designed to empower Black-owned businesses and strengthen economic circulation within the African American community. Named after the legendary West African emperor known for his immense wealth and generosity, our platform embodies the spirit of economic empowerment and community prosperity.",
              size: 24,
            }),
          ],
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "THE BILLION-DOLLAR VERDICT: ",
              bold: true,
              size: 24,
            }),
            new TextRun({
              text: "Yes, Mansa Musa Marketplace has legitimate billion-dollar potential. The platform addresses a $1.6 trillion market opportunity with a unique 4-sided marketplace model, comprehensive feature set, and clear path to scale.",
              size: 24,
            }),
          ],
          spacing: { after: 400 },
        }),

        // Market Opportunity
        new Paragraph({
          text: "MARKET OPPORTUNITY",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }),
        createMarketTable(),

        new Paragraph({
          text: "The Market Gap",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 300, after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "• Only 2% of Black consumer dollars circulate within Black communities", size: 24 }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "• Black-owned businesses receive less than 1% of venture capital funding", size: 24 }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "• Limited access to business tools, financing, and growth resources", size: 24 }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "• Fragmented discovery of Black-owned businesses", size: 24 }),
          ],
          spacing: { after: 300 },
        }),

        // Platform Assessment
        new Paragraph({
          text: "PLATFORM ASSESSMENT",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }),
        createPlatformTable(),

        new Paragraph({
          text: "Core Features",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 300, after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "• Business Directory: ", bold: true, size: 24 }),
            new TextRun({ text: "Comprehensive listings with search, filtering, and reviews", size: 24 }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "• Loyalty Points System: ", bold: true, size: 24 }),
            new TextRun({ text: "Gamified engagement rewarding community participation", size: 24 }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "• Community Savings Circles: ", bold: true, size: 24 }),
            new TextRun({ text: "Traditional 'Susu' system digitized for group savings", size: 24 }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "• Business Management Suite: ", bold: true, size: 24 }),
            new TextRun({ text: "Invoicing, expenses, inventory, customer management", size: 24 }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "• AI Assistant (Mansa AI): ", bold: true, size: 24 }),
            new TextRun({ text: "Intelligent business guidance and recommendations", size: 24 }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "• Sales Agent Network: ", bold: true, size: 24 }),
            new TextRun({ text: "Commission-based referral program with tiered rewards", size: 24 }),
          ],
          spacing: { after: 300 },
        }),

        // Competitive Advantages
        new Paragraph({
          text: "COMPETITIVE ADVANTAGES",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "1. Four-Sided Marketplace Model - ", bold: true, size: 24 }),
            new TextRun({ text: "Connects consumers, businesses, corporate sponsors, and sales agents", size: 24 }),
          ],
          spacing: { after: 150 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "2. Community Finance Innovation - ", bold: true, size: 24 }),
            new TextRun({ text: "Digital savings circles tap into trusted cultural practices", size: 24 }),
          ],
          spacing: { after: 150 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "3. Comprehensive Business Tools - ", bold: true, size: 24 }),
            new TextRun({ text: "Full-stack management reduces need for multiple subscriptions", size: 24 }),
          ],
          spacing: { after: 150 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "4. AI-Powered Intelligence - ", bold: true, size: 24 }),
            new TextRun({ text: "Personalized recommendations and automated assistance", size: 24 }),
          ],
          spacing: { after: 150 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "5. Mobile-First Architecture - ", bold: true, size: 24 }),
            new TextRun({ text: "Native iOS and Android apps for maximum accessibility", size: 24 }),
          ],
          spacing: { after: 300 },
        }),

        // Revenue Model
        new Paragraph({
          text: "REVENUE MODEL",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }),
        createRevenueTable(),

        // Growth Projections
        new Paragraph({
          text: "5-YEAR GROWTH PROJECTIONS",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }),
        createGrowthTable(),

        // Key Requirements
        new Paragraph({
          text: "KEY REQUIREMENTS FOR SUCCESS",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "1. Traction & User Growth: ", bold: true, size: 24 }),
            new TextRun({ text: "Demonstrate product-market fit with consistent growth", size: 24 }),
          ],
          spacing: { after: 150 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "2. Revenue Validation: ", bold: true, size: 24 }),
            new TextRun({ text: "Prove multiple revenue streams with paying customers", size: 24 }),
          ],
          spacing: { after: 150 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "3. Strategic Partnerships: ", bold: true, size: 24 }),
            new TextRun({ text: "Secure partnerships with corporations and financial institutions", size: 24 }),
          ],
          spacing: { after: 150 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "4. Funding & Resources: ", bold: true, size: 24 }),
            new TextRun({ text: "Raise capital to accelerate growth and scale marketing", size: 24 }),
          ],
          spacing: { after: 150 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "5. Community Engagement: ", bold: true, size: 24 }),
            new TextRun({ text: "Build authentic relationships with Black business owners", size: 24 }),
          ],
          spacing: { after: 400 },
        }),

        // Contact Information
        new Paragraph({
          text: "CONTACT INFORMATION",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Thomas D. Bowling", bold: true, size: 28 }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Founder & CEO", size: 24 }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Email: Thomas@1325.AI", size: 24 }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Phone: 312.709.6006", size: 24 }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: `© ${new Date().getFullYear()} Mansa Musa Marketplace. All rights reserved.`, size: 20, color: "666666" }),
          ],
          alignment: AlignmentType.CENTER,
        }),
      ],
    }],
  });

  try {
    const packerBlob = await Packer.toBlob(doc);
    
    // Re-wrap with explicit MIME type for cross-browser compatibility (especially Safari/macOS)
    const blob = new Blob([packerBlob], { 
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
    });
    
    // Ensure filename has .docx extension
    const filename = options.filename.endsWith('.docx') 
      ? options.filename 
      : `${options.filename}.docx`;
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Delay revocation to ensure download completes on all browsers
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (error) {
    console.error('Error generating Word document:', error);
    throw new Error('Failed to generate Word document. Please try again.');
  }
};

function createMarketTable(): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      createTableRow(["Market Segment", "Value"], true),
      createTableRow(["Black Consumer Spending Power (Annual)", "$1.6 Trillion"]),
      createTableRow(["Black-Owned Businesses in U.S.", "3.1 Million"]),
      createTableRow(["Average Annual Revenue per Black Business", "$142,000"]),
      createTableRow(["Projected Black Spending Power by 2030", "$2.1 Trillion"]),
    ],
  });
}

function createPlatformTable(): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      createTableRow(["Component", "Scale"], true),
      createTableRow(["Total Application Pages/Views", "130+"]),
      createTableRow(["Database Tables", "110+"]),
      createTableRow(["Edge Functions (Backend Logic)", "67"]),
      createTableRow(["Revenue Streams", "6+"]),
      createTableRow(["Mobile App Ready", "Yes (iOS & Android)"]),
    ],
  });
}

function createRevenueTable(): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      createTableRow(["Revenue Stream", "Model", "Potential"], true),
      createTableRow(["Business Subscriptions", "$29-199/month tiers", "High"]),
      createTableRow(["Corporate Sponsorships", "$5K-100K+ packages", "Very High"]),
      createTableRow(["Transaction Fees", "2-3% on bookings", "High"]),
      createTableRow(["Savings Circle Fees", "1-2% management fee", "Medium"]),
      createTableRow(["Premium Features", "AI, analytics, tools", "Medium"]),
      createTableRow(["Advertising", "Featured listings", "Medium"]),
    ],
  });
}

function createGrowthTable(): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      createTableRow(["Metric", "Year 1", "Year 2", "Year 3", "Year 5"], true),
      createTableRow(["Registered Users", "50K", "250K", "1M", "5M"]),
      createTableRow(["Listed Businesses", "5K", "25K", "100K", "500K"]),
      createTableRow(["Paying Subscribers", "500", "5K", "25K", "150K"]),
      createTableRow(["Annual Revenue (ARR)", "$500K", "$5M", "$25M", "$150M"]),
      createTableRow(["Estimated Valuation", "$5M", "$50M", "$250M", "$1.5B"]),
    ],
  });
}

function createTableRow(cells: string[], isHeader = false): TableRow {
  return new TableRow({
    children: cells.map((text, index) => 
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text,
                bold: isHeader,
                size: 22,
                color: isHeader ? "FFFFFF" : "1a1a2e",
              }),
            ],
            alignment: index === 0 ? AlignmentType.LEFT : AlignmentType.RIGHT,
          }),
        ],
        shading: isHeader ? { fill: "1a1a2e" } : undefined,
        borders: {
          top: { style: BorderStyle.SINGLE, size: 1, color: "DDDDDD" },
          bottom: { style: BorderStyle.SINGLE, size: 1, color: "DDDDDD" },
          left: { style: BorderStyle.SINGLE, size: 1, color: "DDDDDD" },
          right: { style: BorderStyle.SINGLE, size: 1, color: "DDDDDD" },
        },
      })
    ),
  });
}
