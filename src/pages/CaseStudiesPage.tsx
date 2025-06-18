
import React from 'react';
import { Navbar } from '@/components/navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, Users, DollarSign, Star } from 'lucide-react';
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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-mansablue to-mansablue-dark text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Real Success Stories
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Discover how businesses are thriving through intentional economic circulation
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <div className="bg-white/10 px-4 py-2 rounded-full">
                  <span className="font-semibold">500+</span> Success Stories
                </div>
                <div className="bg-white/10 px-4 py-2 rounded-full">
                  <span className="font-semibold">$2M+</span> Revenue Generated
                </div>
                <div className="bg-white/10 px-4 py-2 rounded-full">
                  <span className="font-semibold">95%</span> Customer Satisfaction
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Case Studies Grid */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Featured Success Stories
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  These businesses transformed their growth trajectory by joining our community-focused ecosystem
                </p>
              </div>

              <div className="grid gap-8">
                {caseStudies.map((study) => (
                  <Card key={study.id} className="overflow-hidden">
                    <div className="md:flex">
                      <div className="md:w-1/3">
                        <img 
                          src={study.image} 
                          alt={study.businessName}
                          className="w-full h-64 md:h-full object-cover"
                        />
                      </div>
                      <div className="md:w-2/3 p-8">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                              {study.businessName}
                            </h3>
                            <p className="text-gray-600 mb-2">
                              Owner: <span className="font-medium">{study.ownerName}</span>
                            </p>
                            <div className="flex items-center gap-2 mb-4">
                              <Badge variant="outline">{study.category}</Badge>
                              <span className="text-sm text-gray-500">{study.location}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-mansablue">
                              +{study.results.revenueIncrease}
                            </div>
                            <div className="text-sm text-gray-500">Revenue Growth</div>
                          </div>
                        </div>

                        <div className="mb-6">
                          <h4 className="font-semibold text-gray-900 mb-2">The Challenge</h4>
                          <p className="text-gray-600 mb-4">{study.challenge}</p>
                          
                          <h4 className="font-semibold text-gray-900 mb-2">Our Solution</h4>
                          <p className="text-gray-600 mb-4">{study.solution}</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4 mb-6">
                          <div className="text-center p-4 bg-green-50 rounded-lg">
                            <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-2" />
                            <div className="font-bold text-green-700">{study.results.revenueIncrease}</div>
                            <div className="text-sm text-green-600">Revenue Increase</div>
                          </div>
                          <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                            <div className="font-bold text-blue-700">{study.results.newCustomers}</div>
                            <div className="text-sm text-blue-600">New Customers</div>
                          </div>
                          <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <Star className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                            <div className="font-bold text-purple-700">{study.results.loyaltyMembers}</div>
                            <div className="text-sm text-purple-600">Loyalty Members</div>
                          </div>
                        </div>

                        <blockquote className="border-l-4 border-mansagold pl-4 py-2 italic text-gray-700 mb-4">
                          "{study.testimonial}"
                        </blockquote>

                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-500">
                            Success achieved in <span className="font-medium">{study.timeline}</span>
                          </div>
                          <Link to="/directory">
                            <Button variant="outline" size="sm">
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
        <section className="py-16 bg-mansablue text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Write Your Success Story?</h2>
            <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
              Join hundreds of businesses already growing through intentional economic circulation
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/business-form">
                <Button size="lg" className="bg-mansagold hover:bg-mansagold/90 text-mansablue font-semibold">
                  Join as Business
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/directory">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-mansablue">
                  Explore Directory
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default CaseStudiesPage;
