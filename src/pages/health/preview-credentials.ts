/** Browser-held private-viewing pass. Never grants access by itself: the server re-verifies it on every use. */
export const PREVIEW_TOKEN_KEY = 'hc_preview_access';
export const PREVIEW_DEVICE_KEY = 'hc_preview_device';

export function previewDeviceId(storage: Storage = localStorage) {
  let d = storage.getItem(PREVIEW_DEVICE_KEY);
  if (!d || !/^[a-f0-9]{32}$/.test(d)) {
    d = Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, '0')).join('');
    storage.setItem(PREVIEW_DEVICE_KEY, d);
  }
  return d;
}

/** The current visitor pass, if this browser holds one (admins usually do not). */
export function readPreviewPass(storage: Storage = localStorage) {
  const token = storage.getItem(PREVIEW_TOKEN_KEY);
  if (!token || !/^[a-f0-9]{48}$/.test(token)) return null;
  return { token, device: previewDeviceId(storage) };
}

/** Plain-English messages for emailed sign-in code problems reported by the server. */
export function signinCodeMessage(reason: unknown, triesLeft?: unknown) {
  switch (reason) {
    case 'wrong': return typeof triesLeft === 'number' ? `That code doesn't match. ${triesLeft} ${triesLeft === 1 ? 'try' : 'tries'} left.` : "That code doesn't match. Check the newest email and try again.";
    case 'expired': return 'That code has expired or was already used. Send yourself a new code.';
    case 'locked': return 'Too many wrong tries. Send yourself a new code.';
    case 'wait': return 'A code was just sent. Wait a minute, then try again.';
    case 'too_many': return 'Too many codes sent this hour. Please wait, or use your password.';
    case 'not_approved': return 'Your private viewing is no longer active, so a code cannot be sent.';
    case 'not_sent': return "We couldn't confirm the email was sent. Please try again.";
    default: return 'Something went wrong. Please try again.';
  }
}
