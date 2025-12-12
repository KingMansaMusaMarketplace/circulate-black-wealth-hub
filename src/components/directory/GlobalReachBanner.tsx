import React from 'react';
import { Globe, MapPin } from 'lucide-react';

const usaStates = ['IL', 'GA', 'TX', 'DC', 'MI', 'NY', 'CA'];

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
    <div className="space-y-3">
      {/* US Coverage Line */}
      <div className="flex items-center gap-3 flex-wrap justify-center">
        <div className="flex items-center gap-2 text-mansagold font-semibold">
          <MapPin className="h-5 w-5" />
          <span>Coverage</span>
        </div>
        <span className="text-white font-medium">{usaStates.length} States</span>
        <span className="text-slate-300">{usaStates.join(', ')}</span>
      </div>
      
      {/* Global Countries Line */}
      <div className="flex items-center gap-3 flex-wrap justify-center">
        <div className="flex items-center gap-2 text-emerald-400 font-semibold">
          <Globe className="h-5 w-5" />
          <span>Expanding Globally</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {globalCountries.map((country, index) => (
            <span key={country.name} className="text-slate-300">
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
