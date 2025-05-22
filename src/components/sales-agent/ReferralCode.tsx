
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Check, Share2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { logActivity } from '@/lib/utils/error-utils';

interface ReferralCodeProps {
  referralCode: string;
}

const ReferralCode: React.FC<ReferralCodeProps> = ({ referralCode }) => {
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [copying, setCopying] = useState(false);
  
  const referralUrl = `${window.location.origin}/?ref=${referralCode}`;

  const handleCopyCode = async () => {
    try {
      setCopying(true);
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      toast.success('Referral code copied to clipboard');
      
      // Log the copy event
      await logActivity('copy_referral_code', 'sales_agent', 'user');
      
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying code:', error);
      toast.error('Failed to copy referral code to clipboard');
    } finally {
      setCopying(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      setCopying(true);
      await navigator.clipboard.writeText(referralUrl);
      toast.success('Referral link copied to clipboard');
      
      // Log the copy link event
      await logActivity('copy_referral_link', 'sales_agent', 'user');
    } catch (error) {
      console.error('Error copying link:', error);
      toast.error('Failed to copy referral link to clipboard');
    } finally {
      setCopying(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        setSharing(true);
        await navigator.share({
          title: 'Join Mansa Musa Marketplace',
          text: 'Join Mansa Musa Marketplace using my referral code',
          url: referralUrl,
        });
        
        // Log the share event
        await logActivity('share_referral_link', 'sales_agent', 'user');
      } catch (error) {
        // User may have canceled sharing, only show error if it's not an abort error
        if (error.name !== 'AbortError') {
          console.error('Error sharing:', error);
          toast.error('Failed to share referral link');
        }
      } finally {
        setSharing(false);
      }
    } else {
      handleCopyLink();
    }
  };

  // Early failure detection for clipboard API
  const clipboardAvailable = !!navigator.clipboard;
  if (!clipboardAvailable) {
    console.warn('Clipboard API not available in this browser');
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Your Referral Code</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="bg-gray-100 px-4 py-2 rounded-md font-mono text-lg flex-1 text-center">
              {referralCode}
            </div>
            <Button
              size="icon"
              variant="outline"
              onClick={handleCopyCode}
              title="Copy referral code"
              disabled={copying || !clipboardAvailable}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              readOnly
              value={referralUrl}
              className="font-mono text-sm flex-1"
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 sm:flex-none"
                onClick={handleCopyLink}
                disabled={copying || !clipboardAvailable}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </Button>
              <Button
                variant="default"
                className="flex-1 sm:flex-none"
                onClick={handleShare}
                disabled={sharing}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          <div className="text-sm text-gray-500">
            <p>Share this code with potential customers and business owners. You'll earn 10% commission when they sign up.</p>
            {!clipboardAvailable && (
              <div className="flex items-center text-amber-600 mt-2">
                <AlertCircle className="h-4 w-4 mr-1" />
                <span>Copy functionality may not work in this browser.</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferralCode;
