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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-[32rem] h-[32rem] bg-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-rose-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <ResponsiveLayout>
        <div className="max-w-4xl mx-auto relative z-10">
          {/* Enhanced Header */}
          <div className="mb-10 animate-fade-in">
            <div className="relative inline-block w-full">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/30 via-pink-400/30 to-rose-400/30 rounded-3xl blur-2xl"></div>
              <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-0 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500"></div>
                <div className="pt-2 flex items-center gap-4">
                  <Calendar className="w-12 h-12 text-purple-600" />
                  <div>
                    <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
                      My <span className="text-yellow-500">Bookings</span> 📅
                    </h1>
                    <p className="text-gray-700 text-lg font-medium">
                      View and manage all your appointments ✨
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <BookingsList customerId={user.id} />
          </div>
        </div>
      </ResponsiveLayout>
    </div>
  );
}
