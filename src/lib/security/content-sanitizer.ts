// Content sanitization utilities to prevent XSS attacks
import DOMPurify from 'dompurify';

/**
 * Sanitizes HTML content using DOMPurify - industry standard protection against XSS
 * This provides comprehensive protection against:
 * - Script injection
 * - SVG-based XSS
 * - CSS injection vectors
 * - Data URI attacks
 * - Mutation XSS (mXSS)
 * - HTML5 semantic tag exploits
 */
export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 
      'ul', 'ol', 'li', 'div', 'span', 'a'
    ],
    ALLOWED_ATTR: ['class', 'href', 'target', 'rel'],
    ALLOW_DATA_ATTR: false,
    // Force links to open in new tab with security attributes
    ADD_ATTR: ['target', 'rel'],
    // Prevent javascript: and data: URIs
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  });
};

/**
 * Escapes HTML special characters to prevent XSS
 */
export const escapeHtml = (text: string): string => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

/**
 * Sanitizes user input for display in React components
 */
export const sanitizeUserInput = (input: string): string => {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // Remove null bytes and control characters
  let sanitized = input.replace(/[\x00-\x1F\x7F]/g, '');

  // Escape HTML entities
  sanitized = escapeHtml(sanitized);

  return sanitized;
};

/**
 * Validates and sanitizes URLs to prevent malicious redirects
 */
export const sanitizeUrl = (url: string): string | null => {
  if (!url || typeof url !== 'string') {
    return null;
  }

  try {
    const parsedUrl = new URL(url);
    
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return null;
    }

    // Block localhost and private IPs in production
    if (process.env.NODE_ENV === 'production') {
      const hostname = parsedUrl.hostname.toLowerCase();
      
      // Block localhost
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return null;
      }

      // Block private IP ranges (basic check)
      if (hostname.startsWith('192.168.') || 
          hostname.startsWith('10.') || 
          hostname.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./)) {
        return null;
      }
    }

    return parsedUrl.toString();
  } catch {
    return null;
  }
};

/**
 * Creates a safe props object for dangerouslySetInnerHTML
 * Only use this when you absolutely need to render HTML content
 */
export const createSafeHTML = (html: string) => {
  return {
    __html: sanitizeHtml(html)
  };
};

/**
 * Validates that content is safe before using dangerouslySetInnerHTML
 * Throws an error if content contains potentially dangerous elements
 */
export const validateSafeHTML = (html: string): boolean => {
  const dangerousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
    /<form/gi
  ];

  return !dangerousPatterns.some(pattern => pattern.test(html));
};