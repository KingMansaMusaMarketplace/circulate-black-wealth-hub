export type PreviewViewer = { name: string; email: string };
// Only a server-issued deadline can open a visitor session.
export function readPreviewGrant(data: unknown) {
  if (!data || typeof data !== 'object') return null;
  const grant = data as Record<string, unknown>;
  if (grant.ok !== true || typeof grant.name !== 'string' || typeof grant.email !== 'string' ||
      typeof grant.viewing_expires_at !== 'string' || typeof grant.server_now !== 'string') return null;
  const remaining = Date.parse(grant.viewing_expires_at) - Date.parse(grant.server_now);
  if (!Number.isFinite(remaining) || remaining <= 0 || remaining > 40 * 60 * 1000) return null;
  return { viewer: { name: grant.name, email: grant.email }, remaining, expiresAt: Date.parse(grant.viewing_expires_at) };
}