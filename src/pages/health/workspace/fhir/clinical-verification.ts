import { supabase } from '@/integrations/supabase/client';

export type VerifiedClinic = { id: string; name: string; role: string };
export type ClinicalVerification = {
  status: 'verified' | 'signed-out' | 'no-access' | 'failed';
  userId: string | null;
  checkedAt: string | null;
  clinics: VerifiedClinic[];
};
export const EMPTY_VERIFICATION: ClinicalVerification = { status: 'signed-out', userId: null, checkedAt: null, clinics: [] };

/** Hosted Auth validation plus existing RLS preview/member checks. Never map registry/sample IDs to clinic IDs. */
export async function verifyClinicalFacilities(): Promise<ClinicalVerification> {
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError) throw new Error('Clinical sign-in could not be verified.');
  if (!auth.user) return EMPTY_VERIFICATION;
  const userId = auth.user.id;
  const { data, error } = await supabase.from('hc_members')
    .select('clinic_id, role, hc_clinics(id, name)').eq('user_id', userId);
  if (error) throw new Error('Clinical facility permission could not be verified.');
  // Do not publish a membership result if the account changed during the request.
  const { data: confirmed, error: confirmError } = await supabase.auth.getUser();
  if (confirmError || confirmed.user?.id !== userId) throw new Error('Clinical sign-in changed during verification.');
  const clinics: VerifiedClinic[] = [];
  for (const row of data ?? []) {
    const clinic = Array.isArray(row.hc_clinics) ? row.hc_clinics[0] : row.hc_clinics;
    if (clinic && typeof clinic.id === 'string' && typeof clinic.name === 'string' && clinic.id === row.clinic_id && typeof row.role === 'string') {
      clinics.push({ id: clinic.id, name: clinic.name, role: row.role });
    }
  }
  return { status: clinics.length ? 'verified' : 'no-access', userId, checkedAt: new Date().toISOString(), clinics };
}