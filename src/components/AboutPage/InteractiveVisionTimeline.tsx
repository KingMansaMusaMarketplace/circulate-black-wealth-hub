import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Layers, TrendingUp, Users, Building, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const visionMetrics = [
  {
    id: "businesses",
    label: "Businesses Onboarded",
    icon: <Building className="h-5 w-5" />,
    current: 25,
    goal: 100000,
    description: "Black-owned businesses empowered globally through our platform",
    unit: "",
    color: "bg-mansablue"
  },
  {
    id: "circulation",
    label: "Dollars Circulated",
    icon: <DollarSign className="h-5 w-5" />,
    current: 50000, // $50K
    goal: 1000000000, // $1B
    description: "Circulated within Black communities through intentional spending",
    unit: "$",
    color: "bg-mansagold"
  },
  {
    id: "users",
    label: "Growing Our Community",
    icon: <Users className="h-5 w-5" />,
    current: 0,
    goal: 1000000,
    description: "Help us reach 1 million members building wealth together",
    unit: "",
    color: "bg-green-500"
  },
  {
    id: "circulation-time",
    label: "Circulation Time",
    icon: <TrendingUp className="h-5 w-5" />,
    current: 72,
    goal: 168,
    description: "Average hours the Black dollar circulates in our ecosystem (vs 6 hours nationally)",
    unit: "hrs",
    color: "bg-purple-500"
  }
];

const yearMilestones = {
  "2025": [
    "500+ verified businesses on platform",
    "$5M circulation within communities",
    "Launch in 5 major metropolitan areas",
    "First financial education workshop series"
  ],
  "2027": [
    "10,000+ verified businesses on platform",
    "$50M circulation within communities",
    "Launch mobile payment system",
    "Partner with 3 Black-owned banks"
  ],
  "2029": [
    "50,000+ verified businesses on platform",
    "$500M circulation within communities", 
    "Expand to international markets",
    "Introduce business capital funding program"
  ],
  "2031": [
    "100,000+ verified businesses on platform",
    "$1B+ circulation within communities",
    "Complete financial services ecosystem",
    "Measurable wealth increase in Black communities"
  ]
};

