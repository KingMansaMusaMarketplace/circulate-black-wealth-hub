// Returns a trusted site origin for payment/portal return links.
// Never trust the caller's Origin header blindly: only our own domains pass.
const DEFAULT_ORIGIN = "https://1325.ai";
const ALLOWED_HOSTS = new Set([
  "1325.ai",
  "www.1325.ai",
  "circulate-black-wealth-hub.lovable.app",
  "mansamusamarketplace.com",
  "www.mansamusamarketplace.com",
  "localhost",
]);

function isAllowedHost(host: string): boolean {
  return ALLOWED_HOSTS.has(host) ||
    (host.endsWith(".lovable.app") && host.includes("e4235560-3b6b-4780-b91c-854366c7682f")) ||
    host === "id-preview--e4235560-3b6b-4780-b91c-854366c7682f.lovable.app";
}

export function safeOrigin(req: Request): string {
  const raw = req.headers.get("origin");
  if (!raw) return DEFAULT_ORIGIN;
  try {
    const u = new URL(raw);
    if ((u.protocol === "https:" || u.hostname === "localhost") && isAllowedHost(u.hostname)) {
      return u.origin;
    }
  } catch { /* fall through */ }
  return DEFAULT_ORIGIN;
}

// Validate a caller-supplied full return URL; fall back when not on our domains.
export function safeReturnUrl(candidate: string | undefined | null, fallback: string): string {
  if (!candidate) return fallback;
  try {
    const u = new URL(candidate);
    if ((u.protocol === "https:" || u.hostname === "localhost") && isAllowedHost(u.hostname)) {
      return u.toString();
    }
  } catch { /* fall through */ }
  return fallback;
}
