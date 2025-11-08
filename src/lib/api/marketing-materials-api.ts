import { supabase } from '@/integrations/supabase/client';
import { MarketingMaterial, MarketingMaterialFormData, MaterialType } from '@/types/marketing-material';

export const getMarketingMaterials = async (type?: MaterialType): Promise<MarketingMaterial[]> => {
  let query = supabase
    .from('marketing_materials')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (type) {
    query = query.eq('type', type);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
};

export const getAllMarketingMaterials = async (): Promise<MarketingMaterial[]> => {
  const { data, error } = await supabase
    .from('marketing_materials')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const createMarketingMaterial = async (
  materialData: MarketingMaterialFormData
): Promise<MarketingMaterial> => {
  let fileUrl: string | null = null;

  // Upload file if provided
  if (materialData.file) {
    const fileName = `${Date.now()}_${materialData.file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('marketing-materials')
      .upload(fileName, materialData.file);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('marketing-materials')
      .getPublicUrl(uploadData.path);

    fileUrl = publicUrl;
  }

  const { data, error } = await supabase
    .from('marketing_materials')
    .insert({
      title: materialData.title,
      description: materialData.description,
      type: materialData.type,
      dimensions: materialData.dimensions || null,
      file_url: fileUrl,
      file_size: materialData.file?.size || null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateMarketingMaterial = async (
  id: string,
  materialData: Partial<MarketingMaterialFormData>
): Promise<MarketingMaterial> => {
  let fileUrl: string | undefined;

  // Upload new file if provided
  if (materialData.file) {
    const fileName = `${Date.now()}_${materialData.file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('marketing-materials')
      .upload(fileName, materialData.file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('marketing-materials')
      .getPublicUrl(uploadData.path);

    fileUrl = publicUrl;
  }

  const updateData: any = {};
  if (materialData.title) updateData.title = materialData.title;
  if (materialData.description !== undefined) updateData.description = materialData.description;
  if (materialData.type) updateData.type = materialData.type;
  if (materialData.dimensions !== undefined) updateData.dimensions = materialData.dimensions;
  if (fileUrl) {
    updateData.file_url = fileUrl;
    if (materialData.file) updateData.file_size = materialData.file.size;
  }

  const { data, error } = await supabase
    .from('marketing_materials')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteMarketingMaterial = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('marketing_materials')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const toggleMaterialStatus = async (id: string, isActive: boolean): Promise<void> => {
  const { error } = await supabase
    .from('marketing_materials')
    .update({ is_active: isActive })
    .eq('id', id);

  if (error) throw error;
};

export const incrementDownloadCount = async (id: string): Promise<void> => {
  // This is deprecated in favor of trackMaterialDownload
  // Kept for backward compatibility
  const { error } = await supabase.rpc('increment_material_downloads', {
    material_id: id
  });

  if (error) throw error;
};
