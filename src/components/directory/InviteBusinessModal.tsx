import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Copy, 
  Mail, 
  Building2, 
  Sparkles,
  Gift,
  Check,
  Loader2
} from 'lucide-react';
import { useBusinessInvitations } from '@/hooks/use-business-invitations';
import { useAuth } from '@/contexts/AuthContext';
import { ExternalLead } from '@/hooks/use-claim-business';
import { toast } from 'sonner';

interface InviteBusinessModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledLead?: ExternalLead | null;
}

export const InviteBusinessModal: React.FC<InviteBusinessModalProps> = ({
  isOpen,
  onClose,
  prefilledLead
}) => {
  const { user } = useAuth();
  const { sendInvitation, isSending, getInviteLink, copyInviteLink, stats } = useBusinessInvitations();
  
  const [email, setEmail] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);

  // Prefill from lead if provided
  useEffect(() => {
    if (prefilledLead) {
      setBusinessName(prefilledLead.business_name);
      // Try to extract email from contact_info if available
      const contactInfo = prefilledLead.contact_info;
      if (contactInfo?.email) {
        setEmail(contactInfo.email);
      }
    }
  }, [prefilledLead]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    sendInvitation({
      email: email.trim(),
      businessName: businessName.trim() || undefined,
      message: message.trim() || undefined,
    }, {
      onSuccess: () => {
        setEmail('');
        setBusinessName('');
        setMessage('');
        onClose();
      }
    });
  };

  const handleCopyLink = () => {
    copyInviteLink();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!user) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Sign in Required</DialogTitle>
            <DialogDescription className="text-slate-400">
              Please sign in to invite businesses to the platform.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={onClose} className="w-full">
            Close
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-slate-900 to-slate-800 border-purple-500/20 max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <Building2 className="h-5 w-5 text-purple-400" />
            </div>
            <DialogTitle className="text-xl text-white">Invite a Business</DialogTitle>
          </div>
          <DialogDescription className="text-slate-400">
            Help grow our community by inviting Black-owned businesses to join the platform.
          </DialogDescription>
        </DialogHeader>

        {/* Rewards banner */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
          <Gift className="h-5 w-5 text-purple-400" />
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Earn Rewards!</p>
            <p className="text-xs text-slate-400">Get 100 points when they sign up</p>
          </div>
          <Badge className="bg-purple-500/20 text-purple-300 border-0">
            {stats.signedUp} converted
          </Badge>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-300">Business Email *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="owner@business.com"
                className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessName" className="text-slate-300">Business Name (optional)</Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input
                id="businessName"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Business name"
                className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-slate-300">Personal Message (optional)</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a personal note to your invitation..."
              className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 resize-none"
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={isSending || !email.trim()}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isSending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Invitation
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-700" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-slate-900 px-2 text-slate-500">Or share your link</span>
          </div>
        </div>

        {/* Share link section */}
        <div className="space-y-2">
          <Label className="text-slate-300">Your Referral Link</Label>
          <div className="flex gap-2">
            <Input
              value={getInviteLink()}
              readOnly
              className="bg-slate-800/50 border-slate-700 text-slate-300 text-sm"
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleCopyLink}
              className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20 shrink-0"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-slate-500">
            Share this link on social media or anywhere else!
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
