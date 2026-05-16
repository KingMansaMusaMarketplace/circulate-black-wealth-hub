import { supabase } from '@/integrations/supabase/client';

export type DriverApplicationStatus =
  | 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'suspended';

export type DriverDocumentType =
  | 'license_front' | 'license_back' | 'selfie'
  | 'insurance' | 'registration'
  | 'vehicle_front' | 'vehicle_back' | 'vehicle_left' | 'vehicle_right' | 'vehicle_interior'
  | 'w9' | 'vehicle_inspection';

export type DocumentReviewStatus = 'pending' | 'approved' | 'rejected';

export const DOCUMENT_LABELS: Record<DriverDocumentType, string> = {
  license_front: "Driver's License (Front)",
  license_back: "Driver's License (Back)",
  selfie: 'Selfie with ID',
  insurance: 'Proof of Insurance',
  registration: 'Vehicle Registration',
  vehicle_front: 'Vehicle Photo — Front',
  vehicle_back: 'Vehicle Photo — Back',
  vehicle_left: 'Vehicle Photo — Left',
  vehicle_right: 'Vehicle Photo — Right',
  vehicle_interior: 'Vehicle Photo — Interior',
  w9: 'W-9 Tax Form',
  vehicle_inspection: 'Vehicle Inspection Certificate',
};

export const REQUIRED_DOCUMENTS: DriverDocumentType[] = [
  'license_front', 'license_back', 'selfie',
  'insurance', 'registration',
  'vehicle_front', 'vehicle_back', 'vehicle_left', 'vehicle_right', 'vehicle_interior',
];

const BUCKET = 'noir-driver-documents';

export async function uploadDriverDocument(
  userId: string,
  driverId: string,
  documentType: DriverDocumentType,
  file: File,
  expiresAt?: string | null,
) {
  const ext = file.name.split('.').pop() || 'jpg';
  const path = `${userId}/${driverId}/${documentType}-${Date.now()}.${ext}`;

  const { error: uploadErr } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type });
  if (uploadErr) throw uploadErr;

  const { data: signed } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, 60 * 60 * 24 * 365);

  // Remove any prior pending doc of same type
  await (supabase as any)
    .from('noir_driver_documents')
    .delete()
    .eq('driver_id', driverId)
    .eq('document_type', documentType)
    .eq('review_status', 'pending');

  const { data, error } = await (supabase as any)
    .from('noir_driver_documents')
    .insert({
      driver_id: driverId,
      document_type: documentType,
      file_url: signed?.signedUrl || path,
      file_path: path,
      expires_at: expiresAt || null,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getSignedDocUrl(filePath: string) {
  const { data } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(filePath, 60 * 60);
  return data?.signedUrl || null;
}

export async function adminUpdateDriverStatus(
  driverId: string,
  newStatus: DriverApplicationStatus,
  reason?: string,
  adminNotes?: string,
) {
  const { data, error } = await (supabase as any).rpc('admin_update_noir_driver_status', {
    p_driver_id: driverId,
    p_new_status: newStatus,
    p_reason: reason || null,
    p_admin_notes: adminNotes || null,
  });
  if (error) throw error;
  return data;
}

export async function reviewDocument(
  documentId: string,
  status: DocumentReviewStatus,
  notes?: string,
) {
  const { error } = await (supabase as any)
    .from('noir_driver_documents')
    .update({
      review_status: status,
      reviewer_notes: notes || null,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', documentId);
  if (error) throw error;
}

export const STATUS_COLORS: Record<DriverApplicationStatus, string> = {
  draft: 'bg-white/10 text-white/70 border-white/20',
  submitted: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  under_review: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  approved: 'bg-green-500/20 text-green-300 border-green-500/30',
  rejected: 'bg-red-500/20 text-red-300 border-red-500/30',
  suspended: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
};

export const REJECTION_REASONS = [
  'Documents are unclear or illegible — please re-upload high-resolution copies',
  'Driver\'s license expired or about to expire',
  'Insurance does not cover rideshare/commercial use',
  'Vehicle does not meet our age requirements (must be 10 years or newer)',
  'Background check could not be completed',
  'Information on documents does not match the application',
  'Vehicle registration expired',
  'Other — see admin notes',
];
