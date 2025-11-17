
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Users, Calendar } from 'lucide-react';

const ImpactMetricsSection = () => {
  const metricColors = [
    { gradient: 'from-emerald-600 via-teal-600 to-cyan-600', iconBg: 'from-emerald-500/20 to-cyan-500/20', border: 'emerald-300' },
    { gradient: 'from-blue-600 via-indigo-600 to-purple-600', iconBg: 'from-blue-500/20 to-purple-500/20', border: 'blue-300' },
    { gradient: 'from-orange-600 via-red-600 to-pink-600', iconBg: 'from-orange-500/20 to-pink-500/20', border: 'orange-300' }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      
      <div className="container-custom relative z-10">
        <div className="text-center mb-12">
          <h2 className="heading-md mb-4">
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">Our Goals for </span>
            <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">2026</span>
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent"> with your help</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg bg-gradient-to-r from-gray-700 to-gray-600 bg-clip-text text-transparent max-w-2xl mx-auto font-medium">
            We measure our success by the economic impact we create within Black communities.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {[
            { icon: TrendingUp, value: "$2.4M", text: "Dollars circulated through Black businesses via our platform" },
            { icon: Users, value: "175+", text: "Black-owned businesses enrolled and benefiting" },
            { icon: Calendar, value: "72 hrs", text: "Average circulation time of the Black dollar in our ecosystem (vs. 6 hours nationally)" }
          ].map((metric, idx) => {
            const Icon = metric.icon;
            const colors = metricColors[idx];
            return (
              <Card key={idx} className={`border-2 border-${colors.border} bg-white/80 backdrop-blur-sm card-hover hover:shadow-2xl transition-all duration-300 hover:scale-105`}>
                <CardContent className="p-8 flex flex-col items-center text-center">
                  <div className={`bg-gradient-to-br ${colors.iconBg} p-5 rounded-2xl mb-4 shadow-lg`}>
                    <Icon className={`h-10 w-10 bg-gradient-to-br ${colors.gradient} bg-clip-text text-transparent`} style={{ WebkitTextFillColor: 'transparent', WebkitBackgroundClip: 'text', backgroundClip: 'text' }} />
                  </div>
                  <div className={`text-5xl font-bold bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent mb-3`}>
                    {metric.value}
                  </div>
                  <p className="text-gray-700 font-medium leading-relaxed">{metric.text}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="bg-gradient-to-br from-white/90 to-cyan-50/50 backdrop-blur-sm rounded-2xl p-8 border-2 border-cyan-200 shadow-xl">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                Looking Forward: 2026 Goals
              </h3>
              <ul className="space-y-4">
                {[
                  "Increase circulation time to 1 week average",
                  "Enroll 500+ businesses across 10 major cities",
                  "Facilitate $10M in Black business transactions"
                ].map((goal, idx) => (
                  <li key={idx} className="flex items-center group">
                    <div className="h-3 w-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 mr-3 group-hover:scale-125 transition-transform shadow-md"></div>
                    <span className="text-gray-800 font-medium group-hover:text-cyan-700 transition-colors">{goal}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl p-8 shadow-xl border-2 border-purple-200 w-full hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="text-center">
                  <div className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                    Community Investment Score
                  </div>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
                      9.4
                    </span>
                    <span className="text-2xl text-gray-500 font-semibold">/10</span>
                  </div>
                  <div className="w-full bg-gray-200 h-3 rounded-full mb-4 overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 h-3 rounded-full shadow-md animate-pulse" style={{ width: '94%' }}></div>
                  </div>
                  <p className="text-sm text-gray-700 font-medium">
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
