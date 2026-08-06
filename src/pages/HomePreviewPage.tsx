import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Search, ArrowRight, Heart, Gift, MapPin, ShieldCheck, Store } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { trackFunnelEvent } from '@/lib/analytics/funnel-tracker';
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
  'Music', 'Entertainment', 'Event Planning',
  'Technology', 'IT Services', 'Marketing',
  'Pet Grooming', 'Veterinarian',
  'Nail Salon', 'Skincare', 'Braids', 'Locs',
];

const POPULAR_CITIES = ['Atlanta, GA', 'Chicago, IL', 'Houston, TX', 'Detroit, MI', 'Charlotte, NC', 'Washington, DC'];

const BENEFITS = [
  {
    icon: MapPin,
    title: 'Find businesses near you',
    body: 'Search thousands of verified Black-owned businesses by city, category, or name.',
  },
  {
    icon: Gift,
    title: 'Save with member discounts',
    body: 'Members unlock 5–30% off at participating businesses and earn loyalty points on every visit.',
  },
  {
    icon: Heart,
    title: 'Save your favorites',
    body: 'Keep a personal list of the businesses you love and come back to them anytime.',
  },
  {
    icon: ShieldCheck,
    title: 'Verified listings',
    body: 'Every listing is reviewed for ownership and an active website before it goes live.',
  },
];

const HomePreviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { data: stats } = useQuery({
    queryKey: ['platform-stats-home-preview'],
    queryFn: async () => {
      const { data } = await supabase.rpc('get_platform_stats');
      return data as { total_members: number; total_businesses: number } | null;
    },
    staleTime: 5 * 60 * 1000,
  });

  const suggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return SUGGESTION_TERMS
      .filter((term) => term.toLowerCase().includes(q))
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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const goToDirectory = (term?: string) => {
    if (term) {
      navigate(`/directory?search=${encodeURIComponent(term)}`);
    } else {
      navigate('/directory');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    trackFunnelEvent('home_preview_search_submit', { query: searchQuery.trim() || null });
    goToDirectory(searchQuery.trim() || undefined);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      const term = suggestions[selectedIndex];
      trackFunnelEvent('home_preview_search_suggestion_click', { term });
      setSearchQuery(term);
      setShowSuggestions(false);
      goToDirectory(term);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const businessCount = stats?.total_businesses ?? 0;

  return (
    <>
      <Helmet>
        <title>Find Black-Owned Businesses Near You | 1325.AI</title>
        <meta
          name="description"
          content="Join free to discover verified Black-owned businesses near you, unlock member discounts, earn loyalty points, and save your favorites."
        />
        <meta name="robots" content="noindex" />
      </Helmet>

      <main className="relative min-h-screen bg-gradient-to-b from-[#000000] via-[#050a18] to-[#030712]">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-mansagold/5 blur-[150px]" />
          <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-blue-600/10 blur-[130px]" />
        </div>

        {/* HERO */}
        <section className="relative px-4 pt-10 pb-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <motion.img
              src={logo1325}
              alt="1325.AI"
              width={512}
              height={512}
              fetchPriority="high"
              decoding="async"
              className="mx-auto h-24 w-auto object-contain drop-shadow-[0_0_24px_hsl(var(--mansagold)/0.5)] sm:h-28 md:h-32"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            />

            <motion.h1
              className="mt-6 font-playfair text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              Find Black-owned businesses near you
            </motion.h1>

            <motion.p
              className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-blue-100/80 sm:text-lg"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Join free to unlock member discounts of 5–30%, earn loyalty points, and save the
              businesses you love. No cost, no credit card.
            </motion.p>

            {/* Search */}
            <motion.form
              onSubmit={handleSearch}
              className="mx-auto mt-8 max-w-xl"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <div className="relative" ref={wrapperRef}>
                <div className="relative flex items-center">
                  <Search className="pointer-events-none absolute left-4 h-5 w-5 text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                    onKeyDown={handleKeyDown}
                    placeholder="Restaurants, barbers, catering..."
                    aria-label="Search businesses"
                    autoComplete="off"
                    className="h-14 w-full rounded-full border border-mansagold/30 bg-white pl-12 pr-24 text-base text-slate-900 placeholder:text-slate-500 transition-all focus:border-mansagold/60 focus:outline-none focus:ring-2 focus:ring-mansagold/50 sm:pr-28"
                    style={{ color: '#111827', WebkitTextFillColor: '#111827', caretColor: '#111827' }}
                  />
                  <button
                    type="submit"
                    className="absolute right-2 rounded-full bg-mansagold px-4 py-2 text-sm font-semibold text-mansablue-dark transition-colors hover:bg-mansagold-dark sm:px-5"
                  >
                    Search
                  </button>
                </div>

                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full z-50 mt-2 w-full overflow-hidden rounded-xl border border-white/15 bg-[#0d1117] shadow-2xl">
                    {suggestions.map((term, i) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => {
                          trackFunnelEvent('home_preview_search_suggestion_click', { term });
                          setSearchQuery(term);
                          setShowSuggestions(false);
                          goToDirectory(term);
                        }}
                        className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
                          i === selectedIndex ? 'bg-mansagold/15 text-white' : 'text-white/80 hover:bg-white/5'
                        }`}
                      >
                        <Search className="h-4 w-4 shrink-0 text-white/30" />
                        <span className="text-sm">{term}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.form>

            {/* Primary CTAs */}
            <motion.div
              className="mx-auto mt-7 flex w-full max-w-xl flex-col gap-3 sm:flex-row sm:justify-center"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link
                to="/signup"
                onClick={() => trackFunnelEvent('home_preview_cta_signup_click', { placement: 'hero' })}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-mansagold px-6 py-4 text-base font-bold text-mansablue-dark shadow-xl transition-colors hover:bg-mansagold-dark sm:w-auto"
              >
                Sign up free
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/directory"
                onClick={() => trackFunnelEvent('home_preview_cta_browse_click', { placement: 'hero' })}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/5 px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-white/10 sm:w-auto"
              >
                Browse the directory
              </Link>
            </motion.div>

            {businessCount > 0 && (
              <p className="mt-5 text-sm text-white/60">
                {businessCount.toLocaleString()}+ businesses listed · Free to join
              </p>
            )}

            {/* Popular cities */}
            <div className="mt-8">
              <p className="text-xs uppercase tracking-wider text-white/40">Popular cities</p>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {POPULAR_CITIES.map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => {
                      trackFunnelEvent('home_preview_city_click', { city });
                      goToDirectory(city.split(',')[0]);
                    }}
                    className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/80 transition-colors hover:border-mansagold/40 hover:bg-mansagold/10 sm:text-sm"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* BENEFITS */}
        <section className="relative border-t border-white/10 px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center font-playfair text-2xl font-bold text-white sm:text-3xl">
              What you get when you join — free
            </h2>
            <div className="mt-9 grid gap-5 sm:grid-cols-2">
              {BENEFITS.map(({ icon: Icon, title, body }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors hover:border-mansagold/30"
                >
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-mansagold/15">
                    <Icon className="h-5 w-5 text-mansagold" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-blue-100/70">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="relative border-t border-white/10 px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-center font-playfair text-2xl font-bold text-white sm:text-3xl">
              Three steps to start saving
            </h2>
            <ol className="mt-9 grid gap-5 sm:grid-cols-3">
              {[
                { n: '1', t: 'Sign up free', d: 'Takes about 30 seconds. Email and password, that is it.' },
                { n: '2', t: 'Search the directory', d: 'Find verified Black-owned businesses in your city.' },
                { n: '3', t: 'Save and earn', d: 'Claim discounts, scan QR codes, and collect loyalty points.' },
              ].map((s) => (
                <li key={s.n} className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                  <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-mansagold font-bold text-mansablue-dark">
                    {s.n}
                  </div>
                  <h3 className="text-base font-semibold text-white">{s.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-blue-100/70">{s.d}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="relative border-t border-white/10 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-playfair text-2xl font-bold text-white sm:text-3xl">
              Ready to support Black-owned businesses?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-base text-blue-100/80">
              Create your free account and start finding businesses in your community today.
            </p>
            <Link
              to="/signup"
              onClick={() => trackFunnelEvent('home_preview_cta_signup_click', { placement: 'footer' })}
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-mansagold px-8 py-4 text-base font-bold text-mansablue-dark shadow-xl transition-colors hover:bg-mansagold-dark"
            >
              Sign up free
              <ArrowRight className="h-5 w-5" />
            </Link>

            {/* Secondary business path */}
            <div className="mt-10 border-t border-white/10 pt-8">
              <p className="flex flex-wrap items-center justify-center gap-2 text-sm text-white/60">
                <Store className="h-4 w-4 text-mansagold" />
                Own a business?
                <Link
                  to="/business-signup"
                  onClick={() => trackFunnelEvent('home_preview_cta_business_click', {})}
                  className="font-semibold text-mansagold underline-offset-4 hover:underline"
                >
                  List it free on 1325.AI
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default HomePreviewPage;
