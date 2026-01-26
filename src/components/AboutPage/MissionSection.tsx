
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Layers } from 'lucide-react';

const MissionSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-mansablue-light/10 to-amber-50">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="heading-md mb-6 relative bg-gradient-to-r from-mansablue via-blue-600 to-blue-700 bg-clip-text text-transparent font-extrabold">
              Mission Statement
              <span className="absolute bottom-0 left-0 w-20 h-1 bg-gradient-to-r from-mansagold to-amber-500 rounded-full"></span>
            </h2>
            <p className="text-gray-700 text-lg mb-6 font-medium leading-relaxed">
              To build, protect, and expand the Black economic ecosystem through intentional 
              consumer behavior, loyalty rewards, and strategic digital infrastructure.
            </p>
            
            <Card className="border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 shadow-lg hover:shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-500/10 via-mansablue/10 to-blue-600/10 pb-3">
                <CardTitle className="text-xl font-bold text-gray-900">Why It Matters</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-gray-900 mb-4 font-medium">
                  Today, the Black dollar circulates within our community for less than six hours, compared to 
                  28+ days in other groups.
                </p>
                <p className="text-gray-900 font-bold">
                  Without structural intervention, this cycle of leakage continues — weakening every generation's 
                  economic potential.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border-2 border-gradient-to-br from-purple-200 to-blue-200">
            <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 p-8">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Layers className="mr-2" /> Key Strategic Pillars
              </h3>
            </div>
            <div className="p-8 bg-gradient-to-br from-white to-purple-50">
              <ul className="space-y-6">
                <li className="flex group">
                  <div className="bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4 flex-shrink-0 font-bold shadow-md group-hover:scale-110 transition-transform duration-300">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Economic Rails</h4>
                    <p className="text-gray-700 font-medium">
                      Build the patent-protected infrastructure necessary to support intentional economic behavior.
                    </p>
                  </div>
                </li>
                
                <li className="flex group">
                  <div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4 flex-shrink-0 font-bold shadow-md group-hover:scale-110 transition-transform duration-300">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Consumer Empowerment</h4>
                    <p className="text-gray-700 font-medium">
                      Turn spending into investing by rewarding loyalty to Black-owned businesses.
                    </p>
                  </div>
                </li>
                
                <li className="flex group">
                  <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4 flex-shrink-0 font-bold shadow-md group-hover:scale-110 transition-transform duration-300">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Merchant Empowerment</h4>
                    <p className="text-gray-700 font-medium">
                      Provide Black-owned businesses with visibility, loyalty programs, and direct new customer pipelines.
                    </p>
                  </div>
                </li>
                
                <li className="flex group">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4 flex-shrink-0 font-bold shadow-md group-hover:scale-110 transition-transform duration-300">
                    4
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Data Ownership Moat</h4>
                    <p className="text-gray-600">
                      Ensure that the community owns its own economic behavioral data — the competitive moat that outside platforms cannot replicate.
                    </p>
                  </div>
                </li>
                
                <li className="flex group">
                  <div className="bg-gradient-to-br from-mansagold to-amber-500 text-mansablue-dark rounded-full w-10 h-10 flex items-center justify-center mr-4 flex-shrink-0 font-bold shadow-md group-hover:scale-110 transition-transform duration-300">
                    5
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1 bg-gradient-to-r from-mansagold-dark to-amber-600 bg-clip-text text-transparent">Legacy Engineering</h4>
                    <p className="text-gray-600">
                      Position 1325.AI as an educational, economic, and cultural pillar
                      that teaches future generations how intentional infrastructure is built and sustained.
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
