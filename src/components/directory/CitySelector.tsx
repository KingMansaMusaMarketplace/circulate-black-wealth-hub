import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface City {
  id: string;
  name: string;
  state: string;
  businesses: number;
  featured?: boolean;
}

// Note: Business counts are placeholders - real counts will come from database
export const cities: City[] = [
  { id: 'chicago', name: 'Chicago', state: 'IL', businesses: 0, featured: true },
  { id: 'atlanta', name: 'Atlanta', state: 'GA', businesses: 0, featured: true },
  { id: 'houston', name: 'Houston', state: 'TX', businesses: 0, featured: true },
  { id: 'washington-dc', name: 'Washington', state: 'DC', businesses: 0, featured: true },
  { id: 'detroit', name: 'Detroit', state: 'MI', businesses: 0, featured: true },
  { id: 'new-york', name: 'New York', state: 'NY', businesses: 0, featured: true },
  { id: 'los-angeles', name: 'Los Angeles', state: 'CA', businesses: 0, featured: true },
  { id: 'memphis', name: 'Memphis', state: 'TN', businesses: 0 },
  { id: 'baltimore', name: 'Baltimore', state: 'MD', businesses: 0 },
  { id: 'new-orleans', name: 'New Orleans', state: 'LA', businesses: 0 },
  { id: 'birmingham', name: 'Birmingham', state: 'AL', businesses: 0 },
  { id: 'philadelphia', name: 'Philadelphia', state: 'PA', businesses: 0 },
  { id: 'miami', name: 'Miami', state: 'FL', businesses: 0 },
  { id: 'charlotte', name: 'Charlotte', state: 'NC', businesses: 0 },
  { id: 'dallas', name: 'Dallas', state: 'TX', businesses: 0 },
  { id: 'st-louis', name: 'St. Louis', state: 'MO', businesses: 0 },
  { id: 'cleveland', name: 'Cleveland', state: 'OH', businesses: 0 },
];

interface CitySelectorProps {
  selectedCity: string;
  onCityChange: (cityId: string) => void;
  showBusinessCount?: boolean;
}

const CitySelector: React.FC<CitySelectorProps> = ({ 
  selectedCity, 
  onCityChange,
  showBusinessCount = true 
}) => {
  const selectedCityData = cities.find(city => city.id === selectedCity);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <MapPin size={16} className="text-mansagold" />
        <label className="text-sm font-medium text-gray-200">Select City</label>
        {selectedCityData && showBusinessCount && selectedCityData.businesses > 0 && (
          <Badge variant="outline" className="ml-auto bg-mansagold/10 text-mansagold border-mansagold/30">
            {selectedCityData.businesses} businesses
          </Badge>
        )}
      </div>
      
      <Select value={selectedCity} onValueChange={onCityChange}>
        <SelectTrigger className="w-full bg-slate-800/70 border-white/10 text-white hover:border-mansagold/40 transition-colors">
          <SelectValue placeholder="Choose a city">
            {selectedCityData && (
              <div className="flex items-center gap-2">
                <span>{selectedCityData.name}, {selectedCityData.state}</span>
                {selectedCityData.featured && (
                  <Badge variant="secondary" className="text-xs bg-mansagold/20 text-mansagold border-mansagold/30">Featured</Badge>
                )}
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-slate-900 border-white/10 text-white max-h-80">
          <SelectItem value="all">All Cities</SelectItem>
          {cities.map((city) => (
            <SelectItem key={city.id} value={city.id}>
              <div className="flex items-center justify-between w-full gap-3">
                <div className="flex items-center gap-2">
                  <span>{city.name}, {city.state}</span>
                  {city.featured && (
                    <Badge variant="secondary" className="text-xs bg-mansagold/20 text-mansagold border-mansagold/30">Featured</Badge>
                  )}
                </div>
                {showBusinessCount && city.businesses > 0 && (
                  <span className="text-xs text-gray-400 ml-2">
                    {city.businesses}
                  </span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CitySelector;