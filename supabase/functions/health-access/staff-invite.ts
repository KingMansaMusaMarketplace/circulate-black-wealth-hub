// Doctor-sent staff invitations. Every invite files a normal access request that Thomas must still approve.
import { clinicalEmailTheme, escapeHtml } from './confirmation.ts';

export const INVITE_ROLES = ['doctor', 'nurse', 'front_desk', 'biller'] as const;
export const INVITE_ROLE_LABELS: Record<string, string> = { doctor: 'Doctor', nurse: 'Nurse', front_desk: 'Front desk', biller: 'Biller' };
/** One reminder email per invite per hour, so a Resend button cannot flood someone's inbox. */
export const INVITE_RESEND_MINUTES = 60;
/** Access-request statuses that need a fresh request to 1325 before the person can get in. */
export const NEEDS_NEW_REQUEST: ReadonlySet<string> = new Set(['denied', 'revoked', 'expired']);

export const resendAllowed = (lastEmailedAt: string | null | undefined, now: Date) =>
  !lastEmailedAt || now.getTime() - Date.parse(lastEmailedAt) >= INVITE_RESEND_MINUTES * 60000;

export function staffInviteEmail(details: { full_name: string; inviter: string; clinic: string; role: string; approved: boolean }) {
  const theme = clinicalEmailTheme;
  const role = INVITE_ROLE_LABELS[details.role] ?? details.role;
  const lines = [
    `Hello ${details.full_name},`,
    `${details.inviter} invited you to join ${details.clinic} on 1325 Clinical EMR / EHR as ${role}.`,
    details.approved
      ? '1325.AI has approved your access. Look for the email from "Thomas at 1325.AI" with the subject "Your private access to 1325 Clinical EMR / EHR" and press "Open your preview". After you sign in with this email address, you join the clinic automatically.'
      : '1325.AI is reviewing the request now. When it is approved you will get a second email from "Thomas at 1325.AI" with your private link. After you sign in with this email address, you join the clinic automatically.',
    'Please check your Spam or Junk folder if you do not see it.',
    'This is a private preview with made-up test patients only. Do not enter real patient information.',
  ];
  const p = (s: string, muted = true) => `<p style="margin:0 0 16px;font-size:15px;color:${muted ? theme.muted : theme.foreground}">${escapeHtml(s)}</p>`;
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>1325 Clinical EMR / EHR | Team invitation</title></head><body style="margin:0;background:${theme.background};font-family:Arial,Helvetica,sans-serif;line-height:1.5">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${theme.background}"><tr><td align="center" style="padding:28px 12px">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:${theme.navy};border:1px solid ${theme.border};border-top:4px solid ${theme.gold}">
  <tr><td style="padding:28px 24px 24px;border-bottom:1px solid ${theme.border}"><img src="https://1325.ai/email/1325-logo.jpg" width="88" alt="1325.AI" style="display:block;width:88px;height:auto;border:0;margin-bottom:16px"><div style="font-size:24px;font-weight:700;color:${theme.foreground}">1325 Clinical EMR / EHR</div><div style="font-size:13px;color:${theme.muted}">Team invitation</div></td></tr>
  <tr><td style="padding:28px 24px;overflow-wrap:anywhere;word-break:break-word"><div style="font-size:12px;font-weight:700;color:${theme.gold}">${details.approved ? 'ACCESS APPROVED' : 'WAITING FOR 1325 APPROVAL'}</div><h1 style="margin:10px 0 20px;font-size:26px;line-height:1.2;color:${theme.foreground}">You're invited to join your clinic team</h1>
  ${p(lines[0], false)}${p(lines[1], false)}${p(lines[2])}<p style="margin:0 0 16px;font-size:15px;font-weight:700;color:${theme.gold}">${escapeHtml(lines[3])}</p>${p(lines[4])}
  <p style="margin:0;font-size:15px;color:${theme.foreground}"><strong>Thomas</strong><br>1325.AI</p></td></tr>
  <tr><td style="padding:20px 24px;border-top:1px solid ${theme.border};font-size:11px;color:${theme.muted}"><strong style="color:${theme.gold}">PRIVATE &amp; CONFIDENTIAL</strong><br>This invitation is for ${escapeHtml(details.full_name)} only. Do not forward.</td></tr>
  </table></td></tr></table></body></html>`;
  return { subject: `${details.inviter} invited you to 1325 Clinical EMR / EHR`, text: [...lines, 'Thomas\n1325.AI'].join('\n\n'), html };
}
