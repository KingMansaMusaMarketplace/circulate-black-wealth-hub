/** Opening email links never changes state. Submission carries a same-origin form nonce. */
export function validDecisionSubmission(req: Request, nonce: string): boolean {
  const cookie = (req.headers.get('cookie') ?? '').split(';').map(value => value.trim()).find(value => value.startsWith('hc_decision_nonce='))?.slice('hc_decision_nonce='.length);
  return req.method === 'POST' && req.headers.get('origin') === new URL(req.url).origin
    && /^[a-f0-9]{48}$/.test(nonce) && cookie === nonce;
}