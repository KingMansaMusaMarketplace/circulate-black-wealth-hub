
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
      <Card className="bg-gradient-to-br from-mansablue via-mansablue to-mansablue-dark text-white shadow-2xl border-0 overflow-hidden relative">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-gradient-to-r from-mansablue/30 to-transparent"></div>
        <div className="absolute top-0 right-0 w-40 h-40 bg-mansagold/10 rounded-full -translate-y-20 translate-x-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-mansagold/10 rounded-full translate-y-16 -translate-x-16"></div>
        
        <CardContent className="p-8 md:p-12 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              {user ? 'Ready to Increase Your Impact?' : 'Ready to Make an Impact?'}
            </h3>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed max-w-2xl mx-auto">
              {user 
                ? 'Discover more Black-owned businesses in your area and continue building community wealth through every purchase you make.'
                : 'Join our community and start supporting Black-owned businesses to build wealth together and create lasting economic change.'
              }
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
              {user ? (
                <>
                  <Link to="/directory">
                    <Button size="lg" className="bg-mansagold hover:bg-mansagold-dark text-mansablue font-semibold px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-200 text-lg">
                      <Search className="mr-2 h-5 w-5" />
                      Find Businesses
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to="/scanner">
                    <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white/10 font-semibold px-8 py-4 text-lg backdrop-blur-sm">
                      <Scan className="mr-2 h-5 w-5" />
                      Scan QR Code
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/signup">
                    <Button size="lg" className="bg-mansagold hover:bg-mansagold-dark text-mansablue font-semibold px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-200 text-lg">
                      <Users className="mr-2 h-5 w-5" />
                      Join the Movement
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to="/directory">
                    <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white/10 font-semibold px-8 py-4 text-lg backdrop-blur-sm">
                      <Building2 className="mr-2 h-5 w-5" />
                      Browse Businesses
                    </Button>
                  </Link>
                </>
              )}
            </div>
            
            {/* Additional stats or info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-white/20">
              <div className="text-center">
                <div className="text-2xl font-bold text-mansagold mb-1">2,450+</div>
                <div className="text-sm text-blue-100">Community Members</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-mansagold mb-1">187+</div>
                <div className="text-sm text-blue-100">Black-Owned Businesses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-mansagold mb-1">$485K+</div>
                <div className="text-sm text-blue-100">Wealth Circulated</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CallToActionSection;
