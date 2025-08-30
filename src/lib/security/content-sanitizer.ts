// Content sanitization utilities to prevent XSS attacks

export const sanitizeHtml = (content: string): string => {
  // Basic HTML sanitization - remove potentially dangerous elements and attributes
  const dangerous = /<(script|iframe|object|embed|form|meta|link|style)[^>]*>.*?<\/\1>/gi;
  const dangerousAttributes = /(on\w+|javascript:|data:text\/html|vbscript:|mocha:|livescript:|expression\()/gi;
  
  let sanitized = content
    .replace(dangerous, '') // Remove dangerous tags
    .replace(dangerousAttributes, ''); // Remove dangerous attributes
  
  return sanitized;
};

export const sanitizeText = (text: string): string => {
  // Escape HTML entities to prevent XSS
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

export const validateImageUrl = (url: string): boolean => {
  // Validate image URLs to prevent data URLs and script injection
  const validImagePattern = /^https?:\/\/.*\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i;
  const dangerousPattern = /(javascript:|data:|vbscript:|on\w+)/i;
  
  return validImagePattern.test(url) && !dangerousPattern.test(url);
};

export const sanitizeBusinessData = (data: any) => {
  if (typeof data === 'string') {
    return sanitizeText(data);
  }
  
  if (Array.isArray(data)) {
    return data.map(sanitizeBusinessData);
  }
  
  if (data && typeof data === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(data)) {
      sanitized[key] = sanitizeBusinessData(value);
    }
    return sanitized;
  }
  
  return data;
};

// Safe component for rendering user content
export const createSafeHtml = (content: string) => {
  return {
    __html: sanitizeHtml(content)
  };
};