import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, TrendingUp, Users, Layers } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const AboutPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="bg-mansablue-dark py-20">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="heading-lg text-white mb-6">Building the Future of Black Wealth Circulation</h1>
              <p className="text-white/80 text-lg mb-8">
                Mansa Musa Marketplace was never designed as just an app. It's the infrastructure blueprint for circulating 
                Black dollars intentionally, systemically, and sustainably across generations.
              </p>
              <div className="flex justify-center">
                <Link to="/how-it-works">
                  <Button className="bg-mansagold hover:bg-mansagold-dark text-white px-8 py-6 text-lg group">
                    Learn How It Works
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Mission Section - Enhanced with Card component */}
        <section className="py-20">
          <div className="container-custom">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="heading-md text-mansablue mb-6 relative">
                  Mission Statement
                  <span className="absolute bottom-0 left-0 w-16 h-1 bg-mansagold"></span>
                </h2>
                <p className="text-gray-700 text-lg mb-6">
                  To build, protect, and expand the Black economic ecosystem through intentional 
                  consumer behavior, loyalty rewards, and strategic digital infrastructure.
                </p>
                
                <Card className="border-mansagold/20">
                  <CardHeader className="bg-gradient-to-r from-mansablue/5 to-mansablue/10 pb-2">
                    <CardTitle className="text-xl text-mansablue-dark">Why It Matters</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-gray-700 mb-4">
                      Today, the Black dollar circulates within our community for less than six hours, compared to 
                      28+ days in other groups.
                    </p>
                    <p className="text-gray-700 font-medium">
                      Without structural intervention, this cycle of leakage continues — weakening every generation's 
                      economic potential.
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
                <div className="bg-mansablue p-8">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <Layers className="mr-2" /> Key Strategic Pillars
                  </h3>
                </div>
                <div className="p-8">
                  <ul className="space-y-6">
                    <li className="flex">
                      <div className="bg-mansagold/20 text-mansagold rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
                        1
                      </div>
                      <div>
                        <h4 className="font-bold text-lg mb-1">Circulation Infrastructure</h4>
                        <p className="text-gray-600">
                          Build the digital bridges necessary to support intentional economic behavior.
                        </p>
                      </div>
                    </li>
                    
                    <li className="flex">
                      <div className="bg-mansagold/20 text-mansagold rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
                        2
                      </div>
                      <div>
                        <h4 className="font-bold text-lg mb-1">Consumer Empowerment</h4>
                        <p className="text-gray-600">
                          Turn spending into investing by rewarding loyalty to Black-owned businesses.
                        </p>
                      </div>
                    </li>
                    
                    <li className="flex">
                      <div className="bg-mansagold/20 text-mansagold rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
                        3
                      </div>
                      <div>
                        <h4 className="font-bold text-lg mb-1">Merchant Empowerment</h4>
                        <p className="text-gray-600">
                          Provide Black-owned businesses with visibility, loyalty programs, and direct new customer pipelines.
                        </p>
                      </div>
                    </li>
                    
                    <li className="flex">
                      <div className="bg-mansagold/20 text-mansagold rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
                        4
                      </div>
                      <div>
                        <h4 className="font-bold text-lg mb-1">Data Ownership</h4>
                        <p className="text-gray-600">
                          Ensure that the community owns its own economic behavioral data — not outside platforms.
                        </p>
                      </div>
                    </li>
                    
                    <li className="flex">
                      <div className="bg-mansagold/20 text-mansagold rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
                        5
                      </div>
                      <div>
                        <h4 className="font-bold text-lg mb-1">Legacy Engineering</h4>
                        <p className="text-gray-600">
                          Position Mansa Musa Marketplace as an educational, economic, and cultural pillar
                          that teaches future generations how intentional systems are built and sustained.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Vision Section - Enhanced with animated cards */}
        <section className="py-20 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="heading-md text-mansablue mb-4 inline-block relative">
                Vision 2030
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-mansagold"></span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg mt-6">
                By 2030, Mansa Musa Marketplace will have created measurable impact in Black communities through 
                intentional economic infrastructure.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-mansagold/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="text-center border-b border-gray-100 pb-4">
                  <div className="text-4xl mb-4 flex justify-center">✊🏾</div>
                  <CardTitle className="text-xl">100,000+</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-gray-600 text-center">
                    Black-owned businesses empowered globally through our platform
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-mansagold/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="text-center border-b border-gray-100 pb-4">
                  <div className="text-4xl mb-4 flex justify-center">💵</div>
                  <CardTitle className="text-xl">$1+ Billion</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-gray-600 text-center">
                    Circulated within Black communities through intentional spending
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-mansagold/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="text-center border-b border-gray-100 pb-4">
                  <div className="text-4xl mb-4 flex justify-center">🏦</div>
                  <CardTitle className="text-xl">Financial Services</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-gray-600 text-center">
                    Launch of parallel services: cashback, lending, wealth planning
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-12 text-center">
              <p className="text-lg text-gray-700 font-bold mb-8">
                This is not a marketplace.<br />
                This is a platform for economic sovereignty.
              </p>
              <Link to="/signup">
                <Button className="bg-mansablue hover:bg-mansablue-dark text-white px-8 py-2 text-lg group">
                  Join The Movement
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* About the Author - Enhanced with better visual hierarchy */}
        <section className="py-20">
          <div className="container-custom">
            <Card className="overflow-hidden border-mansagold/20">
              <div className="grid md:grid-cols-3">
                <div className="md:col-span-1 bg-mansablue p-8 text-white">
                  <h3 className="heading-md mb-6">About the Author</h3>
                  <div className="w-32 h-32 rounded-full bg-white mb-6 mx-auto md:mx-0 flex items-center justify-center border-4 border-mansagold">
                    <span className="text-mansablue font-spartan font-bold text-4xl">TB</span>
                  </div>
                  <h4 className="text-xl font-bold mb-2">Thomas D. Bowling</h4>
                  <p className="text-white/80 mb-4 flex items-center">
                    <Users className="mr-2 h-4 w-4" />
                    Founder & Chief Architect
                  </p>
                </div>
                
                <div className="md:col-span-2 p-8">
                  <p className="text-gray-700 mb-4">
                    Thomas D. Bowling is a visionary entrepreneur, strategic founder, and inventor behind
                    Mansa Musa Marketplace. With a mission to engineer economic empowerment through
                    infrastructure, Thomas brings decades of experience in strategic development,
                    community-centered innovation, and business leadership.
                  </p>
                  <p className="text-gray-700 mb-4">
                    He believes wealth circulation is not an accident — it is a system that must be intentionally built,
                    protected, and expanded.
                  </p>
                  <Separator className="my-4" />
                  <p className="text-gray-700 font-bold italic text-lg">
                    "My life's work is to leave blueprints, not breadcrumbs, for the next generation of Black builders."
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>
        
        {/* Quote Section - Enhanced with better visual style */}
        <section className="py-20 bg-mansablue text-white text-center">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto">
              <div className="mb-6 text-mansagold text-6xl opacity-60">
                "
              </div>
              <blockquote className="text-2xl font-medium mb-8 leading-relaxed">
                Wealth is not created by individuals shouting in isolation.
                Wealth is created by systems — built, protected, and expanded together.
                <span className="block mt-4 font-bold text-mansagold">Mansa Musa Marketplace is your system.</span>
                <span className="block mt-2">Now circulate, build, and lead.</span>
              </blockquote>
              <footer className="font-bold flex items-center justify-center">
                <div className="h-0.5 w-10 bg-mansagold/60 mr-3"></div>
                Thomas D. Bowling
                <div className="h-0.5 w-10 bg-mansagold/60 ml-3"></div>
              </footer>
            </div>
          </div>
        </section>
        
        {/* CTA Section - Enhanced with gradient and animation */}
        <section className="py-20">
          <div className="container-custom">
            <div className="bg-gradient-to-br from-mansablue to-mansablue-dark rounded-2xl p-8 md:p-12 text-white text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTJoMnYyem0wLTRoLTJ2LTJoMnYyem0wLTRoLTJ2LTJoMnYyem0wLTRoLTJWNmgydjJ6TTI0IDM0aC0ydi0yaDJ2MnptMC00aC0ydi0yaDJ2MnptMC00aC0ydi0yaDJ2MnptMC00aC0ydi0yaDJ2MnptMC00aC0yVjZoMnYyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
              <div className="relative z-10">
                <TrendingUp className="mb-6 mx-auto h-16 w-16 text-mansagold animate-bounce" />
                <h2 className="heading-lg mb-6">Join Us in Building Economic Infrastructure</h2>
                <p className="text-white/80 max-w-xl mx-auto mb-8 text-lg">
                  Be part of the movement that's creating intentional wealth circulation for generations to come.
                </p>
                <Link to="/signup">
                  <Button className="bg-mansagold hover:bg-mansagold-dark text-white px-8 py-6 text-lg font-medium group animate-pulse">
                    Get Early Access 
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
