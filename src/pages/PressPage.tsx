import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  Mail,
  Download,
  Copy,
  Check,
  Linkedin,
  Handshake,
  Newspaper,
  Building2,
  Sparkles,
  Quote,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import logo1325 from '@/assets/1325-ai-logo.webp';
import { updateMetaTags, BASE_URL } from '@/utils/seoUtils';

const PRESS_EMAIL = 'press@1325.ai';
const PARTNERSHIPS_EMAIL = 'partners@1325.ai';
const FOUNDER_LINKEDIN = 'https://www.linkedin.com/in/williamfostermansamusa/';

const STATS = [
  { value: '47,000+', label: 'Black-Owned Businesses' },
  { value: '$1.6T', label: 'Market Opportunity' },
  { value: '33', label: 'AI Agents Deployed' },
  { value: '27', label: 'Patent Claims Pending' },
];

const BOILERPLATE = `1325.AI is the first AI-powered economic operating system built for the Black business community. With more than 47,000 verified Black-owned business listings across the United States, 33 deployed AI agents, and patent-pending technology (USPTO 63/969,202), 1325.AI helps consumers discover and support Black-owned businesses while giving owners the tools to grow. 1325.AI is a product of Mansa Musa Marketplace, founded in 2024 and headquartered in Illinois.`;

