import React, { useState, useEffect } from 'react';
import { Loader2, ImageIcon, List, GridIcon } from "lucide-react";
import { ProductImage } from '@/lib/api/product-api';
import ProductCard from './gallery/ProductCard';
import BulkActions from './gallery/BulkActions';
import ProductDetailDialog from './gallery/ProductDetailDialog';
import GalleryPagination from './gallery/GalleryPagination';
import ProductFilters, { SortOption, FilterOption } from './gallery/ProductFilters';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  products: ProductImage[];
  loading: boolean;
  onDelete: (id: string, imageUrl: string) => Promise<void>;
  onToggleActive: (id: string, isActive: boolean) => Promise<void>;
  onEdit?: (product: ProductImage) => void;
  onBulkDelete?: (ids: string[]) => Promise<void>;
  onBulkToggleActive?: (ids: string[], isActive: boolean) => Promise<void>;
}

type LayoutType = 'grid' | 'list';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<ProductImage | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [animatingCardId, setAnimatingCardId] = useState<string | null>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [layoutType, setLayoutType] = useState<LayoutType>('grid');
  
  const itemsPerPage = layoutType === 'grid' ? 6 : 8;
  
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy, filterBy]);
  
  // Reset selection when products change
  useEffect(() => {
    setSelectedProductIds([]);
    setSelectionMode(false);
  }, [products.length]);
  
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
  
  const toggleProductSelection = (id: string, selected: boolean) => {
    if (selected) {
      setSelectedProductIds(prev => [...prev, id]);
    } else {
      setSelectedProductIds(prev => prev.filter(productId => productId !== id));
    }
  };
  
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
  
  const handleBulkDelete = async (ids: string[]) => {
    if (!onBulkDelete) return;
    
    setIsProcessing(true);
    try {
      await onBulkDelete(ids);
      setSelectedProductIds([]);
      setSelectionMode(false);
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
  
  // Apply filtering
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        product.description.toLowerCase().includes(searchTerm.toLowerCase());
                        
    let matchesStatus = true;
    if (filterBy === 'active') matchesStatus = product.is_active;
    if (filterBy === 'inactive') matchesStatus = !product.is_active;
    
    return matchesSearch && matchesStatus;
  });
  
  // Apply sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
      case 'oldest':
        return new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime();
      case 'title-asc':
        return a.title.localeCompare(b.title);
      case 'title-desc':
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  });
  
  // Apply pagination
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-mansablue" />
        <span className="ml-2">Loading products...</span>
      </div>
    );
  }
  
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
        <div className="bg-gray-100 p-6 rounded-full mb-4">
          <ImageIcon size={48} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-medium mb-1">No products yet</h3>
        <p className="text-gray-500 max-w-md">
          Start showcasing your products or services by adding images and descriptions.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Filter, Sort, Layout Controls */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <ProductFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortBy={sortBy}
          setSortBy={setSortBy}
          filterBy={filterBy}
          setFilterBy={setFilterBy}
        />
        
        <div className="flex gap-2 items-center">
          <Button
            size="sm"
            variant={selectionMode ? "default" : "outline"}
            onClick={toggleSelectionMode}
            className="h-9"
          >
            {selectionMode ? "Cancel Selection" : "Select Multiple"}
          </Button>
          
          <div className="border rounded-md flex">
            <Button 
              size="sm"
              variant={layoutType === 'grid' ? "ghost" : "ghost"}
              className={cn("h-9 rounded-r-none", layoutType === 'grid' ? "bg-muted" : "")}
              onClick={() => setLayoutType('grid')}
            >
              <GridIcon className="h-4 w-4" />
            </Button>
            <Button 
              size="sm"
              variant={layoutType === 'list' ? "ghost" : "ghost"}
              className={cn("h-9 rounded-l-none", layoutType === 'list' ? "bg-muted" : "")}
              onClick={() => setLayoutType('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
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
        <div className="text-center py-10 animate-fade-in">
          <p className="text-gray-500">No products match your search criteria.</p>
        </div>
      ) : (
        <>
          {/* Product Grid or List */}
          <div className={cn(
            layoutType === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
              : "flex flex-col space-y-4"
          )}>
            {paginatedProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                animatingCardId={animatingCardId}
                deletingId={deletingId}
                togglingId={togglingId}
                onToggleActive={handleToggleActive}
                onDelete={handleDelete}
                onEdit={onEdit}
                onView={viewProductDetails}
                onAnimate={animateCard}
                index={index}
                isSelected={selectedProductIds.includes(product.id)}
                onToggleSelect={toggleProductSelection}
                selectionMode={selectionMode}
                layoutType={layoutType}
              />
            ))}
          </div>
          
          {/* Pagination */}
          <GalleryPagination 
            currentPage={currentPage}
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
