import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Play, Store, Globe2, Network } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { OrganizationStructuredData } from '@/components/SEO/OrganizationStructuredData';
import { WebsiteStructuredData } from '@/components/SEO/WebsiteStructuredData';
import { trackFunnelEvent } from '@/lib/analytics/funnel-tracker';
import { useLiveBusinessCount } from '@/hooks/use-live-business-count';
import { assetUrl } from '@/utils/assetUrl';
import FlagshipWorkforce from '@/components/homepage/FlagshipWorkforce';
import { FlagshipHeader, FlagshipFooter } from '@/components/homepage/FlagshipChrome';
import hero from '@/assets/flagship-commerce.jpg';
import heroLoop from '@/assets/videos/flagship-hero-loop.mp4.asset.json';
import community from '@/assets/demo-soul-food.jpg';
import clinical from '@/assets/clinical-solutions-practice.jpg';
import founder from '@/assets/team/Thomas_D_Bowling_headshot.jpg';
import film from '@/assets/meet-kayla-upgraded.mp4.asset.json';
import '@/components/homepage/flagship.css';

const pillars = [
  { number: '01', icon: Store, eyebrow: 'FOR BUSINESS OWNERS', title: 'Your business. A bigger team.', description: 'Get found in the directory. Bring Kayla into your operations. Build your next chapter with specialized Agentic intelligence.', to: '/business-signup?focus=true', action: 'List your business free', image: hero, alt: 'Business owners reviewing their work together' },
  { number: '02', icon: Globe2, eyebrow: 'FOR CONSUMERS & COMMUNITIES', title: 'Discover local. Connect global.', description: 'Find Black-owned businesses, explore your community and keep the businesses you love within reach.', to: '/directory', action: 'Explore the directory', image: community, alt: 'Food from a community restaurant' },
  { number: '03', icon: Network, eyebrow: 'FOR ENTERPRISE & HEALTHCARE', title: 'Infrastructure for what’s next.', description: 'Explore enterprise connectivity and the development of 1325 Clinical EMR / EHR. Private preview · sample data only.', to: '/corporate-sponsorship', action: 'Explore enterprise', image: clinical, alt: 'Physicians collaborating in a clinical setting' },
];

