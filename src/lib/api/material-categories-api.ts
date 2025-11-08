import { supabase } from '@/integrations/supabase/client';
import { MaterialCategory, MaterialTag, MaterialWithCategoriesAndTags } from '@/types/material-category';

// Categories
export const getCategories = async (): Promise<MaterialCategory[]> => {
  const { data, error } = await supabase
    .from('material_categories')
    .select('*')
    .eq('is_active', true)
    .order('name');

  if (error) throw error;
  return data || [];
};

export const getAllCategories = async (): Promise<MaterialCategory[]> => {
  const { data, error } = await supabase
    .from('material_categories')
    .select('*')
    .order('name');

  if (error) throw error;
  return data || [];
};

export const createCategory = async (category: Partial<MaterialCategory>): Promise<MaterialCategory> => {
  const { data, error } = await supabase
    .from('material_categories')
    .insert(category)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateCategory = async (id: string, category: Partial<MaterialCategory>): Promise<MaterialCategory> => {
  const { data, error } = await supabase
    .from('material_categories')
    .update(category)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteCategory = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('material_categories')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Tags
export const getTags = async (): Promise<MaterialTag[]> => {
  const { data, error } = await supabase
    .from('material_tags')
    .select('*')
    .eq('is_active', true)
    .order('name');

  if (error) throw error;
  return data || [];
};

export const getAllTags = async (): Promise<MaterialTag[]> => {
  const { data, error } = await supabase
    .from('material_tags')
    .select('*')
    .order('name');

  if (error) throw error;
  return data || [];
};

export const createTag = async (tag: Partial<MaterialTag>): Promise<MaterialTag> => {
  const { data, error } = await supabase
    .from('material_tags')
    .insert(tag)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateTag = async (id: string, tag: Partial<MaterialTag>): Promise<MaterialTag> => {
  const { data, error } = await supabase
    .from('material_tags')
    .update(tag)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteTag = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('material_tags')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Material assignments
export const assignCategoriesToMaterial = async (materialId: string, categoryIds: string[]): Promise<void> => {
  // First, remove existing assignments
  await supabase
    .from('material_category_assignments')
    .delete()
    .eq('material_id', materialId);

  // Then add new assignments
  if (categoryIds.length > 0) {
    const assignments = categoryIds.map(categoryId => ({
      material_id: materialId,
      category_id: categoryId
    }));

    const { error } = await supabase
      .from('material_category_assignments')
      .insert(assignments);

    if (error) throw error;
  }
};

export const assignTagsToMaterial = async (materialId: string, tagIds: string[]): Promise<void> => {
  // First, remove existing assignments
  await supabase
    .from('material_tag_assignments')
    .delete()
    .eq('material_id', materialId);

  // Then add new assignments
  if (tagIds.length > 0) {
    const assignments = tagIds.map(tagId => ({
      material_id: materialId,
      tag_id: tagId
    }));

    const { error } = await supabase
      .from('material_tag_assignments')
      .insert(assignments);

    if (error) throw error;
  }
};

// Get materials with filters
export const getMaterialsWithFilters = async (
  categoryIds?: string[],
  tagIds?: string[],
  type?: string
): Promise<MaterialWithCategoriesAndTags[]> => {
  const { data, error } = await supabase.rpc('get_materials_with_filters', {
    p_category_ids: categoryIds || null,
    p_tag_ids: tagIds || null,
    p_type: type || null
  });

  if (error) throw error;
  return data || [];
};

// Get categories and tags for a specific material
export const getMaterialCategoriesAndTags = async (materialId: string) => {
  const [categoriesResult, tagsResult] = await Promise.all([
    supabase
      .from('material_category_assignments')
      .select('category_id, material_categories(*)')
      .eq('material_id', materialId),
    supabase
      .from('material_tag_assignments')
      .select('tag_id, material_tags(*)')
      .eq('material_id', materialId)
  ]);

  if (categoriesResult.error) throw categoriesResult.error;
  if (tagsResult.error) throw tagsResult.error;

  return {
    categories: categoriesResult.data?.map(item => item.material_categories) || [],
    tags: tagsResult.data?.map(item => item.material_tags) || []
  };
};
