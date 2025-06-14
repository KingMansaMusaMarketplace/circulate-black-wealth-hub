
import React, { useEffect } from 'react';
import { preloadGoogleFonts, optimizeFontDisplay, inlineCriticalCSS } from '@/utils/fontOptimizer';
import { PerformanceOptimizer } from '@/utils/performanceOptimizer';

const PerformanceOptimizerComponent: React.FC = () => {
  useEffect(() => {
    const optimizer = PerformanceOptimizer.getInstance();
    
    // Initialize all optimizations
    const initOptimizations = async () => {
      // Font optimizations
      preloadGoogleFonts();
      optimizeFontDisplay();
      inlineCriticalCSS();
      
      // Resource hints
      optimizer.addResourceHints();
      
      // Scroll optimization
      const cleanupScroll = optimizer.optimizeScrolling();
      
      // Cleanup unused resources periodically
      const cleanupInterval = setInterval(() => {
        optimizer.cleanupUnusedResources();
      }, 30000); // Every 30 seconds

      // Performance logging in development
      if (process.env.NODE_ENV === 'development') {
        setTimeout(() => {
          console.log('Performance Summary:', optimizer.getPerformanceSummary());
        }, 3000);
      }

      return () => {
        cleanupScroll();
        clearInterval(cleanupInterval);
      };
    };

    initOptimizations();
  }, []);

  return null; // This is a utility component with no UI
};

export default PerformanceOptimizerComponent;
