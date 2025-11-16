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
          className="relative cursor-pointer transition-all duration-500 hover:shadow-2xl group hover:-translate-y-2 border-2 border-border/40 hover:border-mansablue/60 backdrop-blur-sm bg-card/95 overflow-hidden"
          onClick={() => setSelectedTab('customer')}
        >
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-mansablue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative text-center p-10 space-y-6">
            <div className="w-28 h-28 rounded-3xl bg-gradient-primary text-white flex items-center justify-center mx-auto shadow-[var(--shadow-premium)] group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
              <Users className="h-14 w-14" />
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-bold group-hover:text-mansablue transition-colors duration-300">I'm a Customer</h3>
              <p className="text-muted-foreground text-base leading-relaxed px-2">
                Support Black-owned businesses, earn rewards, and discover amazing local spots
              </p>
            </div>
            <div className="pt-4">
              <div className="inline-flex items-center gap-2 text-base font-semibold text-mansablue group-hover:gap-3 transition-all">
                Get Started
                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
              </div>
            </div>
          </div>
        </Card>

        <Card 
          className="relative cursor-pointer transition-all duration-500 hover:shadow-2xl group hover:-translate-y-2 border-2 border-border/40 hover:border-mansablue/60 backdrop-blur-sm bg-card/95 overflow-hidden"
          onClick={() => setSelectedTab('business')}
        >
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-mansagold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative text-center p-10 space-y-6">
            <div className="w-28 h-28 rounded-3xl bg-gradient-primary text-white flex items-center justify-center mx-auto shadow-[var(--shadow-premium)] group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
              <Building className="h-14 w-14" />
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-bold group-hover:text-mansablue transition-colors duration-300">I'm a Business</h3>
              <p className="text-muted-foreground text-base leading-relaxed px-2">
                List your business, connect with customers, and grow your community presence
              </p>
            </div>
            <div className="pt-4">
              <div className="inline-flex items-center gap-2 text-base font-semibold text-mansablue group-hover:gap-3 transition-all">
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
