
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Users, Scan, Search } from 'lucide-react';
import { motion } from 'framer-motion';

interface CallToActionSectionProps {
  user: any;
}

const CallToActionSection: React.FC<CallToActionSectionProps> = ({ user }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
    >
      <Card className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white shadow-2xl border-white/10 overflow-hidden relative">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-transparent"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-400/10 rounded-full translate-y-12 -translate-x-12"></div>
        
        <CardContent className="p-6 md:p-8 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold mb-3 text-white">
              {user ? 'Ready to Increase Your Impact?' : 'Ready to Make an Impact?'}
            </h3>
            <p className="text-lg text-blue-200 mb-6 leading-relaxed max-w-xl mx-auto">
              {user 
                ? 'Discover more Black-owned businesses in your area and continue building community wealth through every purchase you make.'
                : 'Join our community and start supporting Black-owned businesses to build wealth together and create lasting economic change.'
              }
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-4">
              {user ? (
                <>
                  <Link to="/directory">
                    <Button size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-200">
                      <Search className="mr-2 h-4 w-4" />
                      Find Businesses
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/scanner">
                    <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white/10 font-semibold px-6 py-3 backdrop-blur-sm">
                      <Scan className="mr-2 h-4 w-4" />
                      Scan QR Code
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/signup">
                    <Button size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-200">
                      <Users className="mr-2 h-4 w-4" />
                      Join the Movement
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/directory">
                    <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white/10 font-semibold px-6 py-3 backdrop-blur-sm">
                      <Building2 className="mr-2 h-4 w-4" />
                      Browse Businesses
                    </Button>
                  </Link>
                </>
              )}
            </div>
            
            {/* Additional stats or info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/20">
              <div className="text-center">
                <div className="text-xl font-bold text-yellow-400 mb-1">2,450+</div>
                <div className="text-sm text-blue-200">Community Members</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-yellow-400 mb-1">187+</div>
                <div className="text-sm text-blue-200">Black-Owned Businesses</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-yellow-400 mb-1">$485K+</div>
                <div className="text-sm text-blue-200">Wealth Circulated</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CallToActionSection;
