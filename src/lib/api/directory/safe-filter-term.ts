/**
 * Makes a user-typed search term safe to place inside a PostgREST `.or()` filter.
 * Characters that carry filter syntax (commas, parentheses, dots, colons, quotes,
 * wildcards, backslashes) are replaced with spaces so a visitor can't add extra filters.
 */
export function safeFilterTerm(raw: unknown, maxLen = 100): string {
  return String(raw ?? '')
    .slice(0, maxLen)
    .replace(/[,()."':*%\\]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
