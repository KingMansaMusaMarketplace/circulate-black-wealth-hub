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

/**
 * Copy all CSS custom properties from :root to the target element
 * so that Tailwind theme tokens resolve correctly in the offscreen container.
 */
function copyRootCSSProperties(target: HTMLElement) {
  const rootStyles = getComputedStyle(document.documentElement);
  const propsToCheck = [
    '--background', '--foreground', '--card', '--card-foreground',
    '--popover', '--popover-foreground', '--primary', '--primary-foreground',
    '--secondary', '--secondary-foreground', '--muted', '--muted-foreground',
    '--accent', '--accent-foreground', '--destructive', '--destructive-foreground',
    '--border', '--input', '--ring', '--radius',
    '--mansablue', '--mansagold', '--mansablue-dark', '--mansablue-light',
    '--mansagold-light', '--mansagold-dark',
    '--sidebar-background', '--sidebar-foreground', '--sidebar-primary',
    '--sidebar-primary-foreground', '--sidebar-accent', '--sidebar-accent-foreground',
    '--sidebar-border', '--sidebar-ring',
  ];

  // Also grab ALL custom properties from all stylesheets
  try {
    for (const sheet of Array.from(document.styleSheets)) {
      try {
        for (const rule of Array.from(sheet.cssRules)) {
          if (rule instanceof CSSStyleRule && (rule.selectorText === ':root' || rule.selectorText === '.dark')) {
            for (let i = 0; i < rule.style.length; i++) {
              const prop = rule.style[i];
              if (prop.startsWith('--')) {
                target.style.setProperty(prop, rule.style.getPropertyValue(prop));
              }
            }
          }
        }
      } catch {
        // Cross-origin stylesheet, skip
      }
    }
  } catch {
    // Fallback: copy known properties
    propsToCheck.forEach(prop => {
      const value = rootStyles.getPropertyValue(prop);
      if (value) {
        target.style.setProperty(prop, value);
      }
    });
  }
}

/**
 * Inject a <style> block that forces all framer-motion elements to their
 * final state and replaces backdrop-blur with solid backgrounds for html2canvas.
 */
function createExportOverrideStyles(): HTMLStyleElement {
  const style = document.createElement('style');
  style.id = 'pitch-deck-export-overrides';
  style.textContent = `
    /* Force all motion elements to be visible and at final position */
    [style*="opacity"], [style*="transform"] {
      opacity: 1 !important;
      transform: none !important;
    }
    
    /* Replace backdrop-blur with solid dark backgrounds (html2canvas can't render blur) */
    .backdrop-blur-sm, .backdrop-blur, .backdrop-blur-md, .backdrop-blur-lg {
      backdrop-filter: none !important;
      -webkit-backdrop-filter: none !important;
    }
    
    /* Ensure bg-white/5 with backdrop-blur gets a visible solid background */
    .bg-white\\/5.backdrop-blur-sm,
    .bg-white\\/5.backdrop-blur {
      background-color: rgba(255, 255, 255, 0.08) !important;
    }
    
    /* Disable all CSS animations and transitions for capture */
    *, *::before, *::after {
      animation-duration: 0s !important;
      animation-delay: 0s !important;
      transition-duration: 0s !important;
      transition-delay: 0s !important;
    }
    
    /* Ensure animate-pulse stops */
    .animate-pulse {
      animation: none !important;
    }
  `;
  return style;
}

export async function exportPitchDeckToPDF(
  onProgress?: (progress: ExportProgress) => void
): Promise<void> {
  // Wait for fonts
  if ('fonts' in document) {
    await (document as Document & { fonts?: { ready?: Promise<unknown> } }).fonts?.ready;
  }

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
    z-index: -9999;
  `;

  // Copy all classes from <html> element (e.g. 'dark' class for dark mode)
  container.className = document.documentElement.className;

  // Copy CSS custom properties so Tailwind tokens resolve
  copyRootCSSProperties(container);

  // Add export override styles
  const overrideStyles = createExportOverrideStyles();
  document.head.appendChild(overrideStyles);
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
        overflow: hidden;
        background: linear-gradient(to bottom right, hsl(210, 100%, 15%), hsl(210, 100%, 12%), hsl(210, 100%, 8%));
      `;
      container.innerHTML = '';
      container.appendChild(slideWrapper);

      // Render the React component
      const root = createRoot(slideWrapper);
      root.render(React.createElement(SlideComponent));

      // Wait for React to render
      await new Promise(resolve => setTimeout(resolve, 500));

      // Wait for all images to load
      const images = Array.from(slideWrapper.querySelectorAll('img'));
      await Promise.all(
        images.map(
          (img) =>
            new Promise<void>((resolve) => {
              if (img.complete && img.naturalHeight > 0) {
                resolve();
                return;
              }
              img.addEventListener('load', () => resolve(), { once: true });
              img.addEventListener('error', () => resolve(), { once: true });
            })
        )
      );

      // Force all framer-motion rendered elements to final state
      const allElements = slideWrapper.querySelectorAll('*');
      allElements.forEach((el) => {
        const htmlEl = el as HTMLElement;
        if (htmlEl.style) {
          // Force opacity to 1 for any element that framer-motion may have set
          if (htmlEl.style.opacity && parseFloat(htmlEl.style.opacity) < 1) {
            htmlEl.style.opacity = '1';
          }
          // Remove transforms that framer-motion applies during animation
          if (htmlEl.style.transform && htmlEl.style.transform !== 'none') {
            htmlEl.style.transform = 'none';
          }
        }
      });

      // Wait for layout to settle after forcing styles
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => resolve());
        });
      });

      // Additional wait for complex slides
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Capture the slide
      const canvas = await html2canvas(slideWrapper, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        width: SLIDE_WIDTH,
        height: SLIDE_HEIGHT,
        logging: false,
        // Ensure we capture from the top-left of the element
        x: 0,
        y: 0,
        scrollX: 0,
        scrollY: 0,
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
    const filename = `1325AI_Pitch_Deck_${date}.pdf`;

    // Save the PDF
    pdf.save(filename);
  } finally {
    // Clean up
    document.body.removeChild(container);
    document.head.removeChild(overrideStyles);
  }
}
