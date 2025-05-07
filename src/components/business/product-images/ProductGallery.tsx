
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
import { useGalleryActions } from './gallery/useGalleryActions';
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
  const [selectedProduct, setSelectedProduct] = useState<ProductImage | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
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
  
  const {
    deletingId,
    togglingId,
    animatingCardId,
    handleDelete,
    handleToggleActive,
    viewProductDetails,
    animateCard,
    handleBulkDelete,
    handleBulkToggleActive
  } = useGalleryActions({
    onDelete,
    onToggleActive,
    onBulkDelete,
    onBulkToggleActive,
    setSelectedProductIds,
    setIsProcessing,
    setSelectedProduct,
    setIsDetailModalOpen
  });
  
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
