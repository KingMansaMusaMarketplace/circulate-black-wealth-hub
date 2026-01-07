import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { addMinutes, format, parse, isBefore, isAfter, startOfDay, addDays } from 'date-fns';

interface Availability {
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

interface ExistingBooking {
  booking_date: string;
  duration_minutes: number;
  service_id: string;
}

interface TimeSlot {
  time: string;
  display: string;
  available: boolean;
}

interface UseBusinessAvailabilityOptions {
  businessId: string;
  serviceId?: string;
  serviceDuration?: number;
  bufferMinutes?: number;
  selectedDate?: Date;
}

export function useBusinessAvailability({
  businessId,
  serviceId,
  serviceDuration = 60,
  bufferMinutes = 15,
  selectedDate
}: UseBusinessAvailabilityOptions) {
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [existingBookings, setExistingBookings] = useState<ExistingBooking[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch business availability (weekly schedule)
  useEffect(() => {
    async function fetchAvailability() {
      if (!businessId) return;
      
      try {
        const { data, error } = await supabase
          .from('business_availability')
          .select('*')
          .eq('business_id', businessId)
          .eq('is_available', true);

        if (error) throw error;
        setAvailability(data || []);
      } catch (error) {
        console.error('Error fetching availability:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAvailability();
  }, [businessId]);

  // Fetch existing bookings for the selected date
  useEffect(() => {
    async function fetchBookings() {
      if (!businessId || !selectedDate) return;

      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('booking_date, duration_minutes, service_id')
          .eq('business_id', businessId)
          .gte('booking_date', `${dateStr}T00:00:00`)
          .lt('booking_date', `${dateStr}T23:59:59`)
          .in('status', ['pending', 'confirmed']);

        if (error) throw error;
        setExistingBookings(data || []);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    }

    fetchBookings();
  }, [businessId, selectedDate]);

  // Check if a specific day of week is available
  const isDayAvailable = (date: Date): boolean => {
    const dayOfWeek = date.getDay();
    return availability.some(a => a.day_of_week === dayOfWeek && a.is_available);
  };

  // Get available dates for the next N days
  const availableDates = useMemo(() => {
    const dates: Date[] = [];
    const today = startOfDay(new Date());
    
    for (let i = 0; i < 60; i++) {
      const date = addDays(today, i);
      if (isDayAvailable(date)) {
        dates.push(date);
      }
    }
    
    return dates;
  }, [availability]);

  // Generate time slots for the selected date
  const timeSlots = useMemo((): TimeSlot[] => {
    if (!selectedDate || !availability.length) return [];

    const dayOfWeek = selectedDate.getDay();
    const dayAvailability = availability.find(a => a.day_of_week === dayOfWeek);
    
    if (!dayAvailability) return [];

    const slots: TimeSlot[] = [];
    const startTime = parse(dayAvailability.start_time, 'HH:mm:ss', selectedDate);
    const endTime = parse(dayAvailability.end_time, 'HH:mm:ss', selectedDate);
    
    let currentTime = startTime;
    const now = new Date();
    const isToday = format(selectedDate, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd');

    while (isBefore(currentTime, endTime)) {
      const slotEndTime = addMinutes(currentTime, serviceDuration);
      
      // Don't show slots that extend past closing time
      if (isAfter(slotEndTime, endTime)) break;

      const timeStr = format(currentTime, 'HH:mm');
      const displayTime = format(currentTime, 'h:mm a');
      
      // Check if slot is in the past (for today)
      const isPast = isToday && isBefore(currentTime, now);
      
      // Check for conflicts with existing bookings
      const hasConflict = existingBookings.some(booking => {
        const bookingStart = new Date(booking.booking_date);
        const bookingEnd = addMinutes(bookingStart, booking.duration_minutes + bufferMinutes);
        
        const slotStart = currentTime;
        const slotEnd = addMinutes(slotStart, serviceDuration);
        
        // Check overlap
        return (
          (slotStart >= bookingStart && slotStart < bookingEnd) ||
          (slotEnd > bookingStart && slotEnd <= bookingEnd) ||
          (slotStart <= bookingStart && slotEnd >= bookingEnd)
        );
      });

      slots.push({
        time: timeStr,
        display: displayTime,
        available: !isPast && !hasConflict
      });

      // Move to next slot (using buffer between slots)
      currentTime = addMinutes(currentTime, 30); // 30-minute intervals
    }

    return slots;
  }, [selectedDate, availability, existingBookings, serviceDuration, bufferMinutes]);

  return {
    availability,
    availableDates,
    timeSlots,
    loading,
    isDayAvailable
  };
}
