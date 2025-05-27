
export interface BusinessVerification {
  id: string;
  business_id: string;
  verification_status: 'pending' | 'approved' | 'rejected';
  ownership_percentage?: number;
  registration_document_url?: string;
  ownership_document_url?: string;
  address_document_url?: string;
  admin_notes?: string;
  rejection_reason?: string;
  verified_by?: string;
  verified_at?: string;
  created_at: string;
  updated_at: string;
  submitted_at: string;
}

export interface VerificationQueueItem {
  verification_id: string;
  business_id: string;
  business_name: string;
  business_email: string;
  owner_id: string;
  owner_name: string;
  ownership_percentage: number;
  verification_status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
  verified_at?: string;
}
