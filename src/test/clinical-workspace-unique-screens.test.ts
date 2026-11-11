// Each workspace screen needs its own label: when two screens shared one, switching screens left
// extra copies of the Daily huddles card stacked on the page (Maurice, Nov 11 2026) and froze its buttons.
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('clinic workspace screens', () => {
  it('every screen on the workspace page has a different label', () => {
    const page = readFileSync('src/pages/health/HealthWorkspacePage.tsx', 'utf8');
    const main = page.slice(page.indexOf('<ExecutiveWalkthrough'), page.indexOf('</main>'));
    const keys = [...main.matchAll(/key=\{`([^`]*)`\}/g)].map(m => m[1]);
    expect(keys.length).toBeGreaterThan(20);
    expect(new Set(keys).size).toBe(keys.length);
  });
});
