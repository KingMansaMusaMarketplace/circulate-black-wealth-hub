
import React from 'react';
import { Link } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ShareDialog: React.FC<ShareDialogProps> = ({ open, onOpenChange }) => {
  // Function to copy link to clipboard
  const copyLinkToClipboard = () => {
    // Using a branded URL instead of the default Lovable URL
    const brandedLink = "https://mansamusa.com/sponsorship/agreement";
    navigator.clipboard.writeText(brandedLink)
      .then(() => {
        toast.success("Link copied to clipboard!");
      })
      .catch(() => {
        toast.error("Failed to copy link. Please try again.");
      });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl text-center mb-2">Share Sponsorship Agreement</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-center text-gray-600">
            Share this agreement with potential sponsors or team members.
          </p>
          <div className="flex items-center w-full max-w-md mx-auto rounded-md border overflow-hidden">
            <div className="flex-1 bg-gray-50 px-3 py-2 text-sm truncate">
              https://mansamusa.com/sponsorship/agreement
            </div>
            <Button 
              variant="ghost"
              onClick={copyLinkToClipboard}
              className="rounded-none h-full px-3"
            >
              <Link className="h-4 w-4" />
              <span className="sr-only">Copy link</span>
            </Button>
          </div>
          <div className="flex justify-center space-x-4 mt-6">
            <Button 
              onClick={() => onOpenChange(false)}
              className="bg-mansablue hover:bg-mansablue-dark w-full"
            >
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
