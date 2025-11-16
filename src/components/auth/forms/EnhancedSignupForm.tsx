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
        <Card className="border-border/40 shadow-xl backdrop-blur-sm bg-card/95">
          <CardHeader className="text-center space-y-3 pb-8">
            <CardTitle className="text-3xl font-bold">Create Your Account</CardTitle>
            <CardDescription className="text-base">Complete your registration to get started</CardDescription>
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
              <Button variant="outline" size="lg" onClick={() => setSelectedTab(null)} className="gap-2">
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
          className="relative cursor-pointer transition-all duration-500 hover:shadow-2xl group hover:-translate-y-2 border-2 border-mansablue/30 hover:border-mansablue backdrop-blur-sm bg-gradient-to-br from-card via-card to-mansablue/5 overflow-hidden"
          onClick={() => setSelectedTab('customer')}
        >
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-mansablue/20 via-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-mansablue/10 rounded-full blur-3xl group-hover:bg-mansablue/20 transition-colors duration-500" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-colors duration-500" />
          
          <div className="relative text-center p-10 space-y-6">
            <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-mansablue to-purple-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-mansablue/50 group-hover:shadow-2xl group-hover:shadow-mansablue/60 group-hover:scale-110 transition-all duration-300">
              <Users className="h-14 w-14" />
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-foreground to-mansablue bg-clip-text text-transparent group-hover:from-mansablue group-hover:to-purple-600 transition-all duration-300">I'm a Customer</h3>
              <p className="text-muted-foreground text-base leading-relaxed px-2">
                Support Black-owned businesses, earn rewards, and discover amazing local spots
              </p>
            </div>
            <div className="pt-4">
              <div className="inline-flex items-center gap-2 text-base font-semibold text-mansablue group-hover:text-purple-600 group-hover:gap-3 transition-all">
                Get Started
                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
              </div>
            </div>
          </div>
        </Card>

        <Card 
          className="relative cursor-pointer transition-all duration-500 hover:shadow-2xl group hover:-translate-y-2 border-2 border-mansagold/30 hover:border-mansagold backdrop-blur-sm bg-gradient-to-br from-card via-card to-mansagold/5 overflow-hidden"
          onClick={() => setSelectedTab('business')}
        >
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-mansagold/20 via-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-mansagold/10 rounded-full blur-3xl group-hover:bg-mansagold/20 transition-colors duration-500" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-colors duration-500" />
          
          <div className="relative text-center p-10 space-y-6">
            <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-mansagold to-amber-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-mansagold/50 group-hover:shadow-2xl group-hover:shadow-mansagold/60 group-hover:scale-110 transition-all duration-300">
              <Building className="h-14 w-14" />
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-foreground to-mansagold bg-clip-text text-transparent group-hover:from-mansagold group-hover:to-amber-500 transition-all duration-300">I'm a Business</h3>
              <p className="text-muted-foreground text-base leading-relaxed px-2">
                List your business, connect with customers, and grow your community presence
              </p>
            </div>
            <div className="pt-4">
              <div className="inline-flex items-center gap-2 text-base font-semibold text-mansagold group-hover:text-amber-500 group-hover:gap-3 transition-all">
                Get Started
                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedSignupForm;
