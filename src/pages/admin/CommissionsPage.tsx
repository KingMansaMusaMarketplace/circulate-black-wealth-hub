import { CommissionDashboard } from '@/components/admin/CommissionDashboard';
import CommissionReportTrigger from '@/components/admin/CommissionReportTrigger';
import { Helmet } from 'react-helmet-async';
import { DollarSign } from 'lucide-react';

const CommissionsPage = () => {
  return (
    <div className="min-h-screen gradient-primary relative overflow-hidden">
      <Helmet>
        <title>Platform Commissions - Admin Dashboard</title>
        <meta name="description" content="Track platform commission earnings and transaction revenue" />
      </Helmet>

      {/* Animated Gradient Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-mansagold/20 blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-mansagold/15 blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-white/5 blur-2xl animate-float" style={{ animationDelay: '4s' }}></div>
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 rounded-full bg-mansagold/10 blur-2xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/4 right-1/4 w-56 h-56 rounded-full bg-white/5 blur-2xl animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10 space-y-8">
        {/* Header */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 md:p-8 shadow-2xl animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-mansagold/20 border border-mansagold/30">
              <DollarSign className="h-7 w-7 text-mansagold" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white font-display">Platform Commissions</h1>
              <p className="text-white/70">Track commission earnings and transaction revenue</p>
            </div>
          </div>
        </div>

        {/* Commission Dashboard */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <CommissionDashboard />
        </div>

        {/* Commission Report Trigger */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <CommissionReportTrigger />
        </div>
      </div>
    </div>
  );
};

export default CommissionsPage;
