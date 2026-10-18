import type { SupabaseClient } from 'npm:@supabase/supabase-js@2';

/** User is authenticated separately. Never accept an owner ID or client admin assertion. */
export async function authorizeClinicalPreview(service: SupabaseClient, req: Request, user: { id: string; email?: string }): Promise<boolean> {
  const { data: admin, error: adminError } = await service.rpc('has_role', { _user_id: user.id, _role: 'admin' });
  if (!adminError && admin === true) return true;
  const token = req.headers.get('x-hc-preview-token');
  const device = req.headers.get('x-hc-preview-device');
  if (!token || !device || !/^[a-f0-9]{48}$/.test(token) || !/^[a-f0-9]{32}$/.test(device) || !user.email) return false;
  // Do not consume/start a viewing through a clinical operation. Entry happens at the gate only.
  const { data: grant, error } = await service.from('hc_access_requests')
    .select('work_email,viewing_expires_at').eq('access_token', token).eq('device_id', device)
    .eq('status', 'approved').not('first_entered_at', 'is', null).maybeSingle();
  return !error && Boolean(grant && grant.work_email.toLowerCase() === user.email.toLowerCase()
    && Date.parse(grant.viewing_expires_at) > Date.now());
}