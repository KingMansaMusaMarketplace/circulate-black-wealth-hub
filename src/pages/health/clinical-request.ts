/** Carries proof to the server; these values never establish permission in the browser. */
export function clinicalRequestHeaders(): Record<string, string> {
  try {
    if (localStorage.getItem('hc_preview_session_closed')) return {};
    const token = localStorage.getItem('hc_preview_access');
    const device = localStorage.getItem('hc_preview_device');
    if (!token || !device) return {};
    return { 'x-hc-preview-token': token, 'x-hc-preview-device': device };
  } catch { return {}; }
}