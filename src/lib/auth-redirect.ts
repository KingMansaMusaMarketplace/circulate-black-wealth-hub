/** Reads a same-site return path from ?redirect= or ?next=; rejects anything that could leave the site. */
export const getSafeRedirect = (search: string = typeof window !== 'undefined' ? window.location.search : ''): string | null => {
  const p = new URLSearchParams(search);
  const v = p.get('redirect') || p.get('next');
  if (!v || !v.startsWith('/') || v.startsWith('//') || v.startsWith('/\\')) return null;
  return v;
};

/** Same password rules on every sign-up form. */
export const passwordProblems = (pwd: string): string[] => {
  const out: string[] = [];
  if (pwd.length < 8) out.push('at least 8 characters');
  if (!/[A-Z]/.test(pwd)) out.push('an uppercase letter');
  if (!/[a-z]/.test(pwd)) out.push('a lowercase letter');
  if (!/[0-9]/.test(pwd)) out.push('a number');
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) out.push('a special character');
  return out;
};
