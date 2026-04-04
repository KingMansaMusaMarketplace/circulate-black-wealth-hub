/**
 * CSRF Protection Module
 * 
 * Generates a per-session CSRF token using crypto.getRandomValues(),
 * stores it in sessionStorage, and exposes it for attachment to
 * state-changing requests (POST/PUT/PATCH/DELETE) via custom headers.
 *
 * Edge functions validate the token by comparing the X-CSRF-Token header
 * against the token stored in the user's session metadata.
 */

const CSRF_STORAGE_KEY = '1325-csrf-token';
const CSRF_HEADER_NAME = 'X-CSRF-Token';

/**
 * Generate a cryptographically random CSRF token (256-bit hex).
 */
function generateToken(): string {
  const buf = new Uint8Array(32);
  crypto.getRandomValues(buf);
  return Array.from(buf, (b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Get (or lazily create) the current session's CSRF token.
 */
export function getCsrfToken(): string {
  try {
    let token = sessionStorage.getItem(CSRF_STORAGE_KEY);
    if (!token) {
      token = generateToken();
      sessionStorage.setItem(CSRF_STORAGE_KEY, token);
    }
    return token;
  } catch {
    // sessionStorage unavailable (e.g. iOS private mode polyfill)
    // Fall back to an in-memory token for this page lifecycle
    if (!(window as any).__csrfToken) {
      (window as any).__csrfToken = generateToken();
    }
    return (window as any).__csrfToken;
  }
}

/**
 * Rotate the CSRF token (call after sensitive actions or on auth change).
 */
export function rotateCsrfToken(): string {
  const newToken = generateToken();
  try {
    sessionStorage.setItem(CSRF_STORAGE_KEY, newToken);
  } catch {
    (window as any).__csrfToken = newToken;
  }
  return newToken;
}

/**
 * Returns the header name and value for use in fetch / Supabase calls.
 */
export function csrfHeader(): Record<string, string> {
  return { [CSRF_HEADER_NAME]: getCsrfToken() };
}

export { CSRF_HEADER_NAME };
