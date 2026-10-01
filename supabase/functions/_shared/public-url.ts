// Validate that a caller-supplied URL points at a normal public website.
// Blocks non-http(s) schemes, credentials, odd ports, IP literals, localhost
// and internal-looking hostnames. Returns the normalized URL or throws.
export function assertPublicUrl(raw: unknown, opts: { allowedHosts?: string[] } = {}): string {
  if (typeof raw !== "string" || raw.length > 2048) throw new Error("Invalid URL");
  let s = raw.trim();
  if (!/^https?:\/\//i.test(s)) s = `https://${s}`;
  let u: URL;
  try { u = new URL(s); } catch { throw new Error("Invalid URL"); }
  if (u.protocol !== "https:" && u.protocol !== "http:") throw new Error("Only web addresses are allowed");
  if (u.username || u.password) throw new Error("Invalid URL");
  if (u.port && u.port !== "80" && u.port !== "443") throw new Error("Invalid URL port");
  const host = u.hostname.toLowerCase().replace(/\.$/, "");
  if (
    !host.includes(".") ||
    host === "localhost" || host.endsWith(".localhost") ||
    host.endsWith(".local") || host.endsWith(".internal") ||
    /^[\d.]+$/.test(host) || host.includes(":") || host.startsWith("[") ||
    host === "metadata.google.internal"
  ) {
    throw new Error("URL must be a public website");
  }
  if (opts.allowedHosts && !opts.allowedHosts.some((h) => host === h || host.endsWith(`.${h}`))) {
    throw new Error("URL host is not allowed");
  }
  return u.toString();
}
