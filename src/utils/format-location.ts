const PLACEHOLDERS = new Set([
  '',
  '-',
  '--',
  '.',
  'unknown',
  'n/a',
  'na',
  'n.a.',
  'none',
  'null',
  'undefined',
  'not available',
  'no address',
  'tbd',
]);

/** Returns a clean value, or undefined when the value is blank/placeholder text. */
export const cleanField = (value?: string | null): string | undefined => {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (PLACEHOLDERS.has(trimmed.toLowerCase())) return undefined;
  return trimmed;
};

/**
 * Builds a human-readable location line.
 * Falls back to "City, State" (then country) when no real street address exists.
 * Returns an empty string when there is nothing meaningful to show.
 */
export const formatBusinessLocation = (
  address?: string | null,
  city?: string | null,
  state?: string | null,
  country?: string | null
): string => {
  const parts = [cleanField(address), cleanField(city), cleanField(state)].filter(Boolean) as string[];
  if (parts.length > 0) return parts.join(', ');
  const fallbackCountry = cleanField(country);
  return fallbackCountry ?? '';
};
