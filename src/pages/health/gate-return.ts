/**
 * Remembers which private clinic screen a visitor was trying to open before
 * requesting access, so the emailed approval link (which always lands on
 * /health) can take them back there on the same device. Only the clinic
 * workspace is remembered; this never grants access — the gate still verifies.
 */
export const GATE_RETURN_KEY = 'hc_gate_return_to';
export const GATE_RETURN_MAX_AGE_MS = 24 * 60 * 60 * 1000;

/** Accept only same-site clinic workspace paths such as /health/app?view=pilot. */
export function safeWorkspacePath(raw: unknown): string | null {
  if (typeof raw !== 'string' || raw.length > 200) return null;
  if (!/^\/health\/app(?:[/?#]|$)/.test(raw)) return null;
  if (raw.includes('//') || raw.includes('\\')) return null;
  return raw;
}

export function rememberGatedDestination(path: string, storage: Pick<Storage, 'setItem'>, now = Date.now()) {
  const safe = safeWorkspacePath(path);
  if (!safe) return;
  storage.setItem(GATE_RETURN_KEY, JSON.stringify({ path: safe, at: now }));
}

/** Returns the remembered workspace path once, then forgets it. */
export function consumeGatedDestination(storage: Pick<Storage, 'getItem' | 'removeItem'>, now = Date.now()): string | null {
  const raw = storage.getItem(GATE_RETURN_KEY);
  if (!raw) return null;
  storage.removeItem(GATE_RETURN_KEY);
  try {
    const parsed = JSON.parse(raw) as { path?: unknown; at?: unknown };
    if (typeof parsed.at !== 'number' || now - parsed.at > GATE_RETURN_MAX_AGE_MS || parsed.at > now) return null;
    return safeWorkspacePath(parsed.path);
  } catch {
    return null;
  }
}
