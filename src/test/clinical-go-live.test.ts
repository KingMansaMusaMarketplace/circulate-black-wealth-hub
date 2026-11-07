import { describe, expect, it } from 'vitest';
import { buildGoLiveStatus, CONSENT_DRAFT_LABEL, type GoLiveVendor } from '@/lib/clinical/go-live';

const signed = (name: string): GoLiveVendor => ({ vendor_name: name, baa_category: 'requires_baa', status: 'signed', attorney_approved: true });

describe('real-patient go-live lock', () => {
  it('never allows real patients, even when every vendor is signed and attorney-approved', () => {
    const s = buildGoLiveStatus([signed('Supabase'), signed('OpenAI')]);
    expect(s.items.find((i) => i.key === 'vendor_agreements')?.done).toBe(true);
    expect(s.realPatientsAllowed).toBe(false);
  });

  it('lists Lovable as a blocker because it declined to sign', () => {
    const s = buildGoLiveStatus([
      signed('Supabase'),
      { vendor_name: 'Lovable', baa_category: 'requires_baa', status: 'vendor_declined', attorney_approved: false },
    ]);
    expect(s.vendorsBlocked).toEqual(['Lovable']);
    expect(s.vendorsCleared).toBe(1);
    expect(s.items.find((i) => i.key === 'vendor_agreements')?.done).toBe(false);
  });

  it('a signed agreement without attorney approval does not count', () => {
    const s = buildGoLiveStatus([{ vendor_name: 'OpenAI', baa_category: 'requires_baa', status: 'signed', attorney_approved: false }]);
    expect(s.vendorsCleared).toBe(0);
  });

  it('offline steps (clinic agreement, consent, security review, protected home, attorney approval) are never done from the app', () => {
    const s = buildGoLiveStatus([signed('Supabase')]);
    expect(s.items).toHaveLength(6);
    expect(s.items.filter((i) => i.key !== 'vendor_agreements').every((i) => !i.done)).toBe(true);
    expect(s.doneCount).toBe(1);
  });

  it('the consent form is labeled as a draft not for signature', () => {
    expect(CONSENT_DRAFT_LABEL).toMatch(/not for signature/i);
  });
});
