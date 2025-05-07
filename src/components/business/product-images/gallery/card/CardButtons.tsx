
import React from 'react';
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Eye } from "lucide-react";
import { ProductImage } from '@/lib/api/product-api';
import ShareProduct from '../ShareProduct';

interface CardButtonsProps {
  product: ProductImage;
  onEdit?: (product: ProductImage) => void;
  onView: (product: ProductImage) => void;
  onAnimate: (id: string) => void;
  onOpenDeleteDialog: () => void;
}

const CardButtons: React.FC<CardButtonsProps> = ({
  product,
  onEdit,
  onView,
  onAnimate,
  onOpenDeleteDialog
}) => {
  return (
    <div className="flex justify-end gap-2">
      <Button 
        size="sm" 
        variant="outline"
        className="h-8 px-2 transition-colors hover:bg-gray-100 card-actions"
        onClick={(e) => {
          e.stopPropagation();
          onView(product);
        }}
        aria-label="View product details"
      >
        <Eye className="h-4 w-4" />
      </Button>
      
      <ShareProduct product={product} />
      
      {onEdit && (
        <Button 
          size="sm" 
          variant="outline"
          className="h-8 px-2 transition-colors hover:bg-gray-100 card-actions"
          onClick={(e) => {
            e.stopPropagation();
            onAnimate(product.id);
            onEdit(product);
          }}
          aria-label="Edit product"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      )}
      
      <Button 
        size="sm" 
        variant="destructive"
        className="h-8 px-2 transition-opacity hover:opacity-90 card-actions"
        aria-label="Delete product"
        onClick={(e) => {
          e.stopPropagation();
          onOpenDeleteDialog();
        }}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default CardButtons;
