
import { useState } from 'react';
import { toast } from 'sonner';
import { 
  ProductImage, 
  fetchProductImages, 
  saveProductImage, 
  updateProductImage, 
  deleteProductImage 
} from '@/lib/api/product-api';
import { uploadProductImage } from '@/lib/api/storage-api';
import { v4 as uuidv4 } from 'uuid';
import { ProductImageFormValues } from '@/components/business/business-form/models';

export const useProductImages = (businessId: string) => {
  const [products, setProducts] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [batchUploading, setBatchUploading] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchProductImages(businessId);
      setProducts(data);
    } catch (error: any) {
      toast.error(`Failed to load products: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (file: File, productData: ProductImageFormValues) => {
    if (!file || !businessId) {
      toast.error('Missing required information');
      return null;
    }

    setUploading(true);
    try {
      const productId = uuidv4();
      // Upload image first
      const imageUpload = await uploadProductImage(file, businessId, productId);
      
      if ('error' in imageUpload) {
        throw new Error(imageUpload.error);
      }

      // Save product data with image URL and compression info
      const result = await saveProductImage({
        business_id: businessId,
        title: productData.title,
        description: productData.description,
        price: productData.price,
        image_url: imageUpload.url,
        is_active: productData.isActive,
        alt_text: productData.altText,
        meta_description: productData.metaDescription,
        category: productData.category,
        tags: productData.tags,
        original_size: file.size,
        compressed_size: file.size, // Ideally would be the compressed size
        compression_savings: 0
      });

      if (!result.success) {
        throw new Error('Failed to save product data');
      }

      // Update local state
      if (result.data) {
        setProducts(prev => [result.data!, ...prev]);
      }
      
      toast.success('Product image added successfully!');
      return result.data;
    } catch (error: any) {
      toast.error(`Failed to add product: ${error.message}`);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const batchAddProducts = async (files: File[], defaultData: Partial<ProductImageFormValues> = {}) => {
    if (!files.length || !businessId) {
      toast.error('No files selected');
      return [];
    }

    setBatchUploading(true);
    setBatchProgress(0);
    
    try {
      const results: ProductImage[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const productId = uuidv4();
        
        // Generate automatic title and description if not provided
        const fileName = file.name.split('.')[0].replace(/_/g, ' ');
        const title = defaultData.title || fileName;
        
        try {
          // Upload image
          const imageUpload = await uploadProductImage(file, businessId, productId);
          
          if ('error' in imageUpload) {
            toast.error(`Failed to upload ${fileName}: ${imageUpload.error}`);
            continue;
          }
          
          // Basic product data
          const productData = {
            business_id: businessId,
            title: title,
            description: defaultData.description || `${title} product image`,
            price: defaultData.price || '',
            image_url: imageUpload.url,
            is_active: defaultData.isActive !== undefined ? defaultData.isActive : true,
            alt_text: defaultData.altText || title,
            tags: defaultData.tags || '',
            category: defaultData.category || '',
            original_size: file.size,
            compressed_size: file.size
          };
          
          // Save product
          const result = await saveProductImage(productData);
          
          if (result.success && result.data) {
            results.push(result.data);
          }
        } catch (error: any) {
          console.error(`Error processing file ${file.name}:`, error);
        }
        
        // Update progress
        setBatchProgress(Math.round(((i + 1) / files.length) * 100));
      }
      
      // Update local state with all successfully uploaded products
      if (results.length > 0) {
        setProducts(prev => [...results, ...prev]);
        toast.success(`Successfully added ${results.length} products`);
      }
      
      return results;
    } catch (error: any) {
      toast.error(`Batch upload failed: ${error.message}`);
      return [];
    } finally {
      setBatchUploading(false);
      setBatchProgress(0);
    }
  };

  const updateProduct = async (product: Partial<ProductImage> & { id: string }) => {
    try {
      const result = await updateProductImage(product);
      
      if (result.success && result.data) {
        setProducts(prev => 
          prev.map(p => p.id === product.id ? result.data! : p)
        );
      }
      
      return result.success;
    } catch (error: any) {
      toast.error(`Failed to update product: ${error.message}`);
      return false;
    }
  };

  const deleteProduct = async (productId: string, imageUrl: string) => {
    try {
      // Delete image from storage first
      await deleteProductImage(productId);
      
      // Update local state
      setProducts(prev => prev.filter(p => p.id !== productId));
      
      toast.success('Product deleted successfully');
      return true;
    } catch (error: any) {
      toast.error(`Failed to delete product: ${error.message}`);
      return false;
    }
  };

  const toggleProductActive = async (productId: string, isActive: boolean) => {
    try {
      const result = await updateProductImage({ 
        id: productId,
        is_active: isActive
      });
      
      if (result.success) {
        setProducts(prev => 
          prev.map(p => p.id === productId ? { ...p, is_active: isActive } : p)
        );
        toast.success(`Product ${isActive ? 'activated' : 'deactivated'} successfully`);
      }
      
      return result.success;
    } catch (error: any) {
      toast.error(`Failed to update product status: ${error.message}`);
      return false;
    }
  };

  // Bulk operations
  const bulkDeleteProducts = async (productIds: string[]) => {
    try {
      // Delete products one by one
      const promises = productIds.map(id => deleteProductImage(id));
      await Promise.all(promises);
      
      // Update local state
      setProducts(prev => prev.filter(p => !productIds.includes(p.id)));
      
      toast.success(`${productIds.length} products deleted successfully`);
      return true;
    } catch (error: any) {
      toast.error(`Failed to delete products: ${error.message}`);
      return false;
    }
  };
  
  const bulkToggleActive = async (productIds: string[], isActive: boolean) => {
    try {
      const updatePromises = productIds.map(id => 
        updateProductImage({ id, is_active: isActive })
      );
      await Promise.all(updatePromises);
      
      // Update local state
      setProducts(prev => 
        prev.map(p => productIds.includes(p.id) ? { ...p, is_active: isActive } : p)
      );
      
      toast.success(`${productIds.length} products ${isActive ? 'activated' : 'deactivated'} successfully`);
      return true;
    } catch (error: any) {
      toast.error(`Failed to update products: ${error.message}`);
      return false;
    }
  };

  return {
    products,
    loading,
    uploading,
    batchUploading,
    batchProgress,
    loadProducts,
    addProduct,
    batchAddProducts,
    updateProduct,
    deleteProduct,
    toggleProductActive,
    bulkDeleteProducts,
    bulkToggleActive
  };
};
