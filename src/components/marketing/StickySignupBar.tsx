import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sparkles, X, ArrowRight } from "lucide-react";
import { useFoundingSlots } from "@/hooks/useFoundingSlots";
import { isNativeApp } from "@/utils/platform-utils";
import { trackFunnelEvent } from "@/lib/analytics/funnel-tracker";

const DISMISS_KEY = "sticky_cta_dismissed_v1";
const HIDDEN_PATHS = ["/business-signup", "/signup", "/login"];

/**
 * Persistent bottom (mobile) / top (desktop) call-to-action bar that drives
 * visitors to the business signup page. Shows live Founding 100 counter.
 * Hidden on iOS native (per platform constraint) and on signup/login pages.
 */
const StickySignupBar = () => {
  const { remaining, isFull, loading } = useFoundingSlots();
  const { pathname } = useLocation();
  const [dismissed, setDismissed] = useState(true); // start hidden to avoid flash

  useEffect(() => {
    if (typeof window === "undefined") return;
    setDismissed(sessionStorage.getItem(DISMISS_KEY) === "1");
  }, []);

  if (dismissed || isNativeApp()) return null;
  if (HIDDEN_PATHS.some((p) => pathname.startsWith(p))) return null;

  const handleDismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  };

  const headline = loading
    ? "List Your Business — Free"
    : isFull
      ? "Founding 100 sold out — join the waitlist"
      : "List Your Business — Free";

  const subline = loading
    ? "Join the Founding 100"
    : isFull
      ? "Get notified when new spots open"
      : `Only ${remaining} of 100 Founding spots left`;

  return (
    <div
      role="region"
      aria-label="Founding member signup"
      className="fixed bottom-0 left-0 right-0 z-[200] animate-fade-in"
    >
      <div className="bg-gradient-to-r from-mansablue via-mansablue to-black/95 border-t border-mansagold/40 backdrop-blur-md shadow-2xl">
        <div className="container mx-auto px-4 py-3 flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-mansagold shrink-0 hidden sm:block" />
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm sm:text-base leading-tight truncate">
              {headline}
            </p>
            <p className="text-mansagold text-xs sm:text-sm leading-tight truncate">
              {subline}
            </p>
          </div>
          <Link
            to="/business-signup"
            onClick={() => trackFunnelEvent("sticky_cta_click", { remaining, isFull })}
            className="inline-flex items-center gap-1.5 bg-mansagold hover:bg-amber-400 text-black font-bold px-4 py-2 rounded-lg text-sm shadow-lg transition-all hover:scale-105 shrink-0"
          >
            Claim Spot
            <ArrowRight className="h-4 w-4" />
          </Link>
          <button
            onClick={handleDismiss}
            aria-label="Dismiss"
            className="text-white/60 hover:text-white p-1 shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StickySignupBar;
