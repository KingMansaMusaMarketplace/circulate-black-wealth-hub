import { Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard';
import { BookingsList } from '@/components/booking/BookingsList';
import { useBusinessProfile } from '@/hooks/use-business-profile';
import { Loader2 } from 'lucide-react';

export default function BusinessBookingsPage() {
  const { user } = useAuth();
  const { profile, loading } = useBusinessProfile();

  if (!user) {
    return <Navigate to="/auth" />;
  }

  if (loading) {
    return (
      <DashboardLayout title="Bookings" icon={<Calendar className="w-6 h-6" />}>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!profile?.id) {
    return (
      <DashboardLayout title="Bookings" icon={<Calendar className="w-6 h-6" />}>
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Please complete your business profile first to manage bookings.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Bookings Management" icon={<Calendar className="w-6 h-6" />}>
      <div className="max-w-6xl">
        <div className="mb-6">
          <p className="text-muted-foreground">
            Manage and track all your customer appointments
          </p>
        </div>

        <BookingsList businessId={profile.id} />
      </div>
    </DashboardLayout>
  );
}
