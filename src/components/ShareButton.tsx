import React, { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const ShareButton: React.FC = () => {
  const [copied, setCopied] = useState(false);
  
  const shareUrl = window.location.origin;
  const shareTitle = "Join Mansa Musa Marketplace";
  const shareText = "Check out Mansa Musa Marketplace - join me in building Black wealth together! Help us reach 1 million members. 💪";

  const handleShare = async () => {
    // Check if Web Share API is available (mobile devices)
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        toast.success('Thanks for sharing! 🎉');
      } catch (error) {
        // User cancelled the share, no error needed
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Error sharing:', error);
        }
      }
    } else {
      // Fallback for desktop: copy to clipboard
      try {
        await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
        setCopied(true);
        toast.success('Link copied! Share with your community 💙');
        
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      } catch (error) {
        console.error('Error copying to clipboard:', error);
        toast.error('Failed to copy link');
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="fixed right-4 md:right-8 bottom-40 md:bottom-32 z-50"
    >
      <Button
        onClick={handleShare}
        size="lg"
        className="relative group shadow-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 hover:from-violet-700 hover:via-fuchsia-700 hover:to-pink-700 text-white border-0 rounded-full h-14 px-6 flex items-center gap-2 transition-all hover:scale-105"
      >
        <AnimatePresence mode="wait">
          {copied ? (
            <motion.div
              key="check"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="flex items-center gap-2"
            >
              <Check className="h-5 w-5" />
              <span className="hidden md:inline font-semibold">Copied!</span>
            </motion.div>
          ) : (
            <motion.div
              key="share"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="flex items-center gap-2"
            >
              <Share2 className="h-5 w-5" />
              <span className="hidden md:inline font-semibold">Share with Family</span>
              <span className="md:hidden font-semibold">Share</span>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Animated pulse ring */}
        <span className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 animate-ping opacity-20"></span>
      </Button>
      
      {/* Tooltip for desktop */}
      <div className="hidden lg:block absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
        <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg">
          Help us reach 1M members! 💙
        </div>
      </div>
    </motion.div>
  );
};

export default ShareButton;
