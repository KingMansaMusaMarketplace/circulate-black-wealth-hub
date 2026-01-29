// Native browser download implementation (no external dependencies)
import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  Table, 
  TableRow, 
  TableCell, 
  WidthType, 
  AlignmentType, 
  BorderStyle, 
  HeadingLevel,
  PageBreak,
  Header,
  Footer,
  PageNumber,
  NumberFormat
} from 'docx';

import { getUSPTOPatentContent, PatentClaim } from '../templates/usptoPatentTemplate';

interface USPTOWordGeneratorOptions {
  filename: string;
}

export const generateUSPTOPatentWord = async (options: USPTOWordGeneratorOptions): Promise<void> => {
  const content = getUSPTOPatentContent();
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const doc = new Document({
    styles: {
      paragraphStyles: [
        {
          id: "LegalNormal",
          name: "Legal Normal",
          basedOn: "Normal",
          next: "Normal",
          run: {
            font: "Times New Roman",
            size: 24, // 12pt
          },
          paragraph: {
            spacing: { line: 360 }, // 1.5 line spacing
          }
        }
      ]
    },
    sections: [{
      properties: {
        page: {
          margin: {
            top: 1440, // 1 inch
            right: 1440,
            bottom: 1440,
            left: 1440
          }
        }
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "USPTO PROVISIONAL PATENT APPLICATION",
                  font: "Times New Roman",
                  size: 18,
                  color: "666666"
                })
              ],
              alignment: AlignmentType.CENTER
            })
          ]
        })
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "CONFIDENTIAL - Attorney-Client Work Product | Page ",
                  font: "Times New Roman",
                  size: 18,
                  color: "666666"
                }),
                new TextRun({
                  children: [PageNumber.CURRENT]
                }),
                new TextRun({
                  text: " of ",
                  font: "Times New Roman",
                  size: 18,
                  color: "666666"
                }),
                new TextRun({
                  children: [PageNumber.TOTAL_PAGES]
                })
              ],
              alignment: AlignmentType.CENTER
            })
          ]
        })
      },
      children: [
        // Cover Page
        ...createCoverPage(content),
        
        // Table of Contents
        ...createTableOfContents(),
        
        // Abstract
        ...createAbstractSection(content.abstract),
        
        // Field of Invention
        ...createFieldSection(content.fieldOfInvention),
        
        // Background
        ...createBackgroundSection(content.background),
        
        // Summary
        ...createSummarySection(content.summary),
        
        // Formal Claims
        ...createClaimsSection(content.claims),
        
        // Key Protected Constants
        ...createConstantsSection(content.keyConstants),
        
        // Technology Equivalents Matrix
        ...createTechnologyMatrixSection(content.technologyMatrix),
        
        // PCT Preservation Language
        ...createPCTSection(content.pctLanguage, content.pctCountries),
        
        // Legal Safeguards
        ...createLegalSafeguardsSection(content.legalSafeguards),
        
        // Inventor Declaration
        ...createDeclarationSection(content.applicantName),
        
        // Filing Checklist
        ...createFilingChecklistSection(content.filingChecklist, content.filingFees),
        
        // Footer
        new Paragraph({
          children: [
            new TextRun({
              text: `© 2024-2026 ${content.applicantName}. All rights reserved.`,
              font: "Times New Roman",
              size: 20,
              color: "666666"
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 600 }
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "Platform: 1325.AI / Mansa Musa Marketplace",
              font: "Times New Roman",
              size: 20,
              color: "666666"
            })
          ],
          alignment: AlignmentType.CENTER
        })
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
    
    // Native browser download with proper cleanup
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    
    // Clean up after a delay to ensure download starts
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 1500);
  } catch (error) {
    console.error('Error generating USPTO Word document:', error);
    throw new Error('Failed to generate Word document. Please try again.');
  }
};

