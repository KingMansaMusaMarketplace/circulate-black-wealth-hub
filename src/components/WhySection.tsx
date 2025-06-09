
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, Heart, DollarSign, ArrowRight } from 'lucide-react';

const WhySection = () => {
  const benefits = [
    {
      icon: TrendingUp,
      title: "Economic Impact",
      description: "Every dollar spent circulates 6-9 times within the Black community, creating lasting wealth.",
      stat: "$1.2M+ Circulated"
    },
    {
      icon: Users,
      title: "Community Building",
      description: "Connect with local entrepreneurs and build stronger community relationships.",
      stat: "500+ Businesses"
    },
    {
      icon: Heart,
      title: "Cultural Preservation",
      description: "Support businesses that celebrate and preserve Black culture and heritage.",
      stat: "10K+ Members"
    },
    {
      icon: DollarSign,
      title: "Loyalty Rewards",
      description: "Earn points and rewards while supporting businesses that matter to you.",
      stat: "50K+ Points Earned"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Why Choose Mansa Musa Marketplace?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join a movement that's creating real economic change in the Black community through conscious spending and business support.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-mansablue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-6 w-6 text-mansablue" />
                  </div>
                  <CardTitle className="text-lg">{benefit.title}</CardTitle>
                  <div className="text-2xl font-bold text-mansagold">{benefit.stat}</div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {benefit.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Link to="/how-it-works">
            <Button size="lg" className="mr-4">
              Learn How It Works
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link to="/signup">
            <Button size="lg" variant="outline">
              Join the Movement
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WhySection;
