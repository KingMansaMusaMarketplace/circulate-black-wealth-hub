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
      <div className="w-full max-w-4xl mx-auto animate-fade-in">
        <Card className="border-border/40 shadow-xl">
          <CardHeader className="text-center space-y-2 pb-6">
            <CardTitle className="text-2xl font-bold">Create Your Account</CardTitle>
            <CardDescription>Complete your registration to get started</CardDescription>
          </CardHeader>
          <CardContent>
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
            
            <div className="mt-6 text-center">
              <Button variant="outline" onClick={() => setSelectedTab(null)}>
                ← Back to Options
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[108rem] mx-auto space-y-8 animate-fade-in">
      <div className="grid gap-8 md:grid-cols-2">
        <Card 
          className="relative cursor-pointer transition-all duration-500 hover:shadow-2xl group hover:-translate-y-2 border-2 hover:border-mansablue/60 p-12"
          onClick={() => setSelectedTab('customer')}
        >
          <div className="text-center space-y-9">
            <div className="w-36 h-36 rounded-3xl bg-gradient-primary text-white flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 transition-transform duration-300">
              <Users className="h-18 w-18" />
            </div>
            <div>
              <h3 className="text-4xl font-bold mb-4 group-hover:text-mansablue transition-colors">I'm a Customer</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Support Black-owned businesses, earn rewards, and discover amazing local spots
              </p>
            </div>
            <div className="pt-6">
              <div className="inline-flex items-center gap-2 text-base font-semibold text-mansablue">
                Get Started
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </div>
        </Card>

        <Card 
          className="relative cursor-pointer transition-all duration-500 hover:shadow-2xl group hover:-translate-y-2 border-2 hover:border-mansablue/60 p-12"
          onClick={() => setSelectedTab('business')}
        >
          <div className="text-center space-y-9">
            <div className="w-36 h-36 rounded-3xl bg-gradient-primary text-white flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 transition-transform duration-300">
              <Building className="h-18 w-18" />
            </div>
            <div>
              <h3 className="text-4xl font-bold mb-4 group-hover:text-mansablue transition-colors">I'm a Business</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                List your business, connect with customers, and grow your community presence
              </p>
            </div>
            <div className="pt-6">
              <div className="inline-flex items-center gap-2 text-base font-semibold text-mansablue">
                Get Started
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedSignupForm;
