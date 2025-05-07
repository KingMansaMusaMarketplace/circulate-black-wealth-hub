
import React from 'react';
import { ProductImage } from '@/lib/api/product-api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ProductDetailDialogProps {
  product: ProductImage | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProductDetailDialog: React.FC<ProductDetailDialogProps> = ({
  product,
  isOpen,
  onOpenChange
}) => {
  if (!product) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl animate-enter">
        <DialogHeader>
          <DialogTitle>{product.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="aspect-video overflow-hidden rounded-md">
            <img 
              src={product.image_url} 
              alt={product.title}
              className="object-contain w-full h-full transition-all duration-500 hover:scale-105"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-medium">{product.title}</h3>
                {product.price && (
                  <p className="text-lg text-mansablue font-medium">{product.price}</p>
                )}
              </div>
              <div className="flex items-center">
                <span className="text-sm mr-2">Status:</span>
                <span className={`text-sm font-medium px-2 py-1 rounded transition-colors duration-300 ${
                  product.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {product.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium text-gray-700 mb-1">Description:</h4>
              <p className="text-gray-600">{product.description}</p>
            </div>
            
            <div className="pt-4 border-t text-sm text-gray-500">
              <p>Created: {new Date(product.created_at || '').toLocaleDateString()}</p>
              {product.updated_at && (
                <p>Last updated: {new Date(product.updated_at).toLocaleDateString()}</p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailDialog;