const PressPage: React.FC = () => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    updateMetaTags({
      title: 'Press & Partnerships | 1325.AI',
      description:
        'Press kit, founder bio, brand assets, and partnership opportunities for 1325.AI — the AI-powered platform for 47,000+ Black-owned businesses.',
      path: '/press',
      type: 'website',
      keywords: ['1325.AI press', 'Black business directory press', 'Mansa Musa Marketplace', 'press kit', 'partnerships'],
    });
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(BOILERPLATE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: '1325.AI',
    alternateName: 'Mansa Musa Marketplace',
    url: BASE_URL,
    logo: `${BASE_URL}/favicon.png`,
    foundingDate: '2024',
    foundingLocation: { '@type': 'Place', name: 'Illinois, USA' },
    founder: {
      '@type': 'Person',
      name: 'William Foster',
      sameAs: [FOUNDER_LINKEDIN],
    },
    sameAs: [FOUNDER_LINKEDIN],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'press',
        email: PRESS_EMAIL,
        availableLanguage: ['English'],
      },
      {
        '@type': 'ContactPoint',
        contactType: 'partnerships',
        email: PARTNERSHIPS_EMAIL,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(orgJsonLd)}</script>
      </Helmet>

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-mansablue/20 via-background to-background pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-6 bg-mansagold/20 text-mansagold border-mansagold/30 px-4 py-1.5">
              <Newspaper className="w-4 h-4 mr-2" />
              Press & Partnerships
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Tell the story of the <span className="text-mansagold">Black economy</span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mb-10">
              1325.AI is the AI-powered platform building infrastructure for 47,000+ Black-owned businesses.
              Everything you need to write about us, partner with us, or interview our founder — in one place.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-mansagold text-black hover:bg-mansagold/90">
                <a href={`mailto:${PRESS_EMAIL}?subject=Press%20Inquiry%20-%201325.AI`}>
                  <Mail className="w-4 h-4 mr-2" /> Email Press Team
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/20 hover:bg-white/5">
                <a href="#press-kit">
                  <Download className="w-4 h-4 mr-2" /> Download Press Kit
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((s) => (
            <Card key={s.label} className="p-6 bg-white/5 border-white/10 text-center">
              <div className="text-3xl md:text-4xl font-bold text-mansagold mb-2">{s.value}</div>
              <div className="text-sm text-white/70">{s.label}</div>
            </Card>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">About 1325.AI</h2>
        <div className="space-y-4 text-white/80 text-lg leading-relaxed">
          <p>
            The Black dollar circulates in Black communities for just <strong className="text-white">6 hours</strong> —
            compared to 20 days in other communities. That's not a marketing problem. It's an
            infrastructure problem.
          </p>
          <p>
            1325.AI is the first integrated economic operating system built to solve it. We combine the
            largest dedicated directory of Black-owned businesses (47,000+ live listings), AI-powered
            tools that help owners run their businesses, QR-based loyalty that captures real
            transactions, and patent-pending technology that turns every interaction into community wealth.
          </p>
          <p>
            1325.AI is a product of <strong className="text-white">Mansa Musa Marketplace</strong>,
            founded in 2024 and headquartered in Illinois.
          </p>
        </div>
      </section>

      {/* FOUNDER */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <Card className="p-8 md:p-10 bg-white/5 border-white/10">
          <div className="grid md:grid-cols-[200px_1fr] gap-8 items-start">
            <div className="w-40 h-40 md:w-48 md:h-48 rounded-2xl overflow-hidden bg-mansablue/40 border border-white/10 flex items-center justify-center mx-auto md:mx-0">
              <img
                src={logo1325}
                alt="William Foster, Founder of 1325.AI"
                className="w-full h-full object-cover opacity-90"
              />
            </div>
            <div>
              <Badge className="mb-3 bg-mansablue/30 text-white/90 border-white/10">Founder</Badge>
              <h3 className="text-2xl md:text-3xl font-bold mb-2">William Foster</h3>
              <p className="text-mansagold mb-4 font-medium">Founder &amp; CEO, 1325.AI</p>
              <p className="text-white/80 leading-relaxed mb-4">
                William Foster is the founder of 1325.AI and Mansa Musa Marketplace, on a mission to build
                the economic infrastructure for the $1.6T Black economy. With patent-pending technology
                (USPTO 63/969,202) and 33 deployed AI agents, his work focuses on extending how long the
                Black dollar circulates and giving Black-owned businesses the tools larger companies take
                for granted.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="outline" size="sm" className="border-white/20 hover:bg-white/5">
                  <a href={FOUNDER_LINKEDIN} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="w-4 h-4 mr-2" /> LinkedIn
                  </a>
                </Button>
                <Button asChild size="sm" className="bg-mansagold text-black hover:bg-mansagold/90">
                  <a href={`mailto:${PRESS_EMAIL}?subject=Interview%20Request%20-%20William%20Foster`}>
                    <Mail className="w-4 h-4 mr-2" /> Request Interview
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* BOILERPLATE */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center gap-3">
          <Quote className="w-7 h-7 text-mansagold" />
          Company Boilerplate
        </h2>
        <p className="text-white/60 mb-4 text-sm">Copy and paste this into your article.</p>
        <Card className="p-6 bg-white/5 border-white/10 relative">
          <p className="text-white/90 leading-relaxed pr-12">{BOILERPLATE}</p>
          <Button
            onClick={handleCopy}
            size="sm"
            variant="ghost"
            className="absolute top-4 right-4 hover:bg-white/10"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-1 text-mansagold" /> Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-1" /> Copy
              </>
            )}
          </Button>
        </Card>
      </section>

      {/* PRESS KIT */}
      <section id="press-kit" className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-2">Press Kit &amp; Brand Assets</h2>
        <p className="text-white/60 mb-8">Logos, brand colors, founder photo, and product screenshots.</p>
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-6 bg-white/5 border-white/10">
            <h3 className="font-bold text-lg mb-3">Logo Pack</h3>
            <div className="bg-mansablue/30 rounded-lg p-6 mb-4 flex items-center justify-center">
              <img src={logo1325} alt="1325.AI logo" className="h-20 w-20 object-contain" />
            </div>
            <Button asChild variant="outline" className="w-full border-white/20 hover:bg-white/5">
              <a href={logo1325} download="1325ai-logo.webp">
                <Download className="w-4 h-4 mr-2" /> Download Logo
              </a>
            </Button>
          </Card>

          <Card className="p-6 bg-white/5 border-white/10">
            <h3 className="font-bold text-lg mb-3">Brand Colors</h3>
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-md border border-white/10" style={{ backgroundColor: '#003366' }} />
                <div>
                  <div className="font-medium">MansaBlue</div>
                  <div className="text-sm text-white/60">#003366</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-md border border-white/10" style={{ backgroundColor: '#FFB300' }} />
                <div>
                  <div className="font-medium">MansaGold</div>
                  <div className="text-sm text-white/60">#FFB300</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-md border border-white/10 bg-black" />
                <div>
                  <div className="font-medium">True Black</div>
                  <div className="text-sm text-white/60">#000000</div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/5 border-white/10">
            <h3 className="font-bold text-lg mb-3">Full Media Kit</h3>
            <p className="text-white/70 text-sm mb-4">
              Investor-grade overview, product screenshots, and platform stats.
            </p>
            <Button asChild className="w-full bg-mansagold text-black hover:bg-mansagold/90">
              <Link to="/media-kit">
                <Download className="w-4 h-4 mr-2" /> Open Media Kit
              </Link>
            </Button>
          </Card>

          <Card className="p-6 bg-white/5 border-white/10">
            <h3 className="font-bold text-lg mb-3">Fact Sheet</h3>
            <p className="text-white/70 text-sm mb-4">
              One-page PDF with company stats, founding info, and key milestones.
            </p>
            <Button
              asChild
              variant="outline"
              className="w-full border-white/20 hover:bg-white/5"
            >
              <a href={`mailto:${PRESS_EMAIL}?subject=Fact%20Sheet%20Request`}>
                <Mail className="w-4 h-4 mr-2" /> Request Fact Sheet
              </a>
            </Button>
          </Card>
        </div>
      </section>

      {/* IN THE NEWS */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-2">In the News</h2>
        <p className="text-white/60 mb-8">Featured coverage and recent mentions.</p>
        <Card className="p-12 bg-white/5 border-white/10 text-center">
          <Sparkles className="w-10 h-10 text-mansagold mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Coverage coming soon</h3>
          <p className="text-white/70 max-w-md mx-auto">
            Want to be the first to write about 1325.AI?{' '}
            <a href={`mailto:${PRESS_EMAIL}`} className="text-mansagold underline">
              Email our press team
            </a>
            .
          </p>
        </Card>
      </section>

      {/* PARTNERSHIPS */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
          <Handshake className="w-8 h-8 text-mansagold" />
          Partner with Us
        </h2>
        <p className="text-white/60 mb-8">Three ways organizations work with 1325.AI.</p>
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {[
            {
              icon: Newspaper,
              title: 'Media',
              desc: 'Journalists, podcasters, and publishers covering Black business and the future of community wealth.',
            },
            {
              icon: Building2,
              title: 'Chambers & Nonprofits',
              desc: 'Cross-list your member businesses and amplify each other to a shared audience.',
            },
            {
              icon: Handshake,
              title: 'Corporate Sponsors',
              desc: 'Back the platform and put your brand in front of an engaged, high-intent community.',
            },
          ].map((p) => (
            <Card key={p.title} className="p-6 bg-white/5 border-white/10">
              <p.icon className="w-8 h-8 text-mansagold mb-3" />
              <h3 className="font-bold text-lg mb-2">{p.title}</h3>
              <p className="text-white/70 text-sm">{p.desc}</p>
            </Card>
          ))}
        </div>
        <div className="text-center">
          <Button asChild size="lg" className="bg-mansagold text-black hover:bg-mansagold/90">
            <a href={`mailto:${PARTNERSHIPS_EMAIL}?subject=Partnership%20Inquiry`}>
              <Mail className="w-4 h-4 mr-2" /> Become a Partner
            </a>
          </Button>
        </div>
      </section>

      {/* MEDIA CONTACT */}
      <section className="max-w-6xl mx-auto px-6 py-12 pb-24">
        <Card className="p-8 md:p-10 bg-gradient-to-br from-mansablue/30 to-white/5 border-mansagold/30">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Media Contact</h2>
              <p className="text-white/80 mb-4">
                We reply to press inquiries within 24 hours.
              </p>
              <div className="space-y-2">
                <a
                  href={`mailto:${PRESS_EMAIL}`}
                  className="flex items-center gap-2 text-mansagold hover:underline"
                >
                  <Mail className="w-4 h-4" /> {PRESS_EMAIL}
                </a>
                <a
                  href={`mailto:${PARTNERSHIPS_EMAIL}`}
                  className="flex items-center gap-2 text-mansagold hover:underline"
                >
                  <Handshake className="w-4 h-4" /> {PARTNERSHIPS_EMAIL}
                </a>
              </div>
            </div>
            <div className="flex md:justify-end gap-3">
              <Button asChild size="lg" className="bg-mansagold text-black hover:bg-mansagold/90">
                <a href={`mailto:${PRESS_EMAIL}`}>
                  <Mail className="w-4 h-4 mr-2" /> Email Press
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/20 hover:bg-white/5">
                <a href={FOUNDER_LINKEDIN} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="w-4 h-4 mr-2" /> LinkedIn
                </a>
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default PressPage;
