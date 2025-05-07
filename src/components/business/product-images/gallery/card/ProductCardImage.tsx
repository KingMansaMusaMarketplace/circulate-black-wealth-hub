
import React, { useState } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { ProductImage } from '@/lib/api/product-api';
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ProductCardImageProps {
  product: ProductImage;
  selectionMode: boolean;
  isSelected: boolean;
  onToggleSelect: (id: string, selected: boolean) => void;
  layoutType: 'grid' | 'list';
}

const ProductCardImage: React.FC<ProductCardImageProps> = ({
  product,
  selectionMode,
  isSelected,
  onToggleSelect,
  layoutType
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div 
      className={cn(
        "relative overflow-hidden cursor-pointer",
        layoutType === 'grid' ? "aspect-video" : "w-24 h-24"
      )}
    >
      {/* Selection Checkbox */}
      {selectionMode && (
        <div className="absolute top-2 left-2 z-10 bg-white bg-opacity-80 rounded-full p-0.5">
          <Checkbox 
            checked={isSelected}
            onCheckedChange={(checked) => onToggleSelect(product.id, checked as boolean)}
          />
        </div>
      )}

      {!imageLoaded && (
        <Skeleton className="absolute inset-0" />
      )}
      
      <img 
        src={product.image_url} 
        alt={product.alt_text || product.title}
        className={cn(
          "object-cover w-full h-full transition-transform duration-500 hover:scale-110",
          !imageLoaded && "opacity-0"
        )}
        loading="lazy"
        onLoad={() => setImageLoaded(true)}
      />
      
      {product.category && (
        <div className="absolute top-2 right-2 z-10">
          <div className="bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
            {product.category}
          </div>
        </div>
      )}
      
      {!product.is_active && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <span className="bg-black text-white text-xs px-2 py-1 rounded">Inactive</span>
        </div>
      )}
    </div>
  );
};

export default ProductCardImage;
