
import React, { useState, useEffect } from 'react';
import { Loader2, ImageIcon } from "lucide-react";
import { ProductImage } from '@/lib/api/product-api';
import ProductCard from './gallery/ProductCard';
import ProductDetailDialog from './gallery/ProductDetailDialog';
import GalleryPagination from './gallery/GalleryPagination';
import ProductFilters, { SortOption, FilterOption } from './gallery/ProductFilters';

interface ProductGalleryProps {
  products: ProductImage[];
  loading: boolean;
  onDelete: (id: string, imageUrl: string) => Promise<void>;
  onToggleActive: (id: string, isActive: boolean) => Promise<void>;
  onEdit?: (product: ProductImage) => void;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({
  products,
  loading,
  onDelete,
  onToggleActive,
  onEdit
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
  
  const itemsPerPage = 6;
  
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy, filterBy]);
  
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
  
  // Apply filtering
  const filteredProducts = products.filter(product => {
    // Apply search term filter
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        product.description.toLowerCase().includes(searchTerm.toLowerCase());
                        
    // Apply status filter
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
      {/* Filter and Sort Controls */}
      <ProductFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortBy={sortBy}
        setSortBy={setSortBy}
        filterBy={filterBy}
        setFilterBy={setFilterBy}
      />
      
      {filteredProducts.length === 0 ? (
        <div className="text-center py-10 animate-fade-in">
          <p className="text-gray-500">No products match your search criteria.</p>
        </div>
      ) : (
        <>
          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
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
