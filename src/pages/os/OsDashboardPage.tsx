import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Check, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useServerAdminVerification } from '@/hooks/useServerAdminVerification';
import { FlagshipHeader, FlagshipFooter } from '@/components/homepage/FlagshipChrome';
import { OS_STATIONS, OS_TOOL_COUNT, SAMPLE_BUSINESS } from './os-stations';
import '@/components/homepage/flagship.css';

// Visible only to verified administrators until visitor approval links are added.
export default function OsDashboardPage() {
  const { user } = useAuth();
  const { isAdmin, isVerifying } = useServerAdminVerification();
  const [active, setActive] = useState(OS_STATIONS[0].id);
  const station = OS_STATIONS.find(s => s.id === active) ?? OS_STATIONS[0];

  let body: React.ReactNode;
  if (user && isVerifying) body = <p className="py-24 text-center text-muted-foreground">Checking access…</p>;
  else if (!isAdmin) body = (
    <div className="py-24 text-center max-w-md mx-auto">
      <Lock className="mx-auto h-10 w-10 text-primary mb-4" />
      <h1 className="text-2xl font-semibold mb-3">This walkthrough is private</h1>
      <p className="text-muted-foreground mb-6">Request access and our team will email you once approved.</p>
      <Button asChild className="flagship-action"><Link to="/os-tour">Request access</Link></Button>
    </div>
  );
  else body = (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-primary text-sm font-medium">1325 OPERATING SYSTEM · SAMPLE DATA ONLY</p>
          <h1 className="text-3xl md:text-4xl font-semibold mt-2">{SAMPLE_BUSINESS}</h1>
        </div>
        <p className="text-muted-foreground text-sm">{OS_TOOL_COUNT} tools · 6 stations · viewing as {user?.email}</p>
      </div>
      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <nav aria-label="Stations" className="flex lg:flex-col gap-2 overflow-x-auto">
          {OS_STATIONS.map((s, i) => (
            <Button key={s.id} variant={s.id === active ? 'default' : 'ghost'} className="justify-start shrink-0 h-auto py-3 text-left whitespace-normal" onClick={() => setActive(s.id)} aria-pressed={s.id === active}>
              <span><span className="block text-xs opacity-70">Station {i + 1}</span>{s.title}</span>
            </Button>
          ))}
        </nav>
        <section>
          <h2 className="text-2xl font-semibold">{station.title}</h2>
          <p className="text-muted-foreground mt-2 mb-6">{station.summary}</p>
          <div className="grid gap-4 md:grid-cols-2">
            {station.tools.map(t => (
              <article key={t.name} className="border border-border rounded-lg p-5 bg-card">
                <h3 className="font-medium">{t.name}</h3>
                <p className="text-primary text-sm mt-2 mb-3">Sample: {t.sample}</p>
                <ul className="space-y-1.5">{t.items.map(item => <li key={item} className="flex gap-2 text-sm text-muted-foreground"><Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />{item}</li>)}</ul>
              </article>
            ))}
          </div>
        </section>
      </div>
      <p className="mt-10 text-xs text-destructive font-medium">PRIVATE & CONFIDENTIAL — DO NOT COPY, FORWARD, OR DISTRIBUTE. Sample business and figures are illustrative.</p>
    </>
  );

  return (
    <div className="flagship font-body">
      <Helmet><title>1325 Operating System | Private Walkthrough</title><meta name="robots" content="noindex" /></Helmet>
      <FlagshipHeader />
      <main className="flagship-content py-12">{body}</main>
      <FlagshipFooter />
    </div>
  );
}
