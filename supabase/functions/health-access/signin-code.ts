import { CLINICAL_OWNER_EMAIL } from './email-routing.ts';
import { clinicalEmailTheme, escapeHtml as esc } from './confirmation.ts';

/** Emailed sign-in codes for approved clinical guests: 6 digits, 10 minutes, single use, 5 tries. */
export const CODE_MINUTES = 10;
export const MAX_ATTEMPTS = 5;
export const MAX_SENDS_PER_HOUR = 5;
export const RESEND_WAIT_SECONDS = 45;

export function newSigninCode(random: (n: number) => Uint8Array = (n) => crypto.getRandomValues(new Uint8Array(n))) {
  // Rejection sampling keeps every 6-digit code equally likely.
  for (;;) {
    const b = random(4);
    const v = ((b[0] << 24) >>> 0) + (b[1] << 16) + (b[2] << 8) + b[3];
    if (v < 4294000000) return String(v % 1000000).padStart(6, '0');
  }
}

export const isSigninCode = (code: unknown): code is string => typeof code === 'string' && /^[0-9]{6}$/.test(code);

export async function hashSigninCode(secret: string, requestId: string, code: string) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${requestId}:${code}`));
  return Array.from(new Uint8Array(sig), (x) => x.toString(16).padStart(2, '0')).join('');
}

export function sameHash(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** Decide whether another code may be sent, given recent send times (newest first). */
export function sendAllowed(recent: Date[], now: Date) {
  const hourAgo = now.getTime() - 3600_000;
  const lastHour = recent.filter((d) => d.getTime() > hourAgo);
  if (lastHour.length >= MAX_SENDS_PER_HOUR) return { ok: false as const, reason: 'too_many' as const };
  if (lastHour[0] && now.getTime() - lastHour[0].getTime() < RESEND_WAIT_SECONDS * 1000) return { ok: false as const, reason: 'wait' as const };
  return { ok: true as const };
}

export function signinCodeEmail(name: string, code: string) {
  const t = clinicalEmailTheme;
  const text = [
    `Hello ${name},`,
    `Your 1325 Clinical EMR / EHR sign-in code is: ${code}`,
    `Type it into the sign-in box. It works once and expires in ${CODE_MINUTES} minutes.`,
    "Didn't ask for this? Ignore this email. No one can sign in without the code.",
    'Private preview · sample data only. Do not enter patient information.',
    `Thomas\n1325.AI\n${CLINICAL_OWNER_EMAIL}`,
  ].join('\n\n');
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Your sign-in code | 1325 Clinical EMR / EHR</title></head>
<body style="margin:0;background:${t.background};font-family:Arial,Helvetica,sans-serif;line-height:1.5">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${t.background}"><tr><td align="center" style="padding:28px 12px">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;background:${t.navy};border:1px solid ${t.border};border-top:4px solid ${t.gold}">
<tr><td style="padding:24px;border-bottom:1px solid ${t.border}"><img src="https://1325.ai/email/1325-logo.jpg" width="72" alt="1325.AI" style="display:block;width:72px;height:auto;border:0;margin-bottom:12px"><div style="font-size:20px;font-weight:700;color:${t.foreground}">1325 Clinical EMR / EHR</div></td></tr>
<tr><td style="padding:28px 24px;color:${t.foreground}">
<p style="margin:0 0 12px;font-size:16px">Hello ${esc(name)},</p>
<p style="margin:0 0 16px;font-size:15px;color:${t.muted}">Your sign-in code is:</p>
<div style="font-size:36px;font-weight:700;letter-spacing:8px;color:${t.gold};margin:0 0 20px">${code}</div>
<p style="margin:0 0 16px;font-size:14px;color:${t.muted}">Type it into the sign-in box. It works once and expires in ${CODE_MINUTES} minutes.</p>
<p style="margin:0 0 16px;font-size:13px;color:${t.muted}">Didn't ask for this? Ignore this email. No one can sign in without the code.</p>
<p style="margin:0 0 20px;font-size:13px;color:${t.muted}">Private preview · sample data only. Do not enter patient information.</p>
<p style="margin:0;font-size:15px"><strong>Thomas</strong><br>1325.AI<br><a href="mailto:${CLINICAL_OWNER_EMAIL}" style="color:${t.gold};text-decoration:none">${CLINICAL_OWNER_EMAIL}</a></p>
</td></tr></table></td></tr></table></body></html>`;
  return { subject: 'Your 1325 Clinical sign-in code', text, html };
}
