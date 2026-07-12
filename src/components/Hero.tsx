import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Building2, TrendingUp, Search, Sparkles, Zap } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Capacitor } from '@capacitor/core';
import { supabase } from '@/integrations/supabase/client';
import CountUpNumber from '@/components/animations/CountUpNumber';
import logo1325 from '@/assets/1325-ai-logo.webp';
import { useFoundingSlots } from '@/hooks/useFoundingSlots';
import { trackFunnelEvent } from '@/lib/analytics/funnel-tracker';
import { FOUNDING_MEMBER_SLOT_CAP } from '@/lib/constants/founding-member';

const SUGGESTION_TERMS = [
  'Restaurant', 'Barber', 'Barbershop', 'Beauty Salon', 'Hair Salon',
  'Catering', 'Bakery', 'Coffee Shop', 'Food Truck', 'Grocery',
  'Clothing', 'Boutique', 'Retail', 'Jewelry',
  'Auto Repair', 'Car Wash', 'Automotive',
  'Fitness', 'Gym', 'Yoga', 'Personal Trainer',
  'Dentist', 'Doctor', 'Health', 'Pharmacy', 'Wellness', 'Spa', 'Massage',
  'Accounting', 'Tax', 'Legal', 'Lawyer', 'Attorney', 'Insurance',
  'Real Estate', 'Photography', 'Graphic Design', 'Web Design',
  'Plumber', 'Electrician', 'Landscaping', 'Cleaning', 'Home Services',
  'Daycare', 'Tutoring', 'Education',
  'Church', 'Nonprofit', 'Community',
  'Music', 'Entertainment', 'Event Planning',
  'Technology', 'IT Services', 'Marketing',
  'Pet Grooming', 'Veterinarian',
  'Nail Salon', 'Skincare', 'Braids', 'Locs',
];

