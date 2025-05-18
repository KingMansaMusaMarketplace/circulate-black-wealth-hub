
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Share2, Copy, Check } from "lucide-react";
import { useSocialShare } from "@/hooks/use-social-share";
import { toast } from 'sonner';

interface SocialShareDialogProps {
  title: string;
  path: string;
  description?: string;
  children?: React.ReactNode;
}

const SocialShareDialog: React.FC<SocialShareDialogProps> = ({ title, path, description, children }) => {
  const { shareTargets, getShareUrl } = useSocialShare();
  const [copied, setCopied] = React.useState(false);
  
  const shareUrl = getShareUrl(path);
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || (
          <Button 
            variant="outline" 
            size="sm"
            className="flex gap-2 items-center"
          >
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share</DialogTitle>
          <DialogDescription>
            Share this link with your network
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center space-x-2 py-4">
          <div className="grid flex-1 gap-2">
            <div className="flex items-center border rounded-md pl-3">
              <Input 
                value={shareUrl} 
                readOnly 
                className="border-0 focus-visible:ring-0"
              />
            </div>
          </div>
          <Button 
            type="submit" 
            size="icon" 
            onClick={handleCopy}
            className={copied ? "bg-green-600 hover:bg-green-700" : ""}
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        <div className="flex justify-center gap-4 py-2">
          {shareTargets.map((target) => (
            <Button
              key={target.name}
              size="icon"
              variant="outline"
              onClick={() => target.action({ title, text: description, url: shareUrl })}
              className={`rounded-full ${target.color}`}
              aria-label={`Share on ${target.name}`}
            >
              {/* Use proper icon component based on target.icon string */}
              <span className="sr-only">Share on {target.name}</span>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SocialShareDialog;
