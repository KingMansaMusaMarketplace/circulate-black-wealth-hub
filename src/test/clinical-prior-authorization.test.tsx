import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import PriorAuthorization from '@/pages/health/workspace/PriorAuthorization';
import { AUTHORIZATION_VISIT_ID, prepareAuthorizationPacket, validateAuthorizationEvidence } from '@/pages/health/workspace/prior-authorization';
import { findVisit } from '@/pages/health/workspace/sample-visits';

afterEach(cleanup);

describe('Fictional prior authorization safeguards', () => {
  it('assembles exact excerpts including the MRI order and unconfirmed assessment', () => {
    const packet = prepareAuthorizationPacket(AUTHORIZATION_VISIT_ID);
    const visit = findVisit(AUTHORIZATION_VISIT_ID);
    expect(packet.evidence).toHaveLength(6);
    for (const item of packet.evidence) expect(item.quote).toBe(visit?.lines[item.line - 1]);
    expect(packet.evidence[0].quote).toBe('Doctor: We will order an MRI of the right knee.');
    expect(packet.evidence[5].quote).toBe('Doctor: I am concerned about a possible meniscus injury, but I cannot confirm that today.');
  });
  it('rejects arbitrary cases and changed source quotations', () => {
    expect(() => prepareAuthorizationPacket('real-patient')).toThrow('Unknown authorization sample');
    expect(() => validateAuthorizationEvidence([{ line: 6, quote: 'Confirmed meniscus tear.' }], AUTHORIZATION_VISIT_ID)).toThrow('Authorization source mismatch');
    expect(() => validateAuthorizationEvidence([{ line: 99, quote: '' }], AUTHORIZATION_VISIT_ID)).toThrow();
  });
  it('keeps the packet awaiting doctor review, never a submission or necessity decision', () => {
    const packet = prepareAuthorizationPacket(AUTHORIZATION_VISIT_ID);
    expect(packet.status).toBe('awaiting_doctor_review');
    expect(packet.fictional).toBe(true);
    expect(packet.canSubmit).toBe(false);
    expect(packet.canExport).toBe(false);
    expect(packet.isMedicalNecessityDecision).toBe(false);
    expect(packet.gaps.map((gap) => gap.id)).toEqual(['identity', 'order', 'rationale', 'payer', 'appeal']);
  });
  it('review rehearsal cannot unlock sending, signature or export and clears on reset', () => {
    render(<PriorAuthorization />);
    fireEvent.click(screen.getByRole('button', { name: 'Prepare fictional packet' }));
    for (const box of screen.getAllByRole('checkbox')) fireEvent.click(box);
    for (const name of ['Send to insurer', 'Export packet', 'Doctor signature unavailable']) {
      expect(screen.getByRole('button', { name }).hasAttribute('disabled')).toBe(true);
    }
    fireEvent.click(screen.getByRole('button', { name: 'View source line 6' }));
    expect(document.getElementById('auth-source-6')?.getAttribute('aria-current')).toBe('true');
    fireEvent.click(screen.getByRole('button', { name: 'Clear packet' }));
    fireEvent.click(screen.getByRole('button', { name: 'Prepare fictional packet' }));
    for (const box of screen.getAllByRole('checkbox')) expect((box as HTMLInputElement).checked).toBe(false);
  });
});