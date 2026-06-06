import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Check, X, Sparkles, Cpu, Shield, TrendingUp, DollarSign, Zap } from "lucide-react";

const directories = [
  "EatOkra", "Official Black Wall Street", "ByBlack (USBC)", "We Buy Black",
  "Buy From A Black Woman", "The Black Directory", "Black-Owned Brooklyn",
  "Miiriya", "I Am Black Business", "Shoppe Black", "Black Business Lists",
  "Support Black Owned", "The Black Shops", "BlackPulse HQ",
  "TheBlackOwnedDirectory", "The Blk Plug", "BlackDistrict", "Blax Directory",
];

const pillars = [
  {
    icon: Cpu,
    title: "AI-native, not hand-curated",
    them: "Manual submissions, small ops team curates listings.",
    us: "Kayla auto-onboards businesses, auto-responds to reviews, predicts churn, and matches B2B partners 24/7.",
  },
  {
    icon: Zap,
    title: "Operating system, not phone book",
    them: "One job: list Black-owned businesses.",
    us: "Five jobs: discovery, AI employee for every business, loyalty rewards, B2B marketplace, and adjacent commerce (Mansa Stays, Noire Rideshare).",
  },
  {
    icon: Shield,
    title: "Patent-protected infrastructure",
    them: "No defensible IP. Listings are easy to copy.",
    us: "27 USPTO patent claims filed (63/969,202) covering geospatial fraud detection, B2B matching, voice AI, and agentic orchestration.",
  },
  {
    icon: TrendingUp,
    title: "Wealth circulation, measured",
    them: '"Support Black business" as a hashtag.',
    us: "Atomic QR loyalty pipeline, ~$12,100+/mo in savings per business, ~4 roles covered by Kayla, 7x average ROI.",
  },
  {
    icon: DollarSign,
    title: "Five revenue streams, not one",
    them: "Donations, grants, or featured-listing fees.",
    us: "Tiered subscriptions, corporate sponsors, Gemini Enterprise add-on, Mansa Stays bookings, rideshare take-rate.",
  },
  {
    icon: Sparkles,
    title: "Built for the AI commerce wave",
    them: "Static profile pages built for 2015 search behavior.",
    us: "Live AI organization per business — the Level 3 agentic stack every business will need by 2027.",
  },
];

export default function Why1325Page() {
  return (
    <>
      <Helmet>
        <title>Why 1325.AI Outclasses Every Black Business Directory | 1325.AI</title>
        <meta
          name="description"
          content="EatOkra, OBWS, ByBlack and others list Black-owned businesses. 1325.AI runs them — with AI employees, B2B matching, loyalty rewards, and patent-protected infrastructure."
        />
        <link rel="canonical" href="https://1325.ai/why-1325" />
      </Helmet>

      <main className="min-h-screen bg-background text-foreground">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(0,51,102,0.4),transparent_55%),radial-gradient(ellipse_at_bottom,_rgba(255,179,0,0.12),transparent_55%)]" />
          <div className="relative container mx-auto px-4 py-20 md:py-28 max-w-5xl">
            <p className="text-mansagold font-mono text-xs tracking-widest uppercase mb-4">
              Competitive Position
            </p>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              They list Black businesses.
              <br />
              <span className="text-mansagold">We run them.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed">
              Every other Black business directory is a phone book. 1325.AI is the AI
              workforce, the wealth-circulation engine, and the commerce protocol they'll
              all eventually plug into.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link
                to="/business-signup"
                className="px-6 py-3 rounded-md bg-mansagold text-black font-semibold hover:opacity-90 transition"
              >
                Add your business
              </Link>
              <Link
                to="/investor-portal"
                className="px-6 py-3 rounded-md border border-border bg-card font-medium hover:bg-accent transition"
              >
                Investor portal
              </Link>
            </div>
          </div>
        </section>

        {/* Side-by-side table */}
        <section className="container mx-auto px-4 py-16 max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            18 directories vs. one platform
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <X className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-semibold text-muted-foreground">
                  The directories
                </h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {directories.map((d) => (
                  <li key={d} className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                    {d}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-muted-foreground/70 mt-4 italic">
                Each does one thing: a searchable list.
              </p>
            </div>

            <div className="rounded-xl border border-mansagold/40 bg-gradient-to-br from-mansablue/20 to-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Check className="h-5 w-5 text-mansagold" />
                <h3 className="text-lg font-semibold">1325.AI</h3>
              </div>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-2"><Check className="h-4 w-4 text-mansagold flex-shrink-0 mt-0.5" /> Verified Black-owned directory (the table-stakes layer)</li>
                <li className="flex gap-2"><Check className="h-4 w-4 text-mansagold flex-shrink-0 mt-0.5" /> Kayla — an AI employee for every business</li>
                <li className="flex gap-2"><Check className="h-4 w-4 text-mansagold flex-shrink-0 mt-0.5" /> 42 specialized AI agents running the platform</li>
                <li className="flex gap-2"><Check className="h-4 w-4 text-mansagold flex-shrink-0 mt-0.5" /> B2B matching marketplace</li>
                <li className="flex gap-2"><Check className="h-4 w-4 text-mansagold flex-shrink-0 mt-0.5" /> QR loyalty + wealth circulation engine</li>
                <li className="flex gap-2"><Check className="h-4 w-4 text-mansagold flex-shrink-0 mt-0.5" /> Mansa Stays (rentals) + Noire Rideshare</li>
                <li className="flex gap-2"><Check className="h-4 w-4 text-mansagold flex-shrink-0 mt-0.5" /> 27 USPTO patent claims filed</li>
                <li className="flex gap-2"><Check className="h-4 w-4 text-mansagold flex-shrink-0 mt-0.5" /> Native iOS app, voice AI, edge infrastructure</li>
              </ul>
              <p className="text-xs text-mansagold/80 mt-4 italic">
                One platform doing what 18 directories can't.
              </p>
            </div>
          </div>
        </section>

        {/* Pillars */}
        <section className="container mx-auto px-4 py-16 max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Six places we lap the field
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {pillars.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.title}
                  className="rounded-xl border border-border bg-card p-6 hover:border-mansagold/40 transition"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-mansablue/30 border border-mansablue/50">
                      <Icon className="h-5 w-5 text-mansagold" />
                    </div>
                    <h3 className="text-xl font-bold leading-tight">{p.title}</h3>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Them</p>
                      <p className="text-muted-foreground">{p.them}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-mansagold mb-1">1325.AI</p>
                      <p className="text-foreground">{p.us}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Closing CTA */}
        <section className="container mx-auto px-4 py-20 max-w-3xl text-center">
          <p className="text-2xl md:text-3xl font-semibold leading-snug mb-8">
            "When the AI commerce wave hits, every other directory is a customer or an
            acquisition. <span className="text-mansagold">1325.AI is the protocol.</span>"
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              to="/business-signup"
              className="px-6 py-3 rounded-md bg-mansagold text-black font-semibold hover:opacity-90 transition"
            >
              List your business — free
            </Link>
            <Link
              to="/press"
              className="px-6 py-3 rounded-md border border-border bg-card font-medium hover:bg-accent transition"
            >
              Press & partnerships
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
