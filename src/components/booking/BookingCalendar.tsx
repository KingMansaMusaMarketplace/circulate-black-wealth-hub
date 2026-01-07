import { useState } from 'react';
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isBefore, startOfDay } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BookingCalendarProps {
  availableDates: Date[];
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  loading?: boolean;
}

export function BookingCalendar({ 
  availableDates, 
  selectedDate, 
  onSelectDate,
  loading = false
}: BookingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Calculate padding for the first day
  const startDay = getDay(monthStart);
  const paddingDays = Array(startDay).fill(null);
  
  const today = startOfDay(new Date());

  const isDateAvailable = (date: Date): boolean => {
    return availableDates.some(d => isSameDay(d, date));
  };

  const isDatePast = (date: Date): boolean => {
    return isBefore(date, today);
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mansagold"></div>
      </div>
    );
  }

  if (availableDates.length === 0) {
    return (
      <div className="text-center py-8">
        <Calendar className="w-12 h-12 mx-auto mb-3 text-white/40" />
        <p className="text-white/70">No available booking dates</p>
        <p className="text-sm text-white/50 mt-1">
          This business hasn't set their availability yet
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="text-white hover:bg-white/10"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <h3 className="text-lg font-semibold text-white">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="text-white hover:bg-white/10"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map(day => (
          <div key={day} className="text-center text-xs font-medium text-white/60 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Padding for first week */}
        {paddingDays.map((_, index) => (
          <div key={`pad-${index}`} className="aspect-square" />
        ))}

        {/* Actual days */}
        {daysInMonth.map(date => {
          const isAvailable = isDateAvailable(date);
          const isPast = isDatePast(date);
          const isSelected = selectedDate && isSameDay(date, selectedDate);
          const isToday = isSameDay(date, today);

          return (
            <button
              key={date.toISOString()}
              onClick={() => isAvailable && !isPast && onSelectDate(date)}
              disabled={!isAvailable || isPast}
              className={cn(
                "aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200",
                // Base styles
                "focus:outline-none focus:ring-2 focus:ring-mansagold/50",
                // Available and selectable
                isAvailable && !isPast && !isSelected && [
                  "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
                  "hover:bg-emerald-500/30 hover:scale-105 cursor-pointer"
                ],
                // Selected
                isSelected && [
                  "bg-mansagold text-black border-2 border-mansagold",
                  "shadow-lg shadow-mansagold/30 scale-105"
                ],
                // Not available
                !isAvailable && !isPast && "text-white/30",
                // Past dates
                isPast && "text-white/20 cursor-not-allowed",
                // Today indicator
                isToday && !isSelected && "ring-2 ring-white/40"
              )}
            >
              {format(date, 'd')}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-xs text-white/60 pt-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-emerald-500/30 border border-emerald-500/50" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-mansagold" />
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-white/10" />
          <span>Unavailable</span>
        </div>
      </div>
    </div>
  );
}
