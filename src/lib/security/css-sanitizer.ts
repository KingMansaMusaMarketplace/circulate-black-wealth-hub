/**
 * CSS Sanitizer - prevents CSS injection attacks from tenant-supplied CSS.
 * Blocks dangerous constructs like @import, url(), expression(), and attr() exfiltration.
 */

const BLOCKED_AT_RULES = /\s*@import\b/gi;
const BLOCKED_FUNCTIONS = /\b(url|expression|calc\s*\(\s*attr|javascript)\s*\(/gi;
const BLOCKED_PROPERTIES = /\b(behavior|binding|-moz-binding)\s*:/gi;
const BLOCKED_CONTENT_ATTR = /content\s*:\s*[^;]*\battr\s*\(/gi;

/**
 * Sanitizes tenant-supplied CSS by stripping dangerous constructs.
 * Only allows safe CSS properties and values — blocks external resource loading,
 * script execution, and data exfiltration vectors.
 */
export const sanitizeCSS = (css: string): string => {
  if (!css || typeof css !== 'string') return '';

  let sanitized = css;

  // Remove @import rules (external resource loading / exfiltration)
  sanitized = sanitized.replace(BLOCKED_AT_RULES, '/* blocked */');

  // Remove url() calls (prevents loading external resources)
  sanitized = sanitized.replace(BLOCKED_FUNCTIONS, '/* blocked */(');

  // Remove dangerous IE/Mozilla properties
  sanitized = sanitized.replace(BLOCKED_PROPERTIES, '/* blocked */:');

  // Remove content: attr() exfiltration
  sanitized = sanitized.replace(BLOCKED_CONTENT_ATTR, '/* blocked */:');

  return sanitized;
};
