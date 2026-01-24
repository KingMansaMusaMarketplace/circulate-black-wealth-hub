import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Share2, Copy, CheckCircle, Users, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

interface CircleInviteLinkProps {
  circleId: string;
  circleName: string;
  contributionAmount: number;
  frequency: string;
}

const CircleInviteLink: React.FC<CircleInviteLinkProps> = ({
  circleId,
  circleName,
  contributionAmount,
  frequency
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const inviteUrl = `${window.location.origin}/susu-circles?join=${circleId}`;
  
  const inviteMessage = `Join my Susu Circle "${circleName}" on 1325.AI! 💰\n\n` +
    `• Contribution: $${contributionAmount} ${frequency}\n` +
    `• Secure escrow protection\n` +
    `• Build wealth together!\n\n` +
    `Join here: ${inviteUrl}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join ${circleName} Susu Circle`,
          text: inviteMessage,
          url: inviteUrl
        });
      } catch (error) {
        // User cancelled or error
      }
    } else {
      handleCopy();
    }
  };

  const handleWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(inviteMessage)}`;
    window.open(url, '_blank');
  };

  const handleSMS = () => {
    const url = `sms:?body=${encodeURIComponent(inviteMessage)}`;
    window.location.href = url;
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setDialogOpen(true)}
        className="border-mansagold/50 text-mansagold hover:bg-mansagold/10 gap-1.5"
      >
        <Share2 className="w-4 h-4" />
        Invite
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-mansagold" />
              Invite Friends to {circleName}
            </DialogTitle>
            <DialogDescription>
              Share this link with friends to invite them to your Susu Circle.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Invite Link */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Invite Link</label>
              <div className="flex gap-2">
                <Input
                  value={inviteUrl}
                  readOnly
                  className="bg-muted/50"
                />
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  className="gap-2 min-w-[100px]"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Share Options */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Share via</label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="flex-col h-auto py-3 gap-2"
                >
                  <Share2 className="w-5 h-5 text-mansagold" />
                  <span className="text-xs">Share</span>
                </Button>
                <Button
                  onClick={handleWhatsApp}
                  variant="outline"
                  className="flex-col h-auto py-3 gap-2"
                >
                  <MessageCircle className="w-5 h-5 text-emerald-500" />
                  <span className="text-xs">WhatsApp</span>
                </Button>
                <Button
                  onClick={handleSMS}
                  variant="outline"
                  className="flex-col h-auto py-3 gap-2"
                >
                  <MessageCircle className="w-5 h-5 text-blue-500" />
                  <span className="text-xs">SMS</span>
                </Button>
              </div>
            </div>

            {/* Circle Info Preview */}
            <div className="p-4 rounded-lg bg-mansagold/10 border border-mansagold/20">
              <p className="text-sm text-slate-300">
                <strong className="text-mansagold">Circle Details:</strong>
              </p>
              <ul className="text-sm text-slate-400 mt-2 space-y-1">
                <li>• Contribution: ${contributionAmount} {frequency}</li>
                <li>• Secure escrow protection</li>
                <li>• 1.5% platform fee at payout</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CircleInviteLink;
