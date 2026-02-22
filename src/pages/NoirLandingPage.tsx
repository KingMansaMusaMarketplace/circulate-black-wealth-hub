import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Car, MapPin, Navigation, Shield, Star, ArrowRight, ExternalLink,
  DollarSign, Users, Clock, Zap, CheckCircle, ChevronDown, ChevronUp,
  Phone, Mail, Briefcase, Award, Globe
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { businesses } from '@/data/businessesData';
import earthImage from '@/assets/earth.png';

const UBER_DEEPLINK = (lat: number, lng: number, name: string) =>
  `https://m.uber.com/ul/?action=setPickup&dropoff[latitude]=${lat}&dropoff[longitude]=${lng}&dropoff[nickname]=${encodeURIComponent(name)}`;

const LYFT_DEEPLINK = (lat: number, lng: number) =>
  `https://lyft.com/ride?destination[latitude]=${lat}&destination[longitude]=${lng}`;

const featuredDestinations = businesses
  .filter(b => b.isFeatured && b.lat && b.lng)
  .slice(0, 6);

const steps = [
  { icon: MapPin, title: 'Enter Your Destination', description: 'Type an address or pick a Black-owned business from our directory.' },
  { icon: Car, title: 'Get Matched', description: 'We connect you with a nearby Noir driver. No surge pricing games.' },
  { icon: Navigation, title: 'Ride and Save', description: 'Pay less than the big apps. Your driver takes home 80% of the fare.' },
];

const stats = [
  { value: '80%', label: 'Driver Take-Home', icon: DollarSign },
  { value: '20%', label: 'Platform Fee', icon: Zap },
  { value: '0%', label: 'Surge Pricing', icon: Shield },
  { value: '24/7', label: 'Service Hours', icon: Clock },
];

const faqs = [
  { q: 'How is Noir different from Uber/Lyft?', a: 'Noir takes only 20% — compared to Uber\'s 25-50% and Lyft\'s 25-40%. Your driver keeps 80% of every fare. Plus, we\'re deeply integrated with the 1325.AI ecosystem, routing riders to community businesses.' },
  { q: 'Is Noir available in my city?', a: 'We\'re launching in Chicago, Atlanta, Houston, DC, Detroit, NYC, and LA first. We\'re building the driver network now — sign up to drive or request early access for your city.' },
  { q: 'How does pricing work?', a: 'Our base fare is $2.50 + $1.25/mile + $0.20/min. No surge pricing ever. What you see is what you pay.' },
  { q: 'Can I schedule rides in advance?', a: 'Scheduled rides are coming in Phase 2. Right now, we connect you to available drivers in real-time or deeplink to partner ride-share apps.' },
  { q: 'How do I become a Noir driver?', a: 'Fill out the driver application below. You\'ll need a valid license, insurance, a vehicle 2015 or newer, and pass a background check. We\'re onboarding drivers in waves.' },
];

const testimonials = [
  { name: 'Marcus J.', city: 'Chicago', text: 'Finally a ride-share that doesn\'t gouge me on pricing. And knowing my driver keeps 80%? That matters.', rating: 5 },
  { name: 'Aisha T.', city: 'Atlanta', text: 'I love that Noir routes me to Black-owned businesses. Got dropped off at a restaurant I never knew existed. Amazing food.', rating: 5 },
  { name: 'Devon R.', city: 'Houston', text: 'As a driver, switching to Noir was a no-brainer. I make $200 more per week on the same number of rides.', rating: 5 },
];

