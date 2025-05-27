
import { useState } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { uploadProductImage } from '@/lib/api/storage-api';
import { createProductImage, ProductImage } from '@/lib/api/product-api';
import { ProductImageFormValues } from '@/components/business/business-form/models';

export const useProductUpload = (businessId: string, updateProducts: (newProduct: ProductImage) => void) => {
  const [uploading, setUploading] = useState(false);
  const [batchUploading, setBatchUploading] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);

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
      const result = await createProductImage(
        businessId,
        {
          title: productData.title,
          description: productData.description,
          price: productData.price,
          is_active: productData.isActive,
          alt_text: productData.altText,
          seo_description: productData.metaDescription,
          category: productData.category,
          tags: productData.tags,
          compressed_size: file.size, // Ideally would be the compressed size
          compression_savings: 0,
          image_url: imageUpload.imageUrl,
          view_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      );

      if (!result.success) {
        throw new Error('Failed to save product data');
      }

      // Update local state through callback
      if (result.product) {
        updateProducts(result.product);
      }
      
      toast.success('Product image added successfully!');
      return result.product;
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
          const productMetadata = {
            title: title,
            description: defaultData.description || `${title} product image`,
            price: defaultData.price || '',
            is_active: defaultData.isActive !== undefined ? defaultData.isActive : true,
            alt_text: defaultData.altText || title,
            tags: defaultData.tags || '',
            category: defaultData.category || '',
            compressed_size: file.size,
            image_url: imageUpload.imageUrl,
            view_count: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          
          // Save product
          const result = await createProductImage(businessId, productMetadata);
          
          if (result.success && result.product) {
            results.push(result.product);
            updateProducts(result.product);
          }
        } catch (error: any) {
          console.error(`Error processing file ${file.name}:`, error);
        }
        
        // Update progress
        setBatchProgress(Math.round(((i + 1) / files.length) * 100));
      }
      
      if (results.length > 0) {
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

  return {
    uploading,
    batchUploading,
    batchProgress,
    addProduct,
    batchAddProducts
  };
};
