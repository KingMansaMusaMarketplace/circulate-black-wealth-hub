export type PracticeInputs = {
  providers: number;
  daysPerMonth: number;
  minutesPerDay: number;
  hourlyValue: number;
  monthlyCost: number;
};

/** Capacity-value scenario only: never forecasts revenue or actual cash savings. */
export function calculatePracticeImpact(input: PracticeInputs) {
  const { providers, daysPerMonth, minutesPerDay, hourlyValue, monthlyCost } = input;
  if (Object.values(input).some((value) => !Number.isFinite(value) || value < 0)) throw new Error('Use finite, nonnegative inputs');
  if (!Number.isInteger(providers) || providers < 1) throw new Error('Clinicians must be a positive whole number');
  if (!Number.isInteger(daysPerMonth) || daysPerMonth > 31) throw new Error('Workdays must be a whole number from 0 to 31');
  if (minutesPerDay > 1440) throw new Error('Minutes cannot exceed one day');
  const hoursPerClinician = daysPerMonth * minutesPerDay / 60;
  const hoursPerMonth = hoursPerClinician * providers;
  const capacityValue = hoursPerMonth * hourlyValue;
  const netModeledValue = capacityValue - monthlyCost;
  const costCoverage = monthlyCost > 0 ? capacityValue / monthlyCost : null;
  if (![hoursPerClinician, hoursPerMonth, capacityValue, netModeledValue].every(Number.isFinite) || (costCoverage !== null && !Number.isFinite(costCoverage))) throw new Error('Inputs are too large');
  return { hoursPerClinician, hoursPerMonth, capacityValue, netModeledValue, costCoverage };
}