/** Signed, expiring links for approve/deny buttons in admin emails. Opening a link never changes anything; the confirmation page must POST it back. */
export type EmailDecisionKind = 'investor' | 'business';
export type EmailDecision = 'approve' | 'deny';
const enc = new TextEncoder();
const hex = (b: ArrayBuffer) => Array.from(new Uint8Array(b), x => x.toString(16).padStart(2, '0')).join('');

async function sign(secret: string, payload: string) {
  const key = await crypto.subtle.importKey('raw', enc.encode(`email-decision:${secret}`), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return hex(await crypto.subtle.sign('HMAC', key, enc.encode(payload)));
}

export async function createDecisionToken(secret: string, kind: EmailDecisionKind, id: string, decision: EmailDecision, now = Date.now(), days = 14) {
  const exp = Math.floor(now / 1000) + days * 86400;
  return `${exp}.${await sign(secret, `${kind}|${id}|${decision}|${exp}`)}`;
}

export async function verifyDecisionToken(secret: string, kind: string, id: string, decision: string, token: string, now = Date.now()) {
  const m = /^(\d{10})\.([a-f0-9]{64})$/.exec(token ?? '');
  if (!m || !secret) return false;
  if (Number(m[1]) * 1000 < now) return false;
  const expected = await sign(secret, `${kind}|${id}|${decision}|${m[1]}`);
  let diff = 0;
  for (let i = 0; i < 64; i++) diff |= expected.charCodeAt(i) ^ m[2].charCodeAt(i);
  return diff === 0;
}

export async function decisionLinks(secret: string, kind: EmailDecisionKind, id: string) {
  const link = async (d: EmailDecision) => `https://1325.ai/email-decision?k=${kind}&id=${id}&d=${d}&t=${await createDecisionToken(secret, kind, id, d)}`;
  return { approve: await link('approve'), deny: await link('deny') };
}

export function decisionButtonsHtml(links: { approve: string; deny: string }, approveLabel = 'Approve', denyLabel = 'Decline') {
  return `<table role="presentation" cellspacing="0" cellpadding="0" style="margin:20px 0"><tr><td bgcolor="#FFB300" style="border-radius:6px"><a href="${links.approve}" style="display:inline-block;padding:14px 22px;color:#003366;font-weight:700;text-decoration:none;font-size:16px">${approveLabel}</a></td><td style="width:12px"></td><td style="border:1px solid #888;border-radius:6px"><a href="${links.deny}" style="display:inline-block;padding:13px 20px;color:#333;font-weight:700;text-decoration:none;font-size:16px">${denyLabel}</a></td></tr></table><p style="font-size:12px;color:#666">Works from your phone. You'll see one confirmation screen before anything changes. Links expire in 14 days.</p>`;
}
