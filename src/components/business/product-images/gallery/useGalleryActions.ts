
import { useState } from 'react';
import { toast } from '@/components/ui/sonner'; // Updated import path
import { ProductImage } from '@/lib/api/product-api';

interface GalleryActionsProps {
  onDelete: (id: string, imageUrl: string) => Promise<void>;
  onToggleActive: (id: string, isActive: boolean) => Promise<void>;
  onBulkDelete?: (ids: string[]) => Promise<void>;
  onBulkToggleActive?: (ids: string[], isActive: boolean) => Promise<void>;
  setSelectedProductIds: React.Dispatch<React.SetStateAction<string[]>>;
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedProduct: React.Dispatch<React.SetStateAction<ProductImage | null>>;
  setIsDetailModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useGalleryActions = ({
  onDelete,
  onToggleActive,
  onBulkDelete,
  onBulkToggleActive,
  setSelectedProductIds,
  setIsProcessing,
  setSelectedProduct,
  setIsDetailModalOpen
}: GalleryActionsProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [animatingCardId, setAnimatingCardId] = useState<string | null>(null);
  
  const handleDelete = async (id: string, imageUrl: string) => {
    setDeletingId(id);
    await onDelete(id, imageUrl);
    setDeletingId(null);
  };
  
  const handleToggleActive = async (id: string, currentState: boolean) => {
    setTogglingId(id);
    await onToggleActive(id, !currentState);
    setTogglingId(null);
  };
  
  const viewProductDetails = (product: ProductImage) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };
  
  const animateCard = (id: string) => {
    setAnimatingCardId(id);
    setTimeout(() => setAnimatingCardId(null), 1000);
  };
  
  const handleBulkDelete = async (ids: string[]) => {
    if (!onBulkDelete) return;
    
    setIsProcessing(true);
    try {
      await onBulkDelete(ids);
      setSelectedProductIds([]);
      toast.success(`Successfully deleted ${ids.length} products`);
    } catch (error) {
      toast.error("Failed to delete products");
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleBulkToggleActive = async (ids: string[], isActive: boolean) => {
    if (!onBulkToggleActive) return;
    
    setIsProcessing(true);
    try {
      await onBulkToggleActive(ids, isActive);
      toast.success(`Successfully ${isActive ? 'activated' : 'deactivated'} ${ids.length} products`);
    } catch (error) {
      toast.error(`Failed to ${isActive ? 'activate' : 'deactivate'} products`);
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    deletingId,
    togglingId,
    animatingCardId,
    handleDelete,
    handleToggleActive,
    viewProductDetails,
    animateCard,
    handleBulkDelete,
    handleBulkToggleActive
  };
};
