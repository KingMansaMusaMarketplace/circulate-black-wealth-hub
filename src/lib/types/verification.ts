
export type VerificationStatus = 'pending' | 'approved' | 'rejected';
export type BadgeTier = 'basic' | 'verified' | 'certified' | 'premium';

export interface BusinessVerification {
  id: string;
  business_id: string;
  ownership_percentage?: number;
  registration_document_url?: string;
  ownership_document_url?: string;
  address_document_url?: string;
  identity_document_url?: string;
  business_license_url?: string;
  certification_agreement_accepted?: boolean;
  certification_agreement_date?: string;
  certification_expires_at?: string;
  certificate_number?: string;
  badge_tier?: BadgeTier;
  verification_status: VerificationStatus;
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
  verification_status: VerificationStatus;
  submitted_at: string;
  verified_at?: string;
  certificate_number?: string;
  badge_tier?: BadgeTier;
  certification_expires_at?: string;
}

export interface VerificationCertificate {
  id: string;
  business_id: string;
  verification_id: string;
  certificate_number: string;
  issued_at: string;
  expires_at: string;
  pdf_url?: string;
  embed_code?: string;
  is_active: boolean;
  revoked_at?: string;
  revoked_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface VerificationFormData {
  ownershipPercentage: number;
  ownerLegalName: string;
  registrationDocUrl: string;
  ownershipDocUrl: string;
  addressDocUrl: string;
  identityDocUrl: string;
  businessLicenseUrl?: string;
  certificationAgreementAccepted: boolean;
}

// Rejection reason templates for admins
export const REJECTION_TEMPLATES = [
  {
    id: 'documents_unclear',
    label: 'Documents Unclear',
    reason: 'The submitted documents are unclear or illegible. Please resubmit clearer copies of all required documents.',
  },
  {
    id: 'ownership_not_confirmed',
    label: 'Ownership Not Confirmed',
    reason: 'The submitted documents do not sufficiently verify 51% or greater Black ownership. Please provide additional documentation such as shareholder agreements, operating agreements, or other legal documents showing ownership percentages.',
  },
  {
    id: 'identity_mismatch',
    label: 'Identity Mismatch',
    reason: 'The name on the government-issued ID does not match the name on the business ownership documents. Please ensure all documents reflect the same legal name.',
  },
  {
    id: 'expired_documents',
    label: 'Expired Documents',
    reason: 'One or more submitted documents have expired. Please submit current, valid documentation.',
  },
  {
    id: 'incomplete_submission',
    label: 'Incomplete Submission',
    reason: 'Your verification submission is missing required documents. Please ensure you upload all required documents: government-issued ID, business registration, and ownership verification.',
  },
  {
    id: 'address_verification_failed',
    label: 'Address Verification Failed',
    reason: 'We were unable to verify the business address with the provided documents. Please submit a recent utility bill, lease agreement, or official correspondence showing the business address.',
  },
  {
    id: 'business_not_registered',
    label: 'Business Not Properly Registered',
    reason: 'The business does not appear to be properly registered with state or local authorities. Please provide valid business registration or incorporation documents.',
  },
] as const;
