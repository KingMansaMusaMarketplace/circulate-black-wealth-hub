
import { useState, useRef, useEffect, useCallback } from 'react';
import { useCapacitor } from '@/hooks/use-capacitor';
import { toast } from 'sonner';
import { useConversionTracking } from '@/hooks/use-analytics-tracking';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export interface ScanResult {
  businessName: string;
  businessId?: string;
  pointsEarned: number;
  timestamp: string;
}

export function useScannerState() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [hasCamera, setHasCamera] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [recentScans, setRecentScans] = useState<ScanResult[]>([]);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { isNative, platform } = useCapacitor();
  const { trackQRScanFunnelStart, trackQRScanFunnelComplete } = useConversionTracking();
  const { user } = useAuth();

  // Load scan history from database on component mount
  useEffect(() => {
    const loadScanHistory = async () => {
      if (!user) {
        // Try local storage for non-authenticated users
        try {
          const storedHistory = localStorage.getItem('qrScanHistory');
          if (storedHistory) {
            setRecentScans(JSON.parse(storedHistory));
          }
        } catch (e) {
          console.error('Failed to load scan history from local storage:', e);
        }
        return;
      }

      try {
        const { data, error } = await supabase
          .from('qr_scans')
          .select(`
            id,
            scan_date,
            points_awarded,
            business_id,
            businesses (
              business_name
            )
          `)
          .eq('customer_id', user.id)
          .order('scan_date', { ascending: false })
          .limit(10);

        if (error) throw error;

        const history: ScanResult[] = (data || []).map(scan => ({
          businessName: ((scan.businesses as unknown) as Record<string, unknown>)?.business_name as string || 'Unknown Business',
          businessId: scan.business_id,
          pointsEarned: scan.points_awarded || 0,
          timestamp: scan.scan_date
        }));

        setRecentScans(history);
      } catch (error) {
        console.error('Error loading scan history:', error);
      }
    };

    loadScanHistory();
    checkCameraAvailability();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const checkCameraAvailability = async () => {
    try {
      // For native platforms, we assume camera is available and will request permissions when needed
      if (isNative) {
        setHasCamera(true);
        return;
      }

      // For web platforms, check if the media devices API is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasCamera(false);
        return;
      }

      // Check if camera permission is already granted
      const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
      setPermissionStatus(permission.state as 'granted' | 'denied' | 'prompt');
      
      // Set hasCamera to true if permission is granted or can be requested
      setHasCamera(permission.state === 'granted' || permission.state === 'prompt');
    } catch (error) {
      console.error('Error checking camera:', error);
      setHasCamera(false);
    }
  };

  const requestCameraPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setPermissionStatus('granted');
      setHasCamera(true);
    } catch (error) {
      console.error('Camera permission denied:', error);
      setPermissionStatus('denied');
      toast.error('Camera access is required to scan QR codes');
    }
  };

  const processQRData = useCallback(async (qrData: string): Promise<ScanResult | null> => {
    try {
      // Parse QR code data
      let qrCodeId: string | null = null;
      let businessId: string | null = null;

      try {
        const parsed = JSON.parse(qrData);
        qrCodeId = parsed.qrCodeId || parsed.id;
        businessId = parsed.businessId || parsed.business_id;
      } catch {
        // If not JSON, try to extract from URL or use as ID directly
        if (qrData.includes('business/')) {
          businessId = qrData.split('business/')[1]?.split(/[?#]/)[0];
        } else if (qrData.includes('qr/')) {
          qrCodeId = qrData.split('qr/')[1]?.split(/[?#]/)[0];
        } else {
          qrCodeId = qrData;
        }
      }

      if (!qrCodeId && !businessId) {
        throw new Error('Invalid QR code data');
      }

      // Fetch QR code or business details
      let qrCodeData;
      if (qrCodeId) {
        const { data, error } = await supabase
          .from('qr_codes')
          .select('*, businesses(id, business_name)')
          .eq('id', qrCodeId)
          .single();

        if (!error) qrCodeData = data;
      }

      if (!qrCodeData && businessId) {
        const { data, error } = await supabase
          .from('businesses')
          .select('id, business_name')
          .eq('id', businessId)
          .single();

        if (!error && data) {
          qrCodeData = {
            business_id: data.id,
            businesses: data,
            points_value: 10 // Default points
          };
        }
      }

      if (!qrCodeData) {
        throw new Error('QR code or business not found');
      }

      const pointsEarned = qrCodeData.points_value || 10;
      const biz = qrCodeData.businesses as Record<string, unknown> | null;
      const businessName = (biz?.business_name as string) || 'Business';
      const actualBusinessId = qrCodeData.business_id || (biz?.id as string);

      // Record the scan + award loyalty atomically via secure RPC (only when we have a real qrCodeId)
      if (user && qrCodeId) {
        const { data: rpcRes, error: rpcErr } = await supabase.rpc('award_qr_scan', {
          p_qr_code_id: qrCodeId,
        });
        if (rpcErr) {
          console.error('award_qr_scan RPC error:', rpcErr);
          throw new Error(rpcErr.message || 'Failed to record scan');
        }
        const res = rpcRes as { success: boolean; error?: string; points_earned?: number; business_name?: string; business_id?: string } | null;
        if (!res?.success) {
          throw new Error(res?.error || 'Failed to record scan');
        }
      }

      return {
        businessName,
        businessId: actualBusinessId,
        pointsEarned,
        timestamp: new Date().toISOString()
      };
    } catch (error: unknown) {
      console.error('Error processing QR code:', error);
      throw error;
    }
  }, [user]);

  const handleScan = async (qrData?: string) => {
    // If we've already scanned something, reset the state
    if (scanned && !qrData) {
      setScanned(false);
      setScanResult(null);
      return;
    }

    if (permissionStatus !== 'granted' && !isNative) {
      await requestCameraPermission();
      if (permissionStatus === 'denied') return;
    }

    trackQRScanFunnelStart();
    setIsScanning(true);

    try {
      if (qrData) {
        // Process real QR data
        const result = await processQRData(qrData);
        
        if (result) {
          // Update recent scans history
          const newScans = [result, ...recentScans].slice(0, 10);
          setRecentScans(newScans);
          
          // Also save to local storage as backup
          localStorage.setItem('qrScanHistory', JSON.stringify(newScans));
          
          setScanResult(result);
          setScanned(true);
          setIsScanning(false);
          
          trackQRScanFunnelComplete(result.pointsEarned);
          toast.success(`Earned ${result.pointsEarned} points at ${result.businessName}!`);
        }
      } else {
        // If no QR data provided, this indicates the scanner should start
        // The actual QR data will be passed when a code is detected
        setIsScanning(true);
      }
    } catch (error: unknown) {
      console.error('Error scanning QR code:', error);
      setIsScanning(false);
      toast.error(error instanceof Error ? error.message : 'Failed to scan QR code');
    }
  };

  return {
    isScanning,
    scanned,
    hasCamera,
    permissionStatus,
    recentScans,
    videoRef,
    scanResult,
    handleScan,
    requestCameraPermission,
    processQRData,
    setIsScanning
  };
}
