
import React from 'react';
import { Minus, Plus, User, Baby, Dog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface GuestCounts {
  adults: number;
  children: number;
  pets: number;
}

interface GuestCounterProps {
  value: GuestCounts;
  onChange: (counts: GuestCounts) => void;
  maxGuests: number;
  petsAllowed: boolean;
  className?: string;
}

const GuestCounter: React.FC<GuestCounterProps> = ({
  value,
  onChange,
  maxGuests,
  petsAllowed,
  className,
}) => {
  const totalGuests = value.adults + value.children;

  const updateCount = (field: keyof GuestCounts, delta: number) => {
    const newValue = { ...value };
    const newCount = Math.max(0, newValue[field] + delta);

    if (field === 'adults' || field === 'children') {
      const otherField = field === 'adults' ? 'children' : 'adults';
      if (newCount + newValue[otherField] > maxGuests) return;
      if (field === 'adults' && newCount < 1) return; // At least 1 adult
    }

    if (field === 'pets' && !petsAllowed) return;

    newValue[field] = newCount;
    onChange(newValue);
  };

  const formatGuestLabel = () => {
    const parts: string[] = [];
    if (totalGuests === 1) {
      parts.push('1 guest');
    } else {
      parts.push(`${totalGuests} guests`);
    }
    if (value.pets > 0) {
      parts.push(`${value.pets} pet${value.pets !== 1 ? 's' : ''}`);
    }
    return parts.join(', ');
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-between text-left font-normal border-white/20 bg-slate-800/50 text-white hover:bg-slate-700',
            className
          )}
        >
          <span>{formatGuestLabel()}</span>
          <User className="w-4 h-4 text-white/60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-slate-900 border-white/20" align="start">
        <div className="space-y-4">
          {/* Adults */}
          <CounterRow
            icon={<User className="w-5 h-5" />}
            label="Adults"
            description="Ages 13 or above"
            value={value.adults}
            min={1}
            max={maxGuests - value.children}
            onIncrement={() => updateCount('adults', 1)}
            onDecrement={() => updateCount('adults', -1)}
          />

          {/* Children */}
          <CounterRow
            icon={<Baby className="w-5 h-5" />}
            label="Children"
            description="Ages 2-12"
            value={value.children}
            min={0}
            max={maxGuests - value.adults}
            onIncrement={() => updateCount('children', 1)}
            onDecrement={() => updateCount('children', -1)}
          />

          {/* Pets */}
          {petsAllowed && (
            <CounterRow
              icon={<Dog className="w-5 h-5" />}
              label="Pets"
              description="Service animals are always welcome"
              value={value.pets}
              min={0}
              max={3}
              onIncrement={() => updateCount('pets', 1)}
              onDecrement={() => updateCount('pets', -1)}
            />
          )}

          {!petsAllowed && (
            <p className="text-sm text-white/60">
              This property doesn't allow pets. Service animals are always welcome.
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

interface CounterRowProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  value: number;
  min: number;
  max: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

const CounterRow: React.FC<CounterRowProps> = ({
  icon,
  label,
  description,
  value,
  min,
  max,
  onIncrement,
  onDecrement,
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="text-mansagold">{icon}</div>
        <div>
          <p className="font-medium text-sm text-white">{label}</p>
          <p className="text-xs text-white/60">{description}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full border-white/20 text-white hover:bg-slate-700"
          disabled={value <= min}
          onClick={onDecrement}
        >
          <Minus className="w-4 h-4" />
        </Button>
        <span className="w-6 text-center font-medium text-white">{value}</span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full border-white/20 text-white hover:bg-slate-700"
          disabled={value >= max}
          onClick={onIncrement}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default GuestCounter;
