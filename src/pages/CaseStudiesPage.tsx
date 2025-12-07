
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, Users, DollarSign, Star, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const caseStudies = [
  {
    id: 1,
    businessName: "Soul Food Kitchen",
    ownerName: "Maria Washington",
    category: "Restaurant",
    location: "Atlanta, GA",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    challenge: "Struggling to attract new customers and compete with chain restaurants",
    solution: "Joined Mansa Musa Marketplace and implemented loyalty program",
    results: {
      revenueIncrease: "150%",
      newCustomers: "300+",
      loyaltyMembers: "200+"
    },
    testimonial: "The Marketplace connected me with customers who truly value supporting Black-owned businesses. My revenue has increased by 150% since joining!",
    timeline: "6 months"
  },
  {
    id: 2,
    businessName: "Elite Barber Shop",
    ownerName: "Marcus Johnson",
    category: "Beauty & Wellness",
    location: "Chicago, IL",
    image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    challenge: "Limited visibility in the community and irregular customer flow",
    solution: "Used QR code system for appointments and customer engagement",
    results: {
      revenueIncrease: "85%",
      newCustomers: "150+",
      loyaltyMembers: "120+"
    },
    testimonial: "The QR code system made booking so much easier for my customers. I've seen consistent growth and built lasting relationships.",
    timeline: "4 months"
  },
  {
    id: 3,
    businessName: "Creative Designs Studio",
    ownerName: "Jasmine Brown",
    category: "Professional Services",
    location: "Houston, TX",
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    challenge: "Difficulty finding clients who appreciated custom design work",
    solution: "Leveraged verification system to showcase credibility and expertise",
    results: {
      revenueIncrease: "200%",
      newCustomers: "75+",
      loyaltyMembers: "50+"
    },
    testimonial: "Being verified on the platform gave my clients confidence in my work. I've landed several high-value projects through the Marketplace.",
    timeline: "8 months"
  }
];

const CaseStudiesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">
      <Helmet>
        <title>Case Studies | Mansa Musa Marketplace</title>
        <meta name="description" content="Real success stories from businesses thriving through intentional economic circulation on Mansa Musa Marketplace." />
      </Helmet>

      {/* Animated gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-40 left-20 w-[400px] h-[400px] bg-mansagold/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Subtle grid overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

      {/* Hero Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-mansagold/20 to-amber-500/20 border border-mansagold/30 mb-6">
              <Sparkles className="h-10 w-10 text-mansagold" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 font-display">
              <span className="text-white">Real </span>
              <span className="bg-gradient-to-r from-mansagold via-amber-400 to-mansagold bg-clip-text text-transparent">Success Stories</span>
            </h1>
            <p className="text-xl text-blue-100/90 mb-8 max-w-2xl mx-auto">
              Discover how businesses are thriving through intentional economic circulation
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 px-6 py-3 rounded-full">
                <span className="font-bold text-mansagold">500+</span>
                <span className="text-white/80 ml-2">Success Stories</span>
              </div>
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 px-6 py-3 rounded-full">
                <span className="font-bold text-mansagold">$2M+</span>
                <span className="text-white/80 ml-2">Revenue Generated</span>
              </div>
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 px-6 py-3 rounded-full">
                <span className="font-bold text-mansagold">95%</span>
                <span className="text-white/80 ml-2">Customer Satisfaction</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="relative z-10 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4 font-display">
                Featured Success Stories
              </h2>
              <p className="text-blue-100/80 max-w-2xl mx-auto">
                These businesses transformed their growth trajectory by joining our community-focused ecosystem
              </p>
            </div>

            <div className="grid gap-8">
              {caseStudies.map((study, index) => (
                <Card 
                  key={study.id} 
                  className="overflow-hidden backdrop-blur-xl bg-slate-800/50 border border-white/10 hover:border-mansagold/30 transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="md:flex">
                    <div className="md:w-1/3 relative">
                      <img 
                        src={study.image} 
                        alt={study.businessName}
                        className="w-full h-64 md:h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-800/50" />
                    </div>
                    <div className="md:w-2/3 p-8">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-2 font-display">
                            {study.businessName}
                          </h3>
                          <p className="text-blue-200/80 mb-2">
                            Owner: <span className="font-medium text-white">{study.ownerName}</span>
                          </p>
                          <div className="flex items-center gap-2 mb-4">
                            <Badge className="bg-mansagold/20 text-mansagold border-mansagold/30">{study.category}</Badge>
                            <span className="text-sm text-blue-200/60">{study.location}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold bg-gradient-to-r from-mansagold to-amber-400 bg-clip-text text-transparent">
                            +{study.results.revenueIncrease}
                          </div>
                          <div className="text-sm text-blue-200/60">Revenue Growth</div>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-semibold text-mansagold mb-2">The Challenge</h4>
                        <p className="text-blue-100/80 mb-4">{study.challenge}</p>
                        
                        <h4 className="font-semibold text-mansagold mb-2">Our Solution</h4>
                        <p className="text-blue-100/80 mb-4">{study.solution}</p>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4 mb-6">
                        <div className="text-center p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                          <TrendingUp className="h-6 w-6 text-green-400 mx-auto mb-2" />
                          <div className="font-bold text-green-400">{study.results.revenueIncrease}</div>
                          <div className="text-sm text-green-300/80">Revenue Increase</div>
                        </div>
                        <div className="text-center p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                          <Users className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                          <div className="font-bold text-blue-400">{study.results.newCustomers}</div>
                          <div className="text-sm text-blue-300/80">New Customers</div>
                        </div>
                        <div className="text-center p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                          <Star className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                          <div className="font-bold text-purple-400">{study.results.loyaltyMembers}</div>
                          <div className="text-sm text-purple-300/80">Loyalty Members</div>
                        </div>
                      </div>

                      <blockquote className="border-l-4 border-mansagold pl-4 py-2 italic text-blue-100/90 mb-4">
                        "{study.testimonial}"
                      </blockquote>

                      <div className="flex justify-between items-center">
                        <div className="text-sm text-blue-200/60">
                          Success achieved in <span className="font-medium text-white">{study.timeline}</span>
                        </div>
                        <Link to="/directory">
                          <Button variant="outline" size="sm" className="border-mansagold/50 text-mansagold hover:bg-mansagold hover:text-slate-900">
                            View Business
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto backdrop-blur-xl bg-slate-800/50 border border-white/10 rounded-3xl p-12">
            <h2 className="text-4xl font-bold text-white mb-4 font-display">
              Ready to Write Your{' '}
              <span className="bg-gradient-to-r from-mansagold via-amber-400 to-mansagold bg-clip-text text-transparent">Success Story</span>?
            </h2>
            <p className="text-xl mb-8 text-blue-100/80 max-w-2xl mx-auto">
              Join hundreds of businesses already growing through intentional economic circulation
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/business-form">
                <Button size="lg" className="bg-gradient-to-r from-mansagold to-amber-500 hover:from-amber-500 hover:to-mansagold text-slate-900 font-bold shadow-lg shadow-mansagold/30">
                  Join as Business
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/directory">
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  Explore Directory
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CaseStudiesPage;
