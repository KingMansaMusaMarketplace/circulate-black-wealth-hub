/**
 * Free period configuration for the platform
 * All businesses get free access until this date
 */
export const FREE_PERIOD_END_DATE = new Date('2026-09-01T23:59:59Z');

export const isInFreePeriod = (): boolean => {
  return new Date() < FREE_PERIOD_END_DATE;
};

export const getFreePeriodEndDateString = (): string => {
  return 'September 1, 2026';
};
