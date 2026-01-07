import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimeSlot {
  time: string;
  display: string;
  available: boolean;
}

interface TimeSlotPickerProps {
  slots: TimeSlot[];
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
  serviceDuration?: number;
}

export function TimeSlotPicker({
  slots,
  selectedTime,
  onSelectTime,
  serviceDuration = 60
}: TimeSlotPickerProps) {
  if (slots.length === 0) {
    return (
      <div className="text-center py-6">
        <Clock className="w-10 h-10 mx-auto mb-2 text-white/40" />
        <p className="text-white/70">Select a date to see available times</p>
      </div>
    );
  }

  const availableSlots = slots.filter(s => s.available);
  const unavailableSlots = slots.filter(s => !s.available);

  if (availableSlots.length === 0) {
    return (
      <div className="text-center py-6">
        <Clock className="w-10 h-10 mx-auto mb-2 text-yellow-500/50" />
        <p className="text-white/70">No available times for this date</p>
        <p className="text-sm text-white/50 mt-1">Please select a different date</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-white/70">
          {availableSlots.length} time{availableSlots.length !== 1 ? 's' : ''} available
        </p>
        <p className="text-xs text-white/50">
          {serviceDuration} min session
        </p>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-64 overflow-y-auto pr-2">
        {slots.map(slot => {
          const isSelected = selectedTime === slot.time;
          
          return (
            <button
              key={slot.time}
              onClick={() => slot.available && onSelectTime(slot.time)}
              disabled={!slot.available}
              className={cn(
                "px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-mansagold/50",
                // Available
                slot.available && !isSelected && [
                  "bg-white/10 text-white border border-white/20",
                  "hover:bg-white/20 hover:border-white/30 cursor-pointer"
                ],
                // Selected
                isSelected && [
                  "bg-mansagold text-black border-2 border-mansagold",
                  "shadow-md shadow-mansagold/20"
                ],
                // Unavailable
                !slot.available && [
                  "bg-white/5 text-white/30 border border-white/10",
                  "cursor-not-allowed line-through"
                ]
              )}
            >
              {slot.display}
            </button>
          );
        })}
      </div>
    </div>
  );
}