export default function HomePage() {
  const { formatted, isLoading } = useLiveBusinessCount();
  const [watching, setWatching] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => { trackFunnelEvent('homepage_view'); }, []);
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.slice(1);
      if (hash) document.getElementById(hash)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);
  useEffect(() => () => { video.current?.pause(); }, []);
  return (
    <div className="flagship font-body">
      <Helmet>
        <title>1325.AI | Agentic Intelligence & Global Black-Owned Commerce</title>
        <meta name="description" content="Connect your business to a global community. Explore Black-owned businesses, Kayla and 42 Agentic AI Employees, and enterprise connectivity. List your business free." />
        <meta property="og:title" content="1325.AI | Agentic Intelligence & Global Commerce" />
        <meta property="og:description" content="Intelligence for your business. Connections for your community. Discover the 1325.AI platform and list your business free." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://1325.ai/" />
      </Helmet>
      <OrganizationStructuredData /><WebsiteStructuredData />
      <FlagshipHeader />
      <section className="flagship-hero relative flex items-center overflow-hidden">
        <img src={hero} alt="Business owners collaborating in a modern workspace" width={1920} height={1024} fetchPriority="high" className="absolute inset-0 w-full h-full object-cover object-[65%_center]" />
        <video src={assetUrl(heroLoop.url)} poster={hero} autoPlay muted loop playsInline preload="metadata" aria-hidden="true" onError={(e) => { e.currentTarget.style.display = 'none'; }} className="absolute inset-0 w-full h-full object-cover object-[65%_center] motion-reduce:hidden" />
        <div className="flagship-content relative z-10 py-16 flagship-rise">
          <p className="text-primary text-sm font-medium mb-5">BUSINESS. COMMUNITY. POSSIBILITY.</p>
          <h1 className="text-5xl md:text-7xl font-medium leading-[1.08] max-w-3xl">1325.AI</h1>
          <p className="text-3xl md:text-5xl font-light leading-[1.15] mt-5 max-w-[660px]">The autonomous enterprise layer for global commerce.</p>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-[540px] mt-6">Your ambition deserves more than a directory. Connect with a global community and meet Kayla &amp; the 42 Agentic AI Employees behind your next chapter.</p>
          <div className="flex flex-col sm:flex-row gap-3 mt-9 max-w-xl">
            <Button noHint asChild size="lg" className="flagship-action px-5 text-sm whitespace-normal h-auto min-h-14"><Link to="/business-signup?focus=true" onClick={() => trackFunnelEvent('home_preview_cta_business_click', { placement: 'flagship_hero' })}>Claim or Add Your Business — Free <ArrowRight /></Link></Button>
            <Button noHint asChild variant="ghost" size="lg" className="flagship-action border border-foreground/30 px-5 text-sm"><a href="#platform">Explore the platform <ArrowUpRight /></a></Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">Free business listing. No credit card required.</p>
        </div>
      </section>
      <section aria-label="Platform at a glance" className="border-b border-border">
        <div className="flagship-content grid grid-cols-2 md:grid-cols-4 gap-y-8 py-10 md:py-12">
          {[['42', 'Agentic AI Employees'], [isLoading ? '…' : formatted, 'Businesses in the directory'], ['Global', 'Community connections'], ['46', 'Provisional claims pending']].map(([value, label]) => <div key={label} className="border-l border-border pl-5 first:border-l-0 first:pl-0"><p className="text-3xl md:text-4xl font-medium">{value}</p><p className="text-muted-foreground text-xs md:text-sm mt-3">{label}</p></div>)}
        </div>
      </section>
      <section id="platform" className="py-20 md:py-28">
        <div className="flagship-content">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"><div><p className="text-primary text-sm mb-4">THE 1325.AI PLATFORM</p><h2 className="text-3xl md:text-5xl font-medium leading-tight">Built for your next move.</h2></div><p className="text-muted-foreground max-w-md leading-relaxed">From the neighborhood business to the enterprise network. One shared ambition: more opportunity.</p></div>
          <div className="grid gap-8 md:grid-cols-3">
            {pillars.map(({ icon: Icon, ...pillar }) => <article key={pillar.number} className="min-w-0 group">
              <Link to={pillar.to} tabIndex={-1} aria-hidden="true" className="block aspect-[4/3] overflow-hidden rounded-sm mb-7"><img src={pillar.image} alt={pillar.alt} loading="lazy" width={640} height={480} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" /></Link>
              <div className="flex items-center justify-between text-primary mb-4"><p className="text-xs font-medium">{pillar.eyebrow}</p><Icon className="h-5 w-5" /></div>
              <h3 className="text-2xl font-medium leading-tight mb-4">{pillar.title}</h3><p className="text-muted-foreground text-sm leading-7 min-h-[112px]">{pillar.description}</p>
              <Button noHint asChild variant="link" className="px-0 text-primary"><Link to={pillar.to}>{pillar.action} <ArrowRight /></Link></Button>
              {pillar.number === '02' && <div><Link to="/allies" className="text-sm text-muted-foreground underline underline-offset-4">Browse Allies separately</Link></div>}
              {pillar.number === '03' && <div><Link to="/health/welcome" className="text-sm text-muted-foreground underline underline-offset-4">Explore 1325 Clinical</Link></div>}
            </article>)}
          </div>
        </div>
      </section>
      <section id="meet-kayla" className="bg-card border-y border-border py-16 md:py-20">
        <div className="flagship-content grid gap-10 lg:grid-cols-[1fr_1fr] items-center">
          <div><p className="text-primary text-sm mb-4">MEET KAYLA</p><h2 className="text-3xl md:text-5xl font-medium leading-tight">Less working alone.<br />More moving forward.</h2><p className="text-muted-foreground leading-relaxed mt-6 max-w-lg">Kayla coordinates a specialized Agentic workforce around your business goals. Explore the team, the capabilities and the work they can help prepare.</p><Button noHint variant="link" asChild className="text-primary px-0 mt-5"><a href="#workforce">Meet the workforce <ArrowRight /></a></Button></div>
          <div className="relative aspect-video bg-muted overflow-hidden rounded-sm flex items-center justify-center">
            {watching ? <><video ref={video} src={assetUrl(film.url)} controls autoPlay playsInline preload="none" aria-label="Meet Kayla film" onError={() => setVideoError(true)} className="w-full h-full object-contain" />{videoError && <div role="alert" className="absolute inset-0 bg-card flex flex-col items-center justify-center p-6 text-center"><p>The film is unavailable right now.</p><Button noHint variant="link" asChild className="text-primary mt-3"><Link to="/what-kayla-does">Explore Kayla instead <ArrowRight /></Link></Button></div>}</> : <><img src={hero} alt="" width={640} height={360} loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-90" /><Button noHint onClick={() => setWatching(true)} variant="ghost" className="relative h-auto py-6 px-7 text-foreground flex flex-col gap-4"><span className="rounded-full border border-foreground/50 w-16 h-16 flex items-center justify-center"><Play className="h-6 w-6" /></span><span>Watch: Meet Kayla</span></Button></>}
          </div>
        </div>
      </section>
      <FlagshipWorkforce />
      <section className="border-t border-border py-20 md:py-24">
        <div className="flagship-content grid gap-10 md:grid-cols-[280px_1fr] lg:gap-20 items-center">
          <img src={founder} alt="Thomas D. Bowling, founder and inventor" loading="lazy" width={400} height={480} className="w-full max-w-[280px] aspect-[4/5] object-cover object-top rounded-sm" />
          <div><p className="text-primary text-sm mb-5">THE FOUNDER’S VISION</p><blockquote className="text-2xl md:text-3xl font-light leading-relaxed">“For too long, we have been divided economically. 1325.AI is the MCP infrastructure layer that turns Black-owned business into global-scale enterprise.”</blockquote><p className="font-medium mt-7">Thomas D. Bowling</p><p className="text-muted-foreground text-sm mt-1">Founder &amp; Inventor</p><Button noHint asChild variant="link" className="text-primary px-0 mt-5"><a href="/ultimate-deep-dive.html">Watch the founder’s vision <ArrowUpRight /></a></Button><p className="text-xs text-muted-foreground mt-4">U.S. Provisional Patent Application No. 63/969,202 — 46 claims pending</p></div>
        </div>
      </section>
      <section id="submit-business" className="bg-card border-t border-border py-20 md:py-24">
        <div className="flagship-content flex flex-col lg:flex-row justify-between gap-8 lg:items-center"><div><p className="text-primary text-sm mb-4">YOUR NEXT CHAPTER STARTS HERE</p><h2 className="text-3xl md:text-5xl font-medium leading-tight">Make your business<br />part of something bigger.</h2><p className="text-muted-foreground mt-5">Create your profile. Submit it for review. Connect with your community.</p></div><div className="lg:max-w-sm"><Button noHint asChild size="lg" className="flagship-action px-6 whitespace-normal h-auto min-h-14 w-full"><Link to="/business-signup?focus=true" onClick={() => trackFunnelEvent('home_preview_cta_business_click', { placement: 'flagship_footer' })}>Claim or Add Your Business — Free <ArrowRight /></Link></Button><p className="text-muted-foreground text-sm mt-4">Free to list · No credit card required<br />Review required before a new listing goes live.</p></div></div>
      </section>
      <FlagshipFooter />
    </div>
  );
}
