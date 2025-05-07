
import { useState } from 'react';
import { toast } from 'sonner';
import { updateProductImage, deleteProductImage } from '@/lib/api/product-api';
import { ProductImage } from '@/lib/api/product-api';

export const useBulkOperations = (setProducts: React.Dispatch<React.SetStateAction<ProductImage[]>>) => {
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Bulk operations
  const bulkDeleteProducts = async (productIds: string[]) => {
    setIsProcessing(true);
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
    } finally {
      setIsProcessing(false);
    }
  };
  
  const bulkToggleActive = async (productIds: string[], isActive: boolean) => {
    setIsProcessing(true);
    try {
      const updatePromises = productIds.map(id => 
        updateProductImage(id, { is_active: isActive })
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
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    bulkDeleteProducts,
    bulkToggleActive
  };
};
