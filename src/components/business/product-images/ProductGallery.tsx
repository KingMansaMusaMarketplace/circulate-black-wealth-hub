
import React from 'react';
import { 
  Card, 
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Pencil, Trash2, Loader2, ImageIcon } from "lucide-react";
import { ProductImage } from '@/lib/api/product-api';

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
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [togglingId, setTogglingId] = React.useState<string | null>(null);
  
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
      <div className="flex flex-col items-center justify-center py-20 text-center">
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {products.map(product => (
        <Card key={product.id} className={product.is_active ? '' : 'opacity-70'}>
          <div className="relative aspect-video overflow-hidden">
            <img 
              src={product.image_url} 
              alt={product.title}
              className="object-cover w-full h-full"
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
                onCheckedChange={() => handleToggleActive(product.id, product.is_active)}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2 line-clamp-3">
              {product.description}
            </p>
          </CardContent>
          
          <CardFooter className="flex justify-end gap-2 pt-0">
            {onEdit && (
              <Button 
                size="sm" 
                variant="outline"
                className="h-8 px-2"
                onClick={() => onEdit(product)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            
            <Button 
              size="sm" 
              variant="destructive"
              className="h-8 px-2"
              onClick={() => handleDelete(product.id, product.image_url)}
              disabled={deletingId === product.id}
            >
              {deletingId === product.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ProductGallery;
