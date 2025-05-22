
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Link as LinkIcon,
  Copy,
} from 'lucide-react';
import { toast } from 'sonner';

interface SocialShareDialogProps {
  title: string;
  text: string;
  customPath?: string;
  triggerContent: React.ReactNode;
}

const SocialShareDialog: React.FC<SocialShareDialogProps> = ({
  title,
  text,
  customPath,
  triggerContent,
}) => {
  const getShareUrl = () => {
    const baseUrl = window.location.origin;
    const path = customPath || window.location.pathname;
    return `${baseUrl}${path}`;
  };

  const shareUrl = getShareUrl();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success('Link copied to clipboard');
  };

  const handleShare = async (platform: string) => {
    let shareLink = '';
    
    switch (platform) {
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(text)}`;
        break;
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`;
        break;
      case 'linkedin':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'email':
        shareLink = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${text}\n\n${shareUrl}`)}`;
        break;
      default:
        return;
    }
    
    // Open share link in a new window
    window.open(shareLink, '_blank', 'noopener,noreferrer');
    toast.success(`Shared on ${platform}`);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {triggerContent}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share</DialogTitle>
          <DialogDescription>
            Share your loyalty achievements with friends and family
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-4 gap-4 py-4">
          <Button
            variant="outline"
            size="icon"
            className="flex flex-col items-center gap-1 h-auto p-3"
            onClick={() => handleShare('facebook')}
          >
            <Facebook className="h-5 w-5 text-blue-600" />
            <span className="text-xs">Facebook</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="flex flex-col items-center gap-1 h-auto p-3"
            onClick={() => handleShare('twitter')}
          >
            <Twitter className="h-5 w-5 text-blue-400" />
            <span className="text-xs">Twitter</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="flex flex-col items-center gap-1 h-auto p-3"
            onClick={() => handleShare('linkedin')}
          >
            <Linkedin className="h-5 w-5 text-blue-700" />
            <span className="text-xs">LinkedIn</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="flex flex-col items-center gap-1 h-auto p-3"
            onClick={() => handleShare('email')}
          >
            <Mail className="h-5 w-5 text-gray-600" />
            <span className="text-xs">Email</span>
          </Button>
        </div>
        <div className="flex items-center border rounded-md px-3 py-2">
          <LinkIcon className="h-4 w-4 mr-2 text-gray-500" />
          <input 
            className="flex-1 bg-transparent outline-none text-sm text-gray-700" 
            value={shareUrl} 
            readOnly 
          />
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleCopyLink}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogTrigger asChild>
            <Button variant="secondary">Done</Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SocialShareDialog;
