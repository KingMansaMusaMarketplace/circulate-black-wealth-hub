import React, { useState } from 'react';
import { Download, Share2, Image, Mail, MessageSquare, FileText, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { nativeShare, copyToClipboard } from '@/utils/social-share';

interface MarketingMaterial {
  id: string;
  title: string;
  description: string;
  type: 'banner' | 'social' | 'email' | 'document';
  icon: typeof Image;
  downloadUrl?: string;
  shareText?: string;
  dimensions?: string;
}

const marketingMaterials: MarketingMaterial[] = [
  // Banners
  {
    id: 'banner-1',
    title: 'Hero Banner - Blue',
    description: 'Main promotional banner with Mansa Musa Marketplace branding',
    type: 'banner',
    icon: Image,
    dimensions: '1200x628px',
    downloadUrl: '#',
    shareText: 'Check out Mansa Musa Marketplace - Building Black Economic Power!'
  },
  {
    id: 'banner-2',
    title: 'Hero Banner - Gold',
    description: 'Alternative gold-themed promotional banner',
    type: 'banner',
    icon: Image,
    dimensions: '1200x628px',
    downloadUrl: '#',
    shareText: 'Join the economic revolution with Mansa Musa Marketplace!'
  },
  {
    id: 'banner-3',
    title: 'Square Social Banner',
    description: 'Perfect for Instagram and Facebook posts',
    type: 'banner',
    icon: Image,
    dimensions: '1080x1080px',
    downloadUrl: '#',
    shareText: 'Discover Black-owned businesses on Mansa Musa Marketplace'
  },
  // Social Templates
  {
    id: 'social-1',
    title: 'Instagram Story Template',
    description: 'Eye-catching story template with your referral code',
    type: 'social',
    icon: MessageSquare,
    dimensions: '1080x1920px',
    downloadUrl: '#',
    shareText: 'Join me on Mansa Musa Marketplace!'
  },
  {
    id: 'social-2',
    title: 'Facebook Post Template',
    description: 'Engaging post template for Facebook sharing',
    type: 'social',
    icon: MessageSquare,
    dimensions: '1200x630px',
    downloadUrl: '#',
    shareText: 'Support Black businesses with Mansa Musa Marketplace'
  },
  {
    id: 'social-3',
    title: 'Twitter/X Card',
    description: 'Twitter card template optimized for engagement',
    type: 'social',
    icon: MessageSquare,
    dimensions: '1200x675px',
    downloadUrl: '#',
    shareText: 'Building economic power in the Black community'
  },
  {
    id: 'social-4',
    title: 'LinkedIn Post',
    description: 'Professional template for LinkedIn networking',
    type: 'social',
    icon: MessageSquare,
    dimensions: '1200x627px',
    downloadUrl: '#',
    shareText: 'Professional networking meets economic empowerment'
  },
  // Email Templates
  {
    id: 'email-1',
    title: 'Introduction Email',
    description: 'Template for introducing businesses to the platform',
    type: 'email',
    icon: Mail,
    downloadUrl: '#',
    shareText: 'Introduce businesses to Mansa Musa Marketplace'
  },
  {
    id: 'email-2',
    title: 'Follow-up Email',
    description: 'Follow-up template for interested prospects',
    type: 'email',
    icon: Mail,
    downloadUrl: '#',
    shareText: 'Follow up with potential referrals'
  },
  {
    id: 'email-3',
    title: 'Benefits Overview Email',
    description: 'Detailed benefits explanation for business owners',
    type: 'email',
    icon: Mail,
    downloadUrl: '#',
    shareText: 'Share the benefits of joining our marketplace'
  },
  // Documents
  {
    id: 'doc-1',
    title: 'One-Page Overview',
    description: 'Quick reference sheet about the marketplace',
    type: 'document',
    icon: FileText,
    downloadUrl: '#',
    shareText: 'Learn about Mansa Musa Marketplace'
  },
  {
    id: 'doc-2',
    title: 'Presentation Deck',
    description: 'Complete presentation for business pitches',
    type: 'document',
    icon: FileText,
    downloadUrl: '#',
    shareText: 'Professional pitch deck for referrals'
  },
  {
    id: 'doc-3',
    title: 'FAQ Sheet',
    description: 'Frequently asked questions and answers',
    type: 'document',
    icon: FileText,
    downloadUrl: '#',
    shareText: 'Common questions about joining the marketplace'
  }
];

const MarketingMaterialsPage: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('all');

  const handleDownload = (material: MarketingMaterial) => {
    toast({
      title: "Download Started",
      description: `${material.title} is being downloaded...`,
    });
    // In production, this would trigger actual file download
  };

  const handleShare = async (material: MarketingMaterial) => {
    const shareData = {
      title: material.title,
      text: material.shareText || material.description,
      url: window.location.origin
    };

    const shared = await nativeShare(shareData);
    if (!shared) {
      await copyToClipboard(shareData.url);
      toast({
        title: "Link Copied",
        description: "Share link copied to clipboard",
      });
    }
  };

  const filterMaterials = (type: string) => {
    if (type === 'all') return marketingMaterials;
    return marketingMaterials.filter(m => m.type === type);
  };

  const filteredMaterials = filterMaterials(activeTab);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/sales-agent-dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Marketing Materials Hub</h1>
              <p className="text-muted-foreground text-lg">
                Download promotional content to boost your referral efforts
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="all">All Materials</TabsTrigger>
            <TabsTrigger value="banner">Banners</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
            <TabsTrigger value="email">Email Templates</TabsTrigger>
            <TabsTrigger value="document">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMaterials.map((material) => {
                const Icon = material.icon;
                return (
                  <Card key={material.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{material.title}</CardTitle>
                            {material.dimensions && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {material.dimensions}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="mb-4">
                        {material.description}
                      </CardDescription>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => handleDownload(material)}
                          className="flex-1"
                          size="sm"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                        <Button
                          onClick={() => handleShare(material)}
                          variant="outline"
                          size="sm"
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* Usage Tips */}
        <Card className="mt-8 bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-xl">Marketing Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              • <strong>Personalize your outreach:</strong> Add your referral code to all shared materials
            </p>
            <p className="text-sm text-muted-foreground">
              • <strong>Use social proof:</strong> Share success stories and testimonials
            </p>
            <p className="text-sm text-muted-foreground">
              • <strong>Be consistent:</strong> Post regularly across all platforms
            </p>
            <p className="text-sm text-muted-foreground">
              • <strong>Track results:</strong> Monitor which materials drive the most referrals
            </p>
            <p className="text-sm text-muted-foreground">
              • <strong>Engage authentically:</strong> Share your genuine passion for economic empowerment
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MarketingMaterialsPage;
