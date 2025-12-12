import React from 'react';
import { Globe, MapPin } from 'lucide-react';

const globalCountries = [
  { name: 'Nigeria', flag: '🇳🇬' },
  { name: 'Ghana', flag: '🇬🇭' },
  { name: 'UK', flag: '🇬🇧' },
  { name: 'Jamaica', flag: '🇯🇲' },
  { name: 'Brazil', flag: '🇧🇷' },
  { name: 'South Africa', flag: '🇿🇦' },
];

const GlobalReachBanner: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* USA Line */}
      <div className="flex items-center gap-4 flex-wrap justify-center">
        <div className="flex items-center gap-2 text-mansagold font-bold text-xl">
          <MapPin className="h-6 w-6" />
          <span>USA</span>
        </div>
        <span className="text-slate-300 text-lg">All 50 States</span>
      </div>
      
      {/* Global Countries Line */}
      <div className="flex items-center gap-4 flex-wrap justify-center">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-xl">
          <Globe className="h-6 w-6" />
          <span>Expanding Globally</span>
        </div>
        <div className="flex items-center gap-3 flex-wrap justify-center">
          {globalCountries.map((country, index) => (
            <span key={country.name} className="text-slate-300 text-lg">
              <span className="mr-1">{country.flag}</span>
              {country.name}
              {index < globalCountries.length - 1 && <span className="text-slate-500 ml-2">•</span>}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GlobalReachBanner;
