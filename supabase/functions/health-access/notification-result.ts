/** A saved request is distinct from the email provider accepting its notification. */
export async function requestNotification(send: () => Promise<{ data?: { id?: string } | null; error?: unknown }>) {
  try { const result = await send(); return !result.error && typeof result.data?.id === 'string' && result.data.id.length > 0; }
  catch { return false; }
}