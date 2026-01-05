import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Award, Building2, Users, Sparkles, ArrowRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useFoundingMembers, FounderCard, FoundingSponsorCard } from '@/components/founders-wall';

const FoundersWallPage = () => {
  const { members, sponsors, loading, spotsRemaining } = useFoundingMembers();

  return (
    <>
      <Helmet>
        <title>Founder's Wall - First 100 Black-Owned Businesses</title>
        <meta
          name="description"
          content="Celebrating our founding members - the first 100 Black-owned businesses to join the Mansa Musa Marketplace community. Join the movement!"
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-mansablue-dark via-mansablue to-mansablue-dark relative overflow-hidden">
        {/* Premium ambient background */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-mansagold/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        {/* Hero Section */}
        <section className="relative py-20 md:py-28 overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mansagold/10 border border-mansagold/30 mb-6">
                  <Award className="w-4 h-4 text-mansagold" />
                  <span className="text-sm font-semibold text-mansagold tracking-wide uppercase">
                    Founding Members
                  </span>
                </div>
              </motion.div>

              <motion.h1 
                className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <span className="text-white">The </span>
                <span className="text-gradient-gold">Founder's Wall</span>
              </motion.h1>

              <motion.p 
                className="text-xl text-blue-100/90 mb-8 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Celebrating the first 100 Black-owned businesses who believed in our mission from day one. These pioneers are building generational wealth together.
              </motion.p>

              {/* Spots remaining counter */}
              {spotsRemaining > 0 && (
                <motion.div
                  className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-red-500/20 via-red-500/30 to-red-500/20 border border-red-500/30 mb-8"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Clock className="w-5 h-5 text-red-400 animate-pulse" />
                  <span className="text-white font-bold">
                    Only <span className="text-red-400">{spotsRemaining}</span> founding spots remaining!
                  </span>
                </motion.div>
              )}

              {spotsRemaining > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Link to="/register-business">
                    <Button 
                      size="lg"
                      className="bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 hover:from-amber-500 hover:via-yellow-500 hover:to-orange-500 text-slate-900 font-bold px-8 py-6 rounded-xl shadow-lg shadow-mansagold/25"
                    >
                      Claim Your Founding Spot
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                </motion.div>
              )}
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="container mx-auto px-4 mb-16">
          <motion.div 
            className="flex flex-wrap justify-center gap-8 md:gap-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-mansagold font-playfair mb-1">
                {members.length}
              </div>
              <div className="text-blue-200/70 text-sm font-medium uppercase tracking-wider">
                Founding Businesses
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white font-playfair mb-1">
                {sponsors.length}
              </div>
              <div className="text-blue-200/70 text-sm font-medium uppercase tracking-wider">
                Founding Sponsors
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-emerald-400 font-playfair mb-1">
                {100 - spotsRemaining}%
              </div>
              <div className="text-blue-200/70 text-sm font-medium uppercase tracking-wider">
                Wall Complete
              </div>
            </div>
          </motion.div>
        </section>

        {/* Founding Sponsors Section */}
        {sponsors.length > 0 && (
          <section className="container mx-auto px-4 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <h2 className="text-2xl md:text-3xl font-bold font-playfair text-white mb-2">
                Founding <span className="text-gradient-gold">Sponsors</span>
              </h2>
              <p className="text-blue-200/70">
                Corporate partners who believed in our mission from the start
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {sponsors.map((sponsor, index) => (
                <FoundingSponsorCard key={sponsor.company_name} sponsor={sponsor} index={index} />
              ))}
            </div>
          </section>
        )}

        {/* Founders Grid */}
        <section className="container mx-auto px-4 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl md:text-3xl font-bold font-playfair text-white mb-2">
              First <span className="text-gradient-gold">100</span> Businesses
            </h2>
            <p className="text-blue-200/70">
              The pioneers building Black wealth together
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="bg-white/5 rounded-2xl h-40 animate-pulse" />
              ))}
            </div>
          ) : members.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {members.map((member, index) => (
                <FounderCard key={member.id} member={member} index={index} />
              ))}
              
              {/* Empty spots */}
              {spotsRemaining > 0 && [...Array(Math.min(spotsRemaining, 6))].map((_, i) => (
                <motion.div
                  key={`empty-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.05 }}
                  className="relative"
                >
                  <Link to="/register-business">
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border-2 border-dashed border-white/20 hover:border-mansagold/50 transition-all duration-300 hover:scale-[1.02] h-full min-h-[160px] flex flex-col items-center justify-center text-center group">
                      <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-3 group-hover:bg-mansagold/20 transition-colors">
                        <span className="text-2xl font-bold text-white/50 group-hover:text-mansagold transition-colors">
                          ?
                        </span>
                      </div>
                      <p className="text-white/50 text-xs font-medium group-hover:text-white transition-colors">
                        Your Business Here
                      </p>
                      <p className="text-mansagold text-xs font-semibold mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        Claim Spot #{members.length + i + 1}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Building2 className="w-16 h-16 text-blue-200/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Be the First!</h3>
              <p className="text-blue-200/70 mb-6">No founding members yet. Claim the #1 spot!</p>
              <Link to="/register-business">
                <Button className="bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 text-slate-900 font-bold">
                  Register Your Business
                </Button>
              </Link>
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default FoundersWallPage;
