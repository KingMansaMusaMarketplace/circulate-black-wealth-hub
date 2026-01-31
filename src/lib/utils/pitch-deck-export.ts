import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { createRoot } from 'react-dom/client';
import React from 'react';

// Import all slide components
import PitchSlide1Cover from '@/components/pitch-deck/PitchSlide1Cover';
import PitchSlide2Problem from '@/components/pitch-deck/PitchSlide2Problem';
import PitchSlide3Solution from '@/components/pitch-deck/PitchSlide3Solution';
import PitchSlide4Technology from '@/components/pitch-deck/PitchSlide4Technology';
import PitchSlide5Platform from '@/components/pitch-deck/PitchSlide5Platform';
import PitchSlide6BusinessModel from '@/components/pitch-deck/PitchSlide6BusinessModel';
import PitchSlide7DataMoat from '@/components/pitch-deck/PitchSlide7DataMoat';
import PitchSlide8Competitive from '@/components/pitch-deck/PitchSlide8Competitive';
import PitchSlide9Traction from '@/components/pitch-deck/PitchSlide9Traction';
import PitchSlide10Market from '@/components/pitch-deck/PitchSlide10Market';
import PitchSlide11Vision from '@/components/pitch-deck/PitchSlide11Vision';
import PitchSlide12Team from '@/components/pitch-deck/PitchSlide12Team';
import PitchSlide13Ask from '@/components/pitch-deck/PitchSlide13Ask';
import PitchSlide14Why776 from '@/components/pitch-deck/PitchSlide14Why776';
import PitchSlide15SequoiaAlignment from '@/components/pitch-deck/PitchSlide15SequoiaAlignment';

const SLIDE_COMPONENTS = [
  PitchSlide1Cover,
  PitchSlide2Problem,
  PitchSlide3Solution,
  PitchSlide4Technology,
  PitchSlide5Platform,
  PitchSlide6BusinessModel,
  PitchSlide7DataMoat,
  PitchSlide8Competitive,
  PitchSlide9Traction,
  PitchSlide10Market,
  PitchSlide11Vision,
  PitchSlide12Team,
  PitchSlide13Ask,
  PitchSlide14Why776,
  PitchSlide15SequoiaAlignment,
];

// Slide dimensions (16:9 aspect ratio for presentation)
const SLIDE_WIDTH = 1920;
const SLIDE_HEIGHT = 1080;

interface ExportProgress {
  current: number;
  total: number;
}

export async function exportPitchDeckToPDF(
  onProgress?: (progress: ExportProgress) => void
): Promise<void> {
  // Create PDF in landscape orientation
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'px',
    format: [SLIDE_WIDTH, SLIDE_HEIGHT],
  });

  // Create hidden container for rendering slides
  const container = document.createElement('div');
  container.style.cssText = `
    position: fixed;
    left: -9999px;
    top: 0;
    width: ${SLIDE_WIDTH}px;
    height: ${SLIDE_HEIGHT}px;
    overflow: hidden;
    background: linear-gradient(to bottom right, hsl(210, 100%, 15%), hsl(210, 100%, 12%), hsl(210, 100%, 8%));
  `;
  document.body.appendChild(container);

  try {
    for (let i = 0; i < SLIDE_COMPONENTS.length; i++) {
      const SlideComponent = SLIDE_COMPONENTS[i];
      
      // Report progress
      onProgress?.({ current: i + 1, total: SLIDE_COMPONENTS.length });

      // Create slide wrapper with proper styling
      const slideWrapper = document.createElement('div');
      slideWrapper.style.cssText = `
        width: ${SLIDE_WIDTH}px;
        height: ${SLIDE_HEIGHT}px;
        position: relative;
        background: linear-gradient(to bottom right, hsl(210, 100%, 15%), hsl(210, 100%, 12%), hsl(210, 100%, 8%));
      `;
      container.innerHTML = '';
      container.appendChild(slideWrapper);

      // Render the React component
      const root = createRoot(slideWrapper);
      root.render(React.createElement(SlideComponent));

      // Wait for render and animations to settle
      await new Promise(resolve => setTimeout(resolve, 500));

      // Capture the slide
      const canvas = await html2canvas(slideWrapper, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        width: SLIDE_WIDTH,
        height: SLIDE_HEIGHT,
        logging: false,
      });

      // Add new page for slides after the first
      if (i > 0) {
        pdf.addPage([SLIDE_WIDTH, SLIDE_HEIGHT], 'landscape');
      }

      // Add the captured image to PDF
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      pdf.addImage(imgData, 'JPEG', 0, 0, SLIDE_WIDTH, SLIDE_HEIGHT);

      // Cleanup
      root.unmount();
    }

    // Generate filename with date
    const date = new Date().toISOString().split('T')[0];
    const filename = `Mansa_Musa_Pitch_Deck_${date}.pdf`;

    // Save the PDF
    pdf.save(filename);
  } finally {
    // Clean up container
    document.body.removeChild(container);
  }
}
