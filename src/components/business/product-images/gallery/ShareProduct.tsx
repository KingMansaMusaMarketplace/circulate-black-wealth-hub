
import React from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link as LinkIcon, Share2 } from "lucide-react";
import { ProductImage } from '@/lib/api/product-image';
import SocialShareButtons from '@/components/common/SocialShareButtons';

interface ShareProductProps {
  product: ProductImage;
}

const ShareProduct: React.FC<ShareProductProps> = ({ product }) => {
  // Generate sharing URL (this would be replaced with your actual product URL)
  const shareUrl = `${window.location.origin}/product/${product.id}`;
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          size="sm" 
          variant="outline" 
          className="h-8 px-2 transition-colors hover:bg-gray-100 card-actions"
          onClick={(e) => e.stopPropagation()}
          aria-label="Share product"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share "{product.title}"</DialogTitle>
          <DialogDescription>
            Share this product with your network
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center space-x-2 mt-4">
          <div className="grid flex-1">
            <div className="flex items-center border rounded-md pl-3">
              <LinkIcon className="h-4 w-4 text-gray-400 mr-2" />
              <Input 
                value={shareUrl} 
                readOnly 
                className="border-0 focus-visible:ring-0"
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-center mt-4">
          <SocialShareButtons 
            url={shareUrl}
            title={product.title}
            text={product.description || `Check out this product: ${product.title}`}
            size="sm"
            showLabels={true}
            className="justify-center flex-wrap"
          />
        </div>
        
        <DialogFooter className="sm:justify-start">
          <DialogDescription>
            Share on social media or copy the link directly
          </DialogDescription>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareProduct;
