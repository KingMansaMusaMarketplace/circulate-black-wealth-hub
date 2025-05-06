
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

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
                  <Button className="bg-mansagold hover:bg-mansagold-dark text-white px-8 py-6 text-lg">
                    Learn How It Works
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Mission Section */}
        <section className="py-20">
          <div className="container-custom">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="heading-md text-mansablue mb-6">Mission Statement</h2>
                <p className="text-gray-700 text-lg mb-6">
                  To build, protect, and expand the Black economic ecosystem through intentional 
                  consumer behavior, loyalty rewards, and strategic digital infrastructure.
                </p>
                
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                  <h3 className="font-bold text-xl mb-4 text-mansablue-dark">Why It Matters</h3>
                  <p className="text-gray-700 mb-4">
                    Today, the Black dollar circulates within our community for less than six hours, compared to 
                    28+ days in other groups.
                  </p>
                  <p className="text-gray-700">
                    Without structural intervention, this cycle of leakage continues — weakening every generation's 
                    economic potential.
                  </p>
                </div>
              </div>
              
              <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                <div className="bg-mansablue p-8">
                  <h3 className="text-xl font-bold text-white mb-4">Key Strategic Pillars</h3>
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
        
        {/* Vision Section */}
        <section className="py-20 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="heading-md text-mansablue mb-4">Vision 2030</h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                By 2030, Mansa Musa Marketplace will have created measurable impact in Black communities through 
                intentional economic infrastructure.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 text-center">
                <div className="text-4xl mb-4">✊🏾</div>
                <h3 className="text-xl font-bold mb-2">100,000+</h3>
                <p className="text-gray-600">
                  Black-owned businesses empowered globally through our platform
                </p>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 text-center">
                <div className="text-4xl mb-4">💵</div>
                <h3 className="text-xl font-bold mb-2">$1+ Billion</h3>
                <p className="text-gray-600">
                  Circulated within Black communities through intentional spending
                </p>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 text-center">
                <div className="text-4xl mb-4">🏦</div>
                <h3 className="text-xl font-bold mb-2">Financial Services</h3>
                <p className="text-gray-600">
                  Launch of parallel services: cashback, lending, wealth planning
                </p>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <p className="text-lg text-gray-700 font-bold mb-8">
                This is not a marketplace.<br />
                This is a platform for economic sovereignty.
              </p>
              <Link to="/signup">
                <Button className="bg-mansablue hover:bg-mansablue-dark text-white px-8 py-2 text-lg">
                  Join The Movement
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* About the Author */}
        <section className="py-20">
          <div className="container-custom">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <div className="grid md:grid-cols-3">
                <div className="md:col-span-1 bg-mansablue p-8 text-white">
                  <h3 className="heading-md mb-6">About the Author</h3>
                  <div className="w-32 h-32 rounded-full bg-white mb-6 mx-auto md:mx-0 flex items-center justify-center">
                    <span className="text-mansablue font-spartan font-bold text-4xl">TB</span>
                  </div>
                  <h4 className="text-xl font-bold mb-2">Thomas D. Bowling</h4>
                  <p className="text-white/80 mb-4">Founder & Chief Architect</p>
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
                  <p className="text-gray-700 font-bold">
                    "My life's work is to leave blueprints, not breadcrumbs, for the next generation of Black builders."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Quote Section */}
        <section className="py-20 bg-mansablue text-white text-center">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto">
              <div className="mb-6 text-mansagold text-4xl">
                "
              </div>
              <blockquote className="text-2xl font-medium mb-8">
                Wealth is not created by individuals shouting in isolation.
                Wealth is created by systems — built, protected, and expanded together.
                Mansa Musa Marketplace is your system.
                Now circulate, build, and lead.
              </blockquote>
              <footer className="font-bold">— Thomas D. Bowling</footer>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20">
          <div className="container-custom">
            <div className="bg-gradient-to-br from-mansablue to-mansablue-dark rounded-2xl p-8 md:p-12 text-white text-center">
              <h2 className="heading-lg mb-6">Join Us in Building Economic Infrastructure</h2>
              <p className="text-white/80 max-w-xl mx-auto mb-8 text-lg">
                Be part of the movement that's creating intentional wealth circulation for generations to come.
              </p>
              <Link to="/signup">
                <Button className="bg-mansagold hover:bg-mansagold-dark text-white px-8 py-6 text-lg font-medium">
                  Get Early Access →
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
