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
    current: 175,
    goal: 100000,
    description: "Black-owned businesses empowered globally through our platform",
    unit: "",
    color: "bg-mansablue"
  },
  {
    id: "circulation",
    label: "Dollars Circulated",
    icon: <DollarSign className="h-5 w-5" />,
    current: 2400000, // $2.4M
    goal: 1000000000, // $1B
    description: "Circulated within Black communities through intentional spending",
    unit: "$",
    color: "bg-mansagold"
  },
  {
    id: "users",
    label: "Active Users",
    icon: <Users className="h-5 w-5" />,
    current: 15000,
    goal: 5000000,
    description: "Users actively participating in the ecosystem",
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
  "2024": [
    "500+ verified businesses on platform",
    "$5M circulation within communities",
    "Launch in 5 major metropolitan areas",
    "First financial education workshop series"
  ],
  "2026": [
    "10,000+ verified businesses on platform",
    "$50M circulation within communities",
    "Launch mobile payment system",
    "Partner with 3 Black-owned banks"
  ],
  "2028": [
    "50,000+ verified businesses on platform",
    "$500M circulation within communities", 
    "Expand to international markets",
    "Introduce business capital funding program"
  ],
  "2030": [
    "100,000+ verified businesses on platform",
    "$1B+ circulation within communities",
    "Complete financial services ecosystem",
    "Measurable wealth increase in Black communities"
  ]
};

const InteractiveVisionTimeline: React.FC = () => {
  const [activeYear, setActiveYear] = useState<string>("2024");
  
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
    <section className="py-20">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="heading-md text-mansablue mb-4">Vision 2030</h2>
          <div className="w-24 h-1 bg-mansagold mx-auto mb-6"></div>
          <div className="flex justify-center items-center gap-2 mb-4">
            <Layers className="h-5 w-5 text-mansagold" />
            <p className="text-lg font-medium text-mansablue-dark">Our Progress Toward Economic Infrastructure</p>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Track our journey towards creating sustainable economic infrastructure and circulation in Black communities.
          </p>
        </div>
        
        {/* Current Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-16">
          {visionMetrics.map((metric) => (
            <Card key={metric.id} className="border-mansagold/20 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-mansablue/10 mr-3">
                      {metric.icon}
                    </div>
                    <h3 className="font-bold">{metric.label}</h3>
                  </div>
                  <span className="text-xs font-medium text-mansablue bg-mansablue/10 px-2 py-1 rounded-full">
                    {calculateProgress(metric.current, metric.goal)}%
                  </span>
                </div>
                
                <div className="mb-2">
                  <Progress 
                    value={calculateProgress(metric.current, metric.goal)} 
                    className={cn("h-2", metric.color)}
                  />
                </div>
                
                <div className="flex justify-between text-sm text-gray-500">
                  <div>Current: <span className="font-bold text-mansablue">{metric.unit}{formatNumber(metric.current)}</span></div>
                  <div>Goal: <span className="font-bold text-mansablue-dark">{metric.unit}{formatNumber(metric.goal)}</span></div>
                </div>
                
                <p className="mt-4 text-sm text-gray-600">
                  {metric.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Year-based milestone tabs */}
        <Card className="border-mansagold/20">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-center mb-6">Milestone Timeline</h3>
            
            <Tabs value={activeYear} onValueChange={setActiveYear}>
              <TabsList className="w-full justify-between mb-8">
                {Object.keys(yearMilestones).map((year) => (
                  <TabsTrigger key={year} value={year} className="flex-1">
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
                    <div className="text-center mb-4">
                      <h3 className="text-2xl font-bold text-mansablue">{year} Milestones</h3>
                      <p className="text-gray-500">
                        Our targets for building economic infrastructure by {year}
                      </p>
                    </div>
                    
                    <ul className="space-y-4">
                      {milestones.map((milestone, i) => (
                        <motion.li 
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="h-8 w-8 rounded-full bg-mansablue text-white flex items-center justify-center">
                            {i + 1}
                          </div>
                          <span className="font-medium">{milestone}</span>
                          {year === "2024" && (
                            <div className="ml-auto">
                              <div className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                In Progress
                              </div>
                            </div>
                          )}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
        
        <div className="mt-12 text-center">
          <Button className="bg-mansablue hover:bg-mansablue-dark text-white px-8 py-2 text-lg">
            Join Our Movement
          </Button>
          <p className="mt-4 text-sm text-gray-600">
            Be part of the solution and help us build economic sovereignty for future generations.
          </p>
        </div>
      </div>
    </section>
  );
};

export default InteractiveVisionTimeline;
