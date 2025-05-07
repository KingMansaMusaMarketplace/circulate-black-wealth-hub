
import React from 'react';
import { cn } from "@/lib/utils";
import { ProductImage } from '@/lib/api/product-api';
import ProductCard from './ProductCard';

interface GalleryLayoutProps {
  products: ProductImage[];
  layoutType: 'grid' | 'list';
  paginatedProducts: ProductImage[];
  animatingCardId: string | null;
  deletingId: string | null;
  togglingId: string | null;
  onToggleActive: (id: string, currentState: boolean) => Promise<void>;
  onDelete: (id: string, imageUrl: string) => Promise<void>;
  onEdit?: (product: ProductImage) => void;
  onView: (product: ProductImage) => void;
  onAnimate: (id: string) => void;
  selectedProductIds: string[];
  onToggleSelect: (id: string, selected: boolean) => void;
  selectionMode: boolean;
}

const GalleryLayout: React.FC<GalleryLayoutProps> = ({
  layoutType,
  paginatedProducts,
  animatingCardId,
  deletingId,
  togglingId,
  onToggleActive,
  onDelete,
  onEdit,
  onView,
  onAnimate,
  selectedProductIds,
  onToggleSelect,
  selectionMode
}) => {
  return (
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
          onToggleActive={onToggleActive}
          onDelete={onDelete}
          onEdit={onEdit}
          onView={onView}
          onAnimate={onAnimate}
          index={index}
          isSelected={selectedProductIds.includes(product.id)}
          onToggleSelect={onToggleSelect}
          selectionMode={selectionMode}
          layoutType={layoutType}
        />
      ))}
    </div>
  );
};

export default GalleryLayout;
