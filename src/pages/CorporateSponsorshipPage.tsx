
import React from 'react';
import { Helmet } from 'react-helmet';
import { Navbar } from '@/components/navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Star, Users, TrendingUp, Award } from 'lucide-react';

const CorporateSponsorshipPage = () => {
  const sponsorshipTiers = [
    {
      name: 'Bronze Partner',
      price: '$5,000',
      period: 'annually',
      features: [
        'Logo placement on website footer',
        'Quarterly newsletter mention',
        'Access to community metrics',
        'Certificate of partnership'
      ],
      icon: Award
    },
    {
      name: 'Silver Partner',
      price: '$15,000',
      period: 'annually',
      features: [
        'Logo placement on homepage',
        'Monthly newsletter feature',
        'Sponsored content opportunities',
        'Access to detailed analytics',
        'Dedicated account manager'
      ],
      icon: Star,
      popular: true
    },
    {
      name: 'Gold Partner',
      price: '$35,000',
      period: 'annually',
      features: [
        'Prominent logo placement',
        'Co-branded content creation',
        'Event sponsorship opportunities',
        'Custom partnership benefits',
        'Executive partnership meetings',
        'First access to new initiatives'
      ],
      icon: TrendingUp
    }
  ];

  const handleLearnMore = (tierName: string) => {
    // Create contact email with tier information
    const subject = `Interest in ${tierName} Sponsorship`;
    const body = `Hello,\n\nI would like to learn more about the ${tierName} sponsorship tier and how our organization can get involved.\n\nPlease provide additional details about:\n- Specific benefits and opportunities\n- Partnership process and timeline\n- Available customization options\n\nThank you for your time.\n\nBest regards`;
    
    const mailtoUrl = `mailto:partnerships@mansamusamarketplace.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  const handleContactPartnership = () => {
    const subject = 'Partnership Inquiry - Mansa Musa Marketplace';
    const body = `Hello,\n\nI am interested in exploring corporate sponsorship opportunities with Mansa Musa Marketplace.\n\nPlease contact me to discuss:\n- Available partnership tiers\n- Custom sponsorship opportunities\n- Partnership benefits and ROI\n- Next steps in the process\n\nI look forward to hearing from you.\n\nBest regards`;
    
    const mailtoUrl = `mailto:partnerships@mansamusamarketplace.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  const handleDownloadGuide = () => {
    // Create a placeholder PDF download - in a real app this would link to an actual PDF
    const link = document.createElement('a');
    link.href = '/partnership-guide.pdf';
    link.download = 'Mansa-Musa-Partnership-Guide.pdf';
    link.click();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Corporate Sponsorship - Mansa Musa Marketplace</title>
        <meta name="description" content="Partner with Mansa Musa Marketplace to support Black-owned businesses and create meaningful economic impact in communities." />
      </Helmet>

      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-mansablue to-mansablue-dark py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Corporate Sponsorship
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Partner with us to create meaningful economic impact while supporting Black-owned businesses 
              and strengthening communities across the nation.
            </p>
            <Button size="lg" className="bg-mansagold hover:bg-mansagold-dark text-mansablue font-semibold">
              Become a Partner
            </Button>
          </div>
        </div>

        {/* Impact Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-mansablue mb-12">
              The Impact of Your Partnership
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <Users className="h-12 w-12 text-mansagold mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Community Growth</h3>
                <p className="text-gray-600">
                  Support the growth of Black-owned businesses and create sustainable economic opportunities.
                </p>
              </div>
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-mansagold mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Economic Circulation</h3>
                <p className="text-gray-600">
                  Help keep dollars circulating within Black communities, building generational wealth.
                </p>
              </div>
              <div className="text-center">
                <Award className="h-12 w-12 text-mansagold mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Brand Alignment</h3>
                <p className="text-gray-600">
                  Align your brand with meaningful social impact and authentic community engagement.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Sponsorship Tiers */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-mansablue mb-12">
              Partnership Opportunities
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {sponsorshipTiers.map((tier, index) => (
                <Card key={index} className={`relative ${tier.popular ? 'border-mansagold shadow-lg' : ''}`}>
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-mansagold text-mansablue px-4 py-1 rounded-full text-sm font-semibold">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <tier.icon className="h-8 w-8 text-mansagold mx-auto mb-2" />
                    <CardTitle className="text-xl">{tier.name}</CardTitle>
                    <CardDescription>
                      <span className="text-3xl font-bold text-mansablue">{tier.price}</span>
                      <span className="text-gray-600">/{tier.period}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {tier.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className="w-full mt-6" 
                      variant={tier.popular ? 'default' : 'outline'}
                      onClick={() => handleLearnMore(tier.name)}
                    >
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-mansablue">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Make an Impact?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Contact our partnership team to discuss custom sponsorship opportunities 
              that align with your company's values and goals.
            </p>
            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
              <Button 
                size="lg" 
                className="bg-mansagold hover:bg-mansagold-dark text-mansablue"
                onClick={handleContactPartnership}
              >
                Contact Partnership Team
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-mansablue bg-transparent"
                onClick={handleDownloadGuide}
              >
                Download Partnership Guide
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CorporateSponsorshipPage;
