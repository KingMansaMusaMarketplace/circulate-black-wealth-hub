
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Store, Target, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';

interface GoalMetric {
  icon: React.ReactNode;
  current: number;
  goal: number;
  label: string;
  goalLabel: string;
}

const SocialProofWidget = () => {
  const [stats, setStats] = useState({
    members: 0,
    businesses: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Use RPC function to bypass RLS and get accurate counts
        const { data, error } = await supabase.rpc('get_platform_stats');
        
        if (error) {
          console.error('Error fetching platform stats:', error);
          return;
        }

        if (data) {
          setStats({
            members: data.total_members || 0,
            businesses: data.total_businesses || 0
          });
        }
      } catch (error) {
        console.error('Error fetching social proof stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const metrics: GoalMetric[] = [
    {
      icon: <Users className="h-6 w-6 text-mansablue" />,
      current: stats.members,
      goal: 1000,
      label: "Founding Members",
      goalLabel: "Help us reach 1,000 members"
    },
    {
      icon: <Store className="h-6 w-6 text-mansagold" />,
      current: stats.businesses,
      goal: 100,
      label: "Partner Businesses",
      goalLabel: "Growing to 100 businesses"
    }
  ];

  const getProgressPercentage = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  return (
    <section className="py-12 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          {/* Early Access Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-mansablue/10 border border-mansablue/20 mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Sparkles className="w-4 h-4 text-mansablue" />
            <span className="text-mansablue text-sm font-medium">Early Access • Be a Founder</span>
          </motion.div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Join the Movement
          </h2>
          <p className="text-gray-600">
            Be part of something meaningful from the ground up
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-gray-100">
                      {metric.icon}
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {loading ? (
                          <span className="animate-pulse">--</span>
                        ) : (
                          metric.current
                        )}
                      </div>
                      <div className="text-sm text-gray-600">{metric.label}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{metric.goalLabel}</span>
                      <span>{Math.round(getProgressPercentage(metric.current, metric.goal))}%</span>
                    </div>
                    <Progress 
                      value={getProgressPercentage(metric.current, metric.goal)} 
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 text-center">
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live data</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Verified businesses only</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Community-driven</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProofWidget;
