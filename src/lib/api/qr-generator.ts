
import { supabase } from '@/integrations/supabase/client';

interface QRCodeOptions {
  color?: string;
  backgroundColor?: string;
  size?: number;
  useBranding?: boolean;
}

export const generateCustomQrCode = async (data: string, options?: QRCodeOptions): Promise<string> => {
  const {
    size = 512,
    useBranding = true
  } = options || {};

  // Use our branded QR code generator edge function
  if (useBranding) {
    try {
      const { data: result, error } = await supabase.functions.invoke('generate-branded-qr', {
        body: { 
          data, 
          size,
          logoSize: Math.floor(size * 0.2), // Logo is 20% of QR size
          errorCorrectionLevel: 'H' // High error correction for logo overlay
        }
      });

      if (error) {
        console.error('Error generating branded QR code:', error);
        throw error;
      }

      if (result?.qrCodeUrl) {
        return result.qrCodeUrl;
      }
    } catch (error) {
      console.error('Failed to generate branded QR code, falling back to plain:', error);
    }
  }

  // Fallback to simple QR code API
  const baseUrl = 'https://api.qrserver.com/v1/create-qr-code/';
  const params = new URLSearchParams({
    data: data,
    size: `${size}x${size}`,
    color: '1a1a1a',
    bgcolor: 'ffffff',
    format: 'png',
    ecc: 'H'
  });

  return `${baseUrl}?${params.toString()}`;
};

export const downloadQRCode = (url: string, filename?: string) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `qr-code-${Date.now()}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
