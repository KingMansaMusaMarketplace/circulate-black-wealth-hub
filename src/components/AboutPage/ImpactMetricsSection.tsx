
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Users, Calendar } from 'lucide-react';

const ImpactMetricsSection = () => {
  return (
    <section className="py-20">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="heading-md text-mansablue mb-4">Our Impact So Far</h2>
          <div className="w-24 h-1 bg-mansagold mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We measure our success by the economic impact we create within Black communities.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="border-mansagold/20 card-hover">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="bg-mansablue/10 p-4 rounded-full mb-4">
                <TrendingUp className="h-8 w-8 text-mansablue" />
              </div>
              <div className="text-4xl font-bold text-mansablue mb-2">$2.4M</div>
              <p className="text-gray-600">Dollars circulated through Black businesses via our platform</p>
            </CardContent>
          </Card>

          <Card className="border-mansagold/20 card-hover">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="bg-mansablue/10 p-4 rounded-full mb-4">
                <Users className="h-8 w-8 text-mansablue" />
              </div>
              <div className="text-4xl font-bold text-mansablue mb-2">175+</div>
              <p className="text-gray-600">Black-owned businesses enrolled and benefiting</p>
            </CardContent>
          </Card>

          <Card className="border-mansagold/20 card-hover">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="bg-mansablue/10 p-4 rounded-full mb-4">
                <Calendar className="h-8 w-8 text-mansablue" />
              </div>
              <div className="text-4xl font-bold text-mansablue mb-2">72 hrs</div>
              <p className="text-gray-600">Average circulation time of the Black dollar in our ecosystem (vs. 6 hours nationally)</p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-gray-50 rounded-xl p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-mansablue-dark mb-4">Looking Forward: 2025 Goals</h3>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-mansagold mr-2"></div>
                  <span className="text-gray-700">Increase circulation time to 1 week average</span>
                </li>
                <li className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-mansagold mr-2"></div>
                  <span className="text-gray-700">Enroll 500+ businesses across 10 major cities</span>
                </li>
                <li className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-mansagold mr-2"></div>
                  <span className="text-gray-700">Facilitate $10M in Black business transactions</span>
                </li>
              </ul>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100 w-full">
                <div className="text-center">
                  <div className="text-sm text-gray-500 mb-2">Community Investment Score</div>
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-4xl font-bold text-mansablue">9.4</span>
                    <span className="text-lg text-gray-500">/10</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full mt-2 mb-4">
                    <div className="bg-mansablue h-2 rounded-full" style={{ width: '94%' }}></div>
                  </div>
                  <p className="text-xs text-gray-600">
                    Rated by independent community impact assessment
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactMetricsSection;
