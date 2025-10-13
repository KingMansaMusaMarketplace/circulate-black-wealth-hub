/**
 * Mobile Responsiveness Utilities
 * Helper functions to ensure mobile-first responsive design
 */

/**
 * Check if the current device is mobile
 */
export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
};

/**
 * Check if the current device is tablet
 */
export const isTablet = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= 768 && window.innerWidth < 1024;
};

/**
 * Check if the current device is desktop
 */
export const isDesktop = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= 1024;
};

/**
 * Get responsive columns for grid layouts
 */
export const getResponsiveColumns = (): number => {
  if (isMobile()) return 1;
  if (isTablet()) return 2;
  return 4;
};

/**
 * Get responsive font size class
 */
export const getResponsiveFontSize = (size: 'sm' | 'base' | 'lg' | 'xl'): string => {
  const sizeMap = {
    sm: 'text-xs sm:text-sm',
    base: 'text-sm sm:text-base',
    lg: 'text-base sm:text-lg',
    xl: 'text-lg sm:text-xl lg:text-2xl',
  };
  return sizeMap[size];
};

/**
 * Get responsive padding class
 */
export const getResponsivePadding = (size: 'sm' | 'md' | 'lg'): string => {
  const paddingMap = {
    sm: 'p-2 sm:p-3',
    md: 'p-3 sm:p-4 md:p-6',
    lg: 'p-4 sm:p-6 md:p-8 lg:p-10',
  };
  return paddingMap[size];
};

/**
 * Get responsive gap class for flex/grid
 */
export const getResponsiveGap = (size: 'sm' | 'md' | 'lg'): string => {
  const gapMap = {
    sm: 'gap-2 sm:gap-3',
    md: 'gap-3 sm:gap-4 md:gap-6',
    lg: 'gap-4 sm:gap-6 md:gap-8',
  };
  return gapMap[size];
};

/**
 * Optimize image for mobile devices
 */
export const getOptimizedImageUrl = (url: string, width?: number): string => {
  if (!url) return '';
  
  // If it's a Supabase storage URL, add transformation parameters
  if (url.includes('supabase')) {
    const targetWidth = width || (isMobile() ? 400 : 800);
    return `${url}?width=${targetWidth}&quality=80`;
  }
  
  return url;
};

/**
 * Check if touch device
 */
export const isTouchDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

/**
 * Get mobile-optimized table display mode
 */
export const getMobileTableMode = (): 'table' | 'cards' => {
  return isMobile() ? 'cards' : 'table';
};

/**
 * Mobile-friendly scroll to element
 */
export const scrollToElement = (elementId: string, offset = 0): void => {
  const element = document.getElementById(elementId);
  if (!element) return;

  const yOffset = offset || (isMobile() ? -80 : -100);
  const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

  window.scrollTo({ top: y, behavior: 'smooth' });
};

/**
 * Debounce resize events for performance
 */
export const useResponsiveResize = (callback: () => void, delay = 300): (() => void) => {
  if (typeof window === 'undefined') return () => {};

  let timeoutId: NodeJS.Timeout;
  
  const handleResize = () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(callback, delay);
  };

  window.addEventListener('resize', handleResize);
  
  // Cleanup
  return () => {
    window.removeEventListener('resize', handleResize);
    clearTimeout(timeoutId);
  };
};

/**
 * Get mobile-optimized modal size
 */
export const getModalSize = (size: 'sm' | 'md' | 'lg' | 'xl'): string => {
  if (isMobile()) {
    return 'w-full h-full max-w-full'; // Full screen on mobile
  }
  
  const sizeMap = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };
  
  return sizeMap[size];
};
