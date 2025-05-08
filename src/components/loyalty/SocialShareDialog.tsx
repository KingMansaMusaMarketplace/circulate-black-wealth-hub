
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Share2, Twitter, Facebook, Linkedin, Link } from 'lucide-react';
import { useSocialShare } from '@/hooks/use-social-share';

interface SocialShareDialogProps {
  title: string;
  text: string;
  url?: string;
  customPath?: string; // For generating a custom URL
  triggerContent?: React.ReactNode;
}

export const SocialShareDialog: React.FC<SocialShareDialogProps> = ({
  title,
  text,
  url,
  customPath,
  triggerContent
}) => {
  const { shareWithNative, shareTargets, getShareUrl, canShare } = useSocialShare();
  const [open, setOpen] = React.useState(false);

  const shareUrl = url || (customPath ? getShareUrl(customPath) : window.location.href);
  
  const shareOptions = {
    title,
    text,
    url: shareUrl
  };
  
  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Try native sharing first
    if (canShare) {
      const shared = await shareWithNative(shareOptions);
      if (shared) return;
    }
    
    // If native sharing is not available or failed, open the dialog
    setOpen(true);
  };
  
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'twitter':
        return <Twitter className="h-5 w-5" />;
      case 'facebook':
        return <Facebook className="h-5 w-5" />;
      case 'linkedin':
        return <Linkedin className="h-5 w-5" />;
      case 'link':
        return <Link className="h-5 w-5" />;
      default:
        return <Share2 className="h-5 w-5" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerContent ? (
          <div onClick={handleShare} className="cursor-pointer">
            {triggerContent}
          </div>
        ) : (
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2" 
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share</DialogTitle>
          <DialogDescription>
            Share your loyalty reward with others
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3 py-4">
          {shareTargets.map((target) => (
            <Button
              key={target.name}
              className={`gap-2 ${target.color}`}
              onClick={() => {
                target.action(shareOptions);
                setOpen(false);
              }}
            >
              {getIconComponent(target.icon)}
              {target.name}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SocialShareDialog;
