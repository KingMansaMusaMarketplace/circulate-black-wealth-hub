import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logo from '@/assets/1325-ai-logo.webp';
import BackToButton from '@/components/ui/BackToButton';

const links = [
  { label: 'Platform', to: '/#platform' },
  { label: 'Directory', to: '/directory' },
  { label: '1325 Clinical', to: '/health/welcome' },
  { label: 'Enterprise', to: '/connect' },
  { label: 'Team', to: '/team' },
];

export function FlagshipHeader() {
  const [open, setOpen] = useState(false);
  return <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md">
    <div className="flagship-content flex min-h-20 items-center justify-between gap-4">
      <Link to="/" aria-label="1325.AI home" className="flex items-center gap-3 shrink-0"><img src={logo} width={64} height={64} alt="" className="h-12 w-12 object-contain" /><span className="font-semibold text-xl">1325.AI<span className="block text-muted-foreground text-[10px] font-normal">GLOBAL COMMERCE · AGENTIC INTELLIGENCE</span></span></Link>
      <nav aria-label="Main navigation" className="hidden xl:flex items-center gap-1">{links.map(link => <Button key={link.to} variant="ghost" noHint asChild className="flagship-nav text-muted-foreground"><Link to={link.to}>{link.label}</Link></Button>)}</nav>
      <div className="flex items-center gap-3"><Button noHint asChild variant="ghost" className="hidden sm:inline-flex flagship-nav"><Link to="/login">Sign in</Link></Button><Button noHint asChild className="hidden md:inline-flex flagship-action"><Link to="/business-signup?focus=true">List your business — Free <ArrowRight /></Link></Button><Button noHint size="icon" variant="ghost" className="xl:hidden" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="flagship-mobile-menu" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</Button></div>
    </div>
    <div className="flagship-content pb-2"><BackToButton inline showOnHome /></div>
    {open && <nav id="flagship-mobile-menu" aria-label="Mobile navigation" className="flagship-content xl:hidden border-t border-border py-4 flex flex-col gap-1">{links.map(link => <Button key={link.to} noHint variant="ghost" asChild className="justify-start"><Link to={link.to} onClick={() => setOpen(false)}>{link.label}</Link></Button>)}<Button noHint variant="ghost" asChild className="justify-start"><Link to="/allies" onClick={() => setOpen(false)}>Browse Allies</Link></Button><Button noHint variant="ghost" asChild className="justify-start"><Link to="/login">Sign in</Link></Button><Button noHint asChild className="flagship-action mt-2"><Link to="/business-signup?focus=true">List your business — Free <ArrowRight /></Link></Button></nav>}
  </header>;
}

export function FlagshipFooter() {
  const groups = [
    { name: 'Platform', links: [['Business directory', '/directory'], ['Browse Allies', '/allies'], ['Meet Kayla', '/what-kayla-does'], ['Plans & pricing', '/pricing'], ['Holiday Special', '/holiday-special']] },
    { name: 'Enterprise', links: [['Enterprise connectivity', '/connect'], ['1325 Clinical EMR / EHR', '/health/welcome'], ['Corporate partnerships', '/corporate-sponsorship'], ['For investors', '/investors'], ['Our team', '/team']] },
    { name: 'Resources', links: [['How it works', '/how-it-works'], ['Founder film', '/ultimate-deep-dive.html'], ['Why 1325.AI, why now', '/why-100m-series-a.html'], ['Contact', '/contact'], ['Help', '/help']] },
  ];
  return <footer className="border-t border-border py-14">
    <div className="flagship-content">
      <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div><Link to="/" className="text-2xl font-semibold">1325.AI</Link><p className="text-muted-foreground text-sm mt-4 mb-6 max-w-xs">Intelligence for your business.<br />Connections for your community.</p><address className="text-sm text-muted-foreground not-italic leading-7">1000 E. 111th St., Suite 1100<br />Chicago, Illinois 60628<br /><a href="tel:+13129006004" className="hover:text-primary">1-312-900-6004</a></address></div>
        {groups.map(group => <div key={group.name}><h2 className="text-sm font-medium mb-5">{group.name}</h2><ul className="space-y-3">{group.links.map(([label, to]) => <li key={to}>{to.endsWith('.html') ? <a href={to} className="text-muted-foreground hover:text-primary text-sm">{label}</a> : <Link to={to} className="text-muted-foreground hover:text-primary text-sm">{label}</Link>}</li>)}</ul></div>)}
      </div>
      <div className="mt-12 border-t border-border pt-6 text-xs text-muted-foreground space-y-5"><p>U.S. Provisional Patent Application No. 63/969,202 — 46 claims pending</p><div className="flex flex-wrap gap-4 justify-between"><p>© {new Date().getFullYear()} 1325.AI, Inc. All rights reserved.</p><div className="flex gap-5"><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link><a href="https://www.youtube.com/@1325AI" target="_blank" rel="noopener noreferrer">YouTube</a></div></div></div>
    </div>
  </footer>;
}