import { Calendar, Sparkles } from 'lucide-react';
import { BookingsList } from '@/components/booking/BookingsList';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export default function CustomerBookingsPage() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return (
    <div className="min-h-screen bg-[#0a1628] relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-mansablue/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-mansagold/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-20 left-1/3 w-[350px] h-[350px] bg-blue-600/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Enhanced Header */}
          <div className="mb-10 animate-fade-in">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-mansagold/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-mansagold/20 to-mansablue/20 border border-mansagold/30">
                  <Calendar className="w-10 h-10 text-mansagold" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold mb-2 text-white">
                    My <span className="text-mansagold">Bookings</span>
                  </h1>
                  <p className="text-slate-400 text-lg">
                    View and manage all your appointments
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 hover:border-mansagold/30 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-400">Upcoming</span>
                <Calendar className="h-5 w-5 text-mansagold" />
              </div>
              <div className="text-2xl font-bold text-white">—</div>
              <p className="text-xs text-slate-500 mt-1">Scheduled appointments</p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 hover:border-mansagold/30 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-400">Completed</span>
                <Sparkles className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-white">—</div>
              <p className="text-xs text-slate-500 mt-1">Past appointments</p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 hover:border-mansagold/30 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-400">Total</span>
                <Calendar className="h-5 w-5 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white">—</div>
              <p className="text-xs text-slate-500 mt-1">All-time bookings</p>
            </div>
          </div>

          {/* Bookings List Container */}
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <BookingsList customerId={user.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
