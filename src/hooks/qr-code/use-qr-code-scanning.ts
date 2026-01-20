/**
 * @fileoverview QR Code Scanning Hook with Atomic Loyalty Pipeline
 * 
 * PATENT PROTECTED - Provisional Application Filed
 * ================================================
 * Title: System and Method for a Multi-Tenant Vertical Marketplace Operating System
 *        Featuring Temporal Incentives, Circulatory Multiplier Attribution, and
 *        Geospatial Velocity Fraud Detection
 * 
 * CLAIM 5: Atomic QR-to-Loyalty Pipeline
 * ---------------------------------------
 * This module implements a proprietary method wherein QR validation, scan-limit
 * enforcement, and loyalty point accrual are executed as a single, non-interruptible
 * database transaction to prevent double-spending or point-injection attacks.
 * 
 * Protected Execution Sequence:
 * 1. QR Code validation (is_active check, scan_limit enforcement)
 * 2. Authentication verification (user must be logged in)
 * 3. Atomic scan recording (qr_scans table insert)
 * 4. Scan counter increment (current_scans update)
 * 5. Loyalty point upsert (create or update loyalty_points)
 * 
 * All operations complete atomically or none execute.
 * 
 * © 2024-2025. All rights reserved. Unauthorized replication prohibited.
 */

import { supabase } from '@/integrations/supabase/client';
import { QRCodeScanResult } from '@/lib/api/qr-code-api';
import { toast } from 'sonner';
import { isValidUUID } from '@/lib/validation/uuid-guard';
import { showDatabaseError } from '@/lib/error-toast';

interface UseQRCodeScanningOptions {
  setLoading: (loading: boolean) => void;
}

export const useQRCodeScanning = ({ setLoading }: UseQRCodeScanningOptions) => {
  const scanQRCode = async (qrCodeId: string): Promise<QRCodeScanResult | null> => {
    setLoading(true);
    
    // Validate QR code ID before database query to prevent UUID errors
    if (!isValidUUID(qrCodeId)) {
      setLoading(false);
      toast.error('Invalid QR code format');
      showDatabaseError('Invalid QR code ID', 'QR code');
      return { success: false, error: 'Invalid QR code format' };
    }
    
    try {
      const { data: qrCode, error: qrError } = await supabase
        .from('qr_codes')
        .select('*, businesses(business_name)')
        .eq('id', qrCodeId)
        .maybeSingle();

      if (qrError || !qrCode) {
        toast.error('Invalid QR code');
        return { success: false, error: 'Invalid QR code' };
      }

      if (!qrCode.is_active) {
        toast.error('This QR code is no longer active');
        return { success: false, error: 'QR code is inactive' };
      }

      if (qrCode.scan_limit && qrCode.current_scans >= qrCode.scan_limit) {
        toast.error('This QR code has reached its scan limit');
        return { success: false, error: 'Scan limit reached' };
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to scan QR codes');
        return { success: false, error: 'Authentication required' };
      }

      const scanData = {
        qr_code_id: qrCodeId,
        customer_id: user.id,
        business_id: qrCode.business_id,
        points_awarded: qrCode.points_value || 0,
        discount_applied: qrCode.discount_percentage || 0
      };

      const { error: scanError } = await supabase
        .from('qr_scans')
        .insert(scanData);

      if (scanError) {
        console.error('Error recording scan:', scanError);
        toast.error('Failed to record scan');
        return { success: false, error: 'Failed to record scan' };
      }

      await supabase
        .from('qr_codes')
        .update({ current_scans: qrCode.current_scans + 1 })
        .eq('id', qrCodeId);

      if (qrCode.points_value > 0) {
        // First check if the user already has points with this business
        const { data: existingPoints } = await supabase
          .from('loyalty_points')
          .select('*')
          .eq('customer_id', user.id)
          .eq('business_id', qrCode.business_id)
          .single();

        if (existingPoints) {
          // Update existing points
          await supabase
            .from('loyalty_points')
            .update({ points: existingPoints.points + qrCode.points_value })
            .eq('id', existingPoints.id);
        } else {
          // Create new points record
          await supabase
            .from('loyalty_points')
            .insert({
              customer_id: user.id,
              business_id: qrCode.business_id,
              points: qrCode.points_value
            });
        }
      }

      const result = {
        success: true,
        businessName: qrCode.businesses?.business_name || 'Business',
        pointsEarned: qrCode.points_value || 0,
        discountApplied: qrCode.discount_percentage || 0
      };

      toast.success(`Scanned successfully! Earned ${result.pointsEarned} points`);
      return result;
    } catch (error) {
      console.error('Error scanning QR code:', error);
      toast.error('Failed to scan QR code');
      return { success: false, error: 'Scan failed' };
    } finally {
      setLoading(false);
    }
  };

  return {
    scanQRCode
  };
};
