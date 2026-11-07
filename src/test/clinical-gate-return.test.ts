import { describe, expect, it } from 'vitest';
import { consumeGatedDestination, GATE_RETURN_KEY, rememberGatedDestination, safeWorkspacePath } from '@/pages/health/gate-return';

function memory() {
  const m = new Map<string, string>();
  return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => { m.set(k, v); }, removeItem: (k: string) => { m.delete(k); }, m };
}

describe('approval link returns visitor to the pilot screen', () => {
  it('remembers /health/app?view=pilot and returns it once', () => {
    const s = memory();
    rememberGatedDestination('/health/app?view=pilot', s, 1000);
    expect(consumeGatedDestination(s, 2000)).toBe('/health/app?view=pilot');
    expect(consumeGatedDestination(s, 2000)).toBeNull();
  });

  it('forgets the destination after 24 hours', () => {
    const s = memory();
    rememberGatedDestination('/health/app?view=pilot', s, 0);
    expect(consumeGatedDestination(s, 24 * 60 * 60 * 1000 + 1)).toBeNull();
    expect(s.m.has(GATE_RETURN_KEY)).toBe(false);
  });

  it('only remembers the clinic workspace, never other or outside addresses', () => {
    expect(safeWorkspacePath('/health')).toBeNull();
    expect(safeWorkspacePath('/health/apples')).toBeNull();
    expect(safeWorkspacePath('https://evil.example/health/app')).toBeNull();
    expect(safeWorkspacePath('/health/app//evil.example')).toBeNull();
    expect(safeWorkspacePath('/health/app')).toBe('/health/app');
  });
});
