
import React, { useState } from 'react';
import { 
  Card, 
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { ProductImage } from '@/lib/api/product-api';
import { cn } from "@/lib/utils";
import { 
  CardButtons,
  CardHeader,
  DeleteProductDialog,
  ProductCardImage
} from './card';

interface ProductCardProps {
  product: ProductImage;
  animatingCardId: string | null;
  deletingId: string | null;
  togglingId: string | null;
  onToggleActive: (id: string, currentState: boolean) => Promise<void>;
  onDelete: (id: string, imageUrl: string) => Promise<void>;
  onEdit?: (product: ProductImage) => void;
  onView: (product: ProductImage) => void;
  onAnimate: (id: string) => void;
  index: number;
  isSelected: boolean;
  onToggleSelect: (id: string, selected: boolean) => void;
  selectionMode: boolean;
  layoutType?: 'grid' | 'list';
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  animatingCardId,
  deletingId,
  togglingId,
  onToggleActive,
  onDelete,
  onEdit,
  onView,
  onAnimate,
  index,
  isSelected,
  onToggleSelect,
  selectionMode,
  layoutType = 'grid'
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const cardClasses = cn(
    "transition-all duration-300 hover:shadow-md", 
    product.is_active ? '' : 'opacity-70',
    animatingCardId === product.id ? 'ring-2 ring-primary scale-[1.02]' : '',
    isSelected ? 'ring-2 ring-primary' : '',
    "animate-fade-in",
    layoutType === 'list' ? 'flex flex-row' : ''
  );

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger select when clicking buttons or other controls
    if (
      e.target instanceof HTMLButtonElement ||
      e.target instanceof HTMLInputElement ||
      (e.target as HTMLElement).closest('button') ||
      (e.target as HTMLElement).closest('.card-actions')
    ) {
      return;
    }
    
    if (selectionMode) {
      onToggleSelect(product.id, !isSelected);
    } else {
      onView(product);
    }
  };

  return (
    <Card 
      key={product.id} 
      className={cardClasses}
      style={{ 
        animationDelay: `${index * 100}ms`,
      }}
      tabIndex={0}
      onClick={handleCardClick}
    >
      <ProductCardImage
        product={product}
        selectionMode={selectionMode}
        isSelected={isSelected}
        onToggleSelect={onToggleSelect}
        layoutType={layoutType}
      />
      
      <div className={cn("flex flex-col", layoutType === 'list' && "flex-1")}>
        <CardContent className="pt-4">
          <CardHeader 
            product={product}
            imageLoaded={true}
            togglingId={togglingId}
            onToggleActive={onToggleActive}
          />
        </CardContent>
        
        <CardFooter className="flex justify-end gap-2 pt-0">
          <CardButtons 
            product={product}
            onEdit={onEdit}
            onView={onView}
            onAnimate={onAnimate}
            onOpenDeleteDialog={() => setIsDeleteDialogOpen(true)}
          />
          
          <DeleteProductDialog
            product={product}
            deletingId={deletingId}
            onDelete={onDelete}
            isOpen={isDeleteDialogOpen}
            setIsOpen={setIsDeleteDialogOpen}
          >
            <span style={{ display: 'none' }}></span>
          </DeleteProductDialog>
        </CardFooter>
      </div>
    </Card>
  );
};

export default ProductCard;
