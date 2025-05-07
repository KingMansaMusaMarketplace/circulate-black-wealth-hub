
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

export interface ProductImage {
  id: string;
  business_id: string;
  title: string;
  description: string;
  price?: string;
  image_url: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  // New fields
  alt_text?: string;
  meta_description?: string;
  category?: string;
  tags?: string;
  original_size?: number;
  compressed_size?: number;
  compression_savings?: number;
}

// Fetch product images for a business
export const fetchProductImages = async (businessId: string): Promise<ProductImage[]> => {
  try {
    const { data, error } = await supabase
      .from('product_images')
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error('Error fetching product images:', error.message);
    return [];
  }
};

// Add a new product image
export const saveProductImage = async (product: Omit<ProductImage, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean, data?: ProductImage, error?: any }> => {
  try {
    const newProduct = {
      ...product,
      id: uuidv4(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('product_images')
      .insert([newProduct])
      .select();
    
    if (error) throw error;
    toast.success('Product image saved successfully!');
    return { success: true, data: data[0] };
  } catch (error: any) {
    console.error('Error saving product image:', error.message);
    toast.error('Failed to save product image: ' + error.message);
    return { success: false, error };
  }
};

// Update an existing product image
export const updateProductImage = async (product: Partial<ProductImage> & { id: string }): Promise<{ success: boolean, data?: ProductImage, error?: any }> => {
  try {
    const { data, error } = await supabase
      .from('product_images')
      .update({
        ...product,
        updated_at: new Date().toISOString()
      })
      .eq('id', product.id)
      .select();
    
    if (error) throw error;
    toast.success('Product image updated successfully!');
    return { success: true, data: data[0] };
  } catch (error: any) {
    console.error('Error updating product image:', error.message);
    toast.error('Failed to update product image: ' + error.message);
    return { success: false, error };
  }
};

// Delete a product image
export const deleteProductImage = async (id: string): Promise<{ success: boolean, error?: any }> => {
  try {
    const { error } = await supabase
      .from('product_images')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    toast.success('Product image deleted successfully!');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting product image:', error.message);
    toast.error('Failed to delete product image: ' + error.message);
    return { success: false, error };
  }
};
