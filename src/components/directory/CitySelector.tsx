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
        <MapPin size={16} className="text-primary" />
        <label className="text-sm font-medium text-foreground">Select City</label>
        {selectedCityData && showBusinessCount && (
          <Badge variant="outline" className="ml-auto">
            {selectedCityData.businesses} businesses
          </Badge>
        )}
      </div>
      
      <Select value={selectedCity} onValueChange={onCityChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Choose a city">
            {selectedCityData && (
              <div className="flex items-center gap-2">
                <span>{selectedCityData.name}, {selectedCityData.state}</span>
                {selectedCityData.featured && (
                  <Badge variant="secondary" className="text-xs">Featured</Badge>
                )}
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Cities</SelectItem>
          {cities.map((city) => (
            <SelectItem key={city.id} value={city.id}>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <span>{city.name}, {city.state}</span>
                  {city.featured && (
                    <Badge variant="secondary" className="text-xs">Featured</Badge>
                  )}
                </div>
                {showBusinessCount && (
                  <span className="text-sm text-muted-foreground ml-2">
                    {city.businesses} businesses
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