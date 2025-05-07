
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { ProductImage, fetchProductImages } from '@/lib/api/product-api';
import { useProductUpload } from './product-images/use-product-upload';
import { useProductManagement } from './product-images/use-product-management';
import { useBulkOperations } from './product-images/use-bulk-operations';

export const useProductImages = (businessId: string) => {
  const [products, setProducts] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(false);

  // Callback to update products state for new uploads
  const updateProductsState = useCallback((newProduct: ProductImage) => {
    setProducts(prev => [newProduct, ...prev]);
  }, []);

  // Import modularized hooks
  const { 
    uploading, 
    batchUploading, 
    batchProgress, 
    addProduct, 
    batchAddProducts 
  } = useProductUpload(businessId, updateProductsState);
  
  const { 
    togglingId, 
    deletingId, 
    updateProduct, 
    deleteProduct, 
    toggleProductActive 
  } = useProductManagement(setProducts);
  
  const { 
    isProcessing, 
    bulkDeleteProducts, 
    bulkToggleActive 
  } = useBulkOperations(setProducts);

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

  // Load products on mount if businessId is available
  useEffect(() => {
    if (businessId) {
      loadProducts();
    }
  }, [businessId]);

  return {
    // State
    products,
    loading,
    uploading,
    batchUploading,
    batchProgress,
    deletingId,
    togglingId,
    isProcessing,
    
    // Functions
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
