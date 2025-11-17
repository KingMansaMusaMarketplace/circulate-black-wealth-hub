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
      <div className="w-full max-w-2xl mx-auto animate-scale-in">
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
