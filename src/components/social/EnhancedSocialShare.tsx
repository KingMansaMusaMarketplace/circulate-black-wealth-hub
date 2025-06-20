
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Twitter, 
  Facebook, 
  Instagram, 
  Linkedin, 
  MessageCircle, 
  Copy, 
  Share2, 
  Check,
  Mail,
  Download
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';

export interface EnhancedSocialShareProps {
  businessId: string;
  businessName: string;
  businessDescription?: string;
  businessImage?: string;
  url?: string;
  className?: string;
  showStats?: boolean;
}

const EnhancedSocialShare: React.FC<EnhancedSocialShareProps> = ({
  businessId,
  businessName,
  businessDescription = '',
  businessImage,
  url,
  className = '',
  showStats = false,
}) => {
  const { user } = useAuth();
  const [copied, setCopied] = React.useState(false);
  const [shareStats, setShareStats] = React.useState<Record<string, number>>({});

  const shareUrl = url || window.location.href;
  const shareText = `Check out ${businessName} on Mansa Musa Marketplace - Supporting Black-owned businesses and building community wealth! 💰🚀`;
  
  React.useEffect(() => {
    if (showStats) {
      fetchShareStats();
    }
  }, [businessId, showStats]);

  const fetchShareStats = async () => {
    try {
      const { data, error } = await supabase
        .from('social_shares')
        .select('platform')
        .eq('business_id', businessId);

      if (error) throw error;

      const stats: Record<string, number> = {};
      data.forEach(share => {
        stats[share.platform] = (stats[share.platform] || 0) + 1;
      });
      setShareStats(stats);
    } catch (error) {
      console.error('Error fetching share stats:', error);
    }
  };

  const recordShare = async (platform: string) => {
    if (!user) return;

    try {
      await supabase.from('social_shares').insert({
        business_id: businessId,
        platform,
        shared_by: user.id,
        share_url: shareUrl
      });

      // Record analytics
      await supabase.rpc('record_business_metric', {
        p_business_id: businessId,
        p_metric_type: 'social_shares',
        p_metric_value: 1
      });

      if (showStats) {
        fetchShareStats();
      }
    } catch (error) {
      console.error('Error recording share:', error);
    }
  };

  const shareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}&hashtags=BlackOwnedBusiness,CommunityWealth,MansaMusaMarketplace`;
    window.open(twitterUrl, '_blank');
    recordShare('twitter');
    toast.success('Shared to Twitter!');
  };

  const shareToFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(facebookUrl, '_blank');
    recordShare('facebook');
    toast.success('Shared to Facebook!');
  };

  const shareToLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(businessName)}&summary=${encodeURIComponent(shareText)}`;
    window.open(linkedInUrl, '_blank');
    recordShare('linkedin');
    toast.success('Shared to LinkedIn!');
  };

  const shareToInstagram = () => {
    // Instagram doesn't have direct URL sharing, so copy text for user to paste
    navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
    recordShare('instagram');
    toast.success('Text copied! Open Instagram and paste in your story or post.');
  };

  const shareToWhatsApp = () => {
    const whatsAppUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
    window.open(whatsAppUrl, '_blank');
    recordShare('whatsapp');
    toast.success('Shared to WhatsApp!');
  };

  const shareViaEmail = () => {
    const emailUrl = `mailto:?subject=${encodeURIComponent(`Check out ${businessName}`)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`;
    window.open(emailUrl);
    recordShare('email');
    toast.success('Email client opened!');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      setCopied(true);
      recordShare('copy');
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const generateShareableImage = () => {
    // This would integrate with a service to generate branded share images
    toast.info('Shareable image feature coming soon!');
  };

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: businessName,
          text: shareText,
          url: shareUrl,
        });
        recordShare('native');
      } catch (error) {
        console.log('Native share cancelled or failed');
      }
    } else {
      copyToClipboard();
    }
  };

  const platforms = [
    { 
      name: 'Twitter', 
      icon: Twitter, 
      action: shareToTwitter, 
      color: 'bg-[#1DA1F2] hover:bg-[#0d95e8]',
      count: shareStats.twitter || 0
    },
    { 
      name: 'Facebook', 
      icon: Facebook, 
      action: shareToFacebook, 
      color: 'bg-[#1877F2] hover:bg-[#0e6adc]',
      count: shareStats.facebook || 0
    },
    { 
      name: 'LinkedIn', 
      icon: Linkedin, 
      action: shareToLinkedIn, 
      color: 'bg-[#0A66C2] hover:bg-[#0958a8]',
      count: shareStats.linkedin || 0
    },
    { 
      name: 'Instagram', 
      icon: Instagram, 
      action: shareToInstagram, 
      color: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
      count: shareStats.instagram || 0
    },
    { 
      name: 'WhatsApp', 
      icon: MessageCircle, 
      action: shareToWhatsApp, 
      color: 'bg-[#25D366] hover:bg-[#1ebe57]',
      count: shareStats.whatsapp || 0
    },
    { 
      name: 'Email', 
      icon: Mail, 
      action: shareViaEmail, 
      color: 'bg-gray-600 hover:bg-gray-700',
      count: shareStats.email || 0
    }
  ];

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-mansablue">Share {businessName}</h3>
            {navigator.share && (
              <Button onClick={nativeShare} variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3">
            {platforms.map((platform) => {
              const IconComponent = platform.icon;
              return (
                <div key={platform.name} className="text-center">
                  <Button
                    onClick={platform.action}
                    className={`w-full ${platform.color} text-white border-none mb-2`}
                    size="sm"
                  >
                    <IconComponent className="h-4 w-4" />
                  </Button>
                  <div className="text-xs text-gray-600">
                    {platform.name}
                    {showStats && platform.count > 0 && (
                      <div className="text-mansagold font-medium">
                        {platform.count} shares
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t pt-4 space-y-2">
            <Button
              onClick={copyToClipboard}
              variant="outline"
              className="w-full"
              size="sm"
            >
              {copied ? (
                <Check className="h-4 w-4 mr-2" />
              ) : (
                <Copy className="h-4 w-4 mr-2" />
              )}
              {copied ? 'Copied!' : 'Copy Link'}
            </Button>

            <Button
              onClick={generateShareableImage}
              variant="outline"
              className="w-full"
              size="sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Share Image
            </Button>
          </div>

          {showStats && (
            <div className="border-t pt-4">
              <div className="text-sm text-gray-600">
                Total shares: <span className="font-semibold text-mansablue">
                  {Object.values(shareStats).reduce((a, b) => a + b, 0)}
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedSocialShare;
