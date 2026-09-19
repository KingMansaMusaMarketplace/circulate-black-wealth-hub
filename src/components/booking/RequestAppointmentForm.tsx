import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarClock, Info } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { bookingService } from '@/lib/services/booking-service';
import { useBusinessAvailability } from '@/hooks/useBusinessAvailability';
import { BookingCalendar } from './BookingCalendar';
import { TimeSlotPicker } from './TimeSlotPicker';

interface RequestAppointmentFormProps {
  businessId: string;
  businessName: string;
}

/**
 * Shown when a business hasn't listed any bookable services yet.
 * The visitor asks for a time and describes what they need — no payment is taken.
 * The business owner confirms, proposes another time, or declines.
 */
export function RequestAppointmentForm({ businessId, businessName }: RequestAppointmentFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [formData, setFormData] = useState({
    bookingTime: '',
    requestedService: '',
    customerName: user?.user_metadata?.full_name || '',
    customerEmail: user?.email || '',
    customerPhone: '',
    notes: '',
  });

  const { availableDates, timeSlots, loading: availabilityLoading } = useBusinessAvailability({
    businessId,
    serviceDuration: 30,
    bufferMinutes: 0,
    selectedDate: selectedDate || undefined,
  });

  const canSubmit =
    !!selectedDate &&
    !!formData.bookingTime &&
    !!formData.requestedService.trim() &&
    !!formData.customerName.trim() &&
    !!formData.customerEmail.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to request an appointment',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }

    if (!canSubmit || !selectedDate) {
      toast({
        title: 'Missing information',
        description: 'Please pick a day and time and tell them what you need.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const bookingDateTime = `${format(selectedDate, 'yyyy-MM-dd')}T${formData.bookingTime}:00`;

      const result = await bookingService.createBooking({
        businessId,
        businessName,
        serviceId: null,
        requestedService: formData.requestedService.trim(),
        bookingDate: bookingDateTime,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone || undefined,
        notes: formData.notes || undefined,
      });

      if (!result.success) throw new Error(result.error || 'Failed to send request');

      toast({
        title: 'Request sent',
        description: `${businessName} will confirm your time or suggest another one.`,
      });
      navigate('/customer/bookings');
    } catch (error: any) {
      console.error('Appointment request error:', error);
      toast({
        title: 'Could not send request',
        description: error.message || 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-start gap-3 rounded-xl border border-mansagold/20 bg-mansagold/5 p-4">
        <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-mansagold" />
        <p className="text-sm text-white/80">
          This business hasn't published a service menu yet. Ask for a time below — they'll
          confirm it or suggest another. <span className="text-white">No payment is taken now.</span>
        </p>
      </div>

      <div>
        <Label htmlFor="requestedService" className="text-white">What do you need? *</Label>
        <Input
          id="requestedService"
          placeholder="e.g. Consultation, haircut, estimate"
          value={formData.requestedService}
          onChange={(e) => setFormData({ ...formData, requestedService: e.target.value })}
          className="bg-slate-900/60 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-mansagold/40"
          required
        />
      </div>

      <div className="rounded-xl border border-white/10 bg-slate-900/40 p-4">
        <BookingCalendar
          availableDates={availableDates}
          selectedDate={selectedDate}
          onSelectDate={(date) => {
            setSelectedDate(date);
            setFormData((prev) => ({ ...prev, bookingTime: '' }));
          }}
          loading={availabilityLoading}
        />
      </div>

      {selectedDate && (
        <div className="rounded-xl border border-white/10 bg-slate-900/40 p-4">
          <h4 className="mb-3 text-sm font-medium text-slate-300">
            Preferred time on {format(selectedDate, 'EEEE, MMMM d')}
          </h4>
          <TimeSlotPicker
            slots={timeSlots}
            selectedTime={formData.bookingTime}
            onSelectTime={(time) => setFormData({ ...formData, bookingTime: time })}
            serviceDuration={30}
          />
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="reqName" className="text-white">Your Name *</Label>
          <Input
            id="reqName"
            value={formData.customerName}
            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
            className="bg-slate-900/60 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-mansagold/40"
            required
          />
        </div>
        <div>
          <Label htmlFor="reqEmail" className="text-white">Email *</Label>
          <Input
            id="reqEmail"
            type="email"
            value={formData.customerEmail}
            onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
            className="bg-slate-900/60 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-mansagold/40"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="reqPhone" className="text-white">Phone</Label>
        <Input
          id="reqPhone"
          type="tel"
          value={formData.customerPhone}
          onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
          className="bg-slate-900/60 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-mansagold/40"
        />
      </div>

      <div>
        <Label htmlFor="reqNotes" className="text-white">Anything else they should know?</Label>
        <Textarea
          id="reqNotes"
          rows={3}
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="bg-slate-900/60 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-mansagold/40"
        />
      </div>

      <Button
        type="submit"
        disabled={loading || !canSubmit}
        className="w-full bg-mansagold font-semibold text-black hover:bg-mansagold/90"
      >
        <CalendarClock className="mr-2 h-4 w-4" />
        {loading ? 'Sending request...' : 'Request Appointment'}
      </Button>
    </form>
  );
}

export default RequestAppointmentForm;
