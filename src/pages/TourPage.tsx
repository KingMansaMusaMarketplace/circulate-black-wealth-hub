import { Helmet } from "react-helmet-async";
import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import holidayVideo from "@/assets/tour/tour-holiday.mp4.asset.json";
import everydayVideo from "@/assets/tour/tour.mp4.asset.json";

const START = Date.parse("2026-10-01T05:00:00Z");
const END = Date.parse("2027-01-01T06:00:00Z");

// Only allow claim links that point back to 1325.ai (no open redirects).
function safeClaimUrl(raw: string | null): string | null {
  if (!raw) return null;
  try {
    const u = new URL(raw, window.location.origin);
    const ok = u.origin === window.location.origin || /(^|\.)1325\.ai$/i.test(u.hostname);
    return ok && (u.protocol === "https:" || u.origin === window.location.origin) ? u.toString() : null;
  } catch {
    return null;
  }
}

export default function TourPage() {
  const [params] = useSearchParams();
  const now = Date.now();
  const holiday = now >= START && now < END;
  const claim = safeClaimUrl(params.get("claim"));
  // Campaign always plays the latest 1:08 Holiday video (user decision Sep 23 2026).
  const src = holidayVideo.url || everydayVideo.url;
  const poster = "/videos/tour-holiday-thumb.jpg";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Take the 1325.AI Tour | Claim Your Free Listing</title>
        <meta name="description" content="See how 1325.AI helps customers find, call and book Black-owned businesses. Claim your free listing in minutes." />
      </Helmet>
      <section className="mx-auto max-w-4xl px-4 py-12 text-center">
        <h1 className="text-3xl font-extrabold md:text-5xl">
          Take the <span className="text-primary">1325.AI</span> tour
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          {holiday ? "Plus our Holiday Special: Pro for $149/mo, regularly $299. Oct 1 – Dec 31." : "See what your free listing can do for your business."}
        </p>
        <div className="mt-8 overflow-hidden rounded-2xl border border-primary/30 shadow-2xl">
          <video src={src} poster={poster} controls playsInline preload="metadata" className="aspect-video w-full bg-background" />
        </div>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {claim ? (
            <Button asChild size="lg" className="h-14 px-10 text-lg font-bold">
              <a href={claim}>Claim Your Free Listing</a>
            </Button>
          ) : (
            <Button asChild size="lg" className="h-14 px-10 text-lg font-bold">
              <Link to="/claim-business">Claim Your Free Listing</Link>
            </Button>
          )}
          {holiday && (
            <Button asChild size="lg" variant="outline" className="h-14 px-8 text-lg">
              <Link to="/holiday-special">See the Holiday Special</Link>
            </Button>
          )}
        </div>
      </section>
    </main>
  );
}
