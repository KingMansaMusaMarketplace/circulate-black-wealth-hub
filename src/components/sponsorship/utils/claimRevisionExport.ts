import { Document, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, AlignmentType, BorderStyle, WidthType } from 'docx';
import * as FileSaver from 'file-saver';
import { toast } from 'sonner';

interface ClaimRevision {
  claimNumber: string;
  title: string;
  currentLanguage: string;
  revisedLanguage: string;
  preservedDependentClaims: string[];
}

const claimRevisions: ClaimRevision[] = [
  {
    claimNumber: '6',
    title: 'Voice AI Bridge System',
    currentLanguage: 'A Voice AI bridge system utilizing OpenAI Realtime API with WebSocket connections for real-time voice-based customer service within a community-focused marketplace platform...',
    revisedLanguage: 'A Voice AI bridge system comprising an LLM-based real-time voice synthesis system utilizing persistent bidirectional connections for real-time voice-based customer service within a community-focused marketplace platform...',
    preservedDependentClaims: [
      '6.1: The system of claim 6, wherein the LLM-based voice synthesis system utilizes OpenAI Realtime API.',
      '6.2: The system of claim 6, wherein the Voice Activity Detection comprises a silence threshold of approximately 300 milliseconds and prefix padding of approximately 0.5 seconds.',
      '6.3: The system of claim 6, wherein the persistent bidirectional connection utilizes WebSocket protocol with automatic reconnection upon connection failure.'
    ]
  },
  {
    claimNumber: '10',
    title: 'AI Recommendation Engine',
    currentLanguage: 'An AI recommendation engine utilizing Google Gemini 2.5 Flash for personalized business discovery within a community-focused marketplace platform...',
    revisedLanguage: 'An AI recommendation engine comprising an LLM-based system that processes assembled context for personalized business discovery within a community-focused marketplace platform...',
    preservedDependentClaims: [
      '10.1: The engine of claim 10, wherein the LLM-based system comprises Google Gemini 2.5 Flash or equivalent large language model.',
      '10.2: The engine of claim 10, wherein the context assembly module processes at least 50 data points per user session.',
      '10.3: The engine of claim 10, wherein the temporal decay function applies exponential decay with a configurable half-life parameter.'
    ]
  },
  {
    claimNumber: '11',
    title: 'B2B Matching Intelligence',
    currentLanguage: 'A B2B matching intelligence system powered by Google Gemini AI model for connecting businesses within a community ecosystem...',
    revisedLanguage: 'A B2B matching intelligence system comprising an LLM-based matching system that analyzes business compatibility within a community ecosystem...',
    preservedDependentClaims: [
      '11.1: The system of claim 11, wherein the LLM-based matching system utilizes Google Gemini AI model or equivalent.',
      '11.2: The system of claim 11, wherein the confidence threshold for automated match suggestions is at least 70%.',
      '11.3: The system of claim 11, wherein the multi-factor analysis includes geographic proximity, category alignment, and historical transaction success rates.'
    ]
  },
  {
    claimNumber: '12.2',
    title: 'Speech Recognition Subsystem',
    currentLanguage: 'A speech recognition subsystem utilizing Whisper-based speech-to-text conversion for processing voice commands...',
    revisedLanguage: 'A speech recognition subsystem comprising a transformer-based automatic speech recognition (ASR) system for processing voice commands...',
    preservedDependentClaims: [
      '12.2.1: The subsystem of claim 12.2, wherein the transformer-based ASR system comprises OpenAI Whisper or equivalent model.',
      '12.2.2: The subsystem of claim 12.2, wherein the audio capture supports PCM format at 16kHz sample rate.',
      '12.2.3: The subsystem of claim 12.2, wherein the intent extraction engine utilizes natural language understanding (NLU) with at least 95% accuracy.'
    ]
  },
  {
    claimNumber: '26',
    title: 'Partner Referral Attribution System',
    currentLanguage: 'An automated partner referral attribution system for tracking and crediting partner referral activities...',
    revisedLanguage: 'An automated partner referral attribution system comprising an LLM-based attribution tracking engine that monitors and credits partner referral activities...',
    preservedDependentClaims: [
      '26.1: The system of claim 26, wherein the attribution tracking utilizes cryptographic referral codes with tamper detection.'
    ]
  },
  {
    claimNumber: '27',
    title: 'Partner Marketing Toolkit',
    currentLanguage: 'An automated partner marketing toolkit generating personalized promotional materials with dynamic attribution...',
    revisedLanguage: 'An automated partner marketing toolkit comprising an LLM-based content generation system that produces personalized promotional materials...',
    preservedDependentClaims: [
      '27.1: The toolkit of claim 27, wherein the content generation system produces materials in at least three formats: social media, email, and print-ready PDF.',
      '27.2: The toolkit of claim 27, wherein the ROI messaging includes real-time partner earnings calculations.'
    ]
  }
];

