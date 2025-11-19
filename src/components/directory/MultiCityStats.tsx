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
  const totalBusinesses = cities.reduce((sum, city) => sum + city.businesses, 0);
  const avgBusinessesPerCity = Math.round(totalBusinesses / cities.length);

  const stats = selectedCity === 'all' ? [
    {
      icon: <Building2 className="h-5 w-5 text-primary" />,
      label: 'Total Businesses',
      value: totalBusinesses.toLocaleString(),
      description: 'Across all cities'
    },
    {
      icon: <MapPin className="h-5 w-5 text-secondary" />,
      label: 'Active Cities',
      value: cities.length.toString(),
      description: 'Major metropolitan areas'
    },
    {
      icon: <Users className="h-5 w-5 text-accent" />,
      label: 'Average per City',
      value: avgBusinessesPerCity.toString(),
      description: 'Business density'
    },
    {
      icon: <TrendingUp className="h-5 w-5 text-success" />,
      label: 'Network Growth',
      value: '+23%',
      description: 'Month over month'
    }
  ] : [
    {
      icon: <Building2 className="h-5 w-5 text-primary" />,
      label: 'Local Businesses',
      value: selectedCityData?.businesses.toLocaleString() || '0',
      description: `In ${selectedCityData?.name || 'this city'}`
    },
    {
      icon: <MapPin className="h-5 w-5 text-secondary" />,
      label: 'City Rank',
      value: `#${cities.findIndex(city => city.id === selectedCity) + 1}`,
      description: 'By business count'
    },
    {
      icon: <Users className="h-5 w-5 text-accent" />,
      label: 'Market Share',
      value: `${Math.round((selectedCityData?.businesses || 0) / totalBusinesses * 100)}%`,
      description: 'Of total network'
    },
    {
      icon: <TrendingUp className="h-5 w-5 text-success" />,
      label: 'Growth Rate',
      value: '+18%',
      description: 'Monthly growth'
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