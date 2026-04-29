import React, { useState } from 'react';
import { DirectoryPartner } from '@/types/partner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Copy, Share2, Check, Twitter, Linkedin, Facebook, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

interface SocialAssetsGeneratorProps {
  partner: DirectoryPartner;
}

interface SocialPost {
  id: string;
  platform: string;
  icon: React.ReactNode;
  content: string;
  hashtags: string[];
  characterLimit?: number;
}

const SocialAssetsGenerator: React.FC<SocialAssetsGeneratorProps> = ({ partner }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const socialPosts: SocialPost[] = [
    {
      id: 'twitter',
      platform: 'X / Twitter',
      icon: <Twitter className="w-4 h-4" />,
      characterLimit: 280,
      content: `🚀 We've partnered with @1325ai!

👑 Founding 100 Offer: first 100 businesses lock in Pro at $149/mo — forever (regular $249/mo).

Get discovered, connect B2B, build wealth.

Claim your spot:
${partner.referral_link}`,
      hashtags: ['BlackOwned', 'BuyBlack', 'SupportBlackBusiness'],
    },
    {
      id: 'linkedin',
      platform: 'LinkedIn',
      icon: <Linkedin className="w-4 h-4" />,
      content: `I'm thrilled to announce that ${partner.directory_name} has officially partnered with 1325.ai!

💰 THE VALUE: $700/month in business tools for just $100/month - that's a 7x ROI!

1325.ai is building the economic infrastructure for community businesses, offering:

✅ Business directory visibility to conscious consumers
✅ B2B marketplace for partnerships & supply chain
✅ Community-powered financing (Susu circles)
✅ Loyalty & engagement tools
✅ Economic impact tracking

If you're a business owner, this is your opportunity to join a movement focused on building generational wealth.

Founding 100 Offer — the first 100 businesses lock in Pro at just $149/mo, forever. After 100 spots, regular Pro is $249/mo. Spots are limited:
${partner.referral_link}

Let's circulate wealth and build legacy together. 💪`,
      hashtags: ['CommunityBusiness', 'EconomicEmpowerment', 'SupportLocal', 'BusinessGrowth', 'CommunityWealth'],
    },
    {
      id: 'facebook',
      platform: 'Facebook',
      icon: <Facebook className="w-4 h-4" />,
      content: `🎉 Big Announcement!

${partner.directory_name} has partnered with 1325.ai to bring you an amazing opportunity!

💰 GET $700/MONTH IN BUSINESS TOOLS FOR JUST $100/MONTH - THAT'S 7X YOUR INVESTMENT! 💰

1325.ai is the platform designed to help community businesses thrive. Here's what you get:

🔹 Get discovered by customers looking to support great businesses
🔹 Connect with other businesses for partnerships
🔹 Access community savings circles (Susu)
🔹 Build customer loyalty programs
🔹 Track your impact on the community

🔥 Founding 100 Offer: first 100 businesses lock in Pro at $149/mo forever (regular $249/mo). Claim a spot:
${partner.referral_link}

Tag a business owner who needs to see this! 👇`,
      hashtags: ['CommunityBusiness', 'SupportLocal', 'CommunityWealth'],
    },
    {
      id: 'whatsapp',
      platform: 'WhatsApp / SMS',
      icon: <MessageCircle className="w-4 h-4" />,
      content: `Hey! I wanted to share something with you. ${partner.directory_name} just partnered with 1325.ai — a platform for community businesses.

👑 Right now they're running a Founding 100 Offer — first 100 businesses lock in Pro at $149/mo forever (regular $249/mo).

You can get discovered by more customers, connect with other businesses, and access community savings circles.

Claim a spot here: ${partner.referral_link}

Let me know if you have questions!`,
      hashtags: [],
    },
  ];

  const copyToClipboard = async (post: SocialPost, includeHashtags: boolean = true) => {
    let text = post.content;
    if (includeHashtags && post.hashtags.length > 0) {
      text += '\n\n' + post.hashtags.map(h => `#${h}`).join(' ');
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(post.id);
      toast.success('Post copied to clipboard!');
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  const shareNatively = async (post: SocialPost) => {
    let text = post.content;
    if (post.hashtags.length > 0) {
      text += '\n\n' + post.hashtags.map(h => `#${h}`).join(' ');
    }

    if (navigator.share) {
      try {
        await navigator.share({
          text,
          url: partner.referral_link,
        });
      } catch (error) {
        // User cancelled or error
        copyToClipboard(post);
      }
    } else {
      copyToClipboard(post);
    }
  };

  const openPlatform = (post: SocialPost) => {
    let url = '';
    const text = encodeURIComponent(post.content);
    const hashtags = post.hashtags.join(',');

    switch (post.id) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${text}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(partner.referral_link)}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(partner.referral_link)}&quote=${text}`;
        break;
      case 'whatsapp':
        url = `https://wa.me/?text=${text}`;
        break;
    }

    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
    }
  };

  return (
    <Card className="bg-slate-800/60 backdrop-blur-xl border-slate-700/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Share2 className="w-5 h-5 text-amber-400" />
          Social Media Assets
        </CardTitle>
        <CardDescription className="text-slate-400">
          Ready-to-post content for each platform. Personalized with your referral link.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {socialPosts.map((post) => (
          <div 
            key={post.id} 
            className="border border-slate-700/50 rounded-lg p-4 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
                  {post.icon}
                </div>
                <span className="font-medium text-white">{post.platform}</span>
              </div>
              {post.characterLimit && (
                <Badge variant="outline" className="text-slate-400 border-slate-600">
                  {post.content.length}/{post.characterLimit} chars
                </Badge>
              )}
            </div>

            <Textarea
              readOnly
              value={post.content}
              className="bg-slate-900/60 border-slate-700 text-slate-300 min-h-[120px] text-sm resize-none"
            />

            {post.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.hashtags.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="secondary" 
                    className="bg-mansablue/20 text-blue-300 border-0"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                onClick={() => copyToClipboard(post)}
                className="bg-amber-500 hover:bg-amber-600 text-slate-900"
              >
                {copiedId === post.id ? (
                  <Check className="w-4 h-4 mr-2" />
                ) : (
                  <Copy className="w-4 h-4 mr-2" />
                )}
                {copiedId === post.id ? 'Copied!' : 'Copy Post'}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => openPlatform(post)}
                className="border-slate-600 text-slate-300 hover:bg-slate-800"
              >
                {post.icon}
                <span className="ml-2">Open {post.platform}</span>
              </Button>
            </div>
          </div>
        ))}

        <div className="bg-slate-900/40 rounded-lg p-4 border border-slate-700/30">
          <h4 className="font-medium text-amber-400 mb-2">📸 Pro Tips</h4>
          <ul className="text-sm text-slate-400 space-y-1">
            <li>• Add your own photos or brand graphics for higher engagement</li>
            <li>• Tag 1325.ai official accounts for potential reshares</li>
            <li>• Post during peak hours (10am-2pm, 7pm-9pm) for best reach</li>
            <li>• Engage with comments to boost visibility</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialAssetsGenerator;
