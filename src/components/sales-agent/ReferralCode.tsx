
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Check, Share2 } from 'lucide-react';
import { toast } from 'sonner';

interface ReferralCodeProps {
  referralCode: string;
}

const ReferralCode: React.FC<ReferralCodeProps> = ({ referralCode }) => {
  const [copied, setCopied] = useState(false);
  
  const referralUrl = `${window.location.origin}/?ref=${referralCode}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    toast.success('Referral code copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralUrl);
    toast.success('Referral link copied to clipboard');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Mansa Musa Marketplace',
          text: 'Join Mansa Musa Marketplace using my referral code',
          url: referralUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      handleCopyLink();
    }
  };

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
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </Button>
              <Button
                variant="default"
                className="flex-1 sm:flex-none"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          <div className="text-sm text-gray-500">
            <p>Share this code with potential customers and business owners. You'll earn 10% commission when they sign up.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferralCode;
