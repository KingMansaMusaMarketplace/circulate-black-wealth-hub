import { db } from './hc';
import { supabase } from '@/integrations/supabase/client';

/** Ownership is assigned by hc_create_clinic from the validated caller, never by the form. */
export async function registerSampleClinic(name: string, specialty: string) {
  const cleanName = name.trim();
  if (cleanName.length < 2 || cleanName.length > 120) throw new Error('Enter a clinic name between 2 and 120 characters.');
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError || !auth.user) throw new Error('Please sign in again before creating your clinic.');
  const { data: clinicId, error } = await db.rpc('hc_create_clinic', { _name: cleanName, _specialty: specialty.trim() || null });
  if (error) throw new Error(error.message);
  if (typeof clinicId !== 'string' || !clinicId) throw new Error('Clinic creation could not be confirmed. Refresh before trying again.');
  return clinicId;
}