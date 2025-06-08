
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Building2,
  Target,
  Zap,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';

interface EconomicMetrics {
  totalCirculation: number;
  businessesSupported: number;
  communityMembers: number;
  averageSavings: number;
  circulationMultiplier: number;
  monthlyGrowth: number;
  yearOverYearGrowth: number;
}

interface CirculationData {
  month: string;
  circulation: number;
  businesses: number;
  members: number;
}

interface ImpactCategory {
  category: string;
  impact: number;
  color: string;
}

const EconomicImpactDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<EconomicMetrics>({
    totalCirculation: 1247600,
    businessesSupported: 342,
    communityMembers: 2847,
    averageSavings: 437,
    circulationMultiplier: 2.3,
    monthlyGrowth: 12.4,
    yearOverYearGrowth: 156.8
  });

  const [circulationData] = useState<CirculationData[]>([
    { month: 'Jan', circulation: 780000, businesses: 180, members: 1200 },
    { month: 'Feb', circulation: 845000, businesses: 195, members: 1450 },
    { month: 'Mar', circulation: 920000, businesses: 215, members: 1680 },
    { month: 'Apr', circulation: 985000, businesses: 240, members: 1920 },
    { month: 'May', circulation: 1050000, businesses: 265, members: 2150 },
    { month: 'Jun', circulation: 1125000, businesses: 295, members: 2450 },
    { month: 'Jul', circulation: 1180000, businesses: 315, members: 2650 },
    { month: 'Aug', circulation: 1247600, businesses: 342, members: 2847 }
  ]);

  const [impactCategories] = useState<ImpactCategory[]>([
    { category: 'Restaurants', impact: 28, color: '#FF6B6B' },
    { category: 'Retail', impact: 24, color: '#4ECDC4' },
    { category: 'Services', impact: 22, color: '#45B7D1' },
    { category: 'Tech', impact: 15, color: '#96CEB4' },
    { category: 'Health', impact: 11, color: '#FFEAA7' }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getTrendIcon = (value: number) => {
    if (value > 0) return <ArrowUp className="h-4 w-4 text-green-500" />;
    if (value < 0) return <ArrowDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  const getTrendColor = (value: number) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Economic Impact Dashboard</h1>
        <p className="text-gray-600">Tracking the circulation and growth of Black economic power</p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Total Circulation</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-2">
                {formatCurrency(metrics.totalCirculation)}
              </div>
              <div className="flex items-center text-sm">
                {getTrendIcon(metrics.monthlyGrowth)}
                <span className={`ml-1 ${getTrendColor(metrics.monthlyGrowth)}`}>
                  {metrics.monthlyGrowth}% from last month
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Businesses Supported</CardTitle>
                <Building2 className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-2">
                {formatNumber(metrics.businessesSupported)}
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                +47 this month
              </Badge>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Community Members</CardTitle>
                <Users className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-2">
                {formatNumber(metrics.communityMembers)}
              </div>
              <div className="flex items-center text-sm">
                {getTrendIcon(15.2)}
                <span className="ml-1 text-green-600">15.2% growth rate</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Avg. Member Savings</CardTitle>
                <Target className="h-4 w-4 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-2">
                {formatCurrency(metrics.averageSavings)}
              </div>
              <div className="text-sm text-gray-600">per member annually</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Circulation Multiplier */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-gradient-to-r from-mansablue to-mansablue-dark text-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Circulation Multiplier Effect</CardTitle>
                <CardDescription className="text-blue-100">
                  Every dollar spent creates additional economic impact
                </CardDescription>
              </div>
              <Zap className="h-8 w-8 text-mansagold" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="text-4xl font-bold text-mansagold">
                {metrics.circulationMultiplier}x
              </div>
              <div className="flex-1">
                <div className="text-sm text-blue-100 mb-2">
                  Impact: ${formatCurrency(metrics.totalCirculation * metrics.circulationMultiplier)}
                </div>
                <Progress 
                  value={(metrics.circulationMultiplier / 5) * 100} 
                  className="bg-blue-800"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Circulation Growth Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Economic Circulation Growth</CardTitle>
              <CardDescription>Monthly circulation volume over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={circulationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#666" />
                  <YAxis 
                    stroke="#666"
                    tickFormatter={(value) => `$${(value / 1000)}k`}
                  />
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), 'Circulation']}
                    labelStyle={{ color: '#333' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="circulation" 
                    stroke="#2563eb" 
                    strokeWidth={3}
                    dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#2563eb', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Impact by Category */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Impact by Business Category</CardTitle>
              <CardDescription>Distribution of economic impact across sectors</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={impactCategories}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="impact"
                    label={({ category, impact }) => `${category}: ${impact}%`}
                  >
                    {impactCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Growth Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Community Growth Metrics</CardTitle>
            <CardDescription>Tracking membership and business participation over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={circulationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  formatter={(value: number, name: string) => {
                    const label = name === 'businesses' ? 'Businesses' : 'Members';
                    return [formatNumber(value), label];
                  }}
                  labelStyle={{ color: '#333' }}
                />
                <Bar dataKey="businesses" fill="#3B82F6" name="businesses" />
                <Bar dataKey="members" fill="#10B981" name="members" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Year over Year Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Annual Growth Summary</CardTitle>
            <CardDescription>Year-over-year performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  +{metrics.yearOverYearGrowth}%
                </div>
                <div className="text-sm text-green-700">Total Economic Impact</div>
              </div>
              
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  +89%
                </div>
                <div className="text-sm text-blue-700">New Business Partnerships</div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  +124%
                </div>
                <div className="text-sm text-purple-700">Community Membership</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default EconomicImpactDashboard;
