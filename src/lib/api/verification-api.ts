
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { BusinessVerification, VerificationQueueItem } from '../types/verification';

// Get verification status for a business
export const getBusinessVerificationStatus = async (businessId: string): Promise<BusinessVerification | null> => {
  try {
    const { data, error } = await supabase
      .from('business_verifications')
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
      
    if (error) throw error;
    
    if (!data) return null;
    
    return {
      ...data,
      verification_status: data.verification_status as BusinessVerification['verification_status']
    };
  } catch (error: any) {
    console.error('Error fetching business verification status:', error);
    return null;
  }
};

// Upload verification document
export const uploadVerificationDocument = async (
  file: File,
  businessId: string,
  userId: string,
  documentType: 'registration' | 'ownership' | 'address'
): Promise<{ url: string } | { error: string }> => {
  try {
    if (!file) {
      return { error: 'No file selected' };
    }

    // Create a unique file path
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${businessId}/${documentType}_${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload file to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from('verification_documents')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    // Get public URL for the uploaded file
    const { data } = supabase.storage
      .from('verification_documents')
      .getPublicUrl(filePath);

    return { url: data.publicUrl };
  } catch (error: any) {
    console.error('Error uploading document:', error);
    return { error: error.message || 'Error uploading document' };
  }
};

// Submit verification request
export const submitVerificationRequest = async (
  businessId: string,
  ownershipPercentage: number,
  registrationDocUrl: string,
  ownershipDocUrl: string,
  addressDocUrl: string
): Promise<{ success: boolean, error?: string }> => {
  try {
    const { error } = await supabase
      .from('business_verifications')
      .insert({
        business_id: businessId,
        ownership_percentage: ownershipPercentage,
        registration_document_url: registrationDocUrl,
        ownership_document_url: ownershipDocUrl,
        address_document_url: addressDocUrl
      });

    if (error) throw error;
    
    toast.success('Verification documents submitted successfully');
    return { success: true };
  } catch (error: any) {
    console.error('Error submitting verification request:', error);
    toast.error('Failed to submit verification request');
    return { success: false, error: error.message };
  }
};

// Fetch verification queue for admin
export const fetchVerificationQueue = async (): Promise<VerificationQueueItem[]> => {
  try {
    const { data, error } = await supabase
      .from('admin_verification_queue')
      .select('*');
    
    if (error) throw error;
    return (data || []).map(item => ({
      ...item,
      verification_status: item.verification_status as VerificationQueueItem['verification_status']
    }));
  } catch (error: any) {
    console.error('Error fetching verification queue:', error);
    return [];
  }
};

// Approve business verification (admin only)
export const approveBusinessVerification = async (verificationId: string): Promise<boolean> => {
  try {
    const { error } = await supabase.rpc('admin_approve_business_verification', {
      verification_id: verificationId
    });

    if (error) throw error;
    toast.success('Business verification approved');
    return true;
  } catch (error: any) {
    console.error('Error approving business verification:', error);
    toast.error('Failed to approve business verification');
    return false;
  }
};

// Reject business verification (admin only)
export const rejectBusinessVerification = async (verificationId: string, reason: string): Promise<boolean> => {
  try {
    const { error } = await supabase.rpc('admin_reject_business_verification', {
      verification_id: verificationId,
      reason
    });

    if (error) throw error;
    toast.success('Business verification rejected');
    return true;
  } catch (error: any) {
    console.error('Error rejecting business verification:', error);
    toast.error('Failed to reject business verification');
    return false;
  }
};
