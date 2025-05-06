
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

const HowItWorksPage = () => {
  const steps = [
    {
      number: '01',
      title: 'Subscribe',
      description: 'Join for just $10/month and unlock the full directory of Black-owned businesses.',
      details: [
        'Access to full business listings',
        'QR code scanning functionality',
        'Loyalty points tracking',
        'Exclusive discounts at local businesses'
      ],
      icon: '💳'
    },
    {
      number: '02',
      title: 'Discover',
      description: 'Search by Category, Location, or Distance to find businesses near you.',
      details: [
        'Filter by business category',
        'Search by distance',
        'View ratings and reviews',
        'Find special promotions and discounts'
      ],
      icon: '🔍'
    },
    {
      number: '03',
      title: 'Scan & Save',
      description: 'Visit a business, scan their QR code at checkout, and get instant discounts and loyalty points.',
      details: [
        'Instant discount application',
        'Automatic loyalty points',
        'Track your savings',
        'Build your circulation impact'
      ],
      icon: '📱'
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="bg-mansablue py-20">
          <div className="container-custom text-center">
            <h1 className="heading-lg text-white mb-6">How Mansa Musa Marketplace Works</h1>
            <p className="text-white/80 max-w-2xl mx-auto text-lg mb-10">
              We're building more than an app — we're creating infrastructure for Black wealth circulation.
              Here's how you can be part of this economic movement.
            </p>
          </div>
        </section>
        
        {/* Detailed Steps */}
        <section className="py-20">
          <div className="container-custom">
            <div className="space-y-20">
              {steps.map((step, index) => (
                <div key={step.number} className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-12 items-center`}>
                  <div className="md:w-1/2">
                    <div className="mb-4 flex items-center">
                      <span className="text-5xl mr-4">{step.icon}</span>
                      <span className="text-mansagold font-bold text-xl">{step.number}</span>
                    </div>
                    <h2 className="heading-md text-mansablue-dark mb-4">{step.title}</h2>
                    <p className="text-gray-600 text-lg mb-6">{step.description}</p>
                    
                    <div className="space-y-3">
                      {step.details.map((detail, i) => (
                        <div key={i} className="flex items-start">
                          <CheckCircle2 className="h-6 w-6 text-mansagold mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="md:w-1/2">
                    <div className={`bg-gray-50 rounded-xl p-8 border ${index % 2 === 1 ? 'border-mansagold' : 'border-mansablue'}`}>
                      {index === 0 && (
                        <div className="bg-white rounded-lg shadow-sm p-6">
                          <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-gray-900">Subscription Plans</h3>
                            <div className="bg-mansagold text-white px-2 py-1 rounded text-xs font-medium">
                              Best Value
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="border border-gray-200 rounded-lg p-4">
                              <div className="flex justify-between items-center">
                                <h4 className="font-bold">Customer</h4>
                                <span className="font-bold text-mansablue">$10/month</span>
                              </div>
                              <ul className="mt-2 space-y-1">
                                <li className="text-sm text-gray-600">• Full directory access</li>
                                <li className="text-sm text-gray-600">• QR scanning for discounts</li>
                                <li className="text-sm text-gray-600">• Loyalty points system</li>
                              </ul>
                            </div>
                            
                            <div className="border border-gray-200 rounded-lg p-4">
                              <div className="flex justify-between items-center">
                                <h4 className="font-bold">Business</h4>
                                <span className="font-bold text-mansablue">$50/month</span>
                              </div>
                              <ul className="mt-2 space-y-1">
                                <li className="text-sm text-gray-600">• Business listing</li>
                                <li className="text-sm text-gray-600">• Customer analytics</li>
                                <li className="text-sm text-gray-600">• First month free</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {index === 1 && (
                        <div className="bg-white rounded-lg shadow-sm p-6">
                          <h3 className="font-bold text-gray-900 mb-4">Search & Discovery</h3>
                          
                          <div className="space-y-4">
                            <div className="border border-gray-100 rounded-lg p-3">
                              <div className="flex items-center">
                                <div className="bg-mansablue/10 rounded-full p-2 mr-3">🍽️</div>
                                <div>
                                  <h5 className="font-semibold">Restaurants</h5>
                                  <p className="text-sm text-gray-500">56 nearby</p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="border border-gray-100 rounded-lg p-3">
                              <div className="flex items-center">
                                <div className="bg-mansablue/10 rounded-full p-2 mr-3">✂️</div>
                                <div>
                                  <h5 className="font-semibold">Beauty & Barber</h5>
                                  <p className="text-sm text-gray-500">42 nearby</p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="border border-gray-100 rounded-lg p-3">
                              <div className="flex items-center">
                                <div className="bg-mansablue/10 rounded-full p-2 mr-3">🛍️</div>
                                <div>
                                  <h5 className="font-semibold">Retail</h5>
                                  <p className="text-sm text-gray-500">38 nearby</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {index === 2 && (
                        <div className="bg-white rounded-lg shadow-sm p-6">
                          <h3 className="font-bold text-gray-900 mb-4">QR Code & Loyalty</h3>
                          
                          <div className="flex items-center justify-center mb-6">
                            <div className="w-40 h-40 bg-black rounded-lg grid grid-cols-8 grid-rows-8 gap-0.5 p-2">
                              {Array(64).fill(0).map((_, i) => (
                                <div key={i} className={`${Math.random() > 0.4 ? 'bg-white' : 'bg-transparent'} rounded-sm`}></div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="border border-gray-100 rounded-lg p-4">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-2">
                                    <span className="text-xs font-bold text-gray-500">SB</span>
                                  </div>
                                  <h5 className="font-medium">Soul Bistro</h5>
                                </div>
                                <span className="text-mansagold font-bold">15% Off</span>
                              </div>
                              <div className="mt-3 bg-mansablue/10 rounded p-2 text-center">
                                <span className="text-sm font-medium text-mansablue">+15 Points Earned!</span>
                              </div>
                            </div>
                            
                            <div className="mt-4">
                              <div className="flex justify-between text-sm mb-1">
                                <span>Loyalty Progress</span>
                                <span>350/500 pts</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-mansagold h-2.5 rounded-full" style={{width: '70%'}}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Benefits Section */}
        <section className="py-20 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="heading-lg text-mansablue mb-4">Benefits for Everyone</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Mansa Musa Marketplace creates value for customers, businesses, and the entire community.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8">
                <div className="text-4xl mb-4">👤</div>
                <h3 className="text-2xl font-bold mb-6">For Customers</h3>
                <ul className="space-y-4">
                  {[
                    'Save 10-20% every time you shop at participating businesses',
                    'Earn Loyalty Points redeemable for real rewards',
                    'Discover new Black-owned businesses easily',
                    'Track your economic impact in the community',
                    'Exclusive invites to "Circulate the Dollar" events',
                    'Early access to business promotions and limited deals'
                  ].map((benefit, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-mansagold mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8">
                <div className="text-4xl mb-4">🏪</div>
                <h3 className="text-2xl font-bold mb-6">For Business Owners</h3>
                <ul className="space-y-4">
                  {[
                    'Free first month to try the platform risk-free',
                    'Increased visibility to a loyal customer base',
                    'Customer retention through loyalty program',
                    'Detailed analytics on customer engagement',
                    'Participation in community promotional events',
                    'Featured placement opportunities in the app'
                  ].map((benefit, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-mansagold mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-20">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="heading-lg text-mansablue mb-4">Frequently Asked Questions</h2>
            </div>
            
            <div className="max-w-3xl mx-auto divide-y">
              {[
                {
                  question: "Why do I need to pay a subscription?",
                  answer: "Your subscription fee helps maintain the platform infrastructure and supports our ability to provide quality service without selling your data. It also ensures we're accountable to you, not advertisers."
                },
                {
                  question: "How do businesses get verified?",
                  answer: "Businesses go through a verification process to confirm they are Black-owned. This includes business registration documentation review and ownership confirmation."
                },
                {
                  question: "Can I use the app in any city?",
                  answer: "We're launching city by city to ensure quality. Check our current coverage areas in the app, and vote for your city to be included next!"
                },
                {
                  question: "How do I redeem my loyalty points?",
                  answer: "Loyalty points can be redeemed through the app for discounts, merchandise, or special offers from participating businesses once you reach point thresholds."
                },
                {
                  question: "What happens if a business closes or leaves the platform?",
                  answer: "We regularly update our directory to remove closed businesses. If you have loyalty points with that business specifically, we'll provide options to transfer them to another business."
                }
              ].map((faq, i) => (
                <div key={i} className="py-6">
                  <h3 className="text-xl font-bold mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-mansablue text-white text-center">
          <div className="container-custom">
            <h2 className="heading-lg mb-6">Ready to Start Circulating?</h2>
            <p className="max-w-2xl mx-auto mb-8 text-white/80 text-lg">
              Join Mansa Musa Marketplace today and become part of the movement to strengthen Black economic power.
            </p>
            <div className="flex justify-center space-x-4">
              <Link to="/signup">
                <Button className="bg-mansagold hover:bg-mansagold-dark text-white px-8 py-6 text-lg">
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

export default HowItWorksPage;
