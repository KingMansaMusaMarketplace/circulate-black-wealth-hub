
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeTabs } from '@/components/business/qr-code';
import { useBusinessProfile } from '@/hooks/use-business-profile';
import { useQRCode } from '@/hooks/use-qr-code';
import { useAuth } from '@/contexts/AuthContext';
import { QRCode } from '@/lib/api/qr-code-api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Loader2 } from 'lucide-react';

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
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-mansablue" />
            <p className="text-gray-500">Loading QR Code Management...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!databaseInitialized) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Database Not Initialized</h1>
            <p className="mb-6 text-gray-700">
              The database functions for QR code functionality have not been initialized. Please visit the Admin page to set up the database.
            </p>
            <button 
              onClick={() => navigate('/admin')}
              className="px-4 py-2 bg-mansablue text-white rounded hover:bg-opacity-90 transition-colors"
            >
              Go to Admin Page
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">QR Code Management</h1>
          <p className="text-gray-600 mt-2">
            Create and manage QR codes for your business to boost customer loyalty and engagement
          </p>
        </div>

        <QRCodeTabs 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          qrCodes={qrCodes}
          businessId={profile?.id}
        />
      </div>
      <Footer />
    </div>
  );
};

export default QRCodeManagementPage;
