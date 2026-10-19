export function helpGatewayFailure(status: number, payload: unknown) {
  const p = payload && typeof payload === 'object' ? payload as Record<string, unknown> : {};
  const nested = p.error && typeof p.error === 'object' ? p.error as Record<string, unknown> : {};
  const message = typeof p.message === 'string' ? p.message : typeof nested.message === 'string' ? nested.message : typeof p.error === 'string' ? p.error : `Kayla AI request failed (${status}).`;
  return { status, message: message.slice(0, 1500), paused: status === 402 || status === 403 };
}