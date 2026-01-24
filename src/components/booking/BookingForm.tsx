import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Clock, DollarSign, ArrowRight, ArrowLeft, Wallet, CreditCard, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { bookingService, BookingService } from '@/lib/services/booking-service';
import { useAuth } from '@/contexts/AuthContext';
import { useBusinessAvailability } from '@/hooks/useBusinessAvailability';
import { BookingCalendar } from './BookingCalendar';
import { TimeSlotPicker } from './TimeSlotPicker';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface BookingFormProps {
  businessId: string;
  businessName: string;
  services: BookingService[];
}

type BookingStep = 'service' | 'datetime' | 'details' | 'payment';

export function BookingForm({ businessId, businessName, services }: BookingFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<BookingStep>('service');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'card' | null>(null);
  
  const [formData, setFormData] = useState({
    serviceId: '',
    bookingTime: '',
    customerName: user?.user_metadata?.full_name || '',
    customerEmail: user?.email || '',
    customerPhone: '',
    notes: '',
  });

  // Fetch wallet balance
  const { data: profile } = useQuery({
    queryKey: ['wallet-balance-booking', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('wallet_balance')
        .eq('id', user.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const walletBalance = Number(profile?.wallet_balance || 0);

  const selectedService = services.find((s) => s.id === formData.serviceId);
  
  // Get buffer minutes from service or default to 15
  const bufferMinutes = (selectedService as any)?.buffer_minutes ?? 15;

  const { 
    availableDates, 
    timeSlots, 
    loading: availabilityLoading 
  } = useBusinessAvailability({
    businessId,
    serviceId: formData.serviceId,
    serviceDuration: selectedService?.duration_minutes || 60,
    bufferMinutes,
    selectedDate: selectedDate || undefined
  });

  // Reset date/time when service changes
  useEffect(() => {
    setSelectedDate(null);
    setFormData(prev => ({ ...prev, bookingTime: '' }));
  }, [formData.serviceId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to book an appointment',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }

    if (!formData.serviceId || !selectedDate || !formData.bookingTime) {
      toast({
        title: 'Missing Information',
        description: 'Please complete all booking steps',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const bookingDateTime = `${format(selectedDate, 'yyyy-MM-dd')}T${formData.bookingTime}:00`;

      const result = await bookingService.createBooking({
        businessId,
        serviceId: formData.serviceId,
        bookingDate: bookingDateTime,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone || undefined,
        notes: formData.notes || undefined,
      });

      if (result.success) {
        toast({
          title: 'Booking Created!',
          description: 'Your booking has been confirmed. Payment pending.',
        });
        navigate('/customer/bookings');
      } else {
        throw new Error(result.error || 'Failed to create booking');
      }
    } catch (error: any) {
      console.error('Booking error:', error);
      toast({
        title: 'Booking Failed',
        description: error.message || 'Failed to create booking',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const canProceedToDateTime = !!formData.serviceId;
  const canProceedToDetails = !!selectedDate && !!formData.bookingTime;

  if (services.length === 0) {
    return (
      <div className="text-center py-6 text-white/90">
        No services available for booking at this time.
      </div>
    );
  }

  // Step indicators
  const steps = [
    { id: 'service', label: 'Service' },
    { id: 'datetime', label: 'Date & Time' },
    { id: 'details', label: 'Details' },
    { id: 'payment', label: 'Payment' },
  ];

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-2">
        {steps.map((s, idx) => (
          <div key={s.id} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                step === s.id
                  ? 'bg-mansagold text-black'
                  : steps.findIndex(st => st.id === step) > idx
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white/20 text-white/60'
              }`}
            >
              {idx + 1}
            </div>
            {idx < steps.length - 1 && (
              <div className={`w-12 h-0.5 mx-1 ${
                steps.findIndex(st => st.id === step) > idx
                  ? 'bg-emerald-500'
                  : 'bg-white/20'
              }`} />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Service Selection */}
        {step === 'service' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white text-center">
              Select a Service
            </h3>
            
            <div className="space-y-3">
              {services.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, serviceId: service.id })}
                  className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${
                    formData.serviceId === service.id
                      ? 'bg-mansagold/20 border-2 border-mansagold'
                      : 'bg-white/10 border border-white/20 hover:bg-white/15'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-white">{service.name}</h4>
                      {service.description && (
                        <p className="text-sm text-white/70 mt-1">{service.description}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-mansagold">${service.price}</p>
                      <p className="text-xs text-white/60">{service.duration_minutes} min</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <Button
              type="button"
              onClick={() => setStep('datetime')}
              disabled={!canProceedToDateTime}
              className="w-full bg-mansagold hover:bg-mansagold/90 text-black font-semibold"
            >
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Step 2: Date & Time Selection */}
        {step === 'datetime' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setStep('service')}
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <h3 className="text-lg font-semibold text-white">
                Choose Date & Time
              </h3>
              <div className="w-20" />
            </div>

            {/* Selected Service Summary */}
            {selectedService && (
              <div className="bg-white/5 rounded-lg p-3 flex justify-between items-center">
                <span className="text-white/90">{selectedService.name}</span>
                <span className="text-mansagold font-semibold">
                  ${selectedService.price} • {selectedService.duration_minutes} min
                </span>
              </div>
            )}

            {/* Calendar */}
            <div className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-4">
              <BookingCalendar
                availableDates={availableDates}
                selectedDate={selectedDate}
                onSelectDate={(date) => {
                  setSelectedDate(date);
                  setFormData(prev => ({ ...prev, bookingTime: '' }));
                }}
                loading={availabilityLoading}
              />
            </div>

            {/* Time Slots */}
            {selectedDate && (
              <div className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-4">
                <h4 className="text-sm font-medium text-white/80 mb-3">
                  Times for {format(selectedDate, 'EEEE, MMMM d')}
                </h4>
                <TimeSlotPicker
                  slots={timeSlots}
                  selectedTime={formData.bookingTime}
                  onSelectTime={(time) => setFormData({ ...formData, bookingTime: time })}
                  serviceDuration={selectedService?.duration_minutes}
                />
              </div>
            )}

            <Button
              type="button"
              onClick={() => setStep('details')}
              disabled={!canProceedToDetails}
              className="w-full bg-mansagold hover:bg-mansagold/90 text-black font-semibold"
            >
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Step 3: Customer Details */}
        {step === 'details' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setStep('datetime')}
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <h3 className="text-lg font-semibold text-white">
                Your Details
              </h3>
              <div className="w-20" />
            </div>

            {/* Booking Summary */}
            {selectedService && selectedDate && (
              <div className="backdrop-blur-xl bg-white/10 rounded-lg border border-white/20 p-4 space-y-2">
                <p className="font-semibold text-white">{selectedService.name}</p>
                <div className="flex items-center text-sm text-white/80">
                  <Clock className="w-4 h-4 mr-2" />
                  {format(selectedDate, 'EEEE, MMMM d')} at{' '}
                  {timeSlots.find(s => s.time === formData.bookingTime)?.display || formData.bookingTime}
                </div>
                <div className="flex items-center text-sm text-mansagold">
                  <DollarSign className="w-4 h-4 mr-1" />
                  ${selectedService.price.toFixed(2)} • {selectedService.duration_minutes} min
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="customerName" className="text-white">Your Name *</Label>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={(e) =>
                  setFormData({ ...formData, customerName: e.target.value })
                }
                className="backdrop-blur-xl bg-white/10 border-white/20 text-white"
                required
              />
            </div>

            <div>
              <Label htmlFor="customerEmail" className="text-white">Email *</Label>
              <Input
                id="customerEmail"
                type="email"
                value={formData.customerEmail}
                onChange={(e) =>
                  setFormData({ ...formData, customerEmail: e.target.value })
                }
                className="backdrop-blur-xl bg-white/10 border-white/20 text-white"
                required
              />
            </div>

            <div>
              <Label htmlFor="customerPhone" className="text-white">Phone</Label>
              <Input
                id="customerPhone"
                type="tel"
                value={formData.customerPhone}
                onChange={(e) =>
                  setFormData({ ...formData, customerPhone: e.target.value })
                }
                className="backdrop-blur-xl bg-white/10 border-white/20 text-white"
              />
            </div>

            <div>
              <Label htmlFor="notes" className="text-white">Special Requests</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={3}
                className="backdrop-blur-xl bg-white/10 border-white/20 text-white"
              />
            </div>

            <div className="text-xs text-white/60 pt-2">
              Platform fee (7.5%) included • Secure payment via Stripe
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-black font-semibold" 
              disabled={loading}
            >
              {loading ? 'Creating Booking...' : 'Book Now & Pay'}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
