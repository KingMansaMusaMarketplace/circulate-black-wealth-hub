/**
 * Unit tests for mobile responsiveness utilities
 * Example test file - add more tests as needed
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  isMobile,
  isTablet,
  isDesktop,
  getResponsiveColumns,
  getResponsiveFontSize,
} from '../mobile-responsive';

describe('Mobile Responsiveness Utilities', () => {
  beforeEach(() => {
    // Reset window size before each test
    global.innerWidth = 1024;
  });

  describe('isMobile', () => {
    it('should return true for mobile widths', () => {
      global.innerWidth = 375;
      expect(isMobile()).toBe(true);
    });

    it('should return false for desktop widths', () => {
      global.innerWidth = 1024;
      expect(isMobile()).toBe(false);
    });

    it('should return false for tablet widths', () => {
      global.innerWidth = 800;
      expect(isMobile()).toBe(false);
    });
  });

  describe('isTablet', () => {
    it('should return true for tablet widths', () => {
      global.innerWidth = 800;
      expect(isTablet()).toBe(true);
    });

    it('should return false for mobile widths', () => {
      global.innerWidth = 375;
      expect(isTablet()).toBe(false);
    });

    it('should return false for desktop widths', () => {
      global.innerWidth = 1200;
      expect(isTablet()).toBe(false);
    });
  });

  describe('isDesktop', () => {
    it('should return true for desktop widths', () => {
      global.innerWidth = 1200;
      expect(isDesktop()).toBe(true);
    });

    it('should return false for mobile widths', () => {
      global.innerWidth = 375;
      expect(isDesktop()).toBe(false);
    });

    it('should return false for tablet widths', () => {
      global.innerWidth = 800;
      expect(isDesktop()).toBe(false);
    });
  });

  describe('getResponsiveColumns', () => {
    it('should return 1 column for mobile', () => {
      global.innerWidth = 375;
      expect(getResponsiveColumns()).toBe(1);
    });

    it('should return 2 columns for tablet', () => {
      global.innerWidth = 800;
      expect(getResponsiveColumns()).toBe(2);
    });

    it('should return 4 columns for desktop', () => {
      global.innerWidth = 1200;
      expect(getResponsiveColumns()).toBe(4);
    });
  });

  describe('getResponsiveFontSize', () => {
    it('should return correct classes for small size', () => {
      expect(getResponsiveFontSize('sm')).toBe('text-xs sm:text-sm');
    });

    it('should return correct classes for base size', () => {
      expect(getResponsiveFontSize('base')).toBe('text-sm sm:text-base');
    });

    it('should return correct classes for large size', () => {
      expect(getResponsiveFontSize('lg')).toBe('text-base sm:text-lg');
    });

    it('should return correct classes for xl size', () => {
      expect(getResponsiveFontSize('xl')).toBe('text-lg sm:text-xl lg:text-2xl');
    });
  });
});
