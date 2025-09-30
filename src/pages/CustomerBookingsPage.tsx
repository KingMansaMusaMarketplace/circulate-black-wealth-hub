import { Calendar } from 'lucide-react';
import ResponsiveLayout from '@/components/layouts/ResponsiveLayout';
import { BookingsList } from '@/components/booking/BookingsList';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export default function CustomerBookingsPage() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return (
    <ResponsiveLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">My Bookings</h1>
            <p className="text-muted-foreground">
              View and manage your appointments
            </p>
          </div>
        </div>

        <BookingsList customerId={user.id} />
      </div>
    </ResponsiveLayout>
  );
}
