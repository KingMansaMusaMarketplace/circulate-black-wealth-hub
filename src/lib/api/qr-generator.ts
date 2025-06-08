
import QRCode from 'qrcode';

export interface QRCodeOptions {
  color?: string;
  backgroundColor?: string;
  size?: number;
  margin?: number;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
}

export const generateCustomQrCode = async (
  data: string, 
  options: QRCodeOptions = {}
): Promise<string> => {
  const defaultOptions = {
    color: '#000000',
    backgroundColor: '#FFFFFF',
    size: 400,
    margin: 2,
    errorCorrectionLevel: 'M' as const,
    ...options
  };

  try {
    const qrCodeUrl = await QRCode.toDataURL(data, {
      color: {
        dark: defaultOptions.color,
        light: defaultOptions.backgroundColor
      },
      width: defaultOptions.size,
      margin: defaultOptions.margin,
      errorCorrectionLevel: defaultOptions.errorCorrectionLevel
    });

    return qrCodeUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
};

export const generateQRCodeSVG = async (
  data: string,
  options: QRCodeOptions = {}
): Promise<string> => {
  const defaultOptions = {
    color: '#000000',
    backgroundColor: '#FFFFFF',
    size: 400,
    margin: 2,
    errorCorrectionLevel: 'M' as const,
    ...options
  };

  try {
    const qrCodeSVG = await QRCode.toString(data, {
      type: 'svg',
      color: {
        dark: defaultOptions.color,
        light: defaultOptions.backgroundColor
      },
      width: defaultOptions.size,
      margin: defaultOptions.margin,
      errorCorrectionLevel: defaultOptions.errorCorrectionLevel
    });

    return qrCodeSVG;
  } catch (error) {
    console.error('Error generating QR code SVG:', error);
    throw new Error('Failed to generate QR code SVG');
  }
};
