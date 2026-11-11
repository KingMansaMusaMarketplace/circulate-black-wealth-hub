// Daily cap on new access requests per email, to stop form spam.
// Pilot testers helping the owner are exempt; every request still needs owner approval.
export const DAILY_REQUEST_LIMIT = 3;

export const LIMIT_EXEMPT_EMAILS: ReadonlySet<string> = new Set([
  'chefmaurice420@gmail.com', // Maurice G. Howard, pilot tester (owner request Nov 11 2026)
  'mauricehoward001@gmail.com',
]);

export function overDailyLimit(email: string, countLast24h: number): boolean {
  if (LIMIT_EXEMPT_EMAILS.has(email.trim().toLowerCase())) return false;
  return countLast24h >= DAILY_REQUEST_LIMIT;
}
