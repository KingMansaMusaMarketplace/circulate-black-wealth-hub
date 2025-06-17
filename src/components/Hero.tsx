
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, PlayCircle, Users, TrendingUp, Heart } from 'lucide-react';

const Hero: React.FC = () => {
  const [currentFeature, setCurrentFeature] = useState(0);
  
  const features = [
    {
      icon: <Users className="h-6 w-6" />,
      text: "12,000+ Community Members"
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      text: "$2.8M+ Money Circulated"
    },
    {
      icon: <Heart className="h-6 w-6" />,
      text: "3,200+ Black-Owned Businesses"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-mansablue to-mansablue-dark overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-mansagold blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-white blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-mansagold blur-2xl"></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <motion.div 
            className="text-white space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="space-y-4">
              <motion.div 
                className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentFeature}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center gap-2"
                  >
                    {features[currentFeature].icon}
                    <span>{features[currentFeature].text}</span>
                  </motion.div>
                </AnimatePresence>
              </motion.div>

              <motion.h1 
                className="text-4xl md:text-6xl font-bold leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                Save Money &{' '}
                <span className="text-mansagold">Support</span>{' '}
                Black-Owned Businesses
              </motion.h1>

              <motion.p 
                className="text-xl text-white/90 max-w-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                Join thousands of community members discovering amazing Black-owned businesses 
                while earning rewards and building community wealth. Start FREE today!
              </motion.p>
            </div>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Link to="/signup">
                <Button 
                  size="lg" 
                  className="bg-mansagold hover:bg-mansagold-dark text-black font-semibold group w-full sm:w-auto"
                >
                  Start Free Today
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <Button 
                variant="outline" 
                size="lg" 
                className="border-white/30 text-white hover:bg-white hover:text-mansablue w-full sm:w-auto"
              >
                <PlayCircle className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </motion.div>

            <motion.div 
              className="flex items-center gap-6 text-sm text-white/80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <span>100% Free to Join</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-mansagold"></div>
                <span>Instant Rewards</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Visual */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative z-10">
              <div className="bg-white rounded-3xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-12 h-12 bg-mansablue rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Soul Food Kitchen</div>
                      <div className="text-sm text-gray-600">15% off • 4.8 ⭐</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-12 h-12 bg-mansagold rounded-full flex items-center justify-center">
                      <Heart className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Natural Hair Studio</div>
                      <div className="text-sm text-gray-600">20% off • 4.9 ⭐</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">+150 Points Earned</div>
                      <div className="text-sm text-gray-600">This month</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <motion.div
              className="absolute -top-6 -right-6 bg-mansagold text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Join 12,000+ Users!
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg
          className="relative block w-full h-auto"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
            className="fill-white"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