const InteractiveVisionTimeline: React.FC = () => {
  const [activeYear, setActiveYear] = useState<string>("2025");
  
  const calculateProgress = (current: number, goal: number) => {
    return Math.min(100, Math.round((current / goal) * 100));
  };
  
  const formatNumber = (num: number) => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1) + 'B';
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <section className="py-20 bg-transparent">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="heading-md mb-4 bg-gradient-to-r from-blue-400 via-mansagold to-amber-400 bg-clip-text text-transparent font-extrabold">Vision 2031</h2>
          <div className="w-28 h-1 bg-gradient-to-r from-mansagold via-amber-500 to-yellow-500 mx-auto mb-6 rounded-full shadow-md"></div>
          <div className="flex justify-center items-center gap-2 mb-4">
            <Layers className="h-6 w-6 text-mansagold" />
            <p className="text-lg font-bold text-blue-100/90">Our Progress Toward Economic Infrastructure</p>
          </div>
          <p className="text-blue-200/80 max-w-2xl mx-auto font-medium">
            Track our journey towards creating sustainable economic infrastructure and circulation in Black communities.
          </p>
        </div>
        
        {/* Current Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-16">
          {visionMetrics.map((metric, index) => {
            const gradients = [
              'from-blue-500 to-cyan-500',
              'from-amber-500 to-orange-500', 
              'from-green-500 to-emerald-500',
              'from-purple-500 to-pink-500'
            ];
            const borderColors = [
              'border-blue-400/30 hover:border-blue-400/60',
              'border-amber-400/30 hover:border-amber-400/60',
              'border-green-400/30 hover:border-green-400/60',
              'border-purple-400/30 hover:border-purple-400/60'
            ];
            return (
              <Card key={metric.id} className={`border-2 ${borderColors[index]} hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-slate-800/60 backdrop-blur-xl`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className={`p-3 rounded-full bg-gradient-to-br ${gradients[index]} shadow-md`}>
                        <div className="text-white">{metric.icon}</div>
                      </div>
                      <h3 className="font-bold ml-3 text-white">{metric.label}</h3>
                    </div>
                    <span className={`text-xs font-bold bg-gradient-to-r ${gradients[index]} text-white px-3 py-1.5 rounded-full shadow-sm`}>
                      {calculateProgress(metric.current, metric.goal)}%
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <Progress 
                      value={calculateProgress(metric.current, metric.goal)} 
                      className={cn("h-3 rounded-full overflow-hidden bg-slate-700")}
                      style={{
                        background: `linear-gradient(to right, ${gradients[index].split(' ').map(c => c.replace('from-', '').replace('to-', '')).join(', ')})`
                      }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-sm font-medium mb-4">
                    <div className="text-blue-200/80">Current: <span className={`font-extrabold bg-gradient-to-r ${gradients[index]} bg-clip-text text-transparent`}>{metric.unit}{formatNumber(metric.current)}</span></div>
                    <div className="text-blue-200/80">Goal: <span className="font-extrabold text-mansagold">{metric.unit}{formatNumber(metric.goal)}</span></div>
                  </div>
                  
                  <p className="text-sm text-blue-200/70 font-medium leading-relaxed">
                    {metric.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {/* Year-based milestone tabs */}
        <Card className="border-2 border-white/10 hover:border-mansagold/50 shadow-xl transition-all duration-300 bg-slate-800/60 backdrop-blur-xl">
          <CardContent className="p-8">
            <h3 className="text-2xl font-extrabold text-center mb-8 text-white">Milestone Timeline</h3>
            
            <Tabs value={activeYear} onValueChange={setActiveYear}>
              <TabsList className="w-full justify-between mb-10 bg-slate-700/60 p-1 rounded-xl">
                {Object.keys(yearMilestones).map((year) => (
                  <TabsTrigger 
                    key={year} 
                    value={year} 
                    className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-mansagold data-[state=active]:to-amber-500 data-[state=active]:text-mansablue text-blue-200/80 font-bold text-lg rounded-lg transition-all duration-300"
                  >
                    {year}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {Object.entries(yearMilestones).map(([year, milestones]) => (
                <TabsContent key={year} value={year}>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-extrabold text-mansagold">{year} Milestones</h3>
                      <p className="text-blue-200/80 font-medium mt-2">
                        Our targets for building economic infrastructure by {year}
                      </p>
                    </div>
                    
                    <ul className="space-y-4">
                      {milestones.map((milestone, i) => {
                        const gradients = [
                          'from-blue-500 to-cyan-500',
                          'from-amber-500 to-orange-500',
                          'from-green-500 to-emerald-500',
                          'from-purple-500 to-pink-500'
                        ];
                        return (
                          <motion.li 
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center gap-4 p-5 bg-slate-700/40 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-2 border-white/10 hover:border-mansagold/30"
                          >
                            <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${gradients[i % gradients.length]} text-white flex items-center justify-center font-bold shadow-md`}>
                              {i + 1}
                            </div>
                            <span className="font-semibold text-blue-100/90 flex-1">{milestone}</span>
                            {year === "2025" && (
                              <div className="ml-auto">
                                <div className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-500/20 text-green-300 border border-green-400/30">
                                  In Progress
                                </div>
                              </div>
                            )}
                          </motion.li>
                        );
                      })}
                    </ul>
                  </motion.div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
        
        <div className="mt-12 text-center">
          <Button className="bg-gradient-to-r from-mansagold to-amber-500 hover:from-mansagold/90 hover:to-amber-500/90 text-mansablue px-8 py-2 text-lg font-bold">
            Join Our Movement
          </Button>
          <p className="mt-4 text-sm text-blue-200/70">
            Be part of the solution and help us build economic sovereignty for future generations.
          </p>
        </div>
      </div>
    </section>
  );
};

export default InteractiveVisionTimeline;
