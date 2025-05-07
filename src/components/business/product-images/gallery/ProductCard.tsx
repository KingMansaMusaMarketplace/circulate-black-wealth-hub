
import React from 'react';
import { 
  Card, 
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  Pencil, 
  Trash2, 
  Eye,
  Tag
} from "lucide-react";
import { ProductImage } from '@/lib/api/product-api';
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import ShareProduct from './ShareProduct';
import { Skeleton } from "@/components/ui/skeleton";

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
  const [imageLoaded, setImageLoaded] = React.useState(false);

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

  // Show category badge if present
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
    <Card 
      key={product.id} 
      className={cardClasses}
      style={{ 
        animationDelay: `${index * 100}ms`,
      }}
      tabIndex={0}
      onClick={handleCardClick}
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
      
      <div 
        className={cn(
          "relative overflow-hidden cursor-pointer",
          layoutType === 'grid' ? "aspect-video" : "w-24 h-24"
        )}
      >
        {!imageLoaded && (
          <Skeleton className="absolute inset-0" />
        )}
        <img 
          src={product.image_url} 
          alt={product.altText || product.title}
          className={cn(
            "object-cover w-full h-full transition-transform duration-500 hover:scale-110",
            !imageLoaded && "opacity-0"
          )}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
        />
        {renderCategoryBadge()}
        {!product.is_active && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
            <span className="bg-black text-white text-xs px-2 py-1 rounded">Inactive</span>
          </div>
        )}
      </div>
      
      <div className={cn("flex flex-col", layoutType === 'list' && "flex-1")}>
        <CardContent className="pt-4">
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
        </CardContent>
        
        <CardFooter className="flex justify-end gap-2 pt-0">
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
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                size="sm" 
                variant="destructive"
                className="h-8 px-2 transition-opacity hover:opacity-90 card-actions"
                aria-label="Delete product"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="animate-scale-in">
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Product</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{product.title}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(product.id, product.image_url)}
                  disabled={deletingId === product.id}
                  className="transition-transform hover:scale-105"
                >
                  {deletingId === product.id ? (
                    <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Deleting</>
                  ) : (
                    'Delete'
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </div>
    </Card>
  );
};

export default ProductCard;