const Hero = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { claimed, remaining, isFull, loading: foundingLoading } = useFoundingSlots();

  const { data: stats } = useQuery({
    queryKey: ['platform-stats-hero'],
    queryFn: async () => {
      const { data } = await supabase.rpc('get_platform_stats');
      return data as { total_members: number; total_businesses: number } | null;
    },
    staleTime: 5 * 60 * 1000,
  });

  const shouldShowMemberCount = (stats?.total_members ?? 0) >= 1000;

  const suggestions = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 1) return [];
    const q = searchQuery.toLowerCase();
    return SUGGESTION_TERMS
      .filter(term => term.toLowerCase().includes(q))
      .sort((a, b) => {
        const aStarts = a.toLowerCase().startsWith(q) ? 0 : 1;
        const bStarts = b.toLowerCase().startsWith(q) ? 0 : 1;
        return aStarts - bStarts || a.localeCompare(b);
      })
      .slice(0, 6);
  }, [searchQuery]);

  useEffect(() => {
    setSelectedIndex(-1);
    setShowSuggestions(suggestions.length > 0);
  }, [suggestions]);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    trackFunnelEvent('hero_search_submit', { query: searchQuery.trim() || null });
    if (searchQuery.trim()) {
      navigate(`/directory?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/directory');
    }
  };

  const handleSelectSuggestion = (term: string) => {
    setSearchQuery(term);
    setShowSuggestions(false);
    trackFunnelEvent('hero_search_suggestion_click', { term });
    navigate(`/directory?search=${encodeURIComponent(term)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleSelectSuggestion(suggestions[selectedIndex]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleScrollToNextSection = () => {
    document.getElementById('mission-preview')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <section className="relative min-h-[auto] md:min-h-[auto] flex items-center overflow-hidden">

      {/* Premium gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#000000] via-[#050a18] to-[#030712]" />
      
      {/* Ambient effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] md:w-[700px] h-[500px] md:h-[700px] bg-mansagold/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-blue-600/2 rounded-full blur-[120px]" />
      </div>

      {/* Bottom gold edge transition */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-mansagold/5 to-transparent" />

      <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2 md:pt-8 md:pb-3">
        <div className="max-w-3xl lg:max-w-5xl mx-auto text-center">
          {/* Mission tagline */}
          <motion.p
            className="text-xs md:text-sm font-medium text-mansagold/90 tracking-wide mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            1325 — the year Mansa Musa's pilgrimage reshaped global commerce
          </motion.p>

          {/* MCP infrastructure badge — signals to investors/devs that 1325.AI is AI-agent-ready */}
          {!Capacitor.isNativePlatform() && (
            <motion.div
              className="flex justify-center mb-4"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
            >
              <Link
                to="/connect"
                className="group inline-flex items-center gap-2 rounded-full border border-mansagold/30 bg-mansagold/5 hover:bg-mansagold/10 hover:border-mansagold/50 px-3 py-1.5 text-[11px] md:text-xs text-mansagold/90 transition-colors"
              >
                <Zap className="w-3.5 h-3.5" />
                <span className="font-medium">AI Infrastructure</span>
                <span className="text-mansagold/50">·</span>
                <span className="hidden sm:inline">MCP-ready for ChatGPT, Claude, Cursor &amp; Codex</span>
                <span className="sm:hidden">MCP-ready</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>
          )}




          {/* Brand mark — 1325.AI logo on web, Mansa Musa text on iOS App Store build */}
          {Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios' ? (
            <motion.h1
              className="font-playfair text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.05] mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <span className="text-gradient-gold">Mansa Musa</span>
              <br />
              <span className="text-gradient-gold">Marketplace</span>
            </motion.h1>
          ) : (
            <motion.div
              className="flex justify-center mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="relative inline-flex items-center justify-center">
                <div
                  className="absolute inset-0 rounded-full bg-mansagold/60 blur-3xl animate-pulse"
                  style={{ animationDuration: '4s' }}
                  aria-hidden="true"
                />
                <div
                  className="absolute inset-0 rounded-full bg-mansagold/80 blur-2xl scale-75 animate-pulse"
                  style={{ animationDuration: '4s' }}
                  aria-hidden="true"
                />
                <img
                  src={logo1325}
                  alt="1325.AI"
                  width={512}
                  height={512}
                  fetchPriority="high"
                  decoding="async"
                  className="relative h-32 sm:h-40 md:h-52 lg:h-64 w-auto object-contain drop-shadow-[0_0_24px_hsl(var(--mansagold)/0.5)]"
                />
              </div>
            </motion.div>
          )}
          
          {/* Subhead — tightened for 3-second clarity */}
          <motion.h2
            className="text-xl md:text-2xl lg:text-3xl text-white font-semibold mb-3 max-w-2xl lg:max-w-3xl mx-auto leading-snug"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            Discover verified Black-owned businesses. Powered by Agentic AI.
          </motion.h2>
          <motion.p
            className="text-sm md:text-base text-blue-100/80 mb-5 max-w-xl lg:max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="text-white/70">Answers customers 24/7 · Books appointments · Posts to social</span>
          </motion.p>


          {/* Search bar with autocomplete */}
          <motion.form
            onSubmit={handleSearch}
            className="max-w-xl mx-auto mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <div className="relative" ref={wrapperRef}>
              <div className="relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-slate-500 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search businesses: restaurants, barbers, catering..."
                  className="w-full h-13 pl-12 pr-28 rounded-full bg-white border border-mansagold/30 text-slate-900 placeholder:text-slate-500 text-base focus:outline-none focus:ring-2 focus:ring-mansagold/50 focus:border-mansagold/60 transition-all duration-300"
                  style={{
                    color: '#111827',
                    WebkitTextFillColor: '#111827',
                    caretColor: '#111827',
                  }}
                  autoComplete="off"
                />
                <button
                  type="submit"
                  className="absolute right-2 px-5 py-2 rounded-full bg-mansagold text-mansablue-dark font-semibold text-sm hover:bg-mansagold-dark transition-colors"
                >
                  Search
                </button>
              </div>

              {/* Autocomplete dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-50 top-full mt-2 w-full rounded-xl bg-[#0d1117] border border-white/15 shadow-2xl overflow-hidden">
                  {suggestions.map((term, i) => {
                    const q = searchQuery.toLowerCase();
                    const idx = term.toLowerCase().indexOf(q);
                    const before = term.slice(0, idx);
                    const match = term.slice(idx, idx + searchQuery.length);
                    const after = term.slice(idx + searchQuery.length);

                    return (
                      <button
                        key={term}
                        type="button"
                        onClick={() => handleSelectSuggestion(term)}
                        className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                          i === selectedIndex
                            ? 'bg-mansagold/15 text-white'
                            : 'text-white/80 hover:bg-white/5'
                        }`}
                      >
                        <Search className="w-4 h-4 text-white/30 shrink-0" />
                        <span className="text-sm">
                          {before}
                          <span className="text-mansagold font-semibold">{match}</span>
                          {after}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.form>

          {/* Founding 100 banner removed per request */}

          {/* Dual-path CTAs with chooser labels */}
          <motion.div 
            className="flex flex-col gap-5 items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full max-w-3xl">
              <Link
                to="/directory"
                onClick={() => trackFunnelEvent('hero_cta_find_businesses_click', { claimed, remaining })}
                className="group"
              >
                <div className="h-full rounded-2xl border border-white/15 bg-white/5 hover:bg-mansagold/10 hover:border-mansagold/50 transition-all p-4 sm:p-5 text-left">
                  <div className="text-xs uppercase tracking-wider text-white/90 mb-1">I'm a customer</div>
                  <Button
                    size="lg"
                    className="bg-mansagold hover:bg-mansagold-dark text-mansablue-dark font-bold h-auto py-3 px-5 rounded-xl shadow-xl text-base w-full flex items-center justify-center gap-2"
                  >
                    <Search className="w-5 h-5" />
                    Find Black-Owned Businesses
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <p className="mt-2 text-xs text-white/90">Browse {(stats?.total_businesses ?? 44000).toLocaleString()}+ verified businesses — always free.</p>
                </div>
              </Link>

              <Link
                to="/business-signup"
                onClick={() => trackFunnelEvent('hero_cta_business_signup_click', { claimed, remaining })}
                className="group"
              >
                <div className="h-full rounded-2xl border border-mansagold/30 bg-mansagold/5 hover:bg-mansagold/15 hover:border-mansagold/60 transition-all p-4 sm:p-5 text-left">
                  <div className="text-xs uppercase tracking-wider text-mansagold mb-1">I own a business</div>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-mansagold/50 text-mansagold hover:bg-mansagold/20 font-semibold h-auto py-3 px-5 rounded-xl text-base w-full flex items-center justify-center gap-2 bg-black/30"
                  >
                    <Building2 className="w-5 h-5" />
                    List Free & Get Kayla AI
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <p className="mt-2 text-xs text-white/90">Free listing · Kayla AI included.</p>
                </div>
              </Link>
            </div>



            {/* Trust stat bar */}
            {stats && (
              <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mt-2 text-sm text-white/70">
                {shouldShowMemberCount && (
                  <>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-mansagold" />
                      <CountUpNumber end={stats.total_members || 0} suffix="+ Members" className="font-semibold" />
                    </div>
                    <div className="hidden sm:block w-px h-4 bg-white/20" />
                  </>
                )}
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
