
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { QRCodeTabs } from '@/components/business/qr-code';
import { useBusinessProfile } from '@/hooks/use-business-profile';
import { useQRCode } from '@/hooks/qr-code';
import { QRCode } from '@/lib/api/qr-code-api';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/dashboard';
import { Loader2, QrCode } from 'lucide-react';

const QRCodeManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('generate');
  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, userType, databaseInitialized } = useAuth();
  const { profile, loadBusinessProfile } = useBusinessProfile();
  const { fetchBusinessQRCodes } = useQRCode();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (userType !== 'business') {
      navigate('/dashboard');
      return;
    }

    const loadData = async () => {
      setLoading(true);
      await loadBusinessProfile();
      setLoading(false);
    };

    loadData();
  }, [user, userType, loadBusinessProfile, navigate]);

  useEffect(() => {
    if (profile?.id) {
      loadQRCodes();
    }
  }, [profile]);

  const loadQRCodes = async () => {
    if (!profile?.id) return;
    
    try {
      const codes = await fetchBusinessQRCodes();
      setQrCodes(codes);
    } catch (error) {
      console.error('Error loading QR codes:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <Helmet>
          <title>QR Code Management | Mansa Musa Marketplace</title>
        </Helmet>
        
        {/* Animated Background */}
        <div className="fixed inset-0 z-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>
        
        <div className="relative z-10 flex-grow flex items-center justify-center min-h-screen">
          <div className="text-center backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-400" />
            <p className="text-white/70">Loading QR Code Management...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!databaseInitialized) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <Helmet>
          <title>QR Code Management | Mansa Musa Marketplace</title>
        </Helmet>
        
        {/* Animated Background */}
        <div className="fixed inset-0 z-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>
        
        <div className="relative z-10 flex-grow flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md mx-auto p-8 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl">
            <h1 className="text-2xl font-bold text-red-400 mb-4">Database Not Initialized</h1>
            <p className="mb-6 text-white/70">
              The database functions for QR code functionality have not been initialized. Please visit the Admin page to set up the database.
            </p>
            <button 
              onClick={() => navigate('/admin')}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all font-semibold"
            >
              Go to Admin Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Helmet>
        <title>QR Code Management | Mansa Musa Marketplace</title>
        <meta name="description" content="Create and manage QR codes for your business" />
      </Helmet>

      {/* Animated Background */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="relative z-10">
        <DashboardLayout title="QR Code Management">
          <div className="space-y-6">
            {/* Header Banner */}
            <div className="relative overflow-hidden rounded-2xl h-36 backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-yellow-500/20" />
              <div className="absolute top-4 right-10 w-24 h-24 bg-blue-400/20 rounded-full blur-2xl animate-pulse" />
              <div className="absolute bottom-4 left-10 w-32 h-32 bg-yellow-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
              <div className="relative h-full flex items-center px-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                    <QrCode className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white font-display">QR Code Management</h1>
                    <p className="text-blue-200/80">
                      Create and manage QR codes for your business to boost customer loyalty and engagement
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <QRCodeTabs 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              qrCodes={qrCodes}
              businessId={profile?.id}
            />
          </div>
        </DashboardLayout>
      </div>
    </div>
  );
};

export default QRCodeManagementPage;
