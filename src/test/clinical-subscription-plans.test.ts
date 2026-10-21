import { describe, expect, it } from 'vitest';
import { clinicalMonthlyTotal, clinicalSubscriptionPlans, clinicalSubscriptionPolicy } from '@/pages/health/subscription-plans';

describe('approved future clinical subscription rules', () => {
  it('prices Core at $299 per clinician monthly', () => {
    expect(clinicalSubscriptionPlans.find(plan => plan.id === 'core')?.monthlyPerClinician).toBe(299);
  });
  it('prices Plus at $499 per clinician monthly', () => {
    expect(clinicalSubscriptionPlans.find(plan => plan.id === 'plus')?.monthlyPerClinician).toBe(499);
  });
  it('totals five Core clinicians at $1,495 monthly', () => {
    expect(clinicalMonthlyTotal('core', 5)).toBe(1495);
  });
  it('totals five Plus clinicians at $2,495 monthly', () => {
    expect(clinicalMonthlyTotal('plus', 5)).toBe(2495);
  });
  it('includes administrative staff without separate account charges', () => {
    expect(clinicalSubscriptionPolicy.administrativeStaffMonthlyFee).toBe(0);
    expect(clinicalMonthlyTotal('core', 5, 20)).toBe(1495);
    expect(clinicalMonthlyTotal('plus', 5, 20)).toBe(2495);
  });
  it('requires a custom quote for Hospital / Network', () => {
    expect(clinicalMonthlyTotal('network', 5, 20)).toBeNull();
  });
  it('keeps future subscription purchases unavailable', () => {
    expect(clinicalSubscriptionPolicy.status).toBe('planned');
    expect(clinicalSubscriptionPolicy.checkoutEnabled).toBe(false);
  });
});