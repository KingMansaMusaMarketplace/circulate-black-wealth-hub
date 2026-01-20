/**
 * UUID Validation Utilities
 * Prevents database errors from invalid UUIDs reaching Supabase
 */

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Validates if a string is a valid UUID v4 format
 */
export const isValidUUID = (id: string | null | undefined): boolean => {
  if (!id || typeof id !== 'string') return false;
  return UUID_REGEX.test(id.trim());
};

/**
 * Returns the UUID if valid, null otherwise
 * Use this before database queries to prevent "invalid input syntax for type uuid" errors
 */
export const safeUUID = (id: string | null | undefined): string | null => {
  return isValidUUID(id) ? id!.trim() : null;
};

/**
 * Validates UUID and throws a user-friendly error if invalid
 */
export const validateUUID = (id: string | null | undefined, entityName: string = 'item'): string => {
  const safeId = safeUUID(id);
  if (!safeId) {
    throw new Error(`Invalid ${entityName} ID. Please try again or go back.`);
  }
  return safeId;
};

/**
 * Checks if a URL parameter ID is valid before using in queries
 */
export const isValidRouteId = (id: string | undefined): id is string => {
  return isValidUUID(id);
};
