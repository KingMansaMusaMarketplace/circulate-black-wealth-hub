
import QRCode from 'qrcode';

export interface QRCodeOptions {
  color?: string;
  backgroundColor?: string;
  size?: number;
}

export const generateCustomQrCode = async (
  data: string, 
  options: QRCodeOptions = {}
): Promise<string> => {
  try {
    const qrCodeUrl = await QRCode.toDataURL(data, {
      width: options.size || 400,
      color: {
        dark: options.color || '#000000',
        light: options.backgroundColor || '#FFFFFF'
      },
      margin: 2,
      errorCorrectionLevel: 'M'
    });
    
    return qrCodeUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
};
