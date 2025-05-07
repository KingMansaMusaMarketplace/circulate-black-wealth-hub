
import { useState } from 'react';
import { toast } from 'sonner';
import { updateProductImage, deleteProductImage } from '@/lib/api/product-api';
import { ProductImage } from '@/lib/api/product-api';

export const useProductManagement = (setProducts: React.Dispatch<React.SetStateAction<ProductImage[]>>) => {
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
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
    setDeletingId(productId);
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
    } finally {
      setDeletingId(null);
    }
  };

  const toggleProductActive = async (productId: string, isActive: boolean) => {
    setTogglingId(productId);
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
    } finally {
      setTogglingId(null);
    }
  };

  return {
    togglingId,
    deletingId,
    updateProduct,
    deleteProduct,
    toggleProductActive
  };
};
