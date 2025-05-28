
import React from 'react';
import { Helmet } from 'react-helmet';
import { Building2, Star, Users, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SponsorshipForm from '@/components/sponsorship/SponsorshipForm';
import { toast } from 'sonner';

const CorporateSponsorshipPage = () => {
  const sponsorshipTiers = [
    {
      name: 'Silver Sponsor',
      price: '$2,000/month',
      originalPrice: '$2,400',
      features: [
        'Logo placement on website',
        'Mention in monthly newsletter',
        'Social media shout-outs',
        'Basic analytics dashboard',
        '5 premium business listings'
      ],
      color: 'border-gray-200',
      headerColor: 'bg-gray-50'
    },
    {
      name: 'Gold Sponsor',
      price: '$5,000/month',
      originalPrice: '$6,000',
      features: [
        'All Silver benefits',
        'Dedicated account manager',
        'Quarterly spotlight in newsletter',
        'Co-branded marketing materials',
        '10 premium business listings',
        'Priority customer support',
        'Access to community economic data'
      ],
      color: 'border-mansagold',
      headerColor: 'bg-mansagold/10',
      popular: true
    },
    {
      name: 'Platinum Sponsor',
      price: '$10,000/month',
      originalPrice: '$12,000',
      features: [
        'All Gold benefits',
        'Executive advisory board seat',
        'Featured speaker opportunity',
        'Custom integration options',
        '100 premium business listings',
        'Direct access to leadership team',
        'Custom impact reporting',
        'First access to new features'
      ],
      color: 'border-purple-200',
      headerColor: 'bg-purple-50'
    }
  ];

  const impactStats = [
    {
      icon: <Users className="h-8 w-8 text-mansablue" />,
      value: "10,000+",
      label: "Active Users",
      description: "Engaged community members"
    },
    {
      icon: <Building2 className="h-8 w-8 text-mansablue" />,
      value: "500+",
      label: "Partner Businesses",
      description: "Black-owned businesses supported"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-mansablue" />,
      value: "$2M+",
      label: "Economic Impact",
      description: "Circulated in Black communities"
    }
  ];

  const handleScrollToSection = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTierSelection = (tierName: string) => {
    handleScrollToSection('sponsorship-form');
    toast.success(`${tierName} tier selected. Please fill out the form below.`);
  };

  const handleContactTeam = () => {
    window.location.href = 'mailto:partnerships@mansamusamarketplace.com?subject=Corporate Sponsorship Inquiry';
  };

  const handleDownloadPackage = () => {
    toast.info('Sponsorship package download would be available here. Contact our team for detailed materials.');
  };

  const handleScheduleCall = () => {
    window.open('https://calendly.com/mansamusa-partnerships', '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Corporate Sponsorship | Mansa Musa Marketplace</title>
        <meta name="description" content="Partner with Mansa Musa Marketplace to support Black-owned businesses and reach engaged customers." />
      </Helmet>

      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-mansablue via-mansablue-dark to-mansablue">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Corporate <span className="text-mansagold">Sponsorship</span> Program
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
              Partner with us to create meaningful economic impact while gaining valuable visibility for your brand in the Black business community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-mansagold hover:bg-mansagold-dark text-mansablue font-semibold px-8 py-6 text-lg"
                onClick={() => handleScrollToSection('sponsorship-tiers')}
              >
                View Sponsorship Tiers
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg"
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-mansablue px-8 py-6 text-lg"
                onClick={() => handleScrollToSection('impact-stats')}
              >
                See Our Impact
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Impact Stats Section */}
      <div className="py-16 bg-white" id="impact-stats">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Impact By The Numbers
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See how our corporate partners help create meaningful change in Black communities
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {impactStats.map((stat, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="mx-auto mb-4 bg-mansablue/10 p-4 rounded-full w-16 h-16 flex items-center justify-center">
                      {stat.icon}
                    </div>
                    <div className="text-3xl font-bold text-mansablue mb-2">{stat.value}</div>
                    <div className="text-lg font-semibold text-gray-900 mb-1">{stat.label}</div>
                    <div className="text-gray-600 text-sm">{stat.description}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Why Partner Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Why Partner With Us?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Your sponsorship creates measurable impact while providing valuable benefits for your organization
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: "Economic Impact",
                description: "Direct contribution to Black business circulation with measurable community economic impact metrics",
                icon: "💰"
              },
              {
                title: "Brand Visibility",
                description: "Showcase your brand to thousands of conscious consumers committed to economic justice",
                icon: "👥"
              },
              {
                title: "Data & Insights",
                description: "Access detailed analytics and reports on community engagement and sponsorship impact",
                icon: "📊"
              },
              {
                title: "Community Leadership",
                description: "Position your organization as a leader in corporate social responsibility",
                icon: "🏆"
              },
              {
                title: "Authentic Engagement",
                description: "Connect with a highly engaged community that values authentic partnerships",
                icon: "🤝"
              },
              {
                title: "Measurable Results",
                description: "Track ROI through comprehensive reporting and community feedback metrics",
                icon: "📈"
              }
            ].map((benefit, index) => (
              <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-4xl mb-4">{benefit.icon}</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Sponsorship Tiers */}
      <div className="py-16 bg-white" id="sponsorship-tiers">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Sponsorship Tiers
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the sponsorship level that aligns with your organization's goals and budget
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {sponsorshipTiers.map((tier, index) => (
              <Card key={index} className={`relative ${tier.color} ${tier.popular ? 'ring-2 ring-mansagold shadow-xl scale-105' : 'shadow-lg'} transition-all duration-300 hover:shadow-xl`}>
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-mansagold text-mansablue font-semibold px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className={`${tier.headerColor} rounded-t-lg`}>
                  <CardTitle className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                    <div className="space-y-1">
                      <div className="text-3xl font-bold text-mansablue">{tier.price}</div>
                      <div className="text-sm text-gray-500 line-through">{tier.originalPrice}</div>
                      <div className="text-sm text-green-600 font-medium">Save 17%</div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <ul className="space-y-4 mb-6">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${tier.popular ? 'bg-mansagold hover:bg-mansagold-dark text-mansablue' : 'bg-mansablue hover:bg-mansablue-dark'} font-semibold`}
                    size="lg"
                    onClick={() => handleTierSelection(tier.name)}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Sponsorship Form */}
      <SponsorshipForm />

      {/* Contact Section */}
      <div className="py-16 bg-mansablue">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Make an Impact?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Contact our partnership team to discuss custom sponsorship opportunities and start creating meaningful change in Black communities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-mansagold hover:bg-mansagold-dark text-mansablue font-semibold px-8 py-6 text-lg"
                onClick={handleContactTeam}
              >
                Contact Partnership Team
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg"
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-mansablue px-8 py-6 text-lg"
                onClick={handleDownloadPackage}
              >
                Download Sponsorship Package
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CorporateSponsorshipPage;
