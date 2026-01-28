/**
 * Free period configuration for the platform
 * All businesses get free access until this date OR 100,000 founding members
 */
export const FREE_PERIOD_END_DATE = new Date('2026-09-01T23:59:59Z');
export const FOUNDING_MEMBER_CAP = 100000;

export const isInFreePeriod = (): boolean => {
  return new Date() < FREE_PERIOD_END_DATE;
};

export const getFreePeriodEndDateString = (): string => {
  return 'September 1, 2026';
};

export const getFoundingMemberDeadlineMessage = (): string => {
  return 'September 1, 2026 — or 100,000 Founding Members, whichever comes first';
};

export const getFoundingMemberDeadlineShort = (): string => {
  return 'Sept 1, 2026 or 100K members';
};
