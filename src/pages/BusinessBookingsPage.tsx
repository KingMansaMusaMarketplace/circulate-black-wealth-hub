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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-[32rem] h-[32rem] bg-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        <DashboardLayout title="Bookings" icon={<Calendar className="w-6 h-6" />}>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </DashboardLayout>
      </div>
    );
  }

  if (!profile?.id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-[32rem] h-[32rem] bg-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        <DashboardLayout title="Bookings" icon={<Calendar className="w-6 h-6" />}>
          <div className="text-center py-12 bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-blue-500" />
            <p className="text-gray-700 text-lg font-medium">
              Please complete your business profile first to manage bookings.
            </p>
          </div>
        </DashboardLayout>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-[32rem] h-[32rem] bg-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-teal-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <DashboardLayout title="Bookings Management" icon={<Calendar className="w-6 h-6" />}>
        <div className="max-w-6xl relative z-10">
          {/* Enhanced Header */}
          <div className="mb-10 animate-fade-in">
            <div className="relative inline-block w-full">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 via-cyan-400/30 to-teal-400/30 rounded-3xl blur-2xl"></div>
              <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-0 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500"></div>
                <div className="pt-2">
                  <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
                    Bookings <span className="text-yellow-500">Management</span> 📅
                  </h2>
                  <p className="text-gray-700 text-lg font-medium">
                    Manage and track all your customer appointments 🎯
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <BookingsList businessId={profile.id} />
          </div>
        </div>
      </DashboardLayout>
    </div>
  );
}
