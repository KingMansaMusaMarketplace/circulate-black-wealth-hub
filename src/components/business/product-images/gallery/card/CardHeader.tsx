
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tag } from "lucide-react";
import { ProductImage } from '@/lib/api/product-api';
import { Skeleton } from "@/components/ui/skeleton";

interface CardHeaderProps {
  product: ProductImage;
  imageLoaded: boolean;
  togglingId: string | null;
  onToggleActive: (id: string, currentState: boolean) => Promise<void>;
}

const CardHeader: React.FC<CardHeaderProps> = ({
  product,
  imageLoaded,
  togglingId,
  onToggleActive
}) => {
  // Display categories and badges
  const renderCategoryBadge = () => {
    if (product.category) {
      return (
        <div className="absolute top-2 right-2 z-10">
          <Badge variant="secondary" className="bg-opacity-80 flex items-center gap-1">
            <Tag className="h-3 w-3" />
            {product.category}
          </Badge>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium line-clamp-1">{product.title}</h3>
          {product.price && (
            <p className="text-sm text-mansablue font-medium">{product.price}</p>
          )}
        </div>
        <Switch 
          checked={product.is_active} 
          disabled={togglingId === product.id}
          onCheckedChange={() => onToggleActive(product.id, product.is_active)}
          aria-label={product.is_active ? "Set product as inactive" : "Set product as active"}
          className="card-actions"
        />
      </div>
      <p className="text-sm text-gray-600 mt-2 line-clamp-3">
        {product.description}
      </p>
      {product.tags && (
        <div className="flex flex-wrap gap-1 mt-2">
          {product.tags.split(',').map((tag, i) => (
            <Badge key={i} variant="outline" className="text-xs">
              {tag.trim()}
            </Badge>
          ))}
        </div>
      )}
    </>
  );
};

export default CardHeader;
