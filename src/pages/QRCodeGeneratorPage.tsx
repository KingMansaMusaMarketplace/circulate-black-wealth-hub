
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/Footer';
import { QRCodeTabs } from '@/components/business/qr-code/QRCodeTabs';
import { useQRCode } from '@/hooks/qr-code';
import { useBusinessProfile } from '@/hooks/use-business-profile';
import { QRCode } from '@/lib/api/qr-code-api';

const QRCodeGeneratorPage = () => {
  const [activeTab, setActiveTab] = useState('generate');
  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const { fetchBusinessQRCodes } = useQRCode();
  const { profile: businessProfile } = useBusinessProfile();

  useEffect(() => {
    const loadQRCodes = async () => {
      if (businessProfile?.id) {
        const codes = await fetchBusinessQRCodes(businessProfile.id);
        setQrCodes(codes);
      }
    };

    loadQRCodes();
  }, [businessProfile?.id, fetchBusinessQRCodes]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>QR Code Generator | Mansa Musa Marketplace</title>
        <meta name="description" content="Generate and manage QR codes for your business" />
      </Helmet>
      
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">QR Code Management</h1>
          <p className="text-muted-foreground">
            Create, manage, and track QR codes for customer engagement
          </p>
        </div>

        <QRCodeTabs 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          qrCodes={qrCodes}
          businessId={businessProfile?.id}
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default QRCodeGeneratorPage;
