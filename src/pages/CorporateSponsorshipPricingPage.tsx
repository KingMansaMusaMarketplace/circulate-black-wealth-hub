import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Check, Crown, Sparkles, Star, Zap, Loader2, Share2, ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { cn } from '@/lib/utils';
import { useCorporateCheckout } from '@/hooks/useCorporateCheckout';
import { useScreenshotMode } from '@/hooks/use-screenshot-mode';
import { useNativeShare } from '@/hooks/use-native-share';
import NotificationDemo from '@/components/sponsorship/NotificationDemo';
import SponsorshipMediaKit from '@/components/sponsorship/SponsorshipMediaKit';
import { IOSPaymentBlocker } from '@/components/platform/IOSPaymentBlocker';
import { motion } from 'framer-motion';

interface PricingTier {
  name: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  price: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  cta: string;
  popular?: boolean;
  gradient: string;
  bgGlow: string;
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
      icon: <Star className="h-6 w-6 text-white" />,
      gradient: 'from-amber-600 to-amber-700',
      bgGlow: 'rgba(217, 119, 6, 0.15)',
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
      icon: <Sparkles className="h-6 w-6 text-white" />,
      gradient: 'from-slate-400 to-slate-500',
      bgGlow: 'rgba(148, 163, 184, 0.15)',
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
      icon: <Crown className="h-6 w-6 text-white" />,
      popular: true,
      gradient: 'from-amber-400 via-yellow-400 to-orange-400',
      bgGlow: 'rgba(251, 191, 36, 0.2)',
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
      icon: <Zap className="h-6 w-6 text-white" />,
      gradient: 'from-violet-400 via-purple-400 to-fuchsia-400',
      bgGlow: 'rgba(167, 139, 250, 0.15)',
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

