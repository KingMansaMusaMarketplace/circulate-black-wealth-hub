
import React, { useState } from 'react';
import { ProductImage } from '@/lib/api/product-api';
import { toast } from 'sonner';
import ProductDetailDialog from './gallery/ProductDetailDialog';
import BulkActions from './gallery/BulkActions';
import GalleryPagination from './gallery/GalleryPagination';
import GalleryControls from './gallery/GalleryControls';
import GalleryLayout from './gallery/GalleryLayout';
import LoadingState from './gallery/LoadingState';
import EmptyState from './gallery/EmptyState';
import { useGalleryProducts } from './gallery/useGalleryProducts';
import { useProductSelection } from './gallery/useProductSelection';
import { AdvancedFiltersState } from './gallery/AdvancedFilters';

interface ProductGalleryProps {
  products: ProductImage[];
  loading: boolean;
  onDelete: (id: string, imageUrl: string) => Promise<void>;
  onToggleActive: (id: string, isActive: boolean) => Promise<void>;
  onEdit?: (product: ProductImage) => void;
  onBulkDelete?: (ids: string[]) => Promise<void>;
  onBulkToggleActive?: (ids: string[], isActive: boolean) => Promise<void>;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({
  products,
  loading,
  onDelete,
  onToggleActive,
  onEdit,
  onBulkDelete,
  onBulkToggleActive
}) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductImage | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [animatingCardId, setAnimatingCardId] = useState<string | null>(null);
  const [layoutType, setLayoutType] = useState<'grid' | 'list'>('grid');
  
  const itemsPerPage = layoutType === 'grid' ? 6 : 8;
  
  const {
    filteredProducts,
    paginatedProducts,
    totalPages,
    currentPage,
    safeCurrentPage,
    setCurrentPage,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    filterBy,
    setFilterBy,
    categories,
    handleApplyAdvancedFilters
  } = useGalleryProducts(products, itemsPerPage);
  
  const {
    selectedProductIds,
    setSelectedProductIds,
    selectionMode,
    isProcessing,
    setIsProcessing,
    toggleSelectionMode,
    toggleProductSelection
  } = useProductSelection(products.length);
  
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
  
  // Removed the duplicate handleApplyAdvancedFilters function
  // Now using the one from useGalleryProducts hook directly
  
  if (loading) {
    return <LoadingState />;
  }
  
  if (products.length === 0) {
    return <EmptyState />;
  }
  
  return (
    <div className="space-y-6">
      {/* Filter, Sort, Layout Controls */}
      <GalleryControls
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortBy={sortBy}
        setSortBy={setSortBy}
        filterBy={filterBy}
        setFilterBy={setFilterBy}
        layoutType={layoutType}
        setLayoutType={setLayoutType}
        selectionMode={selectionMode}
        toggleSelectionMode={toggleSelectionMode}
        onApplyAdvancedFilters={handleApplyAdvancedFilters}
        categories={categories}
      />
      
      {/* Bulk Actions */}
      {selectedProductIds.length > 0 && (
        <BulkActions
          selectedIds={selectedProductIds}
          onBulkDelete={handleBulkDelete}
          onBulkToggleActive={handleBulkToggleActive}
          onClearSelection={() => setSelectedProductIds([])}
          isProcessing={isProcessing}
        />
      )}
      
      {filteredProducts.length === 0 ? (
        <EmptyState isFiltered />
      ) : (
        <>
          {/* Product Grid or List */}
          <GalleryLayout
            products={products}
            layoutType={layoutType}
            paginatedProducts={paginatedProducts}
            animatingCardId={animatingCardId}
            deletingId={deletingId}
            togglingId={togglingId}
            onToggleActive={handleToggleActive}
            onDelete={handleDelete}
            onEdit={onEdit}
            onView={viewProductDetails}
            onAnimate={animateCard}
            selectedProductIds={selectedProductIds}
            onToggleSelect={toggleProductSelection}
            selectionMode={selectionMode}
          />
          
          {/* Pagination */}
          <GalleryPagination 
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </>
      )}
      
      {/* Product Details Dialog */}
      <ProductDetailDialog
        product={selectedProduct}
        isOpen={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
      />
    </div>
  );
};

export default ProductGallery;
