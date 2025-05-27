
export interface BusinessVerification {
  id: string;
  business_id: string;
  ownership_percentage?: number;
  registration_document_url?: string;
  ownership_document_url?: string;
  address_document_url?: string;
  verification_status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
  verified_at?: string;
  verified_by?: string;
  rejection_reason?: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface VerificationQueueItem {
  verification_id: string;
  business_id: string;
  business_name: string;
  business_email: string;
  owner_id: string;
  owner_name?: string;
  ownership_percentage?: number;
  verification_status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
  verified_at?: string;
}
