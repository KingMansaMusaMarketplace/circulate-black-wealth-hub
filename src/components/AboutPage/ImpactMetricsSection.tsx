
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Users, Calendar } from 'lucide-react';

const ImpactMetricsSection = () => {
  const metricColors = [
    { gradient: 'from-mansagold via-amber-500 to-yellow-500', iconBg: 'from-mansagold/20 to-amber-500/20', border: 'amber-300' },
    { gradient: 'from-mansablue via-blue-600 to-blue-700', iconBg: 'from-blue-500/20 to-mansablue/20', border: 'blue-300' },
    { gradient: 'from-blue-600 via-mansablue to-blue-800', iconBg: 'from-blue-500/20 to-blue-700/20', border: 'blue-400' }
  ];

  return (
    <section className="py-20 bg-transparent relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-80 h-80 bg-gradient-to-br from-mansablue/15 to-blue-500/15 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-gradient-to-br from-mansagold/15 to-amber-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      
      <div className="container-custom relative z-10">
        <div className="text-center mb-12">
          <h2 className="heading-md mb-4">
            <span className="bg-gradient-to-r from-mansagold via-amber-500 to-yellow-500 bg-clip-text text-transparent">Our Goals for </span>
            <span className="bg-gradient-to-r from-blue-400 via-mansagold to-amber-400 bg-clip-text text-transparent">2026</span>
            <span className="bg-gradient-to-r from-mansagold via-amber-500 to-yellow-500 bg-clip-text text-transparent"> with your help</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-mansablue via-blue-600 to-mansagold mx-auto mb-6 rounded-full"></div>
          <p className="text-lg text-blue-100/90 max-w-2xl mx-auto font-medium">
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
              <Card key={idx} className={`border-2 border-white/10 bg-slate-800/60 backdrop-blur-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:border-mansagold/50`}>
                <CardContent className="p-8 flex flex-col items-center text-center">
                  <div className={`bg-gradient-to-br ${colors.iconBg} p-5 rounded-2xl mb-4 shadow-lg`}>
                    <Icon className="h-10 w-10 text-mansagold" />
                  </div>
                  <div className={`text-5xl font-bold bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent mb-3`}>
                    {metric.value}
                  </div>
                  <p className="text-blue-100/90 font-medium leading-relaxed">{metric.text}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="bg-slate-800/60 backdrop-blur-xl rounded-2xl p-8 border-2 border-white/10 shadow-xl">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-mansagold mb-6">
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
                    <span className="text-blue-100/90 font-medium group-hover:text-mansagold transition-colors">{goal}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="bg-slate-700/40 backdrop-blur-sm rounded-2xl p-8 shadow-xl border-2 border-white/10 w-full hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="text-center">
                  <div className="text-sm font-semibold text-blue-200/80 mb-3">
                    Community Investment Score
                  </div>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="text-6xl font-bold bg-gradient-to-r from-mansagold via-amber-500 to-yellow-500 bg-clip-text text-transparent">
                      9.4
                    </span>
                    <span className="text-2xl text-blue-200/70 font-semibold">/10</span>
                  </div>
                  <div className="w-full bg-slate-600 h-3 rounded-full mb-4 overflow-hidden">
                    <div className="bg-gradient-to-r from-mansagold via-amber-500 to-yellow-500 h-3 rounded-full shadow-md animate-pulse" style={{ width: '94%' }}></div>
                  </div>
                  <p className="text-sm text-blue-200/70 font-medium">
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
