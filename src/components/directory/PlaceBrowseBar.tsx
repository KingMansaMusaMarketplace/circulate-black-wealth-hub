import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { MapPin, X } from 'lucide-react';
import { getCountryName, getStateName, getRegionForState, US_REGIONS } from '@/data/categoryGroups';

interface PlaceBrowseBarProps {
  countries: { country: string; count: number }[];
  states: { state: string; count: number }[];
  cities: { city: string; state: string; count: number }[];
  country?: string;
  stateCode?: string;
  city?: string;
  onCountryChange: (v?: string) => void;
  onStateChange: (v?: string) => void;
  onCityChange: (v?: string) => void;
  onClear: () => void;
}

const ALL = '__all__';

const PlaceBrowseBar: React.FC<PlaceBrowseBarProps> = ({
  countries,
  states,
  cities,
  country,
  stateCode,
  city,
  onCountryChange,
  onStateChange,
  onCityChange,
  onClear,
}) => {
  const hasPlace = Boolean(country || stateCode || city);

  // Group US states by region so 50 states stay scannable
  const groupedStates = React.useMemo(() => {
    if (country && country !== 'US') {
      return [{ region: 'All', items: states }];
    }
    return US_REGIONS
      .map(r => ({
        region: r.name,
        items: states.filter(s => getRegionForState(s.state) === r.name),
      }))
      .filter(r => r.items.length > 0)
      .concat([
        {
          region: 'Other',
          items: states.filter(s => !getRegionForState(s.state)),
        },
      ])
      .filter(r => r.items.length > 0);
  }, [states, country]);

  return (
    <div className="mb-6 rounded-xl border border-white/10 bg-slate-900/40 p-3">
      <div className="flex items-center gap-2 mb-2">
        <MapPin className="h-4 w-4 text-mansagold" />
        <span className="text-white text-sm font-medium">Browse by place</span>
        {hasPlace && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="ml-auto h-7 px-2 text-gray-300 hover:text-mansagold"
          >
            <X className="h-3.5 w-3.5 mr-1" /> Clear
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <Select
          value={country || ALL}
          onValueChange={(v) => onCountryChange(v === ALL ? undefined : v)}
        >
          <SelectTrigger className="bg-slate-950/60 border-white/15 text-white h-11">
            <SelectValue placeholder="All countries" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-white/15 text-white max-h-72">
            <SelectItem value={ALL}>All countries</SelectItem>
            {countries.map(c => (
              <SelectItem key={c.country} value={c.country}>
                {getCountryName(c.country)} ({c.count.toLocaleString()})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={stateCode || ALL}
          onValueChange={(v) => onStateChange(v === ALL ? undefined : v)}
        >
          <SelectTrigger className="bg-slate-950/60 border-white/15 text-white h-11">
            <SelectValue placeholder="All states / regions" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-white/15 text-white max-h-72">
            <SelectItem value={ALL}>All states / regions</SelectItem>
            {groupedStates.map(group => (
              <React.Fragment key={group.region}>
                {group.region !== 'All' && (
                  <div className="px-2 py-1 text-[11px] uppercase tracking-wider text-mansagold/80">
                    {group.region}
                  </div>
                )}
                {group.items.map(s => (
                  <SelectItem key={s.state} value={s.state}>
                    {getStateName(s.state)} ({s.count.toLocaleString()})
                  </SelectItem>
                ))}
              </React.Fragment>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={city || ALL}
          onValueChange={(v) => onCityChange(v === ALL ? undefined : v)}
        >
          <SelectTrigger className="bg-slate-950/60 border-white/15 text-white h-11">
            <SelectValue placeholder="All cities" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-white/15 text-white max-h-72">
            <SelectItem value={ALL}>All cities</SelectItem>
            {cities.map(c => (
              <SelectItem key={`${c.city}-${c.state}`} value={c.city}>
                {c.city}{c.state ? `, ${c.state}` : ''} ({c.count.toLocaleString()})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default PlaceBrowseBar;
