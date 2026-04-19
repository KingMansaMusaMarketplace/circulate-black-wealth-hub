import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Building2, TrendingUp, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Capacitor } from '@capacitor/core';
import { supabase } from '@/integrations/supabase/client';
import CountUpNumber from '@/components/animations/CountUpNumber';
import logo1325 from '@/assets/1325-ai-logo.webp';

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
    if (searchQuery.trim()) {
      navigate(`/directory?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/directory');
    }
  };

  const handleSelectSuggestion = (term: string) => {
    setSearchQuery(term);
    setShowSuggestions(false);
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
            className="text-sm md:text-base font-semibold text-mansagold uppercase tracking-widest mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            The Economic Operating System for Community Wealth
          </motion.p>

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
                  className="relative h-32 sm:h-40 md:h-52 lg:h-64 w-auto object-contain drop-shadow-[0_0_24px_hsl(var(--mansagold)/0.5)]"
                />
              </div>
            </motion.div>
          )}
          
          {/* Subhead — tightened for 3-second clarity */}
          <motion.p 
            className="text-base md:text-lg lg:text-xl text-blue-100/80 mb-5 max-w-xl lg:max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            36,000+ verified businesses. Loyalty rewards on every purchase. Always free for consumers.
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
                <Search className="absolute left-4 w-5 h-5 text-white/40 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search businesses: restaurants, barbers, catering..."
                  className="w-full h-13 pl-12 pr-28 rounded-full bg-white/8 border border-white/15 text-white placeholder:text-white/40 text-base focus:outline-none focus:ring-2 focus:ring-mansagold/50 focus:border-mansagold/40 transition-all duration-300"
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

          {/* Dual-path CTAs with micro-descriptions */}
          <motion.div 
            className="flex flex-col gap-5 items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
              <Link to="/signup" className="w-full sm:w-auto">
                <Button 
                  size="lg"
                  className="bg-mansagold hover:bg-mansagold-dark text-mansablue-dark font-bold h-auto py-3 px-8 rounded-xl shadow-xl text-lg w-full sm:w-auto flex flex-col items-center gap-0"
                >
                  <span className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    I'm a Consumer
                    <ArrowRight className="w-5 h-5" />
                  </span>
                  <span className="text-xs font-medium opacity-80">Free forever · Earn rewards</span>
                </Button>
              </Link>

              <Link to="/business-signup" className="w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-mansagold/40 text-mansagold hover:bg-mansagold/10 font-bold h-auto py-3 px-8 rounded-xl text-lg w-full sm:w-auto flex flex-col items-center gap-0"
                >
                  <span className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    I'm a Business
                    <ArrowRight className="w-5 h-5" />
                  </span>
                  <span className="text-xs font-medium opacity-70">28 AI employees · From $19/mo</span>
                </Button>
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
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-mansagold" />
                  <CountUpNumber end={stats.total_businesses || 0} suffix="+ Businesses" className="font-semibold" />
                </div>
                <div className="hidden sm:block w-px h-4 bg-white/20" />
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-mansagold" />
                  <span className="font-semibold">Free to Join</span>
                </div>
              </div>
            )}
          </motion.div>

          {/* No credit card disclaimer */}
          <motion.p
            className="mt-4 text-white/70 text-base"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            No credit card required. Always free for consumers.
          </motion.p>

          {/* Scroll indicator */}
          <motion.div
            className="flex flex-col items-center mt-3 text-white cursor-pointer hover:text-mansagold transition-colors"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            onClick={handleScrollToNextSection}
          >
            <span className="text-xs tracking-widest uppercase mb-1">Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
