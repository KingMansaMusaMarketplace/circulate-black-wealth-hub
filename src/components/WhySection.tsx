
import React from 'react';

const WhySection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="heading-lg text-mansablue-dark mb-6">Why Mansa Musa Marketplace?</h2>
            
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
              <div className="text-5xl mb-4">⏱️</div>
              <h3 className="text-2xl font-bold mb-2">The Black dollar circulates for just 6 hours.</h3>
              <p className="text-gray-600">
                We are building a system that multiplies it across generations. This isn't 
                just about shopping - it's about building economic infrastructure.
              </p>
            </div>
            
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="bg-mansagold/20 rounded-full p-2 mr-4 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-mansagold">
                    <path d="M21 10H3" /><path d="M21 6H3" /><path d="M21 14H3" /><path d="M21 18H3" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-lg">Find local Black-owned businesses.</h4>
                  <p className="text-gray-600">Our comprehensive directory makes discovery easy and intentional.</p>
                </div>
              </li>
              
              <li className="flex items-start">
                <div className="bg-mansagold/20 rounded-full p-2 mr-4 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-mansagold">
                    <path d="M12 8a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0v-5a3 3 0 0 0-3-3Z" /><path d="M5 10a7 7 0 0 1 14 0" />
                    <line x1="8" x2="16" y1="21" y2="21" /><line x1="12" x2="12" y1="17" y2="21" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-lg">Earn rewards every time you support them.</h4>
                  <p className="text-gray-600">Our loyalty system makes intentional circulation rewarding.</p>
                </div>
              </li>
              
              <li className="flex items-start">
                <div className="bg-mansagold/20 rounded-full p-2 mr-4 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-mansagold">
                    <path d="M12 2v20" /><path d="m17 5-5-3-5 3" /><path d="m17 19-5 3-5-3" />
                    <path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-lg">Turn everyday spending into economic empowerment.</h4>
                  <p className="text-gray-600">Every purchase builds community wealth and power.</p>
                </div>
              </li>
            </ul>
          </div>
          
          <div className="relative">
            <div className="relative z-10 bg-white rounded-xl shadow-xl overflow-hidden">
              <div className="bg-mansablue p-6">
                <h3 className="text-white text-2xl font-bold mb-2">The Circulation Challenge</h3>
                <p className="text-white/80 mb-4">See the impact of how long a dollar stays in the community</p>
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Black Community</span>
                    <span className="text-sm font-medium text-gray-700">6 hours</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div className="bg-mansablue h-4 rounded-full animate-pulse-gold" style={{width: '5%'}}></div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Other Communities</span>
                    <span className="text-sm font-medium text-gray-700">28+ days</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div className="bg-mansagold h-4 rounded-full" style={{width: '85%'}}></div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="font-bold text-mansablue mb-2">Our Vision for 2030</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-mansagold mr-2"></div>
                      <span>Empower 100,000+ Black-owned businesses</span>
                    </li>
                    <li className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-mansagold mr-2"></div>
                      <span>Circulate $1+ billion within Black communities</span>
                    </li>
                    <li className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-mansagold mr-2"></div>
                      <span>Launch parallel financial services</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute w-40 h-40 bg-mansagold/20 rounded-full -z-10 -top-10 -left-10"></div>
            <div className="absolute w-60 h-60 bg-mansablue/10 rounded-full -z-10 -bottom-10 -right-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhySection;
