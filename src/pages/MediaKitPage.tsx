import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  Download, 
  Users, 
  Building2, 
  Globe, 
  Smartphone, 
  Database, 
  Zap, 
  TrendingUp,
  Award,
  ShieldCheck,
  Sparkles,
  Target,
  DollarSign,
  Heart,
  FileText,
  Mail,
  Phone,
  MapPin,
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import logo1325 from '@/assets/1325-ai-logo.png';
import {
  generateBrandAssets,
  generateMediaKit,
} from '@/components/sponsorship/services/pdfGenerationService';
import { AccessRequestModal } from '@/components/media-kit/AccessRequestModal';

type GatedDocumentType = 'partnership_guide' | 'investor_analysis';

const MediaKitPage = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [accessModalOpen, setAccessModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<GatedDocumentType>('partnership_guide');

  const handleDownload = async (generator: () => Promise<void>) => {
    setIsGenerating(true);
    try {
      await generator();
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRequestAccess = (documentType: GatedDocumentType) => {
    setSelectedDocument(documentType);
    setAccessModalOpen(true);
  };

  const stats = [
    { value: '$1.6T', label: 'Addressable Market', icon: DollarSign },
    { value: '130+', label: 'Application Pages', icon: Globe },
    { value: '110+', label: 'Database Tables', icon: Database },
    { value: '67', label: 'Edge Functions', icon: Zap },
    { value: '6+', label: 'Revenue Streams', icon: TrendingUp },
    { value: '2', label: 'Mobile Platforms', icon: Smartphone },
  ];

  const features = [
    {
      icon: Building2,
      title: 'Business Directory',
      description: 'Comprehensive directory of verified Black-owned businesses with reviews and ratings'
    },
    {
      icon: Award,
      title: 'Loyalty Points System',
      description: 'Reward customers for supporting Black-owned businesses with redeemable points'
    },
    {
      icon: Users,
      title: 'Community Savings (Susu)',
      description: 'Traditional community savings circles reimagined for the digital age'
    },
    {
      icon: Sparkles,
      title: 'Mansa AI Assistant',
      description: 'AI-powered assistant for business recommendations and financial guidance'
    },
    {
      icon: Target,
      title: 'Sales Agent Network',
      description: 'Commission-based agents recruiting and onboarding businesses nationwide'
    },
    {
      icon: ShieldCheck,
      title: 'Business Verification',
      description: 'Multi-step verification ensuring authenticity of Black-owned businesses'
    }
  ];

  const partnershipTiers = [
    { tier: 'Silver Partner', investment: '$10,000+', color: 'from-slate-300 to-slate-400' },
    { tier: 'Gold Partner', investment: '$25,000+', color: 'from-mansagold to-amber-500' },
    { tier: 'Platinum Partner', investment: '$50,000+', color: 'from-blue-300 to-blue-500' },
  ];

  // Public downloads - directly accessible
  const publicDownloads = [
    { title: 'Full Media Kit', icon: FileText, action: generateMediaKit },
    { title: 'Brand Assets', icon: Award, action: generateBrandAssets },
  ];

  // Gated downloads - require access request
  const gatedDownloads: { title: string; icon: typeof FileText; documentType: GatedDocumentType; description: string }[] = [
    { 
      title: 'Partnership Guide', 
      icon: FileText, 
      documentType: 'partnership_guide',
      description: 'Strategic partnership details'
    },
    { 
      title: 'Investor Analysis', 
      icon: TrendingUp, 
      documentType: 'investor_analysis',
      description: 'Financial projections & valuation'
    },
  ];

  return (
    <>
      <Helmet>
        <title>Media Kit | Mansa Musa Marketplace</title>
        <meta name="description" content="Access Mansa Musa Marketplace's media kit with platform stats, brand assets, partnership opportunities, and press resources." />
        <meta property="og:title" content="Media Kit | Mansa Musa Marketplace" />
        <meta property="og:description" content="Download our media kit, brand assets, and partnership information." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/90 to-slate-900 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-mansagold/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-mansagold/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] opacity-50" />
        </div>

        <div className="container mx-auto px-4 py-16 relative z-10">
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24">
                <img src={logo1325} alt="1325.AI" className="w-full h-full object-contain" />
              </div>
            </div>
            <Badge className="bg-mansagold/20 text-mansagold border-mansagold/30 mb-4 text-sm px-4 py-1">
              Press & Partnership Resources
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-blue-100 to-mansagold bg-clip-text text-transparent">
              Media Kit
            </h1>
            <p className="text-xl text-blue-200/80 max-w-3xl mx-auto leading-relaxed">
              Everything you need to know about Mansa Musa Marketplace – the revolutionary platform building, protecting, and expanding the Black economic ecosystem.
            </p>
          </motion.div>

          {/* About Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-16"
          >
            <Card className="bg-slate-900/60 backdrop-blur-xl border-white/10 overflow-hidden">
              <CardContent className="p-8 md:p-12">
                <div className="flex items-center gap-3 mb-6">
                  <Heart className="w-8 h-8 text-mansagold" />
                  <h2 className="text-2xl md:text-3xl font-bold text-white">Our Mission</h2>
                </div>
                <p className="text-lg text-blue-100/80 leading-relaxed mb-6">
                  Mansa Musa Marketplace is named after the legendary 14th-century African emperor, renowned as the wealthiest person in history. Our platform embodies his legacy of economic empowerment and community wealth-building.
                </p>
                <p className="text-lg text-blue-100/80 leading-relaxed mb-6">
                  We connect consumers with verified Black-owned businesses, reward community support through loyalty points, and create sustainable economic ecosystems that circulate wealth within the community.
                </p>
                <div className="grid md:grid-cols-3 gap-4 mt-8">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-mansagold font-bold text-lg">Founded</p>
                    <p className="text-white">2024</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-mansagold font-bold text-lg">Founder</p>
                    <p className="text-white">Thomas D. Bowling</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-mansagold font-bold text-lg">Headquarters</p>
                    <p className="text-white">Chicago, Illinois</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-8">Platform Statistics</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center hover:border-mansagold/30 transition-all duration-300 group"
                >
                  <stat.icon className="w-8 h-8 mx-auto mb-3 text-mansagold group-hover:scale-110 transition-transform" />
                  <p className="text-3xl font-bold bg-gradient-to-r from-mansagold to-amber-400 bg-clip-text text-transparent">
                    {stat.value}
                  </p>
                  <p className="text-sm text-blue-200/70 mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-16"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-8">Core Features</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-mansagold/30 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-mansagold/20 to-amber-500/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-mansagold" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-blue-200/70">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Partnership Tiers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-16"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-8">Partnership Opportunities</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {partnershipTiers.map((tier, index) => (
                <motion.div
                  key={tier.tier}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300"
                >
                  <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${tier.color} flex items-center justify-center mb-4`}>
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{tier.tier}</h3>
                  <p className="text-2xl font-bold bg-gradient-to-r from-mansagold to-amber-400 bg-clip-text text-transparent">
                    {tier.investment}
                  </p>
                </motion.div>
              ))}
            </div>
            <p className="text-center text-blue-200/60 mt-6">
              Custom partnership packages available for enterprise clients
            </p>
          </motion.div>

          {/* Downloads Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-16"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-8">Download Resources</h2>
            
            {/* Public Downloads */}
            <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-6">
              {publicDownloads.map((item) => (
                <Button
                  key={item.title}
                  onClick={() => handleDownload(item.action)}
                  disabled={isGenerating}
                  variant="outline"
                  className="h-auto py-6 px-6 bg-slate-900/60 border-white/20 hover:border-mansagold/50 hover:bg-mansagold/10 text-white group transition-all duration-300"
                >
                  <div className="flex items-center gap-4 w-full">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-mansagold/20 to-amber-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <item.icon className="w-6 h-6 text-mansagold" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-lg">{item.title}</p>
                      <p className="text-sm text-blue-200/60">Free download</p>
                    </div>
                    <Download className="w-5 h-5 text-mansagold opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Button>
              ))}
            </div>

            {/* Gated Downloads */}
            <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {gatedDownloads.map((item) => (
                <Button
                  key={item.title}
                  onClick={() => handleRequestAccess(item.documentType)}
                  variant="outline"
                  className="h-auto py-6 px-6 bg-slate-900/60 border-amber-500/30 hover:border-mansagold hover:bg-mansagold/10 text-white group transition-all duration-300 w-full"
                >
                  <div className="flex items-center gap-4 w-full">
                    <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center group-hover:scale-110 transition-transform relative">
                      <item.icon className="w-6 h-6 text-amber-400" />
                      <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
                        <Lock className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p className="font-semibold text-lg truncate">{item.title}</p>
                      <p className="text-sm text-amber-400/70 truncate">{item.description}</p>
                    </div>
                    <Badge variant="outline" className="border-amber-500/50 text-amber-400 text-xs flex-shrink-0 whitespace-nowrap">
                      Request Access
                    </Badge>
                  </div>
                </Button>
              ))}
            </div>
            
            <p className="text-center text-blue-200/50 text-sm mt-4">
              🔒 Some resources require approval to protect strategic information
            </p>
          </motion.div>

          {/* Access Request Modal */}
          <AccessRequestModal
            isOpen={accessModalOpen}
            onClose={() => setAccessModalOpen(false)}
            documentType={selectedDocument}
          />

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="bg-slate-900/80 backdrop-blur-xl border-mansagold/40 overflow-hidden shadow-2xl">
              <CardContent className="p-8 md:p-12">
                <h2 className="text-2xl md:text-3xl font-bold text-center bg-gradient-to-r from-mansagold via-amber-400 to-yellow-400 bg-clip-text text-transparent mb-8">
                  Media & Partnership Contact
                </h2>
                <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                  <a 
                    href="mailto:Thomas@1325.AI"
                    className="flex flex-col items-center gap-4 p-6 bg-white/10 rounded-xl border border-mansagold/30 hover:border-mansagold hover:bg-mansagold/10 transition-all duration-300 group"
                  >
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-mansagold to-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <Mail className="w-7 h-7 text-white" />
                    </div>
                    <p className="text-mansagold font-bold text-lg">Email</p>
                    <p className="text-white text-sm text-center font-medium">Thomas@1325.AI</p>
                  </a>
                  <a 
                    href="tel:+1-312-709-6006"
                    className="flex flex-col items-center gap-4 p-6 bg-white/10 rounded-xl border border-mansagold/30 hover:border-mansagold hover:bg-mansagold/10 transition-all duration-300 group"
                  >
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-mansagold to-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <Phone className="w-7 h-7 text-white" />
                    </div>
                    <p className="text-mansagold font-bold text-lg">Phone</p>
                    <p className="text-white text-sm font-medium">(312) 709-6006</p>
                  </a>
                  <div className="flex flex-col items-center gap-4 p-6 bg-white/10 rounded-xl border border-mansagold/30">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-mansagold to-amber-500 flex items-center justify-center shadow-lg">
                      <MapPin className="w-7 h-7 text-white" />
                    </div>
                    <p className="text-mansagold font-bold text-lg">Address</p>
                    <p className="text-white text-sm text-center font-medium">1000 E. 111th St. Suite 1100<br />Chicago, IL 60628</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default MediaKitPage;
