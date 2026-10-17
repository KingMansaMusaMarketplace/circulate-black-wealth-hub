export const emailWasAccepted = (result: { data?: { id?: string } | null; error?: unknown }) =>
  !result.error && Boolean(result.data?.id);

export const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => {
  const entities: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return entities[character] ?? character;
});

export function confirmationPage(title: string, content: string) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${escapeHtml(title)} | 1325 Clinical</title><style>
  :root{--background:#000;--surface:#003366;--foreground:#fff;--muted:#cbd5e1;--accent:#FFB300;--border:#38516b;--danger:#ffb4ab}
  *{box-sizing:border-box}body{margin:0;background:var(--background);color:var(--foreground);font-family:system-ui,-apple-system,BlinkMacSystemFont,sans-serif;line-height:1.6;letter-spacing:0}main{max-width:660px;margin:8vh auto;padding:32px 24px}header{display:flex;align-items:center;gap:14px;border-bottom:1px solid var(--border);padding-bottom:24px}img{width:56px;height:56px;object-fit:contain}.brand{font-size:24px;font-weight:700}.subtitle,footer{color:var(--muted);font-size:13px}h1{font-size:30px;line-height:1.2;margin:36px 0 20px;color:var(--accent)}p{overflow-wrap:anywhere}dl{border-top:1px solid var(--border);margin:28px 0}dl div{display:grid;grid-template-columns:140px minmax(0,1fr);gap:16px;border-bottom:1px solid var(--border);padding:14px 0}dt{color:var(--muted)}dd{margin:0;overflow-wrap:anywhere}a{color:var(--accent)}.revoke{display:inline-block;border:1px solid var(--danger);color:var(--danger);padding:10px 18px;border-radius:6px;text-decoration:none;margin:8px 0}a:focus-visible{outline:2px solid var(--accent);outline-offset:4px}footer{border-top:1px solid var(--border);margin-top:32px;padding-top:20px}@media(max-width:480px){main{margin:3vh auto;padding:24px 20px}dl div{grid-template-columns:1fr;gap:4px}}
  </style></head><body><main><header><img src="https://1325.ai/email/1325-logo.jpg" alt="1325.AI"><div><div class="brand">1325 Clinical</div><div class="subtitle">Private preview access</div></div></header><h1>${escapeHtml(title)}</h1>${content}<footer>PRIVATE &amp; CONFIDENTIAL<br>1325.AI · Authorized preview only</footer></main></body></html>`;
}

export function approvedContent(name: string, email: string, expires: Date, revoke: string, accepted: boolean) {
  const expiration = new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeStyle: 'short', timeZone: 'America/Chicago' }).format(expires).replace(/[\u202f\u00a0]/g, ' ');
  return `<p>You approved <strong>${escapeHtml(name.trim())}&rsquo;s</strong> private preview access.</p><dl><div><dt>Work email</dt><dd>${escapeHtml(email)}</dd></div><div><dt>Access expires</dt><dd>${escapeHtml(expiration)} (Chicago time)</dd></div><div><dt>Visit limit</dt><dd>45 minutes per visit</dd></div><div><dt>Device access</dt><dd>First device only</dd></div><div><dt>Invitation email</dt><dd>${accepted ? 'Accepted by the email service for sending. Delivery to the inbox is not yet confirmed.' : 'Sending could not be confirmed. Access is approved, but the visitor may not have received their link.'}</dd></div></dl><a class="revoke" href="${escapeHtml(revoke)}">Revoke Access</a><p class="subtitle">You can withdraw this approval using this link or the Revoke button in your original request email.</p>`;
}