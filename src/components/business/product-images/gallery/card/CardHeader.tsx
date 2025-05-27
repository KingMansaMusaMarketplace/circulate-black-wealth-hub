
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { ProductImage } from '@/lib/api/product-api';

interface CardHeaderProps {
  product: ProductImage;
}

const CardHeader: React.FC<CardHeaderProps> = ({ product }) => {
  const displayTags = () => {
    if (!product.tags) return null;
    
    // Handle tags as string
    const tagString = typeof product.tags === 'string' ? product.tags : '';
    const tags = tagString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    
    if (tags.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {tags.slice(0, 3).map((tag, index) => (
          <Badge key={index} variant="secondary" className="text-xs">
            {tag}
          </Badge>
        ))}
        {tags.length > 3 && (
          <Badge variant="outline" className="text-xs">
            +{tags.length - 3}
          </Badge>
        )}
      </div>
    );
  };

  return (
    <div className="p-4">
      <h3 className="font-semibold text-sm truncate" title={product.title}>
        {product.title}
      </h3>
      {product.description && (
        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
          {product.description}
        </p>
      )}
      {product.price && (
        <p className="text-sm font-medium text-green-600 mt-2">
          ${product.price}
        </p>
      )}
      {displayTags()}
    </div>
  );
};

export default CardHeader;
