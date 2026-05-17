import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Home, Car } from 'lucide-react';

const AlsoFromStrip: React.FC = () => {
  return (
    <section className="py-8 md:py-12 relative">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center mb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-mansagold">Also from 1325.AI</span>
          <h2 className="text-xl md:text-2xl font-bold text-white mt-1">More ways to circulate wealth</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Mansa Stays */}
          <Link
            to="/stays"
            className="group bg-gradient-to-br from-slate-900/80 to-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 p-5 hover:border-mansagold/40 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-12 h-12 rounded-xl bg-mansagold/10 border border-mansagold/30 flex items-center justify-center">
                <Home className="h-6 w-6 text-mansagold" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-white">Mansa Stays</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">Live</span>
                </div>
                <p className="text-sm text-blue-200/70 mb-2">
                  Vacation rentals from non-bias property owners. 92.5% host payouts.
                </p>
                <span className="text-sm font-semibold text-mansagold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Browse Stays <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </Link>

          {/* Noire Rideshare */}
          <Link
            to="/noir/book"
            className="group bg-gradient-to-br from-black/90 to-slate-900/80 backdrop-blur-sm rounded-2xl border border-mansagold/20 p-5 hover:border-mansagold/50 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-12 h-12 rounded-xl bg-mansagold/10 border border-mansagold/30 flex items-center justify-center">
                <Car className="h-6 w-6 text-mansagold" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-white">Noire Rideshare</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-mansagold bg-mansagold/10 px-2 py-0.5 rounded-full">Soon</span>
                </div>
                <p className="text-sm text-blue-200/70 mb-2">
                  Premium hotel & airport transport in Chicago. Drivers keep 80%.
                </p>
                <span className="text-sm font-semibold text-mansagold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Book a Ride <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AlsoFromStrip;
