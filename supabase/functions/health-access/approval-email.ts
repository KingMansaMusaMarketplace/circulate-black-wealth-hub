import { CLINICAL_OWNER_EMAIL, clinicalEmailRouting } from './email-routing.ts';
import { emailWasAccepted } from './confirmation.ts';
const esc = (s: string) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] ?? c));
type Sender = (message: { from: string; to: string[]; reply_to: string; subject: string; text: string; html: string }) => Promise<unknown>;
export async function sendClinicalApproval(send: Sender, visitor: { full_name: string; work_email: string }, access: string, expires: Date) {
  const paragraphs = [
    `Hello ${visitor.full_name},`, 'Thomas approved your request to view 1325 Clinical.',
    `Your link expires ${expires.toUTCString()}. You receive one twenty-minute viewing, starting when you first enter. Refreshing or returning does not restart the timer. After expiry or ending the session, request Thomas’s approval again. Your name, email and date appear in a confidential screen watermark. Use your approved device and do not forward your link.`,
    `If this message reached Spam/Junk, mark it Not Junk and add ${CLINICAL_OWNER_EMAIL} to your contacts.`,
    `Thomas\n1325.AI\n${CLINICAL_OWNER_EMAIL}`,
    'Private and confidential. Do not copy, share or reproduce preview materials. U.S. Provisional Patent Application No. 63/969,202 — 46 claims pending.',
  ];
  const link = `https://health.1325.ai/?access=${access}`;
  return emailWasAccepted(await send({ ...clinicalEmailRouting(visitor.work_email), subject: 'Your private access to 1325 Clinical',
    text: [...paragraphs.slice(0, 2), `Open your preview: ${link}`, ...paragraphs.slice(2)].join('\n\n'),
    html: [...paragraphs.slice(0, 2).map(p => `<p>${esc(p)}</p>`), `<p><a href="${link}">Open your preview</a></p>`, ...paragraphs.slice(2).map(p => `<p>${esc(p).replace(/\n/g, '<br>')}</p>`)].join(''),
  }));
}