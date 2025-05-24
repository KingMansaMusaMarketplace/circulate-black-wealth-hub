
import { supabase } from '@/integrations/supabase/client';

export interface HBCUVerificationData {
  documentType: string;
  file: File;
}

export const uploadHBCUVerificationDocument = async (
  userId: string,
  data: HBCUVerificationData
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Generate unique filename
    const fileExt = data.file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;

    // Upload file to storage
    const { error: uploadError } = await supabase.storage
      .from('hbcu-verification')
      .upload(fileName, data.file);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return { success: false, error: 'Failed to upload document' };
    }

    // Get public URL for the uploaded file
    const { data: urlData } = supabase.storage
      .from('hbcu-verification')
      .getPublicUrl(fileName);

    // Create verification record
    const { error: dbError } = await supabase
      .from('hbcu_verifications')
      .insert({
        user_id: userId,
        document_url: urlData.publicUrl,
        document_type: data.documentType,
        verification_status: 'pending'
      });

    if (dbError) {
      console.error('Database error:', dbError);
      return { success: false, error: 'Failed to save verification record' };
    }

    return { success: true };
  } catch (error) {
    console.error('HBCU verification upload error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
};

export const getHBCUVerificationStatus = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('hbcu_verifications')
      .select('verification_status, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error fetching HBCU verification status:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('HBCU verification status error:', error);
    return null;
  }
};
