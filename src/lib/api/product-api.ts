
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface ProductImage {
  id: string;
  business_id: string;
  image_url: string;
  title: string;
  description?: string;
  price?: number;
  category?: string;
  tags?: string[];
  is_active: boolean;
  view_count: number;
  alt_text?: string;
  seo_title?: string;
  seo_description?: string;
  compressed_size?: number;
  original_size?: number;
  compression_savings?: number;
  created_at: string;
  updated_at: string;
}

// Get products for a business
export const getBusinessProducts = async (businessId: string): Promise<ProductImage[]> => {
  try {
    const { data, error } = await supabase
      .from('product_images')
      .select('*')
      .eq('business_id', businessId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error('Error fetching business products:', error.message);
    return [];
  }
};

// Create a new product
export const createProductImage = async (
  businessId: string,
  productData: Omit<ProductImage, 'id' | 'business_id' | 'view_count' | 'created_at' | 'updated_at'>
): Promise<{ success: boolean; product?: ProductImage; error?: any }> => {
  try {
    const { data, error } = await supabase
      .from('product_images')
      .insert({
        ...productData,
        business_id: businessId,
        view_count: 0
      })
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('Product image uploaded successfully!');
    return { success: true, product: data };
  } catch (error: any) {
    console.error('Error creating product:', error.message);
    toast.error('Failed to upload product image: ' + error.message);
    return { success: false, error };
  }
};

// Update a product
export const updateProductImage = async (
  productId: string,
  updates: Partial<Omit<ProductImage, 'id' | 'business_id' | 'created_at'>>
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

// Delete a product (soft delete by setting is_active to false)
export const deactivateProductImage = async (productId: string): Promise<{ success: boolean; error?: any }> => {
  try {
    const { error } = await supabase
      .from('product_images')
      .update({ 
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', productId);
    
    if (error) throw error;
    
    toast.success('Product image removed successfully!');
    return { success: true };
  } catch (error: any) {
    console.error('Error deactivating product:', error.message);
    toast.error('Failed to remove product image: ' + error.message);
    return { success: false, error };
  }
};

// Get product by ID and increment view count
export const getProductById = async (productId: string): Promise<ProductImage | null> => {
  try {
    // First get the product
    const { data: product, error: fetchError } = await supabase
      .from('product_images')
      .select('*')
      .eq('id', productId)
      .eq('is_active', true)
      .single();
    
    if (fetchError) throw fetchError;
    
    // Increment view count
    const { error: updateError } = await supabase
      .from('product_images')
      .update({ view_count: (product.view_count || 0) + 1 })
      .eq('id', productId);
    
    if (updateError) {
      console.error('Error updating view count:', updateError);
    }
    
    return product;
  } catch (error: any) {
    console.error('Error fetching product:', error.message);
    return null;
  }
};

// Get products by category
export const getProductsByCategory = async (category: string): Promise<ProductImage[]> => {
  try {
    const { data, error } = await supabase
      .from('product_images')
      .select('*')
      .eq('category', category)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error('Error fetching products by category:', error.message);
    return [];
  }
};

// Search products
export const searchProducts = async (query: string): Promise<ProductImage[]> => {
  try {
    const { data, error } = await supabase
      .from('product_images')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,tags.cs.{${query}}`)
      .eq('is_active', true)
      .order('view_count', { ascending: false })
      .limit(20);
    
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error('Error searching products:', error.message);
    return [];
  }
};

// Get product analytics for a business
export const getProductAnalytics = async (businessId: string) => {
  try {
    const { data, error } = await supabase
      .from('product_images')
      .select('id, title, view_count, created_at')
      .eq('business_id', businessId)
      .eq('is_active', true)
      .order('view_count', { ascending: false });
    
    if (error) throw error;
    
    const totalProducts = data?.length || 0;
    const totalViews = data?.reduce((sum, product) => sum + (product.view_count || 0), 0) || 0;
    const avgViewsPerProduct = totalProducts > 0 ? Math.round(totalViews / totalProducts) : 0;
    
    return {
      totalProducts,
      totalViews,
      avgViewsPerProduct,
      topProducts: data?.slice(0, 5) || []
    };
  } catch (error: any) {
    console.error('Error fetching product analytics:', error.message);
    return {
      totalProducts: 0,
      totalViews: 0,
      avgViewsPerProduct: 0,
      topProducts: []
    };
  }
};
