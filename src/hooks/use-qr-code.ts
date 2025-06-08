
import { useState } from 'react';
import { toast } from 'sonner';

export interface QRCodeData {
  id: string;
  businessId: string;
  type: 'discount' | 'loyalty' | 'checkin';
  value: string;
  isActive: boolean;
  expirationDate?: string;
  scanLimit?: number;
  currentScans: number;
  createdAt: string;
}

export const useQRCode = () => {
  const [qrCodes, setQRCodes] = useState<QRCodeData[]>([]);
  const [loading, setLoading] = useState(false);

  const generateQRCode = async (data: Omit<QRCodeData, 'id' | 'currentScans' | 'createdAt'>) => {
    setLoading(true);
    try {
      // In a real app, this would call your API
      const newQRCode: QRCodeData = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        currentScans: 0,
        createdAt: new Date().toISOString()
      };
      
      setQRCodes(prev => [...prev, newQRCode]);
      toast.success('QR Code generated successfully!');
      return newQRCode;
    } catch (error) {
      toast.error('Failed to generate QR code');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateQRCode = async (id: string, updates: Partial<QRCodeData>) => {
    setLoading(true);
    try {
      setQRCodes(prev => prev.map(qr => 
        qr.id === id ? { ...qr, ...updates } : qr
      ));
      toast.success('QR Code updated successfully!');
    } catch (error) {
      toast.error('Failed to update QR code');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteQRCode = async (id: string) => {
    setLoading(true);
    try {
      setQRCodes(prev => prev.filter(qr => qr.id !== id));
      toast.success('QR Code deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete QR code');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const scanQRCode = async (qrCodeId: string, customerId: string) => {
    try {
      // In a real app, this would call your API to record the scan
      setQRCodes(prev => prev.map(qr => 
        qr.id === qrCodeId ? { ...qr, currentScans: qr.currentScans + 1 } : qr
      ));
      
      toast.success('QR Code scanned successfully!');
      return true;
    } catch (error) {
      toast.error('Failed to scan QR code');
      return false;
    }
  };

  return {
    qrCodes,
    loading,
    generateQRCode,
    updateQRCode,
    deleteQRCode,
    scanQRCode
  };
};
