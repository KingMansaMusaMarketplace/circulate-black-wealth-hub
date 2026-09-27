/** Ensure a website value opens as an outside link, not a page inside our app. */
export const externalUrl = (u?: string | null) => {
  const s = (u || '').trim();
  if (!s) return '#';
  return /^[a-z][a-z0-9+.-]*:/i.test(s) ? s : `https://${s.replace(/^\/+/, '')}`;
};
