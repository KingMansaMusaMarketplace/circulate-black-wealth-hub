import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, DollarSign, X, CheckCircle, XCircle, Loader2 } from 'lucide-react';
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
    const variants: Record<Booking['status'], { variant: any; label: string; gradient: string }> = {
      pending: { variant: 'secondary', label: 'Pending', gradient: 'from-yellow-50 to-yellow-100/50 border-yellow-200' },
      confirmed: { variant: 'default', label: 'Confirmed', gradient: 'from-blue-50 to-blue-100/50 border-blue-200' },
      completed: { variant: 'default', label: 'Completed', gradient: 'from-green-50 to-green-100/50 border-green-200' },
      cancelled: { variant: 'destructive', label: 'Cancelled', gradient: 'from-red-50 to-red-100/50 border-red-200' },
      no_show: { variant: 'destructive', label: 'No Show', gradient: 'from-gray-50 to-gray-100/50 border-gray-200' },
    };

    const config = variants[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getCardGradient = (status: Booking['status']) => {
    const variants: Record<Booking['status'], string> = {
      pending: 'from-yellow-50 to-yellow-100/50 border-yellow-200',
      confirmed: 'from-blue-50 to-blue-100/50 border-blue-200',
      completed: 'from-green-50 to-green-100/50 border-green-200',
      cancelled: 'from-red-50 to-red-100/50 border-red-200',
      no_show: 'from-gray-50 to-gray-100/50 border-gray-200',
    };
    return variants[status];
  };

  if (loading) {
    return (
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50 shadow-lg">
        <CardContent className="pt-6">
          <div className="text-center text-blue-700 font-medium">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-500" />
            Loading bookings...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (bookings.length === 0) {
    return (
      <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100/50 shadow-lg">
        <CardContent className="pt-6">
          <div className="text-center">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-purple-500" />
            <p className="text-purple-700 font-medium">No bookings found.</p>
            <p className="text-purple-600 text-sm mt-2">Your bookings will appear here once customers make appointments.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking: any) => (
        <Card key={booking.id} className={`bg-gradient-to-br ${getCardGradient(booking.status)} shadow-lg hover:shadow-xl transition-shadow`}>
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
