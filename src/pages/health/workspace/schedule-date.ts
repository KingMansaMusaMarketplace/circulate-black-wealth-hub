import { format, isValid, parseISO } from 'date-fns';

export function scheduleDay(value: string): string {
  const date = parseISO(value);
  return isValid(date) ? format(date, 'EEEE, MMM d, yyyy') : 'Date unavailable';
}