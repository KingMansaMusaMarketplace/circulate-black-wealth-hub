import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Building, Star, ArrowRight } from 'lucide-react';
import CustomerSignupTab from './CustomerSignupTab';
import BusinessSignupForm from './BusinessSignupForm';

const EnhancedSignupForm: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'customer' | 'business' | null>(null);

  if (selectedTab) {
    return (
      <div className="w-full max-w-2xl mx-auto animate-scale-in">
        {/* Feature Guide Banner for Business */}
        {selectedTab === 'business' && (
          <div className="mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 via-mansagold/30 to-pink-500/30 rounded-2xl blur-xl" />
            <div className="relative border-2 border-mansagold/40 bg-gradient-to-br from-white/95 via-white/90 to-purple-50/80 backdrop-blur-xl rounded-2xl p-5 shadow-xl overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 via-mansagold to-pink-500"></div>
              <div className="flex items-center justify-between flex-wrap gap-4 pt-1">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-purple-500 via-mansagold to-pink-500 p-3 rounded-xl shadow-lg shadow-mansagold/30 animate-pulse">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-lg bg-gradient-to-r from-mansablue via-purple-600 to-mansagold bg-clip-text text-transparent">
                      📖 See All Features in Detail
                    </p>
                    <p className="text-sm text-foreground/70 font-medium">
                      Learn everything your business will get
                    </p>
                  </div>
                </div>
                <Link 
                  to="/feature-guide" 
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 via-mansagold to-pink-500 hover:from-purple-700 hover:via-amber-500 hover:to-pink-600 text-white rounded-xl shadow-lg shadow-mansagold/20 hover:shadow-xl hover:shadow-mansagold/30 transition-all duration-300 font-bold hover:scale-105"
                >
                  View Feature Guide
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

        <Card className="border-0 bg-white/95 backdrop-blur-xl shadow-2xl overflow-hidden ring-1 ring-mansagold/20">
          <div className="h-3 bg-gradient-blue-gold"></div>
          <CardHeader className="text-center space-y-4 pb-8 bg-gradient-to-br from-mansablue/5 to-mansagold/5 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-mansagold/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-mansablue/10 rounded-full blur-2xl"></div>
            <div className="relative">
              <CardTitle className="text-4xl font-bold bg-gradient-to-r from-mansablue via-mansablue-light to-mansagold bg-clip-text text-transparent animate-fade-in">Create Your Account</CardTitle>
              <CardDescription className="text-lg text-foreground/80 font-medium">Complete your registration to get started 🎉</CardDescription>
            </div>
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
                className="gap-2 border-2 border-mansablue/30 text-mansablue hover:bg-gradient-blue-gold hover:text-white hover:border-transparent transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-mansagold/30"
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
      <div className="grid gap-8 md:grid-cols-2">
        <Card 
          className="relative cursor-pointer transition-all duration-500 hover:shadow-2xl group hover:-translate-y-3 border-0 bg-white/95 backdrop-blur-xl overflow-hidden ring-1 ring-mansagold/20 hover:ring-mansagold/40"
          onClick={() => setSelectedTab('customer')}
        >
          {/* Gold top border */}
          <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-mansagold-dark via-mansagold to-mansagold-light animate-shimmer bg-[length:200%_100%]"></div>
          
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-mansagold/10 via-mansablue/10 to-mansagold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-mansagold/20 rounded-full blur-3xl group-hover:bg-mansagold/40 transition-colors duration-500" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-mansablue/20 rounded-full blur-2xl group-hover:bg-mansablue/40 transition-colors duration-500" />
          
          <div className="relative text-center p-10 space-y-6">
            <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-mansablue via-mansablue-light to-mansagold text-text-on-blue flex items-center justify-center mx-auto shadow-xl shadow-mansablue/50 group-hover:shadow-2xl group-hover:shadow-mansagold/60 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
              <Users className="h-16 w-16 drop-shadow-lg" />
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-mansablue via-mansablue-light to-mansagold bg-clip-text text-transparent group-hover:scale-105 transition-all duration-300">I'm a Customer</h3>
              <p className="text-foreground/80 text-base leading-relaxed px-2 font-medium">
                Support Black-owned businesses, earn rewards, and discover amazing local spots 🎁
              </p>
            </div>
          </div>
        </Card>

        <Card 
          className="relative cursor-pointer transition-all duration-500 hover:shadow-2xl group hover:-translate-y-3 border-0 bg-white/95 backdrop-blur-xl overflow-hidden ring-1 ring-mansablue/20 hover:ring-mansablue/40"
          onClick={() => setSelectedTab('business')}
        >
          {/* Navy top border */}
          <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-mansablue-dark via-mansablue to-mansablue-light animate-shimmer bg-[length:200%_100%]"></div>
          
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-mansablue/10 via-mansagold/10 to-mansablue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-mansablue/20 rounded-full blur-3xl group-hover:bg-mansablue/40 transition-colors duration-500" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-mansagold/20 rounded-full blur-2xl group-hover:bg-mansagold/40 transition-colors duration-500" />
          
          <div className="relative text-center p-10 space-y-6">
            <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-mansagold via-mansagold-light to-mansablue text-text-on-gold flex items-center justify-center mx-auto shadow-xl shadow-mansagold/50 group-hover:shadow-2xl group-hover:shadow-mansablue/60 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500">
              <Building className="h-16 w-16 drop-shadow-lg" />
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-mansagold via-mansagold-light to-mansablue bg-clip-text text-transparent group-hover:scale-105 transition-all duration-300">I'm a Business</h3>
              <p className="text-foreground/80 text-base leading-relaxed px-2 font-medium">
                List your business, connect with customers, and grow your community presence 🚀
              </p>
            </div>
            <div className="pt-4">
              <div className="inline-flex items-center gap-2 text-lg font-bold bg-gradient-to-r from-mansagold to-mansablue bg-clip-text text-transparent group-hover:gap-4 transition-all">
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
