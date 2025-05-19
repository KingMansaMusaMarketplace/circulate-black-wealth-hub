
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  getBusinessVerificationStatus, 
  submitVerificationRequest, 
  uploadVerificationDocument 
} from '@/lib/api/verification-api';
import { BusinessVerification } from '@/lib/types/verification';

export const useVerification = (businessId?: string, userId?: string) => {
  const [verificationStatus, setVerificationStatus] = useState<BusinessVerification | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch current verification status
  const fetchVerificationStatus = async () => {
    if (!businessId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const status = await getBusinessVerificationStatus(businessId);
      setVerificationStatus(status);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch verification status');
    } finally {
      setIsLoading(false);
    }
  };

  // Upload document
  const uploadDocument = async (
    file: File,
    documentType: 'registration' | 'ownership' | 'address'
  ) => {
    if (!businessId || !userId) {
      setError('Missing business or user information');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await uploadVerificationDocument(file, businessId, userId, documentType);
      if ('error' in result) {
        setError(result.error);
        return null;
      }
      return result.url;
    } catch (err: any) {
      setError(err.message || 'Failed to upload document');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Submit verification request
  const submitVerification = async (
    ownershipPercentage: number,
    registrationDocUrl: string,
    ownershipDocUrl: string,
    addressDocUrl: string
  ) => {
    if (!businessId) {
      setError('Missing business information');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await submitVerificationRequest(
        businessId,
        ownershipPercentage,
        registrationDocUrl,
        ownershipDocUrl,
        addressDocUrl
      );

      if (!result.success) {
        setError(result.error || 'Failed to submit verification');
        return false;
      }

      await fetchVerificationStatus();
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to submit verification');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Listen for verification status changes
  useEffect(() => {
    if (!businessId) return;

    fetchVerificationStatus();

    // Subscribe to changes for real-time updates
    const channel = supabase
      .channel('verification-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'business_verifications',
          filter: `business_id=eq.${businessId}`
        },
        (payload) => {
          fetchVerificationStatus();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [businessId]);

  return {
    verificationStatus,
    isLoading,
    error,
    uploadDocument,
    submitVerification,
    refreshStatus: fetchVerificationStatus
  };
};

// Admin hook for managing verifications
export const useVerificationAdmin = () => {
  // Admin-specific functionality could be added here
  // This is a placeholder for future admin functionality
  return {};
};
