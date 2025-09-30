import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
}

export function BookingForm({ businessId, businessName }: BookingFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [services, setServices] = useState<BookingService[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingServices, setLoadingServices] = useState(true);
  
  const [formData, setFormData] = useState({
    serviceId: '',
    bookingDate: '',
    bookingTime: '',
    customerName: user?.user_metadata?.full_name || '',
    customerEmail: user?.email || '',
    customerPhone: '',
    notes: '',
  });

  useEffect(() => {
    loadServices();
  }, [businessId]);

  const loadServices = async () => {
    try {
      setLoadingServices(true);
      const data = await bookingService.getBusinessServices(businessId);
      setServices(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load available services',
        variant: 'destructive',
      });
    } finally {
      setLoadingServices(false);
    }
  };

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

  if (loadingServices) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">Loading services...</div>
        </CardContent>
      </Card>
    );
  }

  if (services.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            No services available for booking at this time.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Book Appointment - {businessName}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="service">Select Service *</Label>
            <Select
              value={formData.serviceId}
              onValueChange={(value) =>
                setFormData({ ...formData, serviceId: value })
              }
            >
              <SelectTrigger>
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
              <p className="text-sm text-muted-foreground mt-1">
                {selectedService.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="bookingDate">Date *</Label>
              <Input
                id="bookingDate"
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={formData.bookingDate}
                onChange={(e) =>
                  setFormData({ ...formData, bookingDate: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="bookingTime">Time *</Label>
              <Input
                id="bookingTime"
                type="time"
                value={formData.bookingTime}
                onChange={(e) =>
                  setFormData({ ...formData, bookingTime: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="customerName">Your Name *</Label>
            <Input
              id="customerName"
              value={formData.customerName}
              onChange={(e) =>
                setFormData({ ...formData, customerName: e.target.value })
              }
              required
            />
          </div>

          <div>
            <Label htmlFor="customerEmail">Email *</Label>
            <Input
              id="customerEmail"
              type="email"
              value={formData.customerEmail}
              onChange={(e) =>
                setFormData({ ...formData, customerEmail: e.target.value })
              }
              required
            />
          </div>

          <div>
            <Label htmlFor="customerPhone">Phone</Label>
            <Input
              id="customerPhone"
              type="tel"
              value={formData.customerPhone}
              onChange={(e) =>
                setFormData({ ...formData, customerPhone: e.target.value })
              }
            />
          </div>

          <div>
            <Label htmlFor="notes">Special Requests</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={3}
            />
          </div>

          {selectedService && (
            <Card className="bg-muted">
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center text-sm">
                      <DollarSign className="w-4 h-4 mr-1" />
                      Service Price:
                    </span>
                    <span className="font-semibold">
                      ${selectedService.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center text-sm">
                      <Clock className="w-4 h-4 mr-1" />
                      Duration:
                    </span>
                    <span className="font-semibold">
                      {selectedService.duration_minutes} minutes
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground pt-2 border-t">
                    Platform fee (2.5%) included • Secure payment via Stripe
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating Booking...' : 'Book Now & Pay'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
