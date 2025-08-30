// Content sanitization utilities to prevent XSS attacks

/**
 * Sanitizes HTML content by removing potentially dangerous elements and attributes
 * This is a basic implementation - for production use, consider using DOMPurify
 */
export const sanitizeHtml = (html: string): string => {
  // Create a temporary div to parse HTML
  const temp = document.createElement('div');
  temp.innerHTML = html;

  // Remove script tags
  const scripts = temp.getElementsByTagName('script');
  for (let i = scripts.length - 1; i >= 0; i--) {
    scripts[i].remove();
  }

  // Remove potentially dangerous attributes
  const allElements = temp.getElementsByTagName('*');
  for (let i = 0; i < allElements.length; i++) {
    const element = allElements[i];
    
    // Remove dangerous attributes
    const dangerousAttrs = ['onclick', 'onload', 'onerror', 'onmouseover', 'onfocus', 'onblur', 'javascript:'];
    dangerousAttrs.forEach(attr => {
      if (element.hasAttribute(attr)) {
        element.removeAttribute(attr);
      }
    });

    // Remove javascript: protocols from href and src
    const href = element.getAttribute('href');
    const src = element.getAttribute('src');
    
    if (href && href.toLowerCase().startsWith('javascript:')) {
      element.removeAttribute('href');
    }
    
    if (src && src.toLowerCase().startsWith('javascript:')) {
      element.removeAttribute('src');
    }
  }

  return temp.innerHTML;
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