
import React, { useCallback } from 'react';
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
  text?: string;
  description?: string;
  path?: string;
  customPath?: string;
  triggerContent?: React.ReactNode;
  children?: React.ReactNode;
}

const SocialShareDialog: React.FC<SocialShareDialogProps> = ({ 
  title, 
  text, 
  path, 
  customPath,
  description, 
  triggerContent,
  children 
}) => {
  const { shareTargets, getShareUrl, share } = useSocialShare();
  const [copied, setCopied] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  
  // Use either customPath or path or fallback to current path
  const shareUrl = getShareUrl(customPath || path || window.location.pathname);
  
  const handleCopy = useCallback(async () => {
    try {
      // Copy to clipboard with a rate limit
      const shareCount = parseInt(localStorage.getItem('share_count') || '0', 10);
      const lastShareTime = parseInt(localStorage.getItem('last_share_time') || '0', 10);
      const now = Date.now();
      
      // Rate limit to 5 shares per minute
      if (shareCount >= 5 && (now - lastShareTime) < 60000) {
        toast.error('Please wait before sharing again');
        return;
      }
      
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard');
      
      // Store share count and time for rate limiting
      localStorage.setItem('share_count', (shareCount + 1).toString());
      localStorage.setItem('last_share_time', now.toString());
      
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
      toast.error('Failed to copy link');
    }
  }, [shareUrl]);
  
  // Reset share count after 1 minute
  React.useEffect(() => {
    const interval = setInterval(() => {
      const lastShareTime = parseInt(localStorage.getItem('last_share_time') || '0', 10);
      const now = Date.now();
      
      if ((now - lastShareTime) > 60000) {
        localStorage.setItem('share_count', '0');
      }
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Security: Sanitize URLs before sharing
  const sanitizeUrl = (url: string): string => {
    try {
      // Only allow specific origins or relative URLs
      const urlObj = new URL(url, window.location.origin);
      const allowedHosts = [
        window.location.hostname,
        'mansamusa.app',
        'www.mansamusa.app'
      ];
      
      if (!allowedHosts.includes(urlObj.hostname)) {
        console.warn('Blocked potentially unsafe URL:', url);
        return window.location.href;
      }
      
      return urlObj.toString();
    } catch (error) {
      console.error('Invalid URL:', error);
      return window.location.href;
    }
  };
  
  // Handle share click with security check
  const handleShareClick = useCallback((target: any, data: any) => {
    const sanitizedData = {
      ...data,
      url: sanitizeUrl(data.url)
    };
    
    target.action(sanitizedData);
    setOpen(false);
  }, []);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerContent || children || (
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
            {description || "Share this link with your network"}
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
              onClick={() => handleShareClick(target, { title, text: text || description, url: shareUrl })}
              className={`rounded-full ${target.color}`}
              aria-label={`Share on ${target.name}`}
            >
              {/* Icon would be rendered here */}
              <span className="sr-only">Share on {target.name}</span>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SocialShareDialog;
