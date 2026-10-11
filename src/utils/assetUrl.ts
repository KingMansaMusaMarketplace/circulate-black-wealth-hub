/**
 * Uploaded videos/images live on the website's file host (paths like "/__l5e/...").
 * Inside the Apple/Android app the page is opened from the phone itself
 * (capacitor://localhost), so those short paths point nowhere. In that case we
 * point them at the live site instead.
 */
const LIVE_SITE = 'https://1325.ai';

export function assetUrl(url: string | undefined | null): string {
  if (!url) return '';
  if (/^https?:\/\//i.test(url) || url.startsWith('data:') || url.startsWith('blob:')) return url;
  if (typeof window === 'undefined') return url;
  const { protocol, hostname } = window.location;
  const isAppShell =
    (protocol !== 'http:' && protocol !== 'https:') ||
    // Android bundled mode serves from https://localhost
    hostname === 'localhost' && !!(window as any).Capacitor?.isNativePlatform?.();
  return isAppShell ? `${LIVE_SITE}${url.startsWith('/') ? '' : '/'}${url}` : url;
}
