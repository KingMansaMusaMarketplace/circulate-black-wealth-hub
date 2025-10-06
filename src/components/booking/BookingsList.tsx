import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, DollarSign, X, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { bookingService, Booking } from '@/lib/services/booking-service';
import { ReviewRequestButton } from '@/components/business/bookings/ReviewRequestButton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface BookingsListProps {
  businessId?: string; // If provided, shows business owner view
  customerId?: string; // If provided, shows customer view
}

export function BookingsList({ businessId, customerId }: BookingsListProps) {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, [businessId, customerId]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = businessId
        ? await bookingService.getBusinessBookings(businessId)
        : await bookingService.getCustomerBookings();
      setBookings(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load bookings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await bookingService.cancelBooking(bookingId, 'Cancelled by customer');
      toast({
        title: 'Booking Cancelled',
        description: 'Your booking has been cancelled successfully',
      });
      loadBookings();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to cancel booking',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateStatus = async (bookingId: string, status: Booking['status']) => {
    try {
      await bookingService.updateBookingStatus(bookingId, status);
      toast({
        title: 'Status Updated',
        description: `Booking marked as ${status}`,
      });
      loadBookings();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update booking status',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: Booking['status']) => {
    const variants: Record<Booking['status'], { variant: any; label: string }> = {
      pending: { variant: 'secondary', label: 'Pending' },
      confirmed: { variant: 'default', label: 'Confirmed' },
      completed: { variant: 'default', label: 'Completed' },
      cancelled: { variant: 'destructive', label: 'Cancelled' },
      no_show: { variant: 'destructive', label: 'No Show' },
    };

    const config = variants[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">Loading bookings...</div>
        </CardContent>
      </Card>
    );
  }

  if (bookings.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            No bookings found.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking: any) => (
        <Card key={booking.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">
                  {businessId ? booking.customer_name : booking.businesses?.business_name}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {booking.business_services?.name}
                </p>
              </div>
              {getStatusBadge(booking.status)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                <span>{format(new Date(booking.booking_date), 'PPP')}</span>
              </div>

              <div className="flex items-center text-sm">
                <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                <span>
                  {format(new Date(booking.booking_date), 'p')} • {booking.duration_minutes} minutes
                </span>
              </div>

              <div className="flex items-center text-sm">
                <DollarSign className="w-4 h-4 mr-2 text-muted-foreground" />
                <span>${booking.amount.toFixed(2)}</span>
                {businessId && (
                  <span className="text-muted-foreground ml-2">
                    (You receive: ${booking.business_amount.toFixed(2)})
                  </span>
                )}
              </div>

              {!businessId && booking.customer_email && (
                <div className="text-sm">
                  <strong>Contact:</strong> {booking.customer_email}
                  {booking.customer_phone && ` • ${booking.customer_phone}`}
                </div>
              )}

              {booking.notes && (
                <div className="text-sm">
                  <strong>Notes:</strong> {booking.notes}
                </div>
              )}

              {/* Customer actions */}
              {!businessId && booking.status === 'pending' && (
                <div className="flex gap-2 pt-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <X className="w-4 h-4 mr-1" />
                        Cancel Booking
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Cancel Booking?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will cancel your booking. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>No, keep it</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleCancelBooking(booking.id)}>
                          Yes, cancel
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}

              {/* Business owner actions */}
              {businessId && booking.status === 'pending' && (
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Confirm
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Cancel
                  </Button>
                </div>
              )}

              {businessId && booking.status === 'confirmed' && (
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleUpdateStatus(booking.id, 'completed')}
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Mark Completed
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateStatus(booking.id, 'no_show')}
                  >
                    No Show
                  </Button>
                </div>
              )}

              {/* Show review request button for completed bookings */}
              {businessId && booking.status === 'completed' && (
                <div className="flex gap-2 pt-2">
                  <ReviewRequestButton 
                    bookingId={booking.id}
                    customerEmail={booking.customer_email}
                    bookingStatus={booking.status}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