      <div className="min-h-screen bg-gradient-to-b from-mansablue-dark via-mansablue to-mansablue-dark relative overflow-hidden">
        {/* Premium ambient background */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-mansagold/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-400/5 rounded-full blur-[150px]" />
        </div>

        {/* Grid pattern overlay */}
        <div 
          className="fixed inset-0 pointer-events-none opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />

        {/* Animated gold particles */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-mansagold rounded-full"
              initial={{ 
                x: `${Math.random() * 100}%`, 
                y: '100%',
                opacity: 0 
              }}
              animate={{ 
                y: '-10%',
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 4 + 4,
                repeat: Infinity,
                delay: Math.random() * 4,
                ease: 'linear',
              }}
            />
          ))}
        </div>

        {/* Hero Section */}
        <section className="relative py-24 md:py-32 overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Premium badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mansagold/10 border border-mansagold/30 mb-8">
                  <Sparkles className="w-4 h-4 text-mansagold" />
                  <span className="text-sm font-semibold text-mansagold tracking-wide uppercase">
                    Corporate Partnership Program
                  </span>
                </div>
              </motion.div>
              
              <motion.h1 
                className="font-playfair text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <span className="text-white">Partner With Us to </span>
                <br />
                <span className="text-gradient-gold">Create Real Impact</span>
              </motion.h1>
              
              <motion.p 
                className="text-xl md:text-2xl text-blue-100/90 mb-10 max-w-3xl mx-auto leading-relaxed font-body"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Your corporate sponsorship directly supports Black-owned businesses
                and strengthens communities. Choose a partnership tier that aligns
                with your company's values and budget.
              </motion.p>
              
              <motion.div 
                className="flex flex-wrap gap-4 justify-center text-sm text-white/90 mb-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                  <Check className="h-4 w-4 text-mansagold" />
                  <span className="font-medium">Tax Deductible</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                  <Check className="h-4 w-4 text-mansagold" />
                  <span className="font-medium">Real-Time Impact Metrics</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                  <Check className="h-4 w-4 text-mansagold" />
                  <span className="font-medium">Transparent Reporting</span>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex justify-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleShare}
                  disabled={isSharing}
                  className="border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 font-semibold px-8 py-6 rounded-xl backdrop-blur-sm transition-all duration-300"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Opportunity
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="container mx-auto px-4 pb-20 relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-mansagold text-sm font-semibold uppercase tracking-widest mb-4">
              Partnership Tiers
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-playfair mb-6">
              <span className="text-white">Choose Your </span>
              <span className="text-gradient-gold">Impact Level</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto items-start">
            {tiers.map((tier, idx) => (
              <motion.div
                key={tier.tier}
                className={`relative ${tier.popular ? 'xl:-mt-4 xl:mb-4' : ''}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                {/* Glow effect for popular tier */}
                {tier.popular && (
                  <div 
                    className="absolute -inset-1 rounded-3xl blur-xl opacity-50"
                    style={{ background: `linear-gradient(135deg, ${tier.bgGlow}, transparent)` }}
                  />
                )}
                
                <div 
                  className={`relative bg-slate-900/70 backdrop-blur-xl rounded-2xl overflow-hidden border transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl h-full ${
                    tier.popular 
                      ? 'border-mansagold/50 shadow-lg shadow-mansagold/10' 
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  {/* Popular badge */}
                  {tier.popular && (
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400" />
                  )}
                  
                  <div className="p-8">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${tier.gradient} mb-4`}>
                          {tier.icon}
                        </div>
                        <h3 className="text-2xl font-bold text-white font-playfair">{tier.name}</h3>
                        <p className="text-blue-200/70 text-sm mt-1 font-medium">{tier.description}</p>
                      </div>
                    </div>
                    
                    {tier.popular && (
                      <span className="inline-block px-3 py-1 rounded-full bg-mansagold/20 border border-mansagold/30 text-mansagold text-xs font-bold uppercase tracking-wide mb-4">
                        Most Popular
                      </span>
                    )}
                    
                    {/* Pricing */}
                    {!isScreenshotMode && (
                      <div className="mb-8">
                        <div className="flex items-baseline gap-1">
                          <span className={`text-4xl font-bold font-playfair bg-gradient-to-r ${tier.gradient} bg-clip-text text-transparent`}>
                            {tier.price}
                          </span>
                          <span className="text-blue-200/60 text-lg font-medium">/month</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Features */}
                    <ul className="space-y-3 mb-8">
                      {tier.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className={`flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br ${tier.gradient} flex items-center justify-center mt-0.5`}>
                            <Check className="w-3 h-3 text-white" strokeWidth={3} />
                          </div>
                          <span className="text-white/90 text-sm leading-relaxed font-medium">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {/* CTA Button */}
                    <Button 
                      className={`w-full group text-base py-6 rounded-xl transition-all duration-300 font-semibold ${
                        tier.popular 
                          ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 hover:from-amber-500 hover:via-yellow-500 hover:to-orange-500 text-slate-900 shadow-lg shadow-mansagold/25' 
                          : 'bg-white/5 hover:bg-white/10 text-white border border-white/20 hover:border-white/30'
                      }`}
                      onClick={() => handleCtaClick(tier.tier)}
                    >
                      {tier.cta}
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Impact Section */}
        <section className="container mx-auto px-4 py-20 border-t border-white/10 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block text-mansagold text-sm font-semibold uppercase tracking-widest mb-4">
                Real Results
              </span>
              <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-6">
                <span className="text-white">Your Impact, </span>
                <span className="text-gradient-gold">Measured</span>
              </h2>
              <p className="text-xl text-blue-100/80 mb-12 font-medium">
                Every corporate sponsor receives real-time access to their
                dedicated impact dashboard, tracking the tangible difference your
                sponsorship makes.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { value: '25+', label: 'Businesses Supported' },
                { value: '150+', label: 'Transactions Facilitated' },
                { value: '1,500+', label: 'Community Members Reached' },
                { value: isScreenshotMode ? '345K+' : '$345K+', label: 'Economic Impact Generated' },
              ].map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <Card className="bg-slate-900/60 backdrop-blur-xl border-white/10 hover:border-mansagold/50 transition-all duration-300 hover:shadow-lg hover:shadow-mansagold/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-3xl font-playfair text-gradient-gold">{stat.value}</CardTitle>
                      <CardDescription className="text-white/70 font-medium">{stat.label}</CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block text-mansagold text-sm font-semibold uppercase tracking-widest mb-4">
                Why Partner With Us
              </span>
              <h2 className="text-3xl md:text-4xl font-bold font-playfair">
                <span className="text-white">Why Become a </span>
                <span className="text-gradient-gold">Corporate Sponsor?</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: 'Measurable Impact', description: 'Track exactly how your sponsorship supports Black-owned businesses with real-time metrics and transparent reporting.' },
                { title: 'Brand Visibility', description: 'Increase your brand awareness among socially conscious consumers who value corporate responsibility.' },
                { title: 'Tax Benefits', description: 'Your sponsorship is tax-deductible. We provide all necessary documentation for your records.' },
                { title: 'Community Building', description: 'Join a network of forward-thinking companies committed to economic empowerment and social justice.' },
                { title: 'ESG Alignment', description: 'Strengthen your Environmental, Social, and Governance (ESG) initiatives with quantifiable social impact.' },
                { title: 'Positive PR', description: 'Generate positive press coverage and social media engagement through authentic community support.' },
              ].map((benefit, idx) => (
                <motion.div 
                  key={benefit.title}
                  className="bg-slate-900/50 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:border-mansagold/30 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <h3 className="text-xl font-bold text-white font-playfair mb-3">{benefit.title}</h3>
                  <p className="text-white/70 font-medium leading-relaxed">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Notification Demo Section */}
        <NotificationDemo />

        {/* Partnership Resources / Media Kit */}
        <SponsorshipMediaKit />

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20 text-center relative z-10">
          <motion.div 
            className="max-w-2xl mx-auto space-y-6 bg-slate-900/60 backdrop-blur-xl p-10 rounded-2xl border border-white/10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold font-playfair">
              <span className="text-white">Ready to Make an </span>
              <span className="text-gradient-gold">Impact?</span>
            </h2>
            <p className="text-lg text-white/80 font-medium">
              Join leading companies in supporting economic empowerment and
              community development. Have questions? Our team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                size="lg"
                onClick={() => handleCtaClick('platinum')}
                className="group bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 hover:from-amber-500 hover:via-yellow-500 hover:to-orange-500 text-slate-900 font-semibold text-lg px-8 py-6 rounded-xl shadow-lg shadow-mansagold/25"
              >
                Become a Sponsor
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                asChild
                className="border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 font-semibold text-lg px-8 py-6 rounded-xl backdrop-blur-sm"
              >
                <a href="/contact">Contact Us</a>
              </Button>
            </div>
          </motion.div>
        </section>

        {/* Company Details Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md bg-slate-900 border-white/20 text-white">
            <DialogHeader>
              <DialogTitle className="text-white font-playfair text-xl">Complete Your Sponsorship</DialogTitle>
              <DialogDescription className="text-white/70 font-medium">
                Please provide your company details to proceed with {selectedTier} tier sponsorship.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName" className="text-white font-semibold">
                  Company Name <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="companyName"
                  placeholder="Acme Corporation"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                  disabled={isLoading}
                  className="bg-slate-800 border-white/30 text-white placeholder:text-white/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="logoUrl" className="text-white font-semibold">Company Logo URL (optional)</Label>
                <Input
                  id="logoUrl"
                  type="url"
                  placeholder="https://example.com/logo.png"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  disabled={isLoading}
                  className="bg-slate-800 border-white/30 text-white placeholder:text-white/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="websiteUrl" className="text-white font-semibold">Company Website (optional)</Label>
                <Input
                  id="websiteUrl"
                  type="url"
                  placeholder="https://example.com"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  disabled={isLoading}
                  className="bg-slate-800 border-white/30 text-white placeholder:text-white/50"
                />
              </div>

              <DialogFooter className="gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isLoading}
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading || !companyName.trim()}
                  className="bg-gradient-to-r from-amber-400 to-orange-400 text-slate-900 font-semibold hover:from-amber-500 hover:to-orange-500"
                >
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
