
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export const useProductSelection = (productCount: number) => {
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Reset selection when products change
  useEffect(() => {
    setSelectedProductIds([]);
    setSelectionMode(false);
  }, [productCount]);
  
  const toggleSelectionMode = () => {
    setSelectionMode(prev => !prev);
    if (!selectionMode) {
      // Entering selection mode
      toast.info("Click on products to select them for bulk actions");
    } else {
      // Exiting selection mode
      setSelectedProductIds([]);
    }
  };
  
  const toggleProductSelection = (id: string, selected: boolean) => {
    if (selected) {
      setSelectedProductIds(prev => [...prev, id]);
    } else {
      setSelectedProductIds(prev => prev.filter(productId => productId !== id));
    }
  };
  
  return {
    selectedProductIds,
    setSelectedProductIds,
    selectionMode,
    setSelectionMode,
    isProcessing,
    setIsProcessing,
    toggleSelectionMode,
    toggleProductSelection
  };
};
