
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { StarIcon, Users, BadgeDollarSign, MapPin } from 'lucide-react';

import AuthLayout from '@/components/auth/AuthLayout';
import LoginContainer from '@/components/auth/LoginContainer';
import LoginForm from '@/components/auth/LoginForm';
import { Badge } from '@/components/ui/badge';

const LoginPage = () => {
  const { signIn } = useAuth();

  return (
    <AuthLayout>
      <div className="w-full flex flex-col md:flex-row md:items-stretch gap-8 max-w-6xl px-4">
        {/* Left side - Login form */}
        <div className="w-full md:w-1/2">
          <LoginContainer 
            header={
              <>
                <motion.div 
                  className="w-16 h-16 rounded-full bg-mansablue flex items-center justify-center mx-auto mb-4"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="text-white font-spartan font-bold text-xl">M</span>
                </motion.div>
                <h1 className="text-3xl font-bold text-mansablue">Welcome Back</h1>
                <p className="text-gray-600 mt-2">
                  Sign in to continue building Black economic power
                </p>
              </>
            }
          >
            <LoginForm onSubmit={signIn} />
          </LoginContainer>
        </div>
        
        {/* Right side - Community engagement showcase */}
        <motion.div 
          className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-md border border-gray-100 self-start"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="space-y-6">
            <div>
              <Badge className="bg-mansagold text-white mb-3">Community Impact</Badge>
              <h2 className="text-2xl font-bold text-mansablue mb-3">Join Our Growing Movement</h2>
              <p className="text-gray-600">
                Mansa Musa Marketplace is dedicated to growing Black economic power through intentional 
                spending, community support, and wealth circulation.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="bg-mansablue/5 p-4 rounded-lg border border-mansablue/20">
                <div className="flex items-center mb-2">
                  <Users className="h-5 w-5 text-mansablue mr-2" />
                  <h3 className="font-semibold text-gray-800">12,500+</h3>
                </div>
                <p className="text-sm text-gray-600">Community members supporting Black businesses</p>
              </div>
              
              <div className="bg-mansablue/5 p-4 rounded-lg border border-mansablue/20">
                <div className="flex items-center mb-2">
                  <MapPin className="h-5 w-5 text-mansablue mr-2" />
                  <h3 className="font-semibold text-gray-800">850+</h3>
                </div>
                <p className="text-sm text-gray-600">Black-owned businesses in our directory</p>
              </div>
              
              <div className="bg-mansablue/5 p-4 rounded-lg border border-mansablue/20">
                <div className="flex items-center mb-2">
                  <BadgeDollarSign className="h-5 w-5 text-mansablue mr-2" />
                  <h3 className="font-semibold text-gray-800">$2.3M+</h3>
                </div>
                <p className="text-sm text-gray-600">Economic impact through our platform</p>
              </div>
              
              <div className="bg-mansablue/5 p-4 rounded-lg border border-mansablue/20">
                <div className="flex items-center mb-2">
                  <StarIcon className="h-5 w-5 text-mansablue mr-2" />
                  <h3 className="font-semibold text-gray-800">45K+</h3>
                </div>
                <p className="text-sm text-gray-600">Loyalty points redeemed by our members</p>
              </div>
            </div>
            
            {/* Testimonial quote */}
            <div className="bg-gradient-to-r from-mansablue to-mansablue-dark p-5 rounded-lg text-white mt-6">
              <p className="italic relative">
                <span className="text-3xl absolute -top-3 -left-2 text-white/30">"</span>
                Mansa Musa Marketplace has transformed how I support my community. I've discovered amazing Black-owned businesses and earned rewards while doing it!
                <span className="text-3xl absolute -bottom-6 -right-2 text-white/30">"</span>
              </p>
              <div className="mt-4 flex items-center">
                <div className="w-8 h-8 rounded-full bg-white/20 mr-3"></div>
                <div>
                  <p className="font-medium">Tasha Williams</p>
                  <p className="text-xs text-white/70">Premium Member since 2023</p>
                </div>
              </div>
            </div>
            
            {/* Mobile app preview */}
            <div className="hidden md:flex justify-center mt-6">
              <div className="relative bg-gray-800 w-48 h-96 rounded-xl p-2 overflow-hidden transform -rotate-6 shadow-xl">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-mansablue/90 to-mansagold/70 opacity-20"></div>
                <div className="bg-white h-full w-full rounded-lg overflow-hidden relative">
                  <div className="h-10 bg-mansablue flex items-center px-3">
                    <div className="w-5 h-5 rounded-full bg-white/80 flex items-center justify-center">
                      <span className="text-mansablue text-xs font-bold">M</span>
                    </div>
                    <span className="text-xs text-white ml-2">Mansa Musa</span>
                  </div>
                  <div className="px-2 py-3">
                    <div className="h-2 bg-gray-200 rounded-full mb-2 w-3/4"></div>
                    <div className="h-2 bg-gray-200 rounded-full mb-4 w-1/2"></div>
                    <div className="h-20 bg-gray-100 rounded-md mb-3 flex items-center justify-center">
                      <MapPin className="text-mansablue/40 h-8 w-8" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-8 bg-gray-100 rounded-md"></div>
                      <div className="h-8 bg-gray-100 rounded-md"></div>
                      <div className="h-8 bg-gray-100 rounded-md"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
