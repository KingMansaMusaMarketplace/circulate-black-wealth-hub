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
      // Atomic, secure RPC handles validation, scan recording, counter increment, and loyalty award
      const { data: rpcRes, error: rpcErr } = await supabase.rpc('award_qr_scan', {
        p_qr_code_id: qrCodeId,
      });

      if (rpcErr) {
        console.error('award_qr_scan RPC error:', rpcErr);
        toast.error('Failed to record scan');
        return { success: false, error: rpcErr.message };
      }

      const res = rpcRes as {
        success: boolean;
        error?: string;
        business_name?: string;
        points_earned?: number;
        discount_applied?: number;
      } | null;

      if (!res?.success) {
        const code = res?.error || 'unknown_error';
        const msg =
          code === 'auth_required' ? 'You must be logged in to scan QR codes' :
          code === 'qr_not_found' ? 'Invalid QR code' :
          code === 'qr_inactive' ? 'This QR code is no longer active' :
          code === 'qr_expired' ? 'This QR code has expired' :
          code === 'scan_limit_reached' ? 'This QR code has reached its scan limit' :
          'Failed to record scan';
        toast.error(msg);
        return { success: false, error: code };
      }

      const result = {
        success: true,
        businessName: res.business_name || 'Business',
        pointsEarned: res.points_earned || 0,
        discountApplied: res.discount_applied || 0,
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
