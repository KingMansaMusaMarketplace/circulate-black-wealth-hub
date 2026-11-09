// Hides placeholder contact details (fictional 555-01xx phones, example.com sites)
// on screen only; saved listing data is never changed.
export function displayPhone(phone?: string | null): string {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '').replace(/^1(?=\d{10}$)/, '');
  if (/^\d{3}55501\d{2}$/.test(digits)) return '';
  return phone;
}

export function displayWebsite(website?: string | null): string {
  if (!website) return '';
  if (/(^|[/.@])example\.(com|org|net)\b/i.test(website)) return '';
  return website;
}