function createCoverPage(content: ReturnType<typeof getUSPTOPatentContent>): Paragraph[] {
  return [
    new Paragraph({
      children: [
        new TextRun({
          text: "COMPLETE USPTO PROVISIONAL PATENT FILING PACKAGE",
          bold: true,
          font: "Times New Roman",
          size: 36,
          color: "1a1a2e"
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 }
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "UNITED STATES PATENT AND TRADEMARK OFFICE",
          bold: true,
          font: "Times New Roman",
          size: 28,
          color: "333333"
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 }
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: content.title,
          bold: true,
          font: "Times New Roman",
          size: 24,
          color: "1a1a2e"
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 }
    }),
    createInfoLine("Filing Date:", content.filingDate),
    createInfoLine("Application Number:", "_______________"),
    createInfoLine("Applicant/Inventor:", content.applicantName),
    createInfoLine("Commercial Name(s):", content.commercialNames),
    createInfoLine("Correspondence Address:", content.correspondenceAddress),
    createInfoLine("Contact:", content.contact),
    new Paragraph({
      children: [],
      spacing: { after: 400 }
    }),
    // Attorney Section
    new Paragraph({
      children: [
        new TextRun({
          text: "PREPARED BY / ATTORNEY OF RECORD",
          bold: true,
          font: "Times New Roman",
          size: 24,
          color: "333333"
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 400, after: 200 },
      border: {
        top: { style: BorderStyle.SINGLE, size: 1, color: "333333" },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: "333333" },
        left: { style: BorderStyle.SINGLE, size: 1, color: "333333" },
        right: { style: BorderStyle.SINGLE, size: 1, color: "333333" }
      },
      shading: { fill: "f5f5f5" }
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: content.attorney.name,
          bold: true,
          font: "Times New Roman",
          size: 24
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 50 }
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: content.attorney.firm,
          font: "Times New Roman",
          size: 22
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 50 }
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: content.attorney.address,
          font: "Times New Roman",
          size: 22
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 50 }
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Phone: ${content.attorney.phone}`,
          font: "Times New Roman",
          size: 22
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 50 }
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: content.attorney.website,
          font: "Times New Roman",
          size: 22,
          color: "0066cc"
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 }
    }),
    new Paragraph({
      children: [new PageBreak()]
    })
  ];
}

function createInfoLine(label: string, value: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: `${label} `,
        bold: true,
        font: "Times New Roman",
        size: 24
      }),
      new TextRun({
        text: value,
        font: "Times New Roman",
        size: 24
      })
    ],
    spacing: { after: 100 }
  });
}

function createTableOfContents(): Paragraph[] {
  const tocItems = [
    "1. Abstract",
    "2. Cross-Reference to Related Applications",
    "3. Field of the Invention",
    "4. Background of the Invention",
    "5. Summary of the Invention",
    "6. Formal Claims (1-14)",
    "7. Key Protected Constants",
    "8. Technology Equivalents Matrix",
    "9. PCT Preservation Language",
    "10. Legal Safeguard Clauses",
    "11. Inventor Declaration",
    "12. Filing Checklist"
  ];

  return [
    new Paragraph({
      text: "TABLE OF CONTENTS",
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 300 }
    }),
    ...tocItems.map(item => new Paragraph({
      children: [
        new TextRun({
          text: item,
          font: "Times New Roman",
          size: 24
        })
      ],
      spacing: { after: 100 }
    })),
    new Paragraph({
      children: [new PageBreak()]
    })
  ];
}

function createAbstractSection(abstract: string): Paragraph[] {
  return [
    new Paragraph({
      text: "ABSTRACT",
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 300 }
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: abstract,
          font: "Times New Roman",
          size: 24
        })
      ],
      spacing: { after: 400 }
    })
  ];
}

function createFieldSection(fieldOfInvention: string): Paragraph[] {
  return [
    new Paragraph({
      text: "FIELD OF THE INVENTION",
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 300 }
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: fieldOfInvention,
          font: "Times New Roman",
          size: 24
        })
      ],
      spacing: { after: 400 }
    })
  ];
}

function createBackgroundSection(background: { problemStatement: string; deficiencies: string[] }): Paragraph[] {
  return [
    new Paragraph({
      text: "BACKGROUND OF THE INVENTION",
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 300 }
    }),
    new Paragraph({
      text: "Problem Statement",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 200 }
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: background.problemStatement,
          font: "Times New Roman",
          size: 24
        })
      ],
      spacing: { after: 300 }
    }),
    new Paragraph({
      text: "Deficiencies in Existing Solutions",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 200 }
    }),
    ...background.deficiencies.map((deficiency, index) => new Paragraph({
      children: [
        new TextRun({
          text: `${index + 1}. `,
          bold: true,
          font: "Times New Roman",
          size: 24
        }),
        new TextRun({
          text: deficiency,
          font: "Times New Roman",
          size: 24
        })
      ],
      spacing: { after: 150 }
    }))
  ];
}

function createSummarySection(summary: { architectureTiers: { name: string; description: string; features: string[] }[] }): Paragraph[] {
  const paragraphs: Paragraph[] = [
    new Paragraph({
      text: "SUMMARY OF THE INVENTION",
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 300 }
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: 'The present invention provides a comprehensive marketplace operating system ("1325.AI / Mansa Musa Marketplace") that addresses these deficiencies through multiple novel and non-obvious technical innovations.',
          font: "Times New Roman",
          size: 24
        })
      ],
      spacing: { after: 300 }
    }),
    new Paragraph({
      text: "System Architecture",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 200 }
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "The invention comprises a three-tier architecture:",
          font: "Times New Roman",
          size: 24
        })
      ],
      spacing: { after: 200 }
    })
  ];

  summary.architectureTiers.forEach(tier => {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${tier.name}: `,
            bold: true,
            font: "Times New Roman",
            size: 24
          }),
          new TextRun({
            text: tier.description,
            font: "Times New Roman",
            size: 24
          })
        ],
        spacing: { after: 100 }
      })
    );
    
    tier.features.forEach(feature => {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `• ${feature}`,
              font: "Times New Roman",
              size: 24
            })
          ],
          indent: { left: 720 },
          spacing: { after: 50 }
        })
      );
    });
  });

  return paragraphs;
}

