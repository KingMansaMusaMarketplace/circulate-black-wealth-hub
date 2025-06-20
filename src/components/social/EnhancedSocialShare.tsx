import React, { useState } from 'react';
import { Share2, Facebook, Twitter, Linkedin, Mail, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface EnhancedSocialShareProps {
  url: string;
  title: string;
  description: string;
  media?: string;
  className?: string;
}

const EnhancedSocialShare: React.FC<EnhancedSocialShareProps> = ({ 
  url, 
  title, 
  description, 
  media,
  className = ''
}) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  const emailShareUrl = `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0D%0A%0D%0ACheck it out: ${encodedUrl}`;

  const handleCopyClick = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className={`flex items-center ${className}`}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <a href={facebookShareUrl} target="_blank" rel="noopener noreferrer">
              <Facebook className="mr-2 h-4 w-4" /> Facebook
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href={twitterShareUrl} target="_blank" rel="noopener noreferrer">
              <Twitter className="mr-2 h-4 w-4" /> Twitter
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href={linkedinShareUrl} target="_blank" rel="noopener noreferrer">
              <Linkedin className="mr-2 h-4 w-4" /> LinkedIn
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href={emailShareUrl} target="_blank" rel="noopener noreferrer">
              <Mail className="mr-2 h-4 w-4" /> Email
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCopyClick}>
            <Copy className="mr-2 h-4 w-4" /> Copy link
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon" className="ml-2">
            <Copy className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Share this link</DialogTitle>
            <DialogDescription>
              Anyone with this link can view this page.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="link" className="text-right">
                Link
              </Label>
              <Input id="link" value={url} className="col-span-3" readOnly />
            </div>
          </div>
          <Button onClick={handleCopyClick} className="w-full">
            {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
            {copied ? 'Copied!' : 'Copy link'}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnhancedSocialShare;
