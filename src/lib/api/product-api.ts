import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { uploadProductImage } from './storage-api';
import { v4 as uuidv4 } from 'uuid';

export interface ProductImage {
  id: string;
  business_id: string;
  title: string;
  description?: string;
  price?: string;
  image_url: string;
  is_active: boolean;
  alt_text?: string;
  meta_description?: string;
  view_count?: number;
  category?: string;
  tags?: string;
  original_size?: number;
  compressed_size?: number;
  compression_savings?: number;
  created_at?: string;
  updated_at?: string;
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
export const addProductImage = async (
  file: File,
  businessId: string,
  metadata: Omit<ProductImage, 'id' | 'business_id' | 'image_url' | 'created_at' | 'updated_at'>
): Promise<{ success: boolean; product?: ProductImage; error?: any }> => {
  try {
    const productId = uuidv4();
    
    // Upload the image to storage
    const uploadResult = await uploadProductImage(file, businessId, productId);
    
    if ('error' in uploadResult) {
      throw new Error(uploadResult.error);
    }
    
    // Create product record in database
    const productData: Partial<ProductImage> = {
      id: productId,
      business_id: businessId,
      image_url: uploadResult.url,
      is_active: true,
      ...metadata,
      original_size: file.size,
      compressed_size: metadata.compressed_size || file.size,
      compression_savings: metadata.compression_savings || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('product_images')
      .insert(productData)
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('Product image added successfully!');
    return { success: true, product: data };
  } catch (error: any) {
    console.error('Error adding product image:', error.message);
    toast.error('Failed to add product image: ' + error.message);
    return { success: false, error };
  }
};

// Update a product image
export const updateProductImage = async (
  productId: string,
  updates: Partial<ProductImage>
): Promise<{ success: boolean; product?: ProductImage; error?: any }> => {
  try {
    const { data, error } = await supabase
      .from('product_images')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', productId)
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('Product updated successfully!');
    return { success: true, product: data };
  } catch (error: any) {
    console.error('Error updating product:', error.message);
    toast.error('Failed to update product: ' + error.message);
    return { success: false, error };
  }
};

// Delete a product image
export const deleteProductImage = async (productId: string): Promise<{ success: boolean; error?: any }> => {
  try {
    // Get the image URL first to delete from storage later
    const { data: product, error: fetchError } = await supabase
      .from('product_images')
      .select('image_url')
      .eq('id', productId)
      .single();
    
    if (fetchError) throw fetchError;
    
    // Delete the product record
    const { error: deleteError } = await supabase
      .from('product_images')
      .delete()
      .eq('id', productId);
    
    if (deleteError) throw deleteError;
    
    // Could also delete the image from storage here if needed
    // await deleteProductImageFromStorage(product.image_url);
    
    toast.success('Product deleted successfully!');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting product:', error.message);
    toast.error('Failed to delete product: ' + error.message);
    return { success: false, error };
  }
};

// Toggle product active status
export const toggleProductActive = async (
  productId: string,
  isActive: boolean
): Promise<{ success: boolean; error?: any }> => {
  try {
    const { error } = await supabase
      .from('product_images')
      .update({
        is_active: isActive,
        updated_at: new Date().toISOString()
      })
      .eq('id', productId);
    
    if (error) throw error;
    
    const status = isActive ? 'activated' : 'deactivated';
    toast.success(`Product ${status} successfully!`);
    return { success: true };
  } catch (error: any) {
    console.error('Error toggling product status:', error.message);
    toast.error('Failed to update product status: ' + error.message);
    return { success: false, error };
  }
};
