import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Car, MapPin, Navigation, Shield, Star, ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/Footer';
import { businesses } from '@/data/businessesData';

const UBER_DEEPLINK = (lat: number, lng: number, name: string) =>
  `https://m.uber.com/ul/?action=setPickup&dropoff[latitude]=${lat}&dropoff[longitude]=${lng}&dropoff[nickname]=${encodeURIComponent(name)}`;

const LYFT_DEEPLINK = (lat: number, lng: number) =>
  `https://lyft.com/ride?destination[latitude]=${lat}&destination[longitude]=${lng}`;

const featuredDestinations = businesses
  .filter(b => b.isFeatured && b.lat && b.lng)
  .slice(0, 6);

const steps = [
  { icon: MapPin, title: 'Enter Your Destination', description: 'Going anywhere? Enter an address or pick a spot from our directory.' },
  { icon: Car, title: 'Get Matched', description: 'We connect you with a nearby Noir driver. No surge pricing games.' },
  { icon: Navigation, title: 'Ride and Save', description: 'Pay less than the big apps. Your driver takes home 80% of the fare.' },
];

const NoirLandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-mansagold/5 via-transparent to-transparent" />
        <div className="absolute top-20 right-10 w-64 h-64 bg-mansagold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-mansagold/3 rounded-full blur-3xl" />

        <div className="container max-w-6xl mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Car className="h-12 w-12 text-mansagold" />
              <h1 className="text-5xl md:text-7xl font-bold">
                <span className="text-mansagold">Noir</span>
                <span className="text-white/50 font-light">.travel</span>
              </h1>
            </div>

            <p className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto mb-4">
              The ride-share that puts people first.
              <br className="hidden md:block" />
              Lower fares. Higher driver pay. Premium experience.
            </p>

            <p className="text-sm font-mono text-mansagold/60 tracking-widest uppercase mb-8">
              Powered by Mansa Musa Marketplace
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-mansagold hover:bg-mansagold-dark text-black font-bold rounded-xl text-lg px-8 group"
              >
                <a href="#destinations">
                  Browse Destinations
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-mansagold/30 text-mansagold hover:bg-mansagold/10 rounded-xl text-lg px-8"
              >
                <Link to="/directory">
                  View Full Directory
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 border-t border-white/5">
        <div className="container max-w-5xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-12"
          >
            How <span className="text-mansagold">Noir</span> Works
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-mansagold/10 border border-mansagold/20 flex items-center justify-center">
                  <step.icon className="h-8 w-8 text-mansagold" />
                </div>
                <div className="text-sm font-mono text-mansagold/50 mb-2">0{i + 1}</div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-white/60 text-sm">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section id="destinations" className="py-16 md:py-24 border-t border-white/5 bg-gradient-to-b from-transparent to-mansagold/3">
        <div className="container max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              <span className="text-mansagold">Popular Destinations</span>
            </h2>
            <p className="text-white/60 max-w-xl mx-auto">
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
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-mansagold/30 transition-colors group"
              >
                <div className="h-32 relative overflow-hidden">
                  <img
                    src={biz.imageUrl || biz.bannerUrl}
                    alt={biz.imageAlt || biz.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-2 left-3 flex items-center gap-1 text-xs text-mansagold">
                    <Star className="h-3 w-3 fill-mansagold" />
                    <span>{biz.averageRating?.toFixed(1) || biz.rating}</span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-white mb-1 truncate">{biz.name}</h3>
                  <p className="text-white/50 text-xs mb-3 truncate">{biz.address}, {biz.city}</p>

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
                      className="flex-1 bg-black border border-white/10 text-white/70 hover:bg-white/10 rounded-lg text-xs"
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

      {/* Driver CTA */}
      <section id="drivers" className="py-16 md:py-24 border-t border-white/5">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Shield className="h-12 w-12 text-mansagold mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Drive with <span className="text-mansagold">Noir</span>
            </h2>
            <p className="text-white/60 max-w-lg mx-auto mb-6">
              Keep 80% of every fare. No gimmicks. Noir drivers earn more because we take less — just 20%. Flexible hours, premium experience.
            </p>
            <Button
              size="lg"
              className="bg-mansagold/20 text-mansagold border border-mansagold/30 hover:bg-mansagold/30 rounded-xl cursor-default"
              disabled
            >
              Driver Signup Coming Soon
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default NoirLandingPage;
