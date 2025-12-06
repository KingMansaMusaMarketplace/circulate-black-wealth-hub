import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, DollarSign, X, CheckCircle, XCircle, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
    const variants: Record<Booking['status'], { className: string; label: string }> = {
      pending: { className: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30', label: 'Pending' },
      confirmed: { className: 'bg-blue-500/20 text-blue-300 border-blue-500/30', label: 'Confirmed' },
      completed: { className: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', label: 'Completed' },
      cancelled: { className: 'bg-red-500/20 text-red-300 border-red-500/30', label: 'Cancelled' },
      no_show: { className: 'bg-slate-500/20 text-slate-300 border-slate-500/30', label: 'No Show' },
    };

    const config = variants[status];
    return (
      <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const getCardBorder = (status: Booking['status']) => {
    const variants: Record<Booking['status'], string> = {
      pending: 'hover:border-yellow-500/30',
      confirmed: 'hover:border-blue-500/30',
      completed: 'hover:border-emerald-500/30',
      cancelled: 'hover:border-red-500/30',
      no_show: 'hover:border-slate-500/30',
    };
    return variants[status];
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-mansagold" />
        <p className="text-slate-400">Loading bookings...</p>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <Sparkles className="w-16 h-16 mx-auto mb-4 text-mansagold/50" />
        <p className="text-white font-medium text-lg">No bookings found</p>
        <p className="text-slate-400 text-sm mt-2">Your bookings will appear here once you make appointments.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking: any) => (
        <div 
          key={booking.id} 
          className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 transition-all duration-300 ${getCardBorder(booking.status)}`}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white">
                {businessId ? booking.customer_name : booking.businesses?.business_name}
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                {booking.business_services?.name}
              </p>
            </div>
            {getStatusBadge(booking.status)}
          </div>

          <div className="space-y-3">
            <div className="flex items-center text-sm text-slate-300">
              <Calendar className="w-4 h-4 mr-2 text-mansagold" />
              <span>{format(new Date(booking.booking_date), 'PPP')}</span>
            </div>

            <div className="flex items-center text-sm text-slate-300">
              <Clock className="w-4 h-4 mr-2 text-mansagold" />
              <span>
                {format(new Date(booking.booking_date), 'p')} • {booking.duration_minutes} minutes
              </span>
            </div>

            <div className="flex items-center text-sm text-slate-300">
              <DollarSign className="w-4 h-4 mr-2 text-mansagold" />
              <span className="text-white font-medium">${booking.amount.toFixed(2)}</span>
              {businessId && (
                <span className="text-slate-500 ml-2">
                  (You receive: ${booking.business_amount.toFixed(2)})
                </span>
              )}
            </div>

            {!businessId && booking.customer_email && (
              <div className="text-sm text-slate-300">
                <strong className="text-slate-200">Contact:</strong> {booking.customer_email}
                {booking.customer_phone && ` • ${booking.customer_phone}`}
              </div>
            )}

            {booking.notes && (
              <div className="text-sm text-slate-300">
                <strong className="text-slate-200">Notes:</strong> {booking.notes}
              </div>
            )}

            {/* Customer actions */}
            {!businessId && booking.status === 'pending' && (
              <div className="flex gap-2 pt-3">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      size="sm"
                      className="bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Cancel Booking
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-[#0f1d32] border-white/10 text-white">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-white">Cancel Booking?</AlertDialogTitle>
                      <AlertDialogDescription className="text-slate-400">
                        This will cancel your booking. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-white/5 border-white/20 text-white hover:bg-white/10">
                        No, keep it
                      </AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => handleCancelBooking(booking.id)}
                        className="bg-red-500 text-white hover:bg-red-600"
                      >
                        Yes, cancel
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}

            {/* Business owner actions */}
            {businessId && booking.status === 'pending' && (
              <div className="flex gap-2 pt-3">
                <Button
                  size="sm"
                  onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                  className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Confirm
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                  className="bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30"
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
              </div>
            )}

            {businessId && booking.status === 'confirmed' && (
              <div className="flex gap-2 pt-3">
                <Button
                  size="sm"
                  onClick={() => handleUpdateStatus(booking.id, 'completed')}
                  className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Mark Completed
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleUpdateStatus(booking.id, 'no_show')}
                  className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                >
                  No Show
                </Button>
              </div>
            )}

            {/* Show review request button for completed bookings */}
            {businessId && booking.status === 'completed' && (
              <div className="flex gap-2 pt-3">
                <ReviewRequestButton 
                  bookingId={booking.id}
                  customerEmail={booking.customer_email}
                  bookingStatus={booking.status}
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
