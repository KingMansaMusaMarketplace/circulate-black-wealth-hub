
export interface BusinessVerification {
  id: string;
  business_id: string;
  verification_status: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string | null;
  admin_notes?: string | null;
  ownership_percentage?: number | null;
  registration_document_url?: string | null;
  ownership_document_url?: string | null;
  address_document_url?: string | null;
  submitted_at: string;
  verified_at?: string | null;
  verified_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface VerificationQueueItem {
  verification_id: string;
  business_id: string;
  verification_status: 'pending' | 'approved' | 'rejected';
  ownership_percentage?: number | null;
  submitted_at: string;
  verified_at?: string | null;
  business_name: string;
  owner_id: string;
  owner_name?: string | null;
  business_email?: string | null;
}
