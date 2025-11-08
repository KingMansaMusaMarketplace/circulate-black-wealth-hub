import { supabase } from '@/integrations/supabase/client';
import { MarketingMaterial, MarketingMaterialFormData } from '@/types/marketing-material';

/**
 * Get all marketing materials (for admin)
 */
export const getAllMarketingMaterials = async (): Promise<MarketingMaterial[]> => {
  try {
    const { data, error } = await supabase
      .from('marketing_materials')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching all materials:', error);
    throw error;
  }
};

/**
 * Get marketing materials (for agents - active only)
 */
export const getMarketingMaterials = async (): Promise<MarketingMaterial[]> => {
  try {
    const { data, error } = await supabase
      .from('marketing_materials')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching materials:', error);
    throw error;
  }
};

/**
 * Create a new marketing material
 */
export const createMarketingMaterial = async (
  formData: MarketingMaterialFormData,
  file?: File
): Promise<MarketingMaterial> => {
  try {
    let fileUrl: string | null = null;

    // Upload file if provided
    if (file) {
      const fileName = `${Date.now()}-${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('marketing-materials')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('marketing-materials')
        .getPublicUrl(fileName);

      fileUrl = publicUrl;
    }

    const insertData: any = {
      title: formData.title,
      description: formData.description,
      type: formData.type,
      dimensions: formData.dimensions,
      file_path: fileUrl,
      file_url: fileUrl
    };

    const { data, error } = await supabase
      .from('marketing_materials')
      .insert([insertData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating material:', error);
    throw error;
  }
};

/**
 * Update a marketing material
 */
export const updateMarketingMaterial = async (
  id: string,
  formData: Partial<MarketingMaterialFormData>,
  file?: File
): Promise<MarketingMaterial> => {
  try {
    let fileUrl: string | null = null;

    // Upload new file if provided
    if (file) {
      const fileName = `${Date.now()}-${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('marketing-materials')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('marketing-materials')
        .getPublicUrl(fileName);

      fileUrl = publicUrl;
    }

    const updateData: any = { ...formData };
    if (fileUrl) {
      updateData.file_path = fileUrl;
      updateData.file_url = fileUrl;
    }

    const { data, error } = await supabase
      .from('marketing_materials')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating material:', error);
    throw error;
  }
};

/**
 * Delete a marketing material
 */
export const deleteMarketingMaterial = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('marketing_materials')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting material:', error);
    throw error;
  }
};

/**
 * Toggle material active status
 */
export const toggleMaterialStatus = async (id: string, isActive: boolean): Promise<void> => {
  try {
    const { error } = await supabase
      .from('marketing_materials')
      .update({ is_active: isActive })
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error toggling material status:', error);
    throw error;
  }
};
