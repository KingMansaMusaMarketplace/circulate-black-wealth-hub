/**
 * Verification paperwork rules shared by the owner upload form and admin review.
 * Files live in the private `verification_documents` bucket under `<ownerId>/<businessId>/...`
 * and are only ever opened through short-lived signed links.
 */
export const VERIFICATION_DOC_BUCKET = 'verification_documents';
export const VERIFICATION_DOC_LINK_SECONDS = 300; // 5 minutes
export const VERIFICATION_DOC_MAX_BYTES = 10 * 1024 * 1024; // 10 MB

export type VerificationDocType = 'registration' | 'ownership' | 'address' | 'identity' | 'license';

/** Government IDs are reviewed by people only and are never sent to an AI service. */
const AI_CHECK_BLOCKED: ReadonlySet<VerificationDocType> = new Set(['identity']);

export const isAiCheckAllowed = (type: VerificationDocType): boolean => !AI_CHECK_BLOCKED.has(type);

const ALLOWED_TYPES: Record<string, string> = {
  'application/pdf': 'pdf',
  'image/png': 'png',
  'image/jpeg': 'jpg',
};

export const validateVerificationFile = (file: { type: string; size: number }): string | null => {
  if (!ALLOWED_TYPES[file.type]) return 'Please upload a PDF, PNG or JPG file.';
  if (file.size > VERIFICATION_DOC_MAX_BYTES) return 'Files must be 10 MB or smaller.';
  if (file.size === 0) return 'That file is empty.';
  return null;
};

export const buildVerificationPath = (
  ownerId: string,
  businessId: string,
  type: VerificationDocType,
  mimeType: string,
  now: number = Date.now(),
): string => `${ownerId}/${businessId}/${type}_${now}.${ALLOWED_TYPES[mimeType] ?? 'bin'}`;

/** Only stored bucket paths can be opened; old web addresses are treated as not on file. */
export const isStoredVerificationPath = (value: string | null | undefined): value is string =>
  !!value && !/^[a-z]+:\/\//i.test(value) && !value.includes('..');
