
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { QRCode } from '@/lib/api/qr-code-api';
import { useQRCode } from './qr-code';

interface QRCodeNotification {
  id: string;
  message: string;
  type: 'warning' | 'info' | 'error';
  qrCodeId: string;
  seen: boolean;
}

export const useQRCodeNotifications = (businessId?: string) => {
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<QRCodeNotification[]>([]);
  const { updateQRCode } = useQRCode();

  // Check for QR codes that need attention
  const checkQRCodesForNotifications = async (qrCodes: QRCode[]) => {
    const currentDate = new Date();
    const newNotifications: QRCodeNotification[] = [];
    
    qrCodes.forEach(qrCode => {
      // Check for QR codes nearing scan limit
      if (qrCode.scan_limit && qrCode.current_scans >= qrCode.scan_limit * 0.8) {
        newNotifications.push({
          id: `scan_limit_${qrCode.id}`,
          message: `QR code is at ${Math.round((qrCode.current_scans / qrCode.scan_limit!) * 100)}% of scan limit (${qrCode.current_scans}/${qrCode.scan_limit})`,
          type: 'warning',
          qrCodeId: qrCode.id,
          seen: false
        });
      }
      
      // Check for QR codes nearing expiration
      if (qrCode.expiration_date) {
        const expirationDate = new Date(qrCode.expiration_date);
        const daysUntilExpiration = Math.ceil((expirationDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysUntilExpiration <= 7 && daysUntilExpiration > 0) {
          newNotifications.push({
            id: `expiration_${qrCode.id}`,
            message: `QR code expires in ${daysUntilExpiration} days (${expirationDate.toLocaleDateString()})`,
            type: 'warning',
            qrCodeId: qrCode.id,
            seen: false
          });
        } else if (daysUntilExpiration <= 0) {
          newNotifications.push({
            id: `expired_${qrCode.id}`,
            message: `QR code has expired on ${expirationDate.toLocaleDateString()}`,
            type: 'error',
            qrCodeId: qrCode.id,
            seen: false
          });
        }
      }
      
      // Check for inactive QR codes
      if (!qrCode.is_active) {
        newNotifications.push({
          id: `inactive_${qrCode.id}`,
          message: `QR code is currently inactive`,
          type: 'info',
          qrCodeId: qrCode.id,
          seen: false
        });
      }
    });
    
    setNotifications(newNotifications);
    return newNotifications;
  };
  
  // Load QR codes and check for notifications
  const loadNotifications = async () => {
    if (!businessId) return;
    
    setLoading(true);
    try {
      const { data: qrCodes, error } = await supabase
        .from('qr_codes')
        .select('*')
        .eq('business_id', businessId);
      
      if (error) {
        console.error('Error fetching QR codes for notifications:', error);
        return;
      }
      
      if (qrCodes) {
        const notifications = await checkQRCodesForNotifications(qrCodes as QRCode[]);
        
        // Show toast notifications for unseen important notifications
        notifications
          .filter(notification => !notification.seen && notification.type !== 'info')
          .forEach(notification => {
            if (notification.type === 'warning') {
              toast.warning(notification.message, {
                id: notification.id,
                duration: 5000
              });
            } else if (notification.type === 'error') {
              toast.error(notification.message, {
                id: notification.id,
                duration: 5000
              });
            }
          });
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Auto-extend a QR code expiration date
  const extendQRCodeExpiration = async (qrCodeId: string, daysToAdd: number = 30) => {
    try {
      // Get current QR code
      const { data: qrCode, error: fetchError } = await supabase
        .from('qr_codes')
        .select('*')
        .eq('id', qrCodeId)
        .single();
      
      if (fetchError || !qrCode) {
        console.error('Error fetching QR code:', fetchError);
        return null;
      }
      
      // Calculate new expiration date
      let newExpirationDate: Date;
      if (qrCode.expiration_date) {
        const currentExpiration = new Date(qrCode.expiration_date);
        newExpirationDate = new Date(currentExpiration.setDate(currentExpiration.getDate() + daysToAdd));
      } else {
        newExpirationDate = new Date();
        newExpirationDate.setDate(newExpirationDate.getDate() + daysToAdd);
      }
      
      // Update QR code
      const updatedQRCode = await updateQRCode(qrCodeId, {
        expiration_date: newExpirationDate.toISOString()
      });
      
      if (updatedQRCode) {
        toast.success(`QR code expiration extended by ${daysToAdd} days`);
        
        // Refresh notifications
        await loadNotifications();
        return updatedQRCode;
      }
      
      return null;
    } catch (error) {
      console.error('Error extending QR code expiration:', error);
      toast.error('Failed to extend QR code expiration');
      return null;
    }
  };
  
  // Increase QR code scan limit
  const increaseQRCodeScanLimit = async (qrCodeId: string, additionalScans: number = 50) => {
    try {
      // Get current QR code
      const { data: qrCode, error: fetchError } = await supabase
        .from('qr_codes')
        .select('*')
        .eq('id', qrCodeId)
        .single();
      
      if (fetchError || !qrCode) {
        console.error('Error fetching QR code:', fetchError);
        return null;
      }
      
      // Calculate new scan limit
      const newScanLimit = (qrCode.scan_limit || 0) + additionalScans;
      
      // Update QR code
      const updatedQRCode = await updateQRCode(qrCodeId, {
        scan_limit: newScanLimit
      });
      
      if (updatedQRCode) {
        toast.success(`QR code scan limit increased by ${additionalScans} scans`);
        
        // Refresh notifications
        await loadNotifications();
        return updatedQRCode;
      }
      
      return null;
    } catch (error) {
      console.error('Error increasing QR code scan limit:', error);
      toast.error('Failed to increase QR code scan limit');
      return null;
    }
  };
  
  // Mark notification as seen
  const markNotificationAsSeen = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, seen: true } 
          : notification
      )
    );
  };
  
  // Return functions and state
  return {
    loading,
    notifications,
    loadNotifications,
    extendQRCodeExpiration,
    increaseQRCodeScanLimit,
    markNotificationAsSeen
  };
};
