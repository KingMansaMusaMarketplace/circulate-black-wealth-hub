import { describe, expect, it } from 'vitest';
import { cmeCaseStatus, cmePortalAccess } from '../pages/health/workspace/cme-portal-policy';

describe('CME portal access and status', () => {
  it('denies case access without clinic membership', () => {
    expect(cmePortalAccess(undefined, 'doctor').clinicMember).toBe(false);
    expect(cmePortalAccess('clinic-1', 'customer').clinicMember).toBe(false);
  });
  it('keeps uploads locked for every clinic role pending independent clearance', () => {
    for (const role of ['owner', 'doctor', 'staff']) {
      expect(cmePortalAccess('clinic-1', role).clinicMember).toBe(true);
      expect(cmePortalAccess('clinic-1', role).uploadsAllowed).toBe(false);
    }
  });
  it('limits review decisions to clinic doctors and owners', () => {
    expect(cmePortalAccess('clinic-1', 'doctor').canReview).toBe(true);
    expect(cmePortalAccess('clinic-1', 'owner').canReview).toBe(true);
    expect(cmePortalAccess('clinic-1', 'staff').canReview).toBe(false);
  });
  it('does not treat a completed AI draft as doctor approval', () => {
    expect(cmeCaseStatus(true, [])).toBe('awaiting_review');
  });
  it('uses the most recent saved doctor decision', () => {
    expect(cmeCaseStatus(true, [
      { decision: 'accepted', created_at: '2026-10-16T10:00:00Z' },
      { decision: 'revision_requested', created_at: '2026-10-17T10:00:00Z' },
    ])).toBe('revision_requested');
    expect(cmeCaseStatus(true, [{ decision: 'accepted', created_at: '2026-10-17T10:00:00Z' }])).toBe('reviewed');
  });
  it('does not label an unlinked draft review-ready', () => {
    expect(cmeCaseStatus(false, [{ decision: 'accepted', created_at: '2026-10-17T10:00:00Z' }])).toBe('source_links_missing');
  });
});