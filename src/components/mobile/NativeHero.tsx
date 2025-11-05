import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Store, Users, Zap, TrendingUp } from 'lucide-react';

const NativeHero = () => {
  return (
    <div className="pt-6 pb-8 px-4 bg-gradient-to-b from-primary/5 to-background">
      {/* Clean, Simple Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-foreground">
          Support Local,{' '}
          <span className="text-primary">Save Money</span>
        </h1>
        <p className="text-lg text-muted-foreground">
          Discover Black-owned businesses and earn rewards
        </p>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Link to="/directory">
          <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer border-2 border-transparent hover:border-primary/20">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Store className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Find Businesses</h3>
                <p className="text-xs text-muted-foreground">Near you</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/qr-scanner">
          <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer border-2 border-transparent hover:border-primary/20">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Zap className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Scan & Earn</h3>
                <p className="text-xs text-muted-foreground">Get rewards</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Impact Metrics - Clean & Simple */}
      <Card className="p-4 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Community Impact</h3>
            <p className="text-xs text-muted-foreground">Building wealth together</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 pt-3 border-t border-border">
          <div className="text-center">
            <div className="text-xl font-bold text-primary">500+</div>
            <div className="text-xs text-muted-foreground">Businesses</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-primary">50K+</div>
            <div className="text-xs text-muted-foreground">Customers</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-primary">$2M+</div>
            <div className="text-xs text-muted-foreground">Circulated</div>
          </div>
        </div>
      </Card>

      {/* Simple CTA */}
      <div className="mt-6">
        <Link to="/signup" className="block">
          <Button 
            size="lg" 
            className="w-full text-base font-semibold h-12"
            style={{ touchAction: 'manipulation' }}
          >
            Get Started Free
          </Button>
        </Link>
        <p className="text-xs text-center text-muted-foreground mt-2">
          No credit card required
        </p>
      </div>
    </div>
  );
};

export default NativeHero;
