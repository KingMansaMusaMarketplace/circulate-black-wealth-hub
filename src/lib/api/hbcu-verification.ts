
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
    console.log('Starting HBCU verification upload for user:', userId);
    console.log('Document type:', data.documentType);
    console.log('File info:', { name: data.file.name, size: data.file.size, type: data.file.type });

    // Validate file
    if (!data.file) {
      console.error('No file provided');
      return { success: false, error: 'No file provided' };
    }

    // Check file size (max 10MB)
    if (data.file.size > 10 * 1024 * 1024) {
      console.error('File too large:', data.file.size);
      return { success: false, error: 'File size must be less than 10MB' };
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(data.file.type)) {
      console.error('Invalid file type:', data.file.type);
      return { success: false, error: 'Only JPEG, PNG, and PDF files are allowed' };
    }

    // Generate unique filename
    const fileExt = data.file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;
    console.log('Generated filename:', fileName);

    // Upload file to storage
    console.log('Uploading file to storage...');
    const { error: uploadError } = await supabase.storage
      .from('hbcu-verification')
      .upload(fileName, data.file);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return { success: false, error: 'Failed to upload document: ' + uploadError.message };
    }

    console.log('File uploaded successfully');

    // Get public URL for the uploaded file
    const { data: urlData } = supabase.storage
      .from('hbcu-verification')
      .getPublicUrl(fileName);

    console.log('Generated public URL:', urlData.publicUrl);

    // Create verification record
    console.log('Creating verification record in database...');
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
      return { success: false, error: 'Failed to save verification record: ' + dbError.message };
    }

    console.log('HBCU verification uploaded successfully');
    return { success: true };
  } catch (error) {
    console.error('HBCU verification upload error:', error);
    return { success: false, error: 'An unexpected error occurred: ' + (error as Error).message };
  }
};

export const getHBCUVerificationStatus = async (userId: string) => {
  try {
    console.log('Fetching HBCU verification status for user:', userId);
    
    const { data, error } = await supabase
      .from('hbcu_verifications')
      .select('verification_status, created_at, document_type')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error fetching HBCU verification status:', error);
      return null;
    }

    console.log('HBCU verification status:', data);
    return data;
  } catch (error) {
    console.error('HBCU verification status error:', error);
    return null;
  }
};

// Test function to verify the API is working
export const testHBCUVerificationAPI = async () => {
  try {
    console.log('Testing HBCU verification API...');
    
    // Test getting current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('User not authenticated for testing');
      return false;
    }

    console.log('Current user:', user.id);

    // Test getting verification status
    const status = await getHBCUVerificationStatus(user.id);
    console.log('Current verification status:', status);

    // Test storage bucket accessibility
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    console.log('Available buckets:', buckets);
    if (bucketsError) {
      console.error('Buckets error:', bucketsError);
    }

    return true;
  } catch (error) {
    console.error('API test failed:', error);
    return false;
  }
};
