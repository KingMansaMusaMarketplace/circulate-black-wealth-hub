import { useState } from 'react';
import { Calendar as CalendarIcon, Clock, DollarSign, User, Phone, Mail, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface Booking {
  id: string;
  booking_date: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  amount: number;
  duration_minutes: number;
  status: string;
  notes: string | null;
  service: {
    name: string;
  } | null;
}

interface BusinessCalendarViewProps {
  businessId: string;
}

export function BusinessCalendarView({ businessId }: BusinessCalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['business-calendar-bookings', businessId, format(currentMonth, 'yyyy-MM')],
    queryFn: async () => {
      const start = startOfMonth(currentMonth);
      const end = endOfMonth(currentMonth);

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          booking_date,
          customer_name,
          customer_email,
          customer_phone,
          amount,
          duration_minutes,
          status,
          notes,
          service:business_services!service_id(name)
        `)
        .eq('business_id', businessId)
        .gte('booking_date', start.toISOString())
        .lte('booking_date', end.toISOString())
        .order('booking_date', { ascending: true })
        .returns<Booking[]>();

      if (error) {
        toast.error('Failed to load bookings');
        throw error;
      }

      return data || [];
    },
  });

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getBookingsForDate = (date: Date) => {
    return bookings.filter(booking => 
      isSameDay(new Date(booking.booking_date), date)
    );
  };

  const selectedDateBookings = selectedDate ? getBookingsForDate(selectedDate) : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <CalendarIcon className="w-6 h-6" />
          Booking Calendar
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="text-lg font-semibold min-w-[200px] text-center">
            {format(currentMonth, 'MMMM yyyy')}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-semibold text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map(day => {
              const dayBookings = getBookingsForDate(day);
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isToday = isSameDay(day, new Date());

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={`
                    aspect-square p-2 rounded-lg border-2 transition-all
                    ${isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'}
                    ${isSelected ? 'border-primary bg-primary/10' : 'border-transparent hover:border-muted'}
                    ${isToday ? 'bg-accent' : ''}
                  `}
                >
                  <div className="text-sm font-medium mb-1">{format(day, 'd')}</div>
                  {dayBookings.length > 0 && (
                    <div className="flex flex-wrap gap-1 justify-center">
                      {dayBookings.slice(0, 3).map((booking, idx) => (
                        <div
                          key={booking.id}
                          className={`w-1.5 h-1.5 rounded-full ${getStatusColor(booking.status)}`}
                        />
                      ))}
                      {dayBookings.length > 3 && (
                        <div className="text-xs text-muted-foreground">+{dayBookings.length - 3}</div>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
          </h3>

          {isLoading ? (
            <div className="text-center text-muted-foreground py-8">Loading bookings...</div>
          ) : selectedDateBookings.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              {selectedDate ? 'No bookings for this date' : 'Click on a date to view bookings'}
            </div>
          ) : (
            <div className="space-y-4">
              {selectedDateBookings.map(booking => (
                <Card key={booking.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold">{booking.service?.name || 'Service'}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {format(new Date(booking.booking_date), 'h:mm a')} ({booking.duration_minutes} min)
                      </div>
                    </div>
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span>{booking.customer_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="truncate">{booking.customer_email}</span>
                    </div>
                    {booking.customer_phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>{booking.customer_phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span className="font-semibold">${booking.amount.toFixed(2)}</span>
                    </div>
                  </div>

                  {booking.notes && (
                    <div className="pt-2 border-t text-sm">
                      <div className="font-medium mb-1">Notes:</div>
                      <div className="text-muted-foreground">{booking.notes}</div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
