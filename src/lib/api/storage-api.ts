
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export const uploadBusinessImage = async (
  file: File,
  businessId: string,
  type: 'logo' | 'banner'
): Promise<{ url: string } | { error: string }> => {
  try {
    if (!file) {
      return { error: 'No file selected' };
    }

    // Create a unique file path
    const fileExt = file.name.split('.').pop();
    const fileName = `${businessId}/${type}_${uuidv4()}.${fileExt}`;
    const filePath = `business_images/${fileName}`;

    // Upload file to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from('business_assets')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    // Get public URL for the uploaded file
    const { data } = supabase.storage
      .from('business_assets')
      .getPublicUrl(filePath);

    return { url: data.publicUrl };
  } catch (error: any) {
    console.error('Error uploading image:', error);
    return { error: error.message || 'Error uploading image' };
  }
};

export const uploadProductImage = async (
  file: File,
  businessId: string,
  productId: string
): Promise<{ url: string } | { error: string }> => {
  try {
    if (!file) {
      return { error: 'No file selected' };
    }

    // Create a unique file path
    const fileExt = file.name.split('.').pop();
    const fileName = `${businessId}/products/${productId}_${uuidv4()}.${fileExt}`;
    const filePath = `business_images/${fileName}`;

    // Upload file to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from('business_assets')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    // Get public URL for the uploaded file
    const { data } = supabase.storage
      .from('business_assets')
      .getPublicUrl(filePath);

    return { url: data.publicUrl };
  } catch (error: any) {
    console.error('Error uploading product image:', error);
    return { error: error.message || 'Error uploading product image' };
  }
};

export const deleteBusinessImage = async (url: string): Promise<{ success: boolean, error?: string }> => {
  try {
    // Extract file path from URL
    const urlParts = url.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const filePath = `business_images/${fileName}`;

    // Delete file from storage
    const { error } = await supabase.storage
      .from('business_assets')
      .remove([filePath]);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting image:', error);
    return { success: false, error: error.message };
  }
};