const NoirLandingPage: React.FC = () => {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [estimatedFare, setEstimatedFare] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [driverForm, setDriverForm] = useState({ name: '', email: '', phone: '', city: '', vehicle: '' });
  const [driverSubmitted, setDriverSubmitted] = useState(false);

  const calculateFare = () => {
    if (pickup && dropoff) {
      // Simulated fare calculation (random 5-25 mile trip)
      const miles = 5 + Math.random() * 20;
      const minutes = miles * 2.5;
      const fare = 2.50 + (miles * 1.25) + (minutes * 0.20);
      setEstimatedFare(Math.round(fare * 100) / 100);
    }
  };

  const handleDriverSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDriverSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-black text-white">

      {/* Hero */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-mansagold/8 via-mansagold/3 to-transparent" />
        <div className="absolute top-20 right-10 w-96 h-96 bg-mansagold/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-amber-500/5 rounded-full blur-[80px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-mansagold/3 rounded-full blur-[150px]" />

        <div className="container max-w-6xl mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <Car className="h-14 w-14 text-mansagold" />
              <h1 className="text-6xl md:text-8xl font-bold tracking-tight">
                <span className="text-mansagold">Noir</span>
                <span className="text-white/40 font-light">.travel</span>
              </h1>
            </div>

            <p className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto mb-3 leading-relaxed">
              The ride-share that puts <span className="text-mansagold font-semibold">people first</span>.
              <br className="hidden md:block" />
              Lower fares. Higher driver pay. Premium experience.
            </p>

            <p className="text-sm font-mono text-mansagold/50 tracking-[0.3em] uppercase mb-10">
              Powered by 1325.AI
            </p>

            {/* Ride Request Form */}
            <div className="max-w-xl mx-auto mb-8">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8">
                <h3 className="text-lg font-bold text-mansagold mb-4 flex items-center gap-2">
                  <Navigation className="h-5 w-5" />
                  Where are you going?
                </h3>
                <div className="space-y-3">
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 bg-emerald-400 rounded-full" />
                    <Input
                      placeholder="Pickup location"
                      value={pickup}
                      onChange={(e) => setPickup(e.target.value)}
                      className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl h-12"
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 bg-mansagold rounded-full" />
                    <Input
                      placeholder="Where to?"
                      value={dropoff}
                      onChange={(e) => setDropoff(e.target.value)}
                      className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl h-12"
                    />
                  </div>
                  <Button
                    onClick={calculateFare}
                    className="w-full bg-mansagold hover:bg-amber-500 text-black font-bold rounded-xl h-12 text-lg group"
                    disabled={!pickup || !dropoff}
                  >
                    Get Fare Estimate
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>

                {estimatedFare && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-5 p-4 bg-mansagold/10 border border-mansagold/20 rounded-2xl"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-white/70 text-sm">Estimated Noir Fare</span>
                      <span className="text-3xl font-bold text-mansagold">${estimatedFare.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-white/40 mb-4">
                      <span>Uber/Lyft estimate</span>
                      <span className="line-through">${(estimatedFare * 1.35).toFixed(2)} – ${(estimatedFare * 1.55).toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-emerald-400 mb-4">
                      <CheckCircle className="h-4 w-4" />
                      <span>You save up to ${((estimatedFare * 1.55) - estimatedFare).toFixed(2)} — your driver keeps ${(estimatedFare * 0.80).toFixed(2)}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        asChild
                        size="sm"
                        className="flex-1 bg-black border border-mansagold/30 text-mansagold hover:bg-mansagold/10 rounded-lg"
                      >
                        <a href="#destinations">
                          Pick a Destination <MapPin className="ml-1 h-3 w-3" />
                        </a>
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-mansagold/20 text-mansagold hover:bg-mansagold/10 rounded-xl px-8"
              >
                <a href="#destinations">Browse Destinations</a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/10 text-white/60 hover:bg-white/5 rounded-xl px-8"
              >
                <Link to="/directory">Full Directory</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-t border-b border-white/5 bg-mansagold/3">
        <div className="container max-w-5xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <stat.icon className="h-6 w-6 text-mansagold mx-auto mb-2" />
                <div className="text-3xl md:text-4xl font-bold text-mansagold font-mono">{stat.value}</div>
                <div className="text-white/50 text-sm mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-28 border-b border-white/5">
        <div className="container max-w-5xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-center mb-4"
          >
            How <span className="text-mansagold">Noir</span> Works
          </motion.h2>
          <p className="text-white/50 text-center max-w-lg mx-auto mb-14">
            Three steps to a better ride experience — for riders and drivers.
          </p>

          <div className="grid md:grid-cols-3 gap-10">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center relative"
              >
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-gradient-to-r from-mansagold/30 to-transparent" />
                )}
                <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-mansagold/10 border border-mansagold/20 flex items-center justify-center">
                  <step.icon className="h-8 w-8 text-mansagold" />
                </div>
                <div className="text-xs font-mono text-mansagold/40 mb-2 tracking-widest">STEP 0{i + 1}</div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Calculator */}
      <section className="py-20 md:py-28 border-b border-white/5 bg-gradient-to-b from-transparent via-mansagold/3 to-transparent">
        <div className="container max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-3">
              <span className="text-mansagold">Fair</span> Pricing
            </h2>
            <p className="text-white/50 max-w-lg mx-auto">
              No surge. No games. See exactly what you'll pay and what your driver earns.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Noir */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-mansagold text-black text-xs font-bold px-4 py-1 rounded-full">
                RECOMMENDED
              </div>
              <Card className="bg-mansagold/10 border-mansagold/30 h-full">
                <CardHeader className="text-center pb-2">
                  <Car className="h-10 w-10 text-mansagold mx-auto mb-2" />
                  <CardTitle className="text-2xl text-mansagold">Noir</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div>
                    <div className="text-4xl font-bold text-white font-mono">$2.50</div>
                    <div className="text-white/40 text-sm">base fare</div>
                  </div>
                  <div className="space-y-2 text-sm text-white/60">
                    <div className="flex justify-between"><span>Per mile</span><span className="text-mansagold font-mono">$1.25</span></div>
                    <div className="flex justify-between"><span>Per minute</span><span className="text-mansagold font-mono">$0.20</span></div>
                    <div className="flex justify-between"><span>Platform fee</span><span className="text-mansagold font-mono">20%</span></div>
                    <div className="flex justify-between"><span>Surge pricing</span><span className="text-emerald-400 font-bold">Never</span></div>
                  </div>
                  <div className="pt-2 border-t border-white/10">
                    <div className="text-sm text-white/40">Driver keeps</div>
                    <div className="text-2xl font-bold text-emerald-400">80%</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Uber */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-white/5 border-white/10 h-full opacity-80">
                <CardHeader className="text-center pb-2">
                  <div className="h-10 w-10 bg-white/10 rounded-xl mx-auto mb-2 flex items-center justify-center text-xl font-bold text-white/50">U</div>
                  <CardTitle className="text-2xl text-white/60">Uber</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div>
                    <div className="text-4xl font-bold text-white/50 font-mono">$2.55</div>
                    <div className="text-white/30 text-sm">base fare</div>
                  </div>
                  <div className="space-y-2 text-sm text-white/40">
                    <div className="flex justify-between"><span>Per mile</span><span className="font-mono">$1.75</span></div>
                    <div className="flex justify-between"><span>Per minute</span><span className="font-mono">$0.35</span></div>
                    <div className="flex justify-between"><span>Platform fee</span><span className="font-mono">25-50%</span></div>
                    <div className="flex justify-between"><span>Surge pricing</span><span className="text-red-400">Up to 3x</span></div>
                  </div>
                  <div className="pt-2 border-t border-white/10">
                    <div className="text-sm text-white/30">Driver keeps</div>
                    <div className="text-2xl font-bold text-white/40">50-75%</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Lyft */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-white/5 border-white/10 h-full opacity-80">
                <CardHeader className="text-center pb-2">
                  <div className="h-10 w-10 bg-white/10 rounded-xl mx-auto mb-2 flex items-center justify-center text-xl font-bold text-white/50">L</div>
                  <CardTitle className="text-2xl text-white/60">Lyft</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div>
                    <div className="text-4xl font-bold text-white/50 font-mono">$2.50</div>
                    <div className="text-white/30 text-sm">base fare</div>
                  </div>
                  <div className="space-y-2 text-sm text-white/40">
                    <div className="flex justify-between"><span>Per mile</span><span className="font-mono">$1.65</span></div>
                    <div className="flex justify-between"><span>Per minute</span><span className="font-mono">$0.30</span></div>
                    <div className="flex justify-between"><span>Platform fee</span><span className="font-mono">25-40%</span></div>
                    <div className="flex justify-between"><span>Surge pricing</span><span className="text-red-400">Up to 2.5x</span></div>
                  </div>
                  <div className="pt-2 border-t border-white/10">
                    <div className="text-sm text-white/30">Driver keeps</div>
                    <div className="text-2xl font-bold text-white/40">60-75%</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section id="destinations" className="py-20 md:py-28 border-b border-white/5">
        <div className="container max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-3">
              <span className="text-mansagold">Popular</span> Destinations
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Pick a destination below and we'll open your preferred ride app with the address ready to go.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredDestinations.map((biz, i) => (
              <motion.div
                key={biz.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-mansagold/30 transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="h-36 relative overflow-hidden">
                  <img
                    src={biz.imageUrl || biz.bannerUrl}
                    alt={biz.imageAlt || biz.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-2 left-3 flex items-center gap-1 text-xs text-mansagold">
                    <Star className="h-3 w-3 fill-mansagold" />
                    <span>{biz.averageRating?.toFixed(1) || biz.rating}</span>
                  </div>
                  <div className="absolute top-2 right-2 bg-mansagold/20 backdrop-blur text-mansagold text-xs px-2 py-0.5 rounded-full border border-mansagold/30">
                    {biz.category}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-white mb-1 truncate">{biz.name}</h3>
                  <p className="text-white/40 text-xs mb-3 truncate">{biz.address}, {biz.city}</p>

                  <div className="flex gap-2">
                    <Button
                      asChild
                      size="sm"
                      className="flex-1 bg-black border border-mansagold/30 text-mansagold hover:bg-mansagold/10 rounded-lg text-xs"
                    >
                      <a href={UBER_DEEPLINK(biz.lat, biz.lng, biz.name)} target="_blank" rel="noopener noreferrer">
                        Uber <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      className="flex-1 bg-black border border-white/10 text-white/60 hover:bg-white/10 rounded-lg text-xs"
                    >
                      <a href={LYFT_DEEPLINK(biz.lat, biz.lng)} target="_blank" rel="noopener noreferrer">
                        Lyft <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {featuredDestinations.length === 0 && (
            <div className="text-center py-12 text-white/40">
              <p>No featured businesses with location data available yet.</p>
              <Link to="/directory" className="text-mansagold hover:underline mt-2 inline-block">
                Browse the full directory →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28 border-b border-white/5 bg-gradient-to-b from-transparent via-mansagold/3 to-transparent">
        <div className="container max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-3">
              What People <span className="text-mansagold">Say</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6"
              >
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 text-mansagold fill-mansagold" />
                  ))}
                </div>
                <p className="text-white/70 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-mansagold/20 flex items-center justify-center text-mansagold text-sm font-bold">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-white text-sm font-semibold">{t.name}</div>
                    <div className="text-white/40 text-xs">{t.city}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Section */}
      <section className="py-20 md:py-28 border-b border-white/5">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Shield className="h-12 w-12 text-mansagold mb-4" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Safety is <span className="text-mansagold">Non-Negotiable</span>
              </h2>
              <p className="text-white/60 leading-relaxed mb-6">
                Every Noir driver undergoes a comprehensive background check, vehicle inspection,
                and community verification. We don't cut corners on safety — ever.
              </p>
              <ul className="space-y-3">
                {[
                  'Comprehensive background checks',
                  'Vehicle inspection required',
                  'Real-time ride tracking & sharing',
                  'In-app emergency button',
                  'Community-verified drivers',
                  '24/7 support team'
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-white/70 text-sm">
                    <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <div className="relative">
                <div className="w-64 h-64 bg-mansagold/10 rounded-full flex items-center justify-center border border-mansagold/20">
                  <img src={earthImage} alt="Global Noir Network" className="w-40 h-40 rounded-full drop-shadow-[0_0_30px_rgba(255,193,7,0.3)]" />
                </div>
                <div className="absolute -top-4 -right-4 bg-emerald-500/20 border border-emerald-500/30 rounded-xl px-3 py-1 text-emerald-400 text-xs font-mono">
                  Live Tracking
                </div>
                <div className="absolute -bottom-4 -left-4 bg-mansagold/20 border border-mansagold/30 rounded-xl px-3 py-1 text-mansagold text-xs font-mono">
                  Verified Drivers
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Driver Signup */}
      <section id="drivers" className="py-20 md:py-28 border-b border-white/5 bg-gradient-to-b from-transparent via-mansagold/3 to-transparent">
        <div className="container max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <Award className="h-12 w-12 text-mansagold mx-auto mb-4" />
            <h2 className="text-3xl md:text-5xl font-bold mb-3">
              Drive with <span className="text-mansagold">Noir</span>
            </h2>
            <p className="text-white/60 max-w-lg mx-auto">
              Keep 80% of every fare. No gimmicks. Flexible hours. Premium experience.
              Join the driver network that respects your hustle.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4 mb-10">
            {[
              { icon: DollarSign, title: '80% Take-Home', desc: 'Industry-leading driver pay' },
              { icon: Clock, title: 'Flexible Schedule', desc: 'Drive when you want' },
              { icon: Users, title: 'Community Network', desc: 'Connected to 1325.AI ecosystem' },
            ].map((perk, i) => (
              <motion.div
                key={perk.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-xl p-4 text-center"
              >
                <perk.icon className="h-8 w-8 text-mansagold mx-auto mb-2" />
                <h4 className="font-bold text-white text-sm">{perk.title}</h4>
                <p className="text-white/40 text-xs mt-1">{perk.desc}</p>
              </motion.div>
            ))}
          </div>

          {driverSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-8 text-center"
            >
              <CheckCircle className="h-12 w-12 text-emerald-400 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-white mb-2">Application Received!</h3>
              <p className="text-white/60 text-sm">
                We're onboarding drivers in waves. You'll hear from us soon. In the meantime,
                <Link to="/directory" className="text-mansagold hover:underline ml-1">explore the directory</Link>.
              </p>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onSubmit={handleDriverSubmit}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8"
            >
              <h3 className="text-lg font-bold text-mansagold mb-5 flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Driver Application
              </h3>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <Input
                  placeholder="Full name"
                  value={driverForm.name}
                  onChange={(e) => setDriverForm({ ...driverForm, name: e.target.value })}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl h-11"
                  required
                />
                <Input
                  type="email"
                  placeholder="Email address"
                  value={driverForm.email}
                  onChange={(e) => setDriverForm({ ...driverForm, email: e.target.value })}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl h-11"
                  required
                />
                <Input
                  type="tel"
                  placeholder="Phone number"
                  value={driverForm.phone}
                  onChange={(e) => setDriverForm({ ...driverForm, phone: e.target.value })}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl h-11"
                  required
                />
                <Input
                  placeholder="City"
                  value={driverForm.city}
                  onChange={(e) => setDriverForm({ ...driverForm, city: e.target.value })}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl h-11"
                  required
                />
              </div>
              <Input
                placeholder="Vehicle (Year, Make, Model)"
                value={driverForm.vehicle}
                onChange={(e) => setDriverForm({ ...driverForm, vehicle: e.target.value })}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl h-11 mb-4"
                required
              />
              <Button
                type="submit"
                className="w-full bg-mansagold hover:bg-amber-500 text-black font-bold rounded-xl h-12 text-lg group"
              >
                Apply to Drive
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <p className="text-white/30 text-xs text-center mt-3">
                Requirements: Valid license, insurance, vehicle 2015+, background check consent.
              </p>
            </motion.form>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28 border-b border-white/5">
        <div className="container max-w-3xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-center mb-12"
          >
            <span className="text-mansagold">FAQ</span>
          </motion.h2>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white/5 border border-white/10 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
                >
                  <span className="font-semibold text-white text-sm pr-4">{faq.q}</span>
                  {openFaq === i ? (
                    <ChevronUp className="h-4 w-4 text-mansagold flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-white/40 flex-shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="px-4 pb-4"
                  >
                    <p className="text-white/60 text-sm leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-28">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Car className="h-14 w-14 text-mansagold mx-auto mb-4" />
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Ready to ride <span className="text-mansagold">different</span>?
            </h2>
            <p className="text-white/50 max-w-lg mx-auto mb-8">
              Join the movement. Lower fares for riders. Higher pay for drivers.
              All powered by the 1325.AI economic ecosystem.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-mansagold hover:bg-amber-500 text-black font-bold rounded-xl text-lg px-10 group"
              >
                <a href="#destinations">
                  Request a Ride
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-mansagold/30 text-mansagold hover:bg-mansagold/10 rounded-xl text-lg px-10"
              >
                <a href="#drivers">
                  Become a Driver
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default NoirLandingPage;
