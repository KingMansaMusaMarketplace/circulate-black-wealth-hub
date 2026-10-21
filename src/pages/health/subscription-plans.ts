/** Future subscription presentation only; never a billing or access entitlement. */
export const clinicalSubscriptionPlans = [
  {
    id: 'core', name: 'Clinical Core', monthlyPerClinician: 299,
    description: 'The foundation for independent practices.',
    features: ['Medical records', 'AI documentation & evidence-linked notes', 'Chart preparation & clinician review', 'Standard support'],
  },
  {
    id: 'plus', name: 'Clinical Plus', monthlyPerClinician: 499,
    description: 'More coordination for a growing practice.',
    features: ['Everything planned for Core', 'Advanced delegation & practice workflows', 'Practice reporting', 'Priority support'],
  },
  {
    id: 'network', name: 'Hospital / Network', monthlyPerClinician: null,
    description: 'An agreement tailored to your organization.',
    features: ['Multiple facilities', 'Provider-specific connections', 'Migration & team training', 'Contracted security & support requirements'],
  },
] as const;

export const clinicalSubscriptionPolicy = {
  status: 'planned', checkoutEnabled: false, currency: 'USD',
  administrativeStaffMonthlyFee: 0,
} as const;

export function clinicalMonthlyTotal(planId: typeof clinicalSubscriptionPlans[number]['id'], clinicians: number, administrativeStaff = 0): number | null {
  if (!Number.isSafeInteger(clinicians) || clinicians < 1 || !Number.isSafeInteger(administrativeStaff) || administrativeStaff < 0) {
    throw new RangeError('Use a positive clinician count and a nonnegative administrative staff count.');
  }
  const plan = clinicalSubscriptionPlans.find(item => item.id === planId);
  if (!plan || plan.monthlyPerClinician === null) return null;
  return plan.monthlyPerClinician * clinicians + clinicalSubscriptionPolicy.administrativeStaffMonthlyFee * administrativeStaff;
}