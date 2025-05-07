
import React, { useState } from 'react';
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
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Copy, 
  Share2,
  Check,
  Link as LinkIcon
} from "lucide-react";
import { toast } from "sonner";
import { ProductImage } from '@/lib/api/product-api';

interface ShareProductProps {
  product: ProductImage;
}

const ShareProduct: React.FC<ShareProductProps> = ({ product }) => {
  const [copied, setCopied] = useState(false);
  
  // Generate sharing URL (this would be replaced with your actual product URL)
  const shareUrl = `${window.location.origin}/product/${product.id}`;
  
  // Handle social media sharing
  const handleShare = (platform: string) => {
    let shareLink = '';
    const text = encodeURIComponent(`Check out ${product.title}`);
    const url = encodeURIComponent(shareUrl);
    
    switch (platform) {
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case 'linkedin':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case 'instagram':
        // Instagram doesn't have a direct share URL, but we'll show a toast
        toast.info("To share on Instagram, copy the link and paste it in your Instagram post");
        return;
    }
    
    // Open share window
    if (shareLink) {
      window.open(shareLink, '_blank', 'width=600,height=400');
    }
  };
  
  // Copy link to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };
  
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
          <Button 
            variant="outline" 
            size="sm" 
            className="px-3"
            onClick={copyToClipboard}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        
        <div className="flex justify-center gap-4 mt-4">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full bg-[#1877F2] text-white border-none hover:bg-[#0e6adc]"
            onClick={() => handleShare('facebook')}
          >
            <Facebook className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full bg-[#1DA1F2] text-white border-none hover:bg-[#0d95e8]"
            onClick={() => handleShare('twitter')}
          >
            <Twitter className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full bg-[#0A66C2] text-white border-none hover:bg-[#0958a8]"
            onClick={() => handleShare('linkedin')}
          >
            <Linkedin className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full bg-gradient-to-r from-[#405DE6] via-[#C13584] to-[#E1306C] text-white border-none"
            onClick={() => handleShare('instagram')}
          >
            <Instagram className="h-5 w-5" />
          </Button>
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
