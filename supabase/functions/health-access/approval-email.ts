import { CLINICAL_OWNER_EMAIL, clinicalEmailRouting } from './email-routing.ts';
import { clinicalEmailTheme, emailWasAccepted } from './confirmation.ts';
import { viewingMinutes } from './viewing-duration.ts';
const esc = (s: string) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] ?? c));
type Sender = (message: { from: string; to: string[]; reply_to: string; subject: string; text: string; html: string }) => Promise<{ data?: { id?: string } | null; error?: unknown }>;
export async function sendClinicalApproval(send: Sender, visitor: { full_name: string; work_email: string; viewing_duration_minutes?: number }, access: string, expires: Date) {
  const duration = viewingMinutes(visitor) === 60 ? 'sixty' : 'forty';
  const paragraphs = [
    `Hello ${visitor.full_name},`, 'Thomas approved your request to view 1325 Clinical EMR / EHR.',
    `Your link expires ${expires.toUTCString()}. You receive one ${duration}-minute viewing, starting when you first enter. Refreshing or returning does not restart the timer. After expiry or ending the session, request Thomas’s approval again. Your name, email and date appear in a confidential screen watermark. Use your approved device and do not forward your link. Private preview · sample data only. Do not enter patient information.`,
    `If this message reached Spam/Junk, mark it Not Junk and add ${CLINICAL_OWNER_EMAIL} to your contacts.`,
    `Thomas\n1325.AI\n${CLINICAL_OWNER_EMAIL}`,
    'Private and confidential. Do not copy, share or reproduce preview materials. U.S. Provisional Patent Application No. 63/969,202 — 46 claims pending.',
  ];
  const link = `https://health.1325.ai/?access=${encodeURIComponent(access)}`;
  const theme = clinicalEmailTheme;
  const expiration = new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeStyle: 'short', timeZone: 'America/Chicago' }).format(expires).replace(/[\u202f\u00a0]/g, ' ');
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Your private access | 1325 Clinical EMR / EHR</title></head>
  <body style="margin:0;background:${theme.background};font-family:Arial,Helvetica,sans-serif;line-height:1.5;letter-spacing:0">
  <div style="display:none;max-height:0;overflow:hidden">Thomas approved your private 1325 Clinical EMR / EHR preview. Your ${duration} minutes begin when you first enter.</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${theme.background}"><tr><td align="center" style="padding:28px 12px">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:${theme.navy};border:1px solid ${theme.border};border-top:4px solid ${theme.gold}">
  <tr><td style="padding:28px 24px 24px;border-bottom:1px solid ${theme.border}"><img src="https://1325.ai/email/1325-logo.jpg" width="88" alt="1325.AI" style="display:block;width:88px;height:auto;border:0;margin-bottom:16px"><div style="font-size:24px;font-weight:700;color:${theme.foreground}">1325 Clinical EMR / EHR</div><div style="font-size:13px;color:${theme.muted}">Enterprise Edition &middot; by 1325.AI</div></td></tr>
  <tr><td style="padding:28px 24px;color:${theme.foreground};overflow-wrap:anywhere;word-break:break-word">
  <div style="font-size:12px;font-weight:700;color:${theme.gold}">PRIVATE PREVIEW &middot; ACCESS APPROVED</div>
  <h1 style="margin:10px 0 24px;font-size:28px;line-height:1.2;color:${theme.foreground}">Your private preview is ready</h1>
  <p style="margin:0 0 12px;font-size:16px">${esc(paragraphs[0])}</p><p style="margin:0 0 24px;font-size:15px;color:${theme.muted}">${esc(paragraphs[1])}</p>
  <table role="presentation" cellspacing="0" cellpadding="0"><tr><td bgcolor="${theme.gold}" style="border-radius:6px;text-align:center"><a href="${esc(link)}" style="display:inline-block;padding:14px 24px;font-size:16px;font-weight:700;color:${theme.navy};text-decoration:none">Open your preview</a></td></tr></table>
  <p style="margin:24px 0 8px;font-size:15px;font-weight:700;color:${theme.gold}">Your ${duration}-minute private viewing</p>
  <p style="margin:0 0 16px;font-size:14px;color:${theme.muted}">Private preview · sample data only. Do not enter patient information.</p>
  <p style="margin:0 0 16px;font-size:14px;color:${theme.muted}">Your viewing starts when you first enter. Refreshing or returning does not restart the timer. After expiry or ending the session, request Thomas’s approval again.</p>
  <p style="margin:0 0 16px;font-size:14px;color:${theme.muted}"><strong style="color:${theme.foreground}">Unused link expires:</strong><br>${esc(expiration)} (Chicago time)</p>
  <p style="margin:0 0 24px;font-size:14px;color:${theme.muted}">Your name, email and date appear in a confidential screen watermark. Use your approved device and do not forward your link.</p>
  <p style="margin:0 0 24px;font-size:12px;color:${theme.muted}">If the button does not open, use your private link:<br><a href="${esc(link)}" style="color:${theme.gold};overflow-wrap:anywhere;word-break:break-all">${esc(link)}</a></p>
  <p style="margin:0 0 24px;font-size:13px;color:${theme.muted}">${esc(paragraphs[3])}</p>
  <p style="margin:0;font-size:15px;color:${theme.foreground}"><strong>Thomas</strong><br>1325.AI<br><a href="mailto:${CLINICAL_OWNER_EMAIL}" style="color:${theme.gold};text-decoration:none">${CLINICAL_OWNER_EMAIL}</a></p>
  </td></tr><tr><td style="padding:20px 24px;border-top:1px solid ${theme.border};color:${theme.muted};font-size:11px;overflow-wrap:anywhere"><strong style="color:${theme.gold}">PRIVATE &amp; CONFIDENTIAL</strong><p style="margin:8px 0 0">${esc(paragraphs[5])}</p></td></tr>
  </table></td></tr></table></body></html>`;
  return emailWasAccepted(await send({ ...clinicalEmailRouting(visitor.work_email), subject: 'Your private access to 1325 Clinical EMR / EHR',
    text: [...paragraphs.slice(0, 2), `Open your preview: ${link}`, ...paragraphs.slice(2)].join('\n\n'),
    html,
  }));
}