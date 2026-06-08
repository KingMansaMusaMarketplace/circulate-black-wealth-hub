import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { trackFunnelEvent } from "@/lib/analytics/funnel-tracker";

const StickySignupBar = () => {
  return (
    <div
      role="region"
      aria-label="Founding member signup"
      className="fixed bottom-0 left-0 right-0 z-[200]"
      style={{ background: '#003366', borderTop: '2px solid #FFB300' }}
    >
      <div className="container mx-auto px-4 py-3 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm sm:text-base leading-tight truncate">
            List Your Business — Free
          </p>
          <p className="text-amber-400 text-xs sm:text-sm leading-tight truncate">
            Join the Founding 100
          </p>
        </div>
        <Link
          to="/business-signup"
          onClick={() => trackFunnelEvent("sticky_cta_click", {})}
          className="inline-flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-black font-bold px-4 py-2 rounded-lg text-sm shadow-lg transition-all hover:scale-105 shrink-0"
        >
          Claim Spot
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

export default StickySignupBar;
