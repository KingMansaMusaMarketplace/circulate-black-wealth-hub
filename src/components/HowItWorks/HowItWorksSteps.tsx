
import React from 'react';
import { CheckCircle2, Clock } from 'lucide-react';

const HowItWorksSteps = () => {
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
    <section id="how-it-works" className="py-8">
      <div className="container-custom">
        <div className="space-y-10">
          {steps.map((step, index) => (
            <div key={step.number} className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 items-center`}>
              <div className="md:w-1/2">
                <div className="mb-2 flex items-center">
                  <span className="text-5xl mr-4">{step.icon}</span>
                  <span className="text-mansagold font-bold text-xl">{step.number}</span>
                </div>
                <h2 className="heading-md text-mansablue-dark mb-3">{step.title}</h2>
                <p className="text-gray-600 text-lg mb-4">{step.description}</p>
                
                <div className="space-y-2">
                  {step.details.map((detail, i) => (
                    <div key={i} className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-mansagold mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="md:w-1/2">
                <div className={`bg-gray-50 rounded-xl p-4 border ${index % 2 === 1 ? 'border-mansagold' : 'border-mansablue'}`}>
                  {/* Content kept the same but with reduced padding */}
                  {index === 0 && (
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-900">Subscription Plans</h3>
                        <div className="bg-mansagold text-white px-2 py-1 rounded text-xs font-medium">
                          Best Value
                        </div>
                      </div>
                      
                      {/* Coming Soon Payment Message */}
                      <div className="mb-4 bg-mansablue/10 rounded-md p-3 border border-mansablue/30 flex items-center">
                        <Clock size={18} className="text-mansablue mr-2 flex-shrink-0" />
                        <p className="text-sm text-mansablue-dark">
                          <span className="font-medium">Payment Processing Coming Soon!</span> We're setting up our payment system. Register now to get notified when it's ready.
                        </p>
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
                            <span className="font-bold text-mansablue">$100/month</span>
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
  );
};

export default HowItWorksSteps;
