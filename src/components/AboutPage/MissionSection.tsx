
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Layers } from 'lucide-react';

const MissionSection = () => {
  return (
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
  );
};

export default MissionSection;
