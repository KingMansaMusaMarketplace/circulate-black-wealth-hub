// "New message" email alerts for clinic team messages. The email never contains the message, patient or chart details,
// because ordinary email is not a protected channel for health information.
import { clinicalEmailTheme, escapeHtml } from './confirmation.ts';

/** At most one alert email per person in this window, however many messages arrive. */
export const ALERT_THROTTLE_MINUTES = 30;
/** Alerts are only sent for a message saved within this many minutes. */
export const ALERT_FRESH_MINUTES = 10;
export const ALERT_MAX_RECIPIENTS = 25;

export const alertDue = (lastSentAt: string | null | undefined, now: Date) =>
  !lastSentAt || now.getTime() - Date.parse(lastSentAt) >= ALERT_THROTTLE_MINUTES * 60000;

export function teamAlertEmail(clinic: string) {
  const theme = clinicalEmailTheme;
  const link = 'https://health.1325.ai/health/app';
  const lines = [
    `A teammate at ${clinic} sent you a message in 1325 Clinical EMR / EHR.`,
    'For privacy, the message is only shown inside the app. Open your workspace and press the bell at the top to read it.',
  ];
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>1325 Clinical EMR / EHR | New team message</title></head><body style="margin:0;background:${theme.background};font-family:Arial,Helvetica,sans-serif;line-height:1.5">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${theme.background}"><tr><td align="center" style="padding:28px 12px">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:${theme.navy};border:1px solid ${theme.border};border-top:4px solid ${theme.gold}">
  <tr><td style="padding:28px 24px"><img src="https://1325.ai/email/1325-logo.jpg" width="72" alt="1325.AI" style="display:block;width:72px;height:auto;border:0;margin-bottom:16px"><h1 style="margin:0 0 16px;font-size:24px;color:${theme.foreground}">You have a new team message</h1>
  <p style="margin:0 0 12px;font-size:15px;color:${theme.foreground}">${escapeHtml(lines[0])}</p><p style="margin:0 0 20px;font-size:15px;color:${theme.muted}">${escapeHtml(lines[1])}</p>
  <table role="presentation" cellspacing="0" cellpadding="0"><tr><td bgcolor="${theme.gold}" style="border-radius:6px"><a href="${link}" style="display:inline-block;padding:13px 20px;color:${theme.navy};font-size:15px;font-weight:700;text-decoration:none">Open 1325 Clinical</a></td></tr></table></td></tr>
  <tr><td style="padding:16px 24px;border-top:1px solid ${theme.border};font-size:11px;color:${theme.muted}"><strong style="color:${theme.gold}">PRIVATE &amp; CONFIDENTIAL</strong><br>1325.AI</td></tr>
  </table></td></tr></table></body></html>`;
  return { subject: 'New team message in 1325 Clinical', text: `${lines.join('\n\n')}\n\nOpen 1325 Clinical: ${link}\n\n1325.AI`, html };
}