function createClaimsSection(claims: PatentClaim[]): Paragraph[] {
  const paragraphs: Paragraph[] = [
    new Paragraph({
      children: [new PageBreak()]
    }),
    new Paragraph({
      text: "FORMAL CLAIMS",
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 300 }
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "The following claims define the scope of protection sought for this invention. Each independent claim is followed by dependent claims that further narrow the scope.",
          font: "Times New Roman",
          size: 24,
          italics: true
        })
      ],
      spacing: { after: 400 }
    })
  ];

  claims.forEach(claim => {
    // Claim title
    paragraphs.push(
      new Paragraph({
        text: `CLAIM ${claim.number}: ${claim.title}`,
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 }
      })
    );

    // Independent claim
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Independent Claim ${claim.number}`,
            bold: true,
            font: "Times New Roman",
            size: 24,
            underline: {}
          })
        ],
        spacing: { after: 150 }
      })
    );

    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: claim.independentClaim,
            font: "Times New Roman",
            size: 24
          })
        ],
        spacing: { after: 200 }
      })
    );

    // Dependent claims
    claim.dependentClaims.forEach(depClaim => {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `Dependent Claim ${depClaim.id}`,
              bold: true,
              font: "Times New Roman",
              size: 22
            })
          ],
          spacing: { before: 150, after: 100 }
        })
      );
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: depClaim.text,
              font: "Times New Roman",
              size: 22
            })
          ],
          indent: { left: 360 },
          spacing: { after: 150 }
        })
      );
    });

    // Technical implementation if available
    if (claim.technicalImplementation) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "Technical Implementation:",
              bold: true,
              font: "Times New Roman",
              size: 22
            })
          ],
          spacing: { before: 150, after: 100 }
        })
      );
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: claim.technicalImplementation,
              font: "Courier New",
              size: 20
            })
          ],
          shading: { fill: "F5F5F5" },
          spacing: { after: 200 }
        })
      );
    }
  });

  return paragraphs;
}

function createConstantsSection(constants: { constant: string; value: string; location: string; claim: string }[]): (Paragraph | Table)[] {
  return [
    new Paragraph({
      children: [new PageBreak()]
    }),
    new Paragraph({
      text: "KEY PROTECTED CONSTANTS",
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 300 }
    }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        createTableRowHelper(["Constant", "Value", "Location", "Claim"], true),
        ...constants.map(c => createTableRowHelper([c.constant, c.value, c.location, c.claim]))
      ]
    })
  ];
}

function createTechnologyMatrixSection(matrix: { technology: string; equivalents: string }[]): (Paragraph | Table)[] {
  return [
    new Paragraph({
      text: "TECHNOLOGY EQUIVALENTS MATRIX",
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 300 }
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "The following substitutions and technology equivalents are explicitly claimed within the scope of protection:",
          font: "Times New Roman",
          size: 24,
          italics: true
        })
      ],
      spacing: { after: 200 }
    }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        createTableRowHelper(["Protected Concept", "Covered Equivalents"], true),
        ...matrix.map(m => createTableRowHelper([m.technology, m.equivalents]))
      ]
    })
  ];
}

function createPCTSection(pctLanguage: string, countries: string[]): Paragraph[] {
  return [
    new Paragraph({
      children: [new PageBreak()]
    }),
    new Paragraph({
      text: "PCT PRESERVATION LANGUAGE",
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 300 }
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: pctLanguage,
          font: "Times New Roman",
          size: 24
        })
      ],
      spacing: { after: 300 }
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "PCT Member States:",
          bold: true,
          font: "Times New Roman",
          size: 24
        })
      ],
      spacing: { after: 150 }
    }),
    ...countries.map(country => new Paragraph({
      children: [
        new TextRun({
          text: `• ${country}`,
          font: "Times New Roman",
          size: 24
        })
      ],
      indent: { left: 360 },
      spacing: { after: 50 }
    }))
  ];
}

function createLegalSafeguardsSection(safeguards: { broadInterpretation: string[]; doctrineOfEquivalents: string }): Paragraph[] {
  return [
    new Paragraph({
      text: "LEGAL SAFEGUARD CLAUSES",
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 300 }
    }),
    new Paragraph({
      text: "Broad Interpretation Clause",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 200 }
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "The descriptions, implementations, and examples provided herein are intended to be illustrative and not restrictive. The scope of protection extends to all reasonable implementations of the described concepts regardless of specific technology choices. The system may be implemented via:",
          font: "Times New Roman",
          size: 24
        })
      ],
      spacing: { after: 150 }
    }),
    ...safeguards.broadInterpretation.map(item => new Paragraph({
      children: [
        new TextRun({
          text: `• ${item}`,
          font: "Times New Roman",
          size: 24
        })
      ],
      indent: { left: 360 },
      spacing: { after: 50 }
    })),
    new Paragraph({
      text: "Doctrine of Equivalents Notice",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 200 }
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: safeguards.doctrineOfEquivalents,
          font: "Times New Roman",
          size: 24
        })
      ],
      spacing: { after: 200 }
    })
  ];
}

function createDeclarationSection(applicantName: string): Paragraph[] {
  return [
    new Paragraph({
      children: [new PageBreak()]
    }),
    new Paragraph({
      text: "INVENTOR DECLARATION",
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 300 }
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "I hereby declare that I am the original inventor of the subject matter claimed in this provisional patent application and that all statements made herein are true to the best of my knowledge.",
          font: "Times New Roman",
          size: 24
        })
      ],
      spacing: { after: 400 }
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "Signature: ",
          bold: true,
          font: "Times New Roman",
          size: 24
        }),
        new TextRun({
          text: "_________________________",
          font: "Times New Roman",
          size: 24
        })
      ],
      spacing: { after: 150 }
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "Printed Name: ",
          bold: true,
          font: "Times New Roman",
          size: 24
        }),
        new TextRun({
          text: applicantName,
          font: "Times New Roman",
          size: 24
        })
      ],
      spacing: { after: 150 }
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "Date: ",
          bold: true,
          font: "Times New Roman",
          size: 24
        }),
        new TextRun({
          text: "_________________________",
          font: "Times New Roman",
          size: 24
        })
      ],
      spacing: { after: 400 }
    })
  ];
}

function createFilingChecklistSection(checklist: { document: string; status: string }[], fees: { entityType: string; fee: string }[]): (Paragraph | Table)[] {
  const filingSteps = [
    "Export this document to PDF",
    "Complete Inventor Declaration (signature above)",
    "Complete Application Data Sheet (USPTO Form PTO/AIA/14)",
    "Go to https://www.uspto.gov/patents/apply",
    "Log in or create USPTO account",
    'Select "Patent" → "Provisional Application"',
    "Upload all documents",
    "Pay filing fee ($80 Micro Entity)",
    "Save confirmation with Application Number",
    "Calendar 12-month deadline: January 27, 2027 for non-provisional/PCT filing"
  ];
  
  return [
    new Paragraph({
      text: "FILING CHECKLIST",
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 300 }
    }),
    new Paragraph({
      text: "Required Documents",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 200 }
    }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        createTableRowHelper(["Document", "Status"], true),
        ...checklist.map(item => createTableRowHelper([item.document, item.status]))
      ]
    }),
    new Paragraph({
      text: "Filing Fee Schedule",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 200 }
    }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        createTableRowHelper(["Entity Type", "Fee"], true),
        ...fees.map(fee => createTableRowHelper([fee.entityType, fee.fee]))
      ]
    }),
    new Paragraph({
      text: "Filing Process",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 200 }
    }),
    ...filingSteps.map((step, index) => new Paragraph({
      children: [
        new TextRun({
          text: `${index + 1}. ${step}`,
          font: "Times New Roman",
          size: 24
        })
      ],
      spacing: { after: 100 }
    }))
  ];
}

function createTableRowHelper(cells: string[], isHeader = false): TableRow {
  return new TableRow({
    children: cells.map((text, index) => 
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text,
                bold: isHeader,
                font: "Times New Roman",
                size: 22,
                color: isHeader ? "FFFFFF" : "1a1a2e",
              }),
            ],
            alignment: index === 0 ? AlignmentType.LEFT : AlignmentType.LEFT,
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
