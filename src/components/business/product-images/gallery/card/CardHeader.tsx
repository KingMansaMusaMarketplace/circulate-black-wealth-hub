
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { ProductImage } from '@/lib/api/product-api';

interface CardHeaderProps {
  product: ProductImage;
}

const CardHeader: React.FC<CardHeaderProps> = ({ product }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="font-medium text-sm leading-tight line-clamp-2">
            {product.title}
          </h3>
          {product.price && (
            <p className="text-sm font-semibold text-green-600">
              {product.price}
            </p>
          )}
        </div>
        <Badge variant={product.is_active ? "default" : "secondary"} className="text-xs">
          {product.is_active ? "Active" : "Inactive"}
        </Badge>
      </div>
      
      {product.description && (
        <p className="text-xs text-gray-600 line-clamp-2">
          {product.description}
        </p>
      )}
      
      <div className="flex items-center gap-2 text-xs text-gray-500">
        {product.category && (
          <span className="bg-gray-100 px-2 py-1 rounded">
            {product.category}
          </span>
        )}
        {product.view_count > 0 && (
          <span>{product.view_count} views</span>
        )}
      </div>
    </div>
  );
};

export default CardHeader;
