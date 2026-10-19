import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import DelegationDesk from '@/pages/health/workspace/DelegationDesk';
import { DRAFT_ORDERS, DELEGATION_CHART, INBOX_ITEMS, routedCounts } from '@/pages/health/workspace/delegation-desk';

afterEach(cleanup);
describe('delegation desk safeguards', () => {
  it('turns the spoken request into exactly three drafts', () => {
    expect(DRAFT_ORDERS.map((o) => o.id)).toEqual(['pet', 'psa', 'ondansetron']);
  });
  it('cites a real chart line for every yes/no answer and leaves the rest unknown', () => {
    for (const q of DRAFT_ORDERS.flatMap((o) => o.questions)) {
      if (q.answer === 'unknown') expect(q.sourceLine).toBeNull();
      else expect(DELEGATION_CHART[(q.sourceLine as number) - 1]).toBeTruthy();
    }
    expect(DRAFT_ORDERS[0].questions.find((q) => q.question.includes('cardiac'))?.answer).toBe('unknown');
  });
  it('sends new symptoms and results to the doctor', () => {
    expect(INBOX_ITEMS.find((i) => i.id === 'i4')?.route).toBe('doctor_judgment');
    expect(INBOX_ITEMS.find((i) => i.id === 'i5')?.route).toBe('doctor_judgment');
    expect(routedCounts()).toEqual({ staff: 3, doctor: 2 });
  });
  it('keeps sending locked after the rehearsal sign-off', () => {
    render(<DelegationDesk />);
    fireEvent.click(screen.getByRole('button', { name: /prepare draft orders/i }));
    fireEvent.click(screen.getByRole('button', { name: /signs all 3/i }));
    expect(screen.getByText(/no order or prescription was sent/i)).toBeTruthy();
    expect((screen.getByRole('button', { name: /send to pharmacy/i }) as HTMLButtonElement).disabled).toBe(true);
  });
});
