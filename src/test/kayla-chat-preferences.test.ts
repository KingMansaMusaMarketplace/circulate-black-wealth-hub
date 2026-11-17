import { describe, expect, it } from 'vitest';
import { prefsFromAccountRow, readLocalKaylaPrefs, KAYLA_ADULT_KEY, KAYLA_MEMORY_KEY } from '@/lib/kayla/chat-preferences';

const store = (values: Record<string, string>) => ({ getItem: (k: string) => values[k] ?? null });

describe('Kayla chat preferences', () => {
  it('asks the 18+ question until someone has confirmed', () => {
    expect(readLocalKaylaPrefs(store({})).adultConfirmed).toBe(false);
    expect(readLocalKaylaPrefs(store({ [KAYLA_ADULT_KEY]: 'yes' })).adultConfirmed).toBe(true);
    expect(prefsFromAccountRow(null).adultConfirmed).toBe(false);
  });

  it('keeps Memory Off once the person chooses it', () => {
    expect(readLocalKaylaPrefs(store({ [KAYLA_MEMORY_KEY]: 'off' })).memoryEnabled).toBe(false);
    expect(prefsFromAccountRow({ memory_enabled: false }).memoryEnabled).toBe(false);
  });

  it('remembers nothing when this device blocks storage', () => {
    const blocked = { getItem: () => { throw new Error('blocked'); } };
    expect(readLocalKaylaPrefs(blocked)).toEqual({ memoryEnabled: false, adultConfirmed: false });
  });
});