const createTableBorders = () => ({
  top: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
  bottom: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
  left: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
  right: { style: BorderStyle.SINGLE, size: 1, color: '000000' }
});

export const generateClaimRevisionDocument = async (): Promise<void> => {
  try {
    toast.info('Generating Claim Revision Strategy Document...');

    const doc = new Document({
      sections: [{
        properties: {
          page: {
            margin: {
              top: 1440,
              right: 1440,
              bottom: 1440,
              left: 1440
            }
          }
        },
        children: [
          // Title
          new Paragraph({
            children: [
              new TextRun({
                text: 'PATENT CLAIM REVISION STRATEGY',
                bold: true,
                size: 32,
                font: 'Times New Roman'
              })
            ],
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 }
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: 'Non-Provisional Conversion Guide',
                size: 24,
                font: 'Times New Roman'
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 }
          }),

          // Meta information
          new Paragraph({
            children: [
              new TextRun({ text: 'Prepared for: ', bold: true, size: 22, font: 'Times New Roman' }),
              new TextRun({ text: 'Allgaier Patent Solutions (Fraline J. Allgaier, Esq.)', size: 22, font: 'Times New Roman' })
            ],
            spacing: { after: 100 }
          }),

          new Paragraph({
            children: [
              new TextRun({ text: 'Priority Date: ', bold: true, size: 22, font: 'Times New Roman' }),
              new TextRun({ text: 'January 30, 2026', size: 22, font: 'Times New Roman' })
            ],
            spacing: { after: 100 }
          }),

          new Paragraph({
            children: [
              new TextRun({ text: 'Conversion Deadline: ', bold: true, size: 22, font: 'Times New Roman' }),
              new TextRun({ text: 'January 30, 2027 (12 months)', size: 22, font: 'Times New Roman' })
            ],
            spacing: { after: 400 }
          }),

          // Executive Summary
          new Paragraph({
            children: [
              new TextRun({ text: 'EXECUTIVE SUMMARY', bold: true, size: 26, font: 'Times New Roman' })
            ],
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 200 }
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: 'This document outlines the recommended revisions to independent claims for the non-provisional patent conversion. The strategy abstracts AI model references in independent claims while preserving specific implementations in dependent claims for enablement.',
                size: 22,
                font: 'Times New Roman'
              })
            ],
            spacing: { after: 200 }
          }),

          new Paragraph({
            children: [
              new TextRun({ text: 'Key Recommendation: ', bold: true, size: 22, font: 'Times New Roman' }),
              new TextRun({
                text: 'File the provisional patent as-is to preserve the priority date. Implement these revisions during the non-provisional conversion.',
                size: 22,
                font: 'Times New Roman'
              })
            ],
            spacing: { after: 400 }
          }),

          // Claims Summary Table
          new Paragraph({
            children: [
              new TextRun({ text: 'CLAIMS REQUIRING REVISION', bold: true, size: 26, font: 'Times New Roman' })
            ],
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 200 }
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Claim', bold: true, size: 20, font: 'Times New Roman' })] })],
                    borders: createTableBorders(),
                    shading: { fill: 'E0E0E0' }
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Current Reference', bold: true, size: 20, font: 'Times New Roman' })] })],
                    borders: createTableBorders(),
                    shading: { fill: 'E0E0E0' }
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Recommended Abstraction', bold: true, size: 20, font: 'Times New Roman' })] })],
                    borders: createTableBorders(),
                    shading: { fill: 'E0E0E0' }
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '6', size: 20, font: 'Times New Roman' })] })], borders: createTableBorders() }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'OpenAI Realtime API', size: 20, font: 'Times New Roman' })] })], borders: createTableBorders() }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'LLM-based real-time voice synthesis system', size: 20, font: 'Times New Roman' })] })], borders: createTableBorders() })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '10', size: 20, font: 'Times New Roman' })] })], borders: createTableBorders() }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Google Gemini 2.5 Flash', size: 20, font: 'Times New Roman' })] })], borders: createTableBorders() }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'LLM-based recommendation engine', size: 20, font: 'Times New Roman' })] })], borders: createTableBorders() })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '11', size: 20, font: 'Times New Roman' })] })], borders: createTableBorders() }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Google Gemini AI model', size: 20, font: 'Times New Roman' })] })], borders: createTableBorders() }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'LLM-based matching system', size: 20, font: 'Times New Roman' })] })], borders: createTableBorders() })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '12.2', size: 20, font: 'Times New Roman' })] })], borders: createTableBorders() }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Whisper speech-to-text', size: 20, font: 'Times New Roman' })] })], borders: createTableBorders() }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Transformer-based ASR system', size: 20, font: 'Times New Roman' })] })], borders: createTableBorders() })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '26-27', size: 20, font: 'Times New Roman' })] })], borders: createTableBorders() }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'AI content generation', size: 20, font: 'Times New Roman' })] })], borders: createTableBorders() }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'LLM-based content generation system', size: 20, font: 'Times New Roman' })] })], borders: createTableBorders() })
                ]
              })
            ]
          }),

          // Detailed Revisions
          ...claimRevisions.flatMap(revision => [
            new Paragraph({
              children: [
                new TextRun({
                  text: `CLAIM ${revision.claimNumber}: ${revision.title.toUpperCase()}`,
                  bold: true,
                  size: 24,
                  font: 'Times New Roman'
                })
              ],
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 400, after: 200 }
            }),

            new Paragraph({
              children: [
                new TextRun({ text: 'Current Language (Provisional):', bold: true, size: 22, font: 'Times New Roman' })
              ],
              spacing: { after: 100 }
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: revision.currentLanguage,
                  size: 20,
                  font: 'Times New Roman',
                  italics: true
                })
              ],
              spacing: { after: 200 },
              indent: { left: 360 }
            }),

            new Paragraph({
              children: [
                new TextRun({ text: 'Revised Language (Non-Provisional):', bold: true, size: 22, font: 'Times New Roman' })
              ],
              spacing: { after: 100 }
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: revision.revisedLanguage,
                  size: 20,
                  font: 'Times New Roman'
                })
              ],
              spacing: { after: 200 },
              indent: { left: 360 }
            }),

            new Paragraph({
              children: [
                new TextRun({ text: 'Preserved Dependent Claims:', bold: true, size: 22, font: 'Times New Roman' })
              ],
              spacing: { after: 100 }
            }),

            ...revision.preservedDependentClaims.map(claim =>
              new Paragraph({
                children: [
                  new TextRun({
                    text: claim,
                    size: 20,
                    font: 'Times New Roman'
                  })
                ],
                spacing: { after: 80 },
                indent: { left: 360 },
                bullet: { level: 0 }
              })
            )
          ]),

          // Timeline
          new Paragraph({
            children: [
              new TextRun({ text: 'IMPLEMENTATION TIMELINE', bold: true, size: 26, font: 'Times New Roman' })
            ],
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Milestone', bold: true, size: 20, font: 'Times New Roman' })] })],
                    borders: createTableBorders(),
                    shading: { fill: 'E0E0E0' }
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Date', bold: true, size: 20, font: 'Times New Roman' })] })],
                    borders: createTableBorders(),
                    shading: { fill: 'E0E0E0' }
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Action', bold: true, size: 20, font: 'Times New Roman' })] })],
                    borders: createTableBorders(),
                    shading: { fill: 'E0E0E0' }
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Provisional Filing', size: 20, font: 'Times New Roman' })] })], borders: createTableBorders() }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'January 30, 2026', size: 20, font: 'Times New Roman' })] })], borders: createTableBorders() }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'File as-is to establish priority', size: 20, font: 'Times New Roman' })] })], borders: createTableBorders() })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '6-Month Review', size: 20, font: 'Times New Roman' })] })], borders: createTableBorders() }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'July 30, 2026', size: 20, font: 'Times New Roman' })] })], borders: createTableBorders() }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Review technology landscape', size: 20, font: 'Times New Roman' })] })], borders: createTableBorders() })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Draft Revisions', size: 20, font: 'Times New Roman' })] })], borders: createTableBorders() }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'October 30, 2026', size: 20, font: 'Times New Roman' })] })], borders: createTableBorders() }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Prepare non-provisional claims', size: 20, font: 'Times New Roman' })] })], borders: createTableBorders() })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Attorney Review', size: 20, font: 'Times New Roman' })] })], borders: createTableBorders() }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'December 15, 2026', size: 20, font: 'Times New Roman' })] })], borders: createTableBorders() }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Final review by counsel', size: 20, font: 'Times New Roman' })] })], borders: createTableBorders() })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Non-Provisional Filing', size: 20, font: 'Times New Roman' })] })], borders: createTableBorders() }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'January 15, 2027', size: 20, font: 'Times New Roman' })] })], borders: createTableBorders() }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'File 15 days before deadline', size: 20, font: 'Times New Roman' })] })], borders: createTableBorders() })
                ]
              })
            ]
          }),

          // Footer
          new Paragraph({
            children: [
              new TextRun({
                text: 'CONFIDENTIAL - Attorney-Client Work Product',
                size: 18,
                font: 'Times New Roman',
                italics: true
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 600, after: 100 }
          })
        ]
      }]
    });

    const { Packer } = await import('docx');
    const packerBlob = await Packer.toBlob(doc);
    
    // Re-wrap with explicit MIME type for cross-browser compatibility (especially Safari/macOS)
    const blob = new Blob([packerBlob], { 
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
    });
    
    // Use FileSaver for reliable cross-browser downloads (Safari/macOS compatible)
    FileSaver.saveAs(blob, 'Patent-Claim-Revision-Strategy.docx');

    toast.success('Claim Revision Strategy document downloaded!');
  } catch (error) {
    console.error('Error generating claim revision document:', error);
    toast.error('Failed to generate document. Please try again.');
    throw error;
  }
};
