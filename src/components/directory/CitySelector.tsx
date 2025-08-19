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

export const cities: City[] = [
  { id: 'chicago', name: 'Chicago', state: 'IL', businesses: 250, featured: true },
  { id: 'atlanta', name: 'Atlanta', state: 'GA', businesses: 180, featured: true },
  { id: 'houston', name: 'Houston', state: 'TX', businesses: 165, featured: true },
  { id: 'washington-dc', name: 'Washington', state: 'DC', businesses: 135, featured: true },
  { id: 'detroit', name: 'Detroit', state: 'MI', businesses: 95, featured: true },
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