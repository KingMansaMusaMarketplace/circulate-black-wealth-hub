
import React from 'react';
import { 
  Card, 
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  Pencil, 
  Trash2, 
  Eye
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
  index
}) => {
  return (
    <Card 
      key={product.id} 
      className={cn(
        "transition-all duration-300 hover:shadow-md", 
        product.is_active ? '' : 'opacity-70',
        animatingCardId === product.id ? 'ring-2 ring-primary scale-[1.02]' : '',
        "animate-fade-in"
      )}
      style={{ 
        animationDelay: `${index * 100}ms`,
      }}
      tabIndex={0}
    >
      <div 
        className="relative aspect-video overflow-hidden cursor-pointer"
        onClick={() => onView(product)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onView(product);
          }
        }}
        tabIndex={0}
        role="button"
        aria-label={`View details of ${product.title}`}
      >
        <img 
          src={product.image_url} 
          alt={product.title}
          className="object-cover w-full h-full transition-transform duration-500 hover:scale-110"
          loading="lazy"
        />
        {!product.is_active && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
            <span className="bg-black text-white text-xs px-2 py-1 rounded">Inactive</span>
          </div>
        )}
      </div>
      
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
          />
        </div>
        <p className="text-sm text-gray-600 mt-2 line-clamp-3">
          {product.description}
        </p>
      </CardContent>
      
      <CardFooter className="flex justify-end gap-2 pt-0">
        <Button 
          size="sm" 
          variant="outline"
          className="h-8 px-2 transition-colors hover:bg-gray-100"
          onClick={() => onView(product)}
          aria-label="View product details"
        >
          <Eye className="h-4 w-4" />
        </Button>
        
        {onEdit && (
          <Button 
            size="sm" 
            variant="outline"
            className="h-8 px-2 transition-colors hover:bg-gray-100"
            onClick={() => {
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
              className="h-8 px-2 transition-opacity hover:opacity-90"
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
    </Card>
  );
};

export default ProductCard;
