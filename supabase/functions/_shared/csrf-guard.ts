/**
 * CSRF Guard for Edge Functions
 *
 * Validates the X-CSRF-Token header on state-changing requests (POST, PUT, PATCH, DELETE).
 * The token is a 64-char hex string generated client-side; its mere presence proves the
 * request originated from our SPA (browsers enforce that custom headers cannot be set by
 * cross-origin forms or simple requests — the CORS preflight will block them).
 *
 * This is the "custom header" pattern recommended by OWASP for SPA CSRF protection:
 * https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#employing-custom-request-headers-for-ajaxapi
 */

const CSRF_HEADER = 'x-csrf-token';
const TOKEN_REGEX = /^[0-9a-f]{64}$/;

export interface CsrfCheckResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate CSRF token from request headers.
 * Call this at the top of any state-changing edge function.
 *
 * Safe methods (GET, HEAD, OPTIONS) are always allowed.
 */
export function validateCsrf(req: Request): CsrfCheckResult {
  const method = req.method.toUpperCase();

  // Safe methods don't need CSRF protection
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    return { valid: true };
  }

  const token = req.headers.get(CSRF_HEADER);

  if (!token) {
    return { valid: false, error: 'Missing CSRF token' };
  }

  if (!TOKEN_REGEX.test(token)) {
    return { valid: false, error: 'Invalid CSRF token format' };
  }

  // Token is present and well-formed — the custom-header CORS pattern
  // guarantees this request came from our origin.
  return { valid: true };
}

/**
 * Convenience: returns a 403 Response if CSRF check fails, or null if OK.
 */
export function csrfGuard(req: Request): Response | null {
  const result = validateCsrf(req);
  if (!result.valid) {
    return new Response(
      JSON.stringify({ error: result.error }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }
  return null;
}
