import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { 
  MapPin, ArrowRight, Sparkles, Star, Gift, 
  Building2, QrCode, TrendingUp, PartyPopper
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { businesses } from '@/data/businessData';

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [zipCode, setZipCode] = useState('');
  const [showBusinesses, setShowBusinesses] = useState(false);

  // Get user's name from metadata
  const userName = user?.user_metadata?.full_name?.split(' ')[0] || 'there';

  // Get a few sample businesses to show
  const sampleBusinesses = businesses.slice(0, 4);

  const handleExplore = () => {
    if (zipCode) {
      navigate(`/directory?zip=${zipCode}`);
    } else {
      navigate('/directory');
    }
  };

  const handleSkip = () => {
    navigate('/');
  };

  return (
    <>
      <Helmet>
        <title>Welcome to Mansa Musa! | Find Black-Owned Businesses</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-mansablue-dark via-mansablue to-indigo-900 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-mansagold/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative container mx-auto px-4 py-12 max-w-2xl">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-mansagold to-amber-500 mb-6">
              <PartyPopper className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Welcome, {userName}! 🎉
            </h1>
            <p className="text-xl text-blue-100/80">
              You're now part of the movement to support Black-owned businesses.
            </p>
          </motion.div>

          {/* Bonus Points Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-mansagold/30 to-amber-500/30 border-2 border-mansagold/50 rounded-2xl p-6 mb-8 text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Gift className="w-6 h-6 text-mansagold" />
              <span className="text-2xl font-bold text-white">+50 Bonus Points</span>
            </div>
            <p className="text-blue-100/80">Complete your profile to unlock rewards!</p>
          </motion.div>

          {/* ZIP Code Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-mansagold" />
                  <h2 className="text-lg font-semibold text-white">Find businesses near you</h2>
                </div>
                <div className="flex gap-3">
                  <Input
                    type="text"
                    placeholder="Enter your ZIP code"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
                    maxLength={5}
                  />
                  <Button
                    onClick={handleExplore}
                    className="bg-mansagold hover:bg-mansagold-dark text-mansablue-dark font-semibold px-6"
                  >
                    Explore
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 gap-4 mb-8"
          >
            {[
              { icon: Building2, label: 'Explore Businesses', action: () => navigate('/directory') },
              { icon: QrCode, label: 'Scan QR Code', action: () => navigate('/scanner') },
              { icon: Star, label: 'View Rewards', action: () => navigate('/loyalty') },
              { icon: TrendingUp, label: 'See Your Impact', action: () => navigate('/impact') },
            ].map((item, index) => (
              <Card
                key={item.label}
                className="bg-white/10 backdrop-blur-lg border-white/20 cursor-pointer hover:bg-white/20 transition-colors"
                onClick={item.action}
              >
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <item.icon className="w-8 h-8 text-mansagold mb-2" />
                  <span className="text-sm text-white font-medium">{item.label}</span>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* Sample Businesses Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-mansagold" />
              Featured Black-Owned Businesses
            </h3>
            <div className="space-y-3">
              {sampleBusinesses.map((business) => (
                <Card
                  key={business.id}
                  className="bg-white/10 backdrop-blur-lg border-white/20 cursor-pointer hover:bg-white/20 transition-colors"
                  onClick={() => navigate(`/business/${business.id}`)}
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-mansagold/20 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-mansagold" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white truncate">{business.name}</p>
                      <p className="text-sm text-blue-100/70 truncate">{business.category}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-white/50" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Skip Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-8"
          >
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="text-blue-100/70 hover:text-white hover:bg-white/10"
            >
              Skip for now
            </Button>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default WelcomePage;
