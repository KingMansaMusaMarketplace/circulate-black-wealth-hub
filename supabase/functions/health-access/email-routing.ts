/** Clinical-only routing; marketplace and shared authentication emails are unchanged. */
export const CLINICAL_OWNER_EMAIL = 'Thomas@1325.ai';
export const CLINICAL_FROM = `"Thomas at 1325.AI" <${CLINICAL_OWNER_EMAIL}>`;

export function clinicalEmailRouting(visitorEmail?: string) {
  return {
    from: CLINICAL_FROM,
    to: [visitorEmail ?? CLINICAL_OWNER_EMAIL],
    reply_to: CLINICAL_OWNER_EMAIL,
  };
}