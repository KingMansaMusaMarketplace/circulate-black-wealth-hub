
import { supabase } from '@/lib/supabase';
import { BusinessVerification, VerificationQueueItem } from '@/lib/types/verification';
import { toast } from 'sonner';

export const getBusinessVerification = async (businessId: string): Promise<BusinessVerification | null> => {
  try {
    const { data, error } = await supabase
      .from('business_verifications')
      .select('*')
      .eq('business_id', businessId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    // Type assertion with proper verification status
    return {
      ...data,
      verification_status: data.verification_status as 'pending' | 'approved' | 'rejected'
    } as BusinessVerification;
  } catch (error: any) {
    console.error('Error fetching business verification:', error);
    return null;
  }
};

export const getBusinessVerificationStatus = async (businessId: string): Promise<BusinessVerification | null> => {
  return getBusinessVerification(businessId);
};

export const createBusinessVerification = async (
  businessId: string,
  verificationData: Omit<BusinessVerification, 'id' | 'created_at' | 'updated_at' | 'verification_status' | 'submitted_at'>
): Promise<{ success: boolean; verification?: BusinessVerification; error?: any }> => {
  try {
    const { data, error } = await supabase
      .from('business_verifications')
      .insert({
        business_id: businessId,
        ...verificationData,
        verification_status: 'pending',
        submitted_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    // Type assertion with proper verification status
    const verification: BusinessVerification = {
      ...data,
      verification_status: data.verification_status as 'pending' | 'approved' | 'rejected'
    };

    toast.success('Verification request submitted successfully!');
    return { success: true, verification };
  } catch (error: any) {
    console.error('Error creating business verification:', error);
    toast.error('Failed to submit verification request: ' + error.message);
    return { success: false, error };
  }
};

export const submitVerificationRequest = async (
  businessId: string,
  ownershipPercentage: number,
  registrationDocUrl: string,
  ownershipDocUrl: string,
  addressDocUrl: string
): Promise<{ success: boolean; error?: any }> => {
  try {
    const { error } = await supabase
      .from('business_verifications')
      .insert({
        business_id: businessId,
        ownership_percentage: ownershipPercentage,
        registration_document_url: registrationDocUrl,
        ownership_document_url: ownershipDocUrl,
        address_document_url: addressDocUrl,
        verification_status: 'pending'
      });

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Error submitting verification request:', error);
    return { success: false, error };
  }
};

export const uploadVerificationDocument = async (
  file: File,
  businessId: string,
  userId: string,
  documentType: 'registration' | 'ownership' | 'address'
): Promise<{ url: string } | { error: string }> => {
  try {
    // Since no storage buckets exist, return a placeholder URL
    const placeholderUrl = `https://placeholder.example.com/${businessId}/${documentType}_${Date.now()}.pdf`;
    return { url: placeholderUrl };
  } catch (error: any) {
    console.error('Error uploading verification document:', error);
    return { error: error.message };
  }
};

export const updateBusinessVerification = async (
  verificationId: string,
  updates: Partial<Omit<BusinessVerification, 'id' | 'created_at' | 'updated_at' | 'business_id'>>
): Promise<{ success: boolean; verification?: BusinessVerification; error?: any }> => {
  try {
    const { data, error } = await supabase
      .from('business_verifications')
      .update(updates)
      .eq('id', verificationId)
      .select()
      .single();

    if (error) throw error;

    // Type assertion with proper verification status
    const verification: BusinessVerification = {
      ...data,
      verification_status: data.verification_status as 'pending' | 'approved' | 'rejected'
    };

    toast.success('Verification updated successfully!');
    return { success: true, verification };
  } catch (error: any) {
    console.error('Error updating business verification:', error);
    toast.error('Failed to update verification: ' + error.message);
    return { success: false, error };
  }
};

export const approveBusinessVerification = async (
  verificationId: string,
  adminNotes?: string
): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('business_verifications')
      .update({
        verification_status: 'approved',
        verified_by: user.id,
        verified_at: new Date().toISOString(),
        admin_notes: adminNotes
      })
      .eq('id', verificationId);

    if (error) throw error;

    toast.success('Business verification approved successfully!');
    return true;
  } catch (error: any) {
    console.error('Error approving business verification:', error);
    toast.error('Failed to approve verification: ' + error.message);
    return false;
  }
};

export const rejectBusinessVerification = async (
  verificationId: string,
  rejectionReason: string,
  adminNotes?: string
): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('business_verifications')
      .update({
        verification_status: 'rejected',
        verified_by: user.id,
        verified_at: new Date().toISOString(),
        rejection_reason: rejectionReason,
        admin_notes: adminNotes
      })
      .eq('id', verificationId);

    if (error) throw error;

    toast.success('Business verification rejected successfully!');
    return true;
  } catch (error: any) {
    console.error('Error rejecting business verification:', error);
    toast.error('Failed to reject verification: ' + error.message);
    return false;
  }
};

export const getVerificationQueue = async (): Promise<VerificationQueueItem[]> => {
  try {
    const { data, error } = await supabase
      .from('admin_verification_queue')
      .select('*')
      .order('submitted_at', { ascending: true });

    if (error) throw error;

    // Type assertion with proper verification status
    return (data || []).map(item => ({
      ...item,
      verification_status: item.verification_status as 'pending' | 'approved' | 'rejected'
    })) as VerificationQueueItem[];
  } catch (error: any) {
    console.error('Error fetching verification queue:', error);
    return [];
  }
};

// Alias for backward compatibility
export const fetchVerificationQueue = getVerificationQueue;

export const resubmitBusinessVerification = async (
    verificationId: string,
    verificationData: Omit<BusinessVerification, 'id' | 'created_at' | 'updated_at' | 'verification_status' | 'submitted_at' | 'business_id'>
  ): Promise<{ success: boolean; verification?: BusinessVerification; error?: any }> => {
    try {
      const { data, error } = await supabase
        .from('business_verifications')
        .update({
          ...verificationData,
          verification_status: 'pending',
          submitted_at: new Date().toISOString(),
          rejection_reason: null,
          admin_notes: null,
          verified_at: null,
          verified_by: null
        })
        .eq('id', verificationId)
        .select()
        .single();
  
      if (error) throw error;
  
      // Type assertion with proper verification status
      const verification: BusinessVerification = {
        ...data,
        verification_status: data.verification_status as 'pending' | 'approved' | 'rejected'
      };
  
      toast.success('Verification request resubmitted successfully!');
      return { success: true, verification };
    } catch (error: any) {
      console.error('Error resubmitting business verification:', error);
      toast.error('Failed to resubmit verification request: ' + error.message);
      return { success: false, error };
    }
  };
