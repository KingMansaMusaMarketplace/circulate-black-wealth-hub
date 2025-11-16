import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Building } from 'lucide-react';
import CustomerSignupTab from './CustomerSignupTab';
import BusinessSignupForm from './BusinessSignupForm';

const EnhancedSignupForm: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'customer' | 'business' | null>(null);

  if (selectedTab) {
    return (
      <div className="w-full max-w-2xl mx-auto animate-fade-in">
        <Card className="border-0 bg-white/95 backdrop-blur-sm shadow-2xl overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>
          <CardHeader className="text-center space-y-4 pb-8 bg-gradient-to-br from-blue-50/50 to-purple-50/50">
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Create Your Account</CardTitle>
            <CardDescription className="text-lg text-gray-700 font-medium">Complete your registration to get started 🎉</CardDescription>
          </CardHeader>
          <CardContent className="px-8">
            {selectedTab === 'customer' ? (
              <CustomerSignupTab onSuccess={() => {}} />
            ) : (
              <BusinessSignupForm 
                referralCode=""
                referringAgent={null}
                onCheckReferralCode={async () => null}
                onSuccess={() => {}}
              />
            )}
            
            <div className="mt-8 text-center">
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => setSelectedTab(null)} 
                className="gap-2 border-2 border-purple-300 text-purple-600 hover:bg-gradient-to-r hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 hover:text-white hover:border-transparent transition-all duration-300"
              >
                ← Back to Options
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="grid gap-6 md:grid-cols-2">
        <Card 
          className="relative cursor-pointer transition-all duration-500 hover:shadow-2xl group hover:-translate-y-3 border-0 bg-white/95 backdrop-blur-sm overflow-hidden"
          onClick={() => setSelectedTab('customer')}
        >
          {/* Colorful top border */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500"></div>
          
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl group-hover:bg-blue-400/40 transition-colors duration-500" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl group-hover:bg-purple-400/40 transition-colors duration-500" />
          
          <div className="relative text-center p-10 space-y-6">
            <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-blue-500/50 group-hover:shadow-2xl group-hover:shadow-purple-500/60 group-hover:scale-110 transition-all duration-300">
              <Users className="h-16 w-16" />
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent group-hover:scale-105 transition-all duration-300">I'm a Customer</h3>
              <p className="text-gray-700 text-base leading-relaxed px-2 font-medium">
                Support Black-owned businesses, earn rewards, and discover amazing local spots 🎁
              </p>
            </div>
            <div className="pt-4">
              <div className="inline-flex items-center gap-2 text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:gap-4 transition-all">
                Get Started
                <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
              </div>
            </div>
          </div>
        </Card>

        <Card 
          className="relative cursor-pointer transition-all duration-500 hover:shadow-2xl group hover:-translate-y-3 border-0 bg-white/95 backdrop-blur-sm overflow-hidden"
          onClick={() => setSelectedTab('business')}
        >
          {/* Colorful top border */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500"></div>
          
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 via-orange-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-400/20 rounded-full blur-3xl group-hover:bg-yellow-400/40 transition-colors duration-500" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-400/20 rounded-full blur-2xl group-hover:bg-orange-400/40 transition-colors duration-500" />
          
          <div className="relative text-center p-10 space-y-6">
            <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-yellow-500 via-orange-500 to-pink-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-yellow-500/50 group-hover:shadow-2xl group-hover:shadow-orange-500/60 group-hover:scale-110 transition-all duration-300">
              <Building className="h-16 w-16" />
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 via-orange-600 to-pink-600 bg-clip-text text-transparent group-hover:scale-105 transition-all duration-300">I'm a Business</h3>
              <p className="text-gray-700 text-base leading-relaxed px-2 font-medium">
                List your business, connect with customers, and grow your community presence 🚀
              </p>
            </div>
            <div className="pt-4">
              <div className="inline-flex items-center gap-2 text-lg font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent group-hover:gap-4 transition-all">
                Get Started
                <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedSignupForm;
