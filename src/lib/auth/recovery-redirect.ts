// When the auth server cannot use the requested reset address it falls back to
// the site root (e.g. "/?code=..."). Supabase marks a password-reset request by
// storing its PKCE verifier with a "/PASSWORD_RECOVERY" suffix, so we can
// recognise the link and send it to the reset page instead of the homepage.

export const RESET_PASSWORD_PATH = '/reset-password';

export function isRecoveryVerifier(value: string | null | undefined): boolean {
  if (!value) return false;
  let raw = value;
  try {
    const parsed = JSON.parse(value);
    if (typeof parsed === 'string') raw = parsed;
  } catch {
    // stored as a plain string
  }
  return raw.endsWith('/PASSWORD_RECOVERY');
}

/** Returns the path to move to, or null when the URL should stay as it is. */
export function recoveryRedirectPath(href: string, verifierValue: string | null | undefined): string | null {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return null;
  }
  const code = url.searchParams.get('code');
  if (!code) return null;
  if (url.pathname === RESET_PASSWORD_PATH) return null;
  if (!isRecoveryVerifier(verifierValue)) return null;
  return `${RESET_PASSWORD_PATH}?code=${encodeURIComponent(code)}`;
}
