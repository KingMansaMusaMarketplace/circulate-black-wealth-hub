/** Opening email links never changes state. Submission carries a same-origin form nonce. */
export function decisionCookieName(id: string, action: string): string {
  if (!/^[0-9a-f-]{36}$/.test(id) || !['approve', 'deny', 'revoke'].includes(action)) throw new Error('Invalid decision scope');
  return `hc_decision_${id.replaceAll('-', '')}_${action}`;
}
export function validDecisionSubmission(req: Request, nonce: string): boolean {
  const url = new URL(req.url);
  let name: string;
  try { name = decisionCookieName(url.searchParams.get('id') ?? '', url.searchParams.get('d') ?? ''); } catch { return false; }
  const cookie = (req.headers.get('cookie') ?? '').split(';').map(value => value.trim()).find(value => value.startsWith(`${name}=`))?.slice(name.length + 1);
  return req.method === 'POST' && req.headers.get('origin') === new URL(req.url).origin
    && /^[a-f0-9]{48}$/.test(nonce) && cookie === nonce;
}