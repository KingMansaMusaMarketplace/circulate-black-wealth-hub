import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coins, Building2, Users, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function CoalitionJoinCTA() {
  const benefits = [
    {
      icon: Coins,
      title: 'Earn Everywhere',
      description: 'Get points at any participating Black-owned business',
    },
    {
      icon: Building2,
      title: 'Redeem Anywhere',
      description: 'Use your points at any coalition business',
    },
    {
      icon: Users,
      title: 'Tier Rewards',
      description: 'Unlock multipliers and exclusive perks as you level up',
    },
    {
      icon: TrendingUp,
      title: 'Community Impact',
      description: 'Keep money circulating in our community longer',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Join the Coalition</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Sign up to start earning and redeeming points across all participating 
          Black-owned businesses in our community.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map((benefit) => (
          <Card key={benefit.title}>
            <CardContent className="pt-6 text-center">
              <div className="inline-flex p-3 rounded-full bg-primary/10 mb-3">
                <benefit.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground">{benefit.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tier Preview */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-4 text-center">Member Tiers</h3>
          <div className="grid gap-3 sm:grid-cols-4">
            <div className="p-4 rounded-lg bg-amber-500/10 text-center">
              <p className="font-bold text-amber-600">Bronze</p>
              <p className="text-2xl font-bold">1x</p>
              <p className="text-xs text-muted-foreground">0 - 999 pts</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-500/10 text-center">
              <p className="font-bold text-slate-600">Silver</p>
              <p className="text-2xl font-bold">1.25x</p>
              <p className="text-xs text-muted-foreground">1,000+ pts</p>
            </div>
            <div className="p-4 rounded-lg bg-yellow-500/10 text-center">
              <p className="font-bold text-yellow-600">Gold</p>
              <p className="text-2xl font-bold">1.5x</p>
              <p className="text-xs text-muted-foreground">5,000+ pts</p>
            </div>
            <div className="p-4 rounded-lg bg-purple-500/10 text-center">
              <p className="font-bold text-purple-600">Platinum</p>
              <p className="text-2xl font-bold">2x</p>
              <p className="text-xs text-muted-foreground">15,000+ pts</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/auth/register">
          <Button size="lg" className="w-full sm:w-auto">
            Sign Up Now
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
        <Link to="/auth/login">
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            Already have an account? Log In
          </Button>
        </Link>
      </div>
    </div>
  );
}
