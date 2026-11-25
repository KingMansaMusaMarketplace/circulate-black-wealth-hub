export const TRAINING_BUCKET = 'clinical-training';
export const TRAINING_PATH = 'pilot/clinical-captioned.mp4';
export const MAX_VIDEO_BYTES = 50 * 1024 * 1024;

export function videoPermission(action: unknown, admin: boolean, grant: { ok?: boolean; remaining_ms?: number; viewing_expires_at?: string } | null, now = Date.now()) {
  if (action !== 'watch' && action !== 'upload') return { allowed: false, ttl: 0 };
  if (admin) return { allowed: true, ttl: 600 };
  if (action === 'upload' || grant?.ok !== true) return { allowed: false, ttl: 0 };
  const remaining = grant.viewing_expires_at ? Date.parse(grant.viewing_expires_at) - now : grant.remaining_ms;
  if (typeof remaining !== 'number' || !Number.isFinite(remaining) || remaining < 1000) return { allowed: false, ttl: 0 };
  return { allowed: true, ttl: Math.min(600, Math.floor(remaining / 1000)) };
}