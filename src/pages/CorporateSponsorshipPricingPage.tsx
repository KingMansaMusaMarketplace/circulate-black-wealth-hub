import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Check, Crown, Sparkles, Star, Zap, Loader2, Share2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { cn } from '@/lib/utils';
import { useCorporateCheckout } from '@/hooks/useCorporateCheckout';
import { useScreenshotMode } from '@/hooks/use-screenshot-mode';
import { useNativeShare } from '@/hooks/use-native-share';
import NotificationDemo from '@/components/sponsorship/NotificationDemo';
import { IOSPaymentBlocker } from '@/components/platform/IOSPaymentBlocker';

interface PricingTier {
  name: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  price: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  cta: string;
  popular?: boolean;
  borderClass: string;
  iconBg: string;
}

const CorporateSponsorshipPricingPage: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string>('');
  const [companyName, setCompanyName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const { startCheckout, isLoading } = useCorporateCheckout();
  const isScreenshotMode = useScreenshotMode();
  const { shareUrl, isSharing } = useNativeShare();

  const tiers: PricingTier[] = [
    {
      name: 'Bronze Partner',
      tier: 'bronze',
      price: '$500',
      description: 'Perfect for small businesses looking to support the community',
      icon: <Star className="h-6 w-6" />,
      borderClass: 'border-amber-300 hover:border-amber-400',
      iconBg: 'bg-amber-100 text-amber-700',
      features: [
        'Logo in website footer',
        'Monthly impact reports',
        'Basic analytics dashboard',
        'Certificate of sponsorship',
        'Tax deduction documentation',
      ],
      cta: 'Start Bronze Partnership',
    },
    {
      name: 'Silver Partner',
      tier: 'silver',
      price: '$1,500',
      description: 'Enhanced visibility for growing organizations',
      icon: <Sparkles className="h-6 w-6" />,
      borderClass: 'border-slate-300 hover:border-slate-400',
      iconBg: 'bg-slate-100 text-slate-700',
      features: [
        'All Bronze benefits',
        'Logo in business directory',
        'Social media recognition (monthly)',
        'Quarterly impact reports',
        'Priority email support',
        'Sponsor spotlight blog post',
      ],
      cta: 'Become Silver Partner',
    },
    {
      name: 'Gold Partner',
      tier: 'gold',
      price: '$5,000',
      description: 'Maximum impact for committed corporate partners',
      icon: <Crown className="h-6 w-6" />,
      popular: true,
      borderClass: 'border-mansagold hover:border-amber-500',
      iconBg: 'bg-mansagold/20 text-mansagold',
      features: [
        'All Silver benefits',
        'Logo on homepage & sidebar',
        'Featured placement on directory',
        'Social media recognition (weekly)',
        'Custom impact case study',
        'Co-branded marketing materials',
        'Invitation to exclusive events',
        'Dedicated account manager',
      ],
      cta: 'Become Gold Partner',
    },
    {
      name: 'Platinum Partner',
      tier: 'platinum',
      price: '$15,000',
      description: 'Premier partnership with maximum visibility and impact',
      icon: <Zap className="h-6 w-6" />,
      borderClass: 'border-mansablue hover:border-blue-700',
      iconBg: 'bg-mansablue/20 text-mansablue',
      features: [
        'All Gold benefits',
        'Top banner placement',
        'All platform logo placements',
        'Daily social media recognition',
        'Custom landing page',
        'Press release & PR support',
        'Executive networking opportunities',
        'Priority technical support',
        'Quarterly strategy sessions',
        'VIP event invitations',
      ],
      cta: 'Become Platinum Partner',
    },
  ];

  const handleCtaClick = (tier: string) => {
    setSelectedTier(tier);
    setIsDialogOpen(true);
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!companyName.trim()) {
      return;
    }

    await startCheckout({
      tier: selectedTier,
      companyName: companyName.trim(),
      logoUrl: logoUrl.trim() || undefined,
      websiteUrl: websiteUrl.trim() || undefined,
    });
  };

  const handleShare = async () => {
    const url = window.location.href;
    const title = 'Support Black-Owned Businesses - Corporate Sponsorship';
    const text = 'Partner with us to create real impact! Choose from Bronze, Silver, Gold, or Platinum sponsorship tiers and support economic empowerment.';
    
    await shareUrl(url, text, title);
  };

  return (
    <IOSPaymentBlocker>
      <Helmet>
        <title>Corporate Sponsorship - Support Black-Owned Businesses</title>
        <meta
          name="description"
          content="Become a corporate sponsor and make a real impact. Choose from Bronze, Silver, Gold, or Platinum partnership tiers. Get visibility while supporting economic empowerment."
        />
        <meta
          name="keywords"
          content="corporate sponsorship, Black-owned businesses, community support, corporate social responsibility, CSR, economic empowerment"
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-slate-50 to-amber-50">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 text-center">
          <Badge className="mb-4 bg-gradient-to-r from-mansablue to-blue-700 text-white border-0">
            Corporate Sponsorship
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Partner With Us to{' '}
            <span className="bg-gradient-to-r from-mansablue to-mansagold bg-clip-text text-transparent">Create Real Impact</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Your corporate sponsorship directly supports Black-owned businesses
            and strengthens communities. Choose a partnership tier that aligns
            with your company's values and budget.
          </p>
          <div className="flex flex-wrap gap-4 justify-center text-sm text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-mansablue" />
              <span>Tax Deductible</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-mansablue" />
              <span>Real-Time Impact Metrics</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-mansablue" />
              <span>Transparent Reporting</span>
            </div>
          </div>
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="lg"
              onClick={handleShare}
              disabled={isSharing}
              className="border-mansablue/30 text-mansablue hover:bg-mansablue/10"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share Opportunity
            </Button>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="container mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {tiers.map((tier) => (
              <Card
                key={tier.tier}
                className={cn(
                  'relative transition-all duration-300 hover:shadow-lg',
                  tier.borderClass,
                  tier.popular && 'ring-2 ring-primary shadow-xl scale-105'
                )}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-mansagold to-amber-600 text-white shadow-lg border-0">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center">
                  <div className={cn('w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center', tier.iconBg)}>
                    {tier.icon}
                  </div>
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <CardDescription className="text-sm mt-2 min-h-[3rem]">
                    {tier.description}
                  </CardDescription>
                  {!isScreenshotMode && (
                    <div className="mt-4 flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold">{tier.price}</span>
                      <span className="text-muted-foreground text-base">/month</span>
                    </div>
                  )}
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handleCtaClick(tier.tier)}
                    className={cn(
                      "w-full whitespace-normal h-auto py-3",
                      tier.popular && "bg-gradient-to-r from-mansagold to-amber-600 hover:from-amber-600 hover:to-mansagold text-white border-0"
                    )}
                    size="lg"
                    variant="default"
                  >
                    {tier.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Impact Section */}
        <section className="container mx-auto px-4 py-16 border-t border-mansablue/20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Your Impact, <span className="bg-gradient-to-r from-mansablue to-mansagold bg-clip-text text-transparent">Measured</span>
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              Every corporate sponsor receives real-time access to their
              dedicated impact dashboard, tracking the tangible difference your
              sponsorship makes.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="border-mansablue/20">
                <CardHeader>
                  <CardTitle className="text-3xl text-mansablue">25+</CardTitle>
                  <CardDescription>Businesses Supported</CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-mansablue/20">
                <CardHeader>
                  <CardTitle className="text-3xl text-mansablue">150+</CardTitle>
                  <CardDescription>Transactions Facilitated</CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-mansablue/20">
                <CardHeader>
                  <CardTitle className="text-3xl text-mansablue">1,500+</CardTitle>
                  <CardDescription>Community Members Reached</CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-mansablue/20">
                <CardHeader>
                  <CardTitle className="text-3xl bg-gradient-to-r from-mansablue to-mansagold bg-clip-text text-transparent">
                    {isScreenshotMode ? '345K+' : '$345K+'}
                  </CardTitle>
                  <CardDescription>Economic Impact Generated</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="container mx-auto px-4 py-16 bg-blue-50/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Become a <span className="bg-gradient-to-r from-mansablue to-mansagold bg-clip-text text-transparent">Corporate Sponsor?</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Measurable Impact</h3>
                <p className="text-muted-foreground">
                  Track exactly how your sponsorship supports Black-owned
                  businesses with real-time metrics and transparent reporting.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Brand Visibility</h3>
                <p className="text-muted-foreground">
                  Increase your brand awareness among socially conscious
                  consumers who value corporate responsibility.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Tax Benefits</h3>
                <p className="text-muted-foreground">
                  Your sponsorship is tax-deductible. We provide all necessary
                  documentation for your records.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Community Building</h3>
                <p className="text-muted-foreground">
                  Join a network of forward-thinking companies committed to
                  economic empowerment and social justice.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">ESG Alignment</h3>
                <p className="text-muted-foreground">
                  Strengthen your Environmental, Social, and Governance (ESG)
                  initiatives with quantifiable social impact.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Positive PR</h3>
                <p className="text-muted-foreground">
                  Generate positive press coverage and social media engagement
                  through authentic community support.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Notification Demo Section */}
        <NotificationDemo />

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold">
              Ready to Make an <span className="text-primary">Impact?</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Join leading companies in supporting economic empowerment and
              community development. Have questions? Our team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => handleCtaClick('platinum')}>
                Become a Sponsor
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="/contact">Contact Us</a>
              </Button>
            </div>
          </div>
        </section>

        {/* Company Details Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Complete Your Sponsorship</DialogTitle>
              <DialogDescription>
                Please provide your company details to proceed with {selectedTier} tier sponsorship.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">
                  Company Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="companyName"
                  placeholder="Acme Corporation"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="logoUrl">Company Logo URL (optional)</Label>
                <Input
                  id="logoUrl"
                  type="url"
                  placeholder="https://example.com/logo.png"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="websiteUrl">Company Website (optional)</Label>
                <Input
                  id="websiteUrl"
                  type="url"
                  placeholder="https://example.com"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <DialogFooter className="gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading || !companyName.trim()}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Proceed to Checkout
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </IOSPaymentBlocker>
  );
};

export default CorporateSponsorshipPricingPage;
