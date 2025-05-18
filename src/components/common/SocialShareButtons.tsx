
import React from 'react';
import { Button } from '@/components/ui/button';
import { Twitter, Facebook, Linkedin, Copy, Share2, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useSocialShare } from '@/hooks/use-social-share';

export interface SocialShareProps {
  title?: string;
  text?: string;
  url?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  showLabels?: boolean;
}

const SocialShareButtons: React.FC<SocialShareProps> = ({
  title,
  text,
  url,
  className = '',
  size = 'sm',
  variant = 'outline',
  showLabels = false,
}) => {
  const [copied, setCopied] = React.useState(false);
  const { shareTargets, shareWithNative, canShare } = useSocialShare();
  
  const options = { title, text, url };
  
  const handleShare = async () => {
    if (canShare) {
      await shareWithNative(options);
    } else {
      // Fallback to the first share target if native sharing isn't available
      if (shareTargets.length > 0) {
        await shareTargets[0].action(options);
      }
    }
  };
  
  const handleCopy = async () => {
    const shareUrl = url || window.location.href;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {canShare && (
        <Button 
          size={size} 
          variant={variant} 
          onClick={handleShare}
          className="rounded-full"
        >
          <Share2 className={`h-4 w-4 ${showLabels ? 'mr-2' : ''}`} />
          {showLabels && <span>Share</span>}
        </Button>
      )}
      
      <Button
        size={size}
        variant={variant}
        onClick={() => shareTargets.find(t => t.name === 'Twitter')?.action(options)}
        className="rounded-full bg-[#1DA1F2] text-white border-none hover:bg-[#0d95e8]"
      >
        <Twitter className={`h-4 w-4 ${showLabels ? 'mr-2' : ''}`} />
        {showLabels && <span>Twitter</span>}
      </Button>
      
      <Button
        size={size}
        variant={variant}
        onClick={() => shareTargets.find(t => t.name === 'Facebook')?.action(options)}
        className="rounded-full bg-[#1877F2] text-white border-none hover:bg-[#0e6adc]"
      >
        <Facebook className={`h-4 w-4 ${showLabels ? 'mr-2' : ''}`} />
        {showLabels && <span>Facebook</span>}
      </Button>
      
      <Button
        size={size}
        variant={variant}
        onClick={() => shareTargets.find(t => t.name === 'LinkedIn')?.action(options)}
        className="rounded-full bg-[#0A66C2] text-white border-none hover:bg-[#0958a8]"
      >
        <Linkedin className={`h-4 w-4 ${showLabels ? 'mr-2' : ''}`} />
        {showLabels && <span>LinkedIn</span>}
      </Button>
      
      <Button
        size={size}
        variant={variant}
        onClick={handleCopy}
        className="rounded-full"
      >
        {copied ? (
          <Check className={`h-4 w-4 ${showLabels ? 'mr-2' : ''}`} />
        ) : (
          <Copy className={`h-4 w-4 ${showLabels ? 'mr-2' : ''}`} />
        )}
        {showLabels && <span>{copied ? 'Copied!' : 'Copy Link'}</span>}
      </Button>
    </div>
  );
};

export default SocialShareButtons;
