import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Building2, Users, TrendingUp } from 'lucide-react';
import { cities } from './CitySelector';

interface MultiCityStatsProps {
  selectedCity: string;
}

const MultiCityStats: React.FC<MultiCityStatsProps> = ({ selectedCity }) => {
  const selectedCityData = cities.find(city => city.id === selectedCity);

  // These are honest stats - showing launch cities and growth potential
  const stats = selectedCity === 'all' ? [
    {
      icon: <Building2 className="h-5 w-5 text-primary" />,
      label: 'Launch Cities',
      value: cities.length.toString(),
      description: 'Growing network'
    },
    {
      icon: <MapPin className="h-5 w-5 text-secondary" />,
      label: 'Coverage',
      value: '5 States',
      description: 'IL, GA, TX, DC, MI'
    },
    {
      icon: <Users className="h-5 w-5 text-accent" />,
      label: 'Status',
      value: 'Beta',
      description: 'Onboarding businesses'
    },
    {
      icon: <TrendingUp className="h-5 w-5 text-success" />,
      label: 'Goal',
      value: '10,000',
      description: 'Businesses by 2027'
    }
  ] : [
    {
      icon: <Building2 className="h-5 w-5 text-primary" />,
      label: 'City',
      value: selectedCityData?.name || 'Unknown',
      description: selectedCityData?.state || ''
    },
    {
      icon: <MapPin className="h-5 w-5 text-secondary" />,
      label: 'Status',
      value: 'Active',
      description: 'Now accepting businesses'
    },
    {
      icon: <Users className="h-5 w-5 text-accent" />,
      label: 'Featured',
      value: selectedCityData?.featured ? 'Yes' : 'No',
      description: 'Priority market'
    },
    {
      icon: <TrendingUp className="h-5 w-5 text-success" />,
      label: 'Join Now',
      value: 'Free',
      description: 'Early adopter benefits'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <Card key={index} className="border border-white/10 bg-slate-800/60 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {stat.icon}
                <span className="text-sm font-medium text-slate-300">{stat.label}</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <p className="text-xs text-slate-400">{stat.description}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MultiCityStats;