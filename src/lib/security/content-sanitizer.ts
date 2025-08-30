/**
 * Content sanitization utilities to prevent XSS attacks
 */

// Basic HTML sanitizer for user-generated content
export const sanitizeHtml = (html: string): string => {
  // Create a temporary div element
  const temp = document.createElement('div');
  temp.textContent = html;
  return temp.innerHTML;
};

// Remove dangerous HTML tags and attributes
export const stripDangerousTags = (html: string): string => {
  const dangerousTags = ['script', 'object', 'embed', 'link', 'style', 'iframe', 'form'];
  const dangerousAttrs = ['onload', 'onerror', 'onclick', 'onmouseover', 'onfocus', 'onblur', 'onchange'];
  
  let cleaned = html;
  
  // Remove dangerous tags
  dangerousTags.forEach(tag => {
    const regex = new RegExp(`<${tag}[^>]*>.*?</${tag}>`, 'gis');
    cleaned = cleaned.replace(regex, '');
    const selfClosingRegex = new RegExp(`<${tag}[^>]*/>`, 'gi');
    cleaned = cleaned.replace(selfClosingRegex, '');
  });
  
  // Remove dangerous attributes
  dangerousAttrs.forEach(attr => {
    const regex = new RegExp(`${attr}\\s*=\\s*["'][^"']*["']`, 'gi');
    cleaned = cleaned.replace(regex, '');
  });
  
  return cleaned;
};

// Sanitize text content for display
export const sanitizeText = (text: string): string => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Validate and sanitize URLs
export const sanitizeUrl = (url: string): string => {
  try {
    const parsed = new URL(url);
    // Only allow http, https, and mailto protocols
    if (!['http:', 'https:', 'mailto:'].includes(parsed.protocol)) {
      return '#';
    }
    return parsed.toString();
  } catch {
    return '#';
  }
};

// Sanitize business description content
export const sanitizeBusinessDescription = (description: string): string => {
  // Allow basic formatting but strip dangerous content
  const cleaned = stripDangerousTags(description);
  return cleaned;
};

// Content Security Policy helper for dynamic content
export const createSecureContent = (content: string): { __html: string } => {
  const sanitized = stripDangerousTags(content);
  return { __html: sanitized };
};