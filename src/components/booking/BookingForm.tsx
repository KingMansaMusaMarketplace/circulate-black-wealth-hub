import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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

interface BookingFormProps {
  businessId: string;
  businessName: string;
  services: BookingService[];
}

export function BookingForm({ businessId, businessName, services }: BookingFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    serviceId: '',
    bookingDate: '',
    bookingTime: '',
    customerName: user?.user_metadata?.full_name || '',
    customerEmail: user?.email || '',
    customerPhone: '',
    notes: '',
  });

  const selectedService = services.find((s) => s.id === formData.serviceId);

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

    if (!formData.serviceId || !formData.bookingDate || !formData.bookingTime) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const bookingDateTime = `${formData.bookingDate}T${formData.bookingTime}:00`;

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
        
        // Redirect to payment or bookings page
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

  if (services.length === 0) {
    return (
      <div className="text-center py-6 text-white/90">
        No services available for booking at this time.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="service" className="text-white">Select Service *</Label>
        <Select
          value={formData.serviceId}
          onValueChange={(value) =>
            setFormData({ ...formData, serviceId: value })
          }
        >
          <SelectTrigger className="backdrop-blur-xl bg-white/10 border-white/20 text-white">
            <SelectValue placeholder="Choose a service" />
          </SelectTrigger>
          <SelectContent>
            {services.map((service) => (
              <SelectItem key={service.id} value={service.id}>
                <div className="flex items-center justify-between w-full">
                  <span>{service.name}</span>
                  <span className="ml-2 text-muted-foreground">
                    ${service.price} • {service.duration_minutes}min
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedService && (
          <p className="text-sm text-white/70 mt-1">
            {selectedService.description}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="bookingDate" className="text-white">Date *</Label>
          <Input
            id="bookingDate"
            type="date"
            min={new Date().toISOString().split('T')[0]}
            value={formData.bookingDate}
            onChange={(e) =>
              setFormData({ ...formData, bookingDate: e.target.value })
            }
            className="backdrop-blur-xl bg-white/10 border-white/20 text-white"
            required
          />
        </div>

        <div>
          <Label htmlFor="bookingTime" className="text-white">Time *</Label>
          <Input
            id="bookingTime"
            type="time"
            value={formData.bookingTime}
            onChange={(e) =>
              setFormData({ ...formData, bookingTime: e.target.value })
            }
            className="backdrop-blur-xl bg-white/10 border-white/20 text-white"
            required
          />
        </div>
      </div>

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

      {selectedService && (
        <div className="backdrop-blur-xl bg-white/10 rounded-lg border border-white/20 p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center text-sm text-white/90">
                <DollarSign className="w-4 h-4 mr-1 text-yellow-400" />
                Service Price:
              </span>
              <span className="font-semibold text-yellow-400">
                ${selectedService.price.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center text-sm text-white/90">
                <Clock className="w-4 h-4 mr-1 text-blue-300" />
                Duration:
              </span>
              <span className="font-semibold text-white">
                {selectedService.duration_minutes} minutes
              </span>
            </div>
            <div className="text-xs text-white/70 pt-2 border-t border-white/20">
              Platform fee (2.5%) included • Secure payment via Stripe
            </div>
          </div>
        </div>
      )}

      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-black font-semibold" 
        disabled={loading}
      >
        {loading ? 'Creating Booking...' : 'Book Now & Pay'}
      </Button>
    </form>
  );
}
