
import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';

interface QRCodeData {
  businessId: string;
  type: 'discount' | 'loyalty' | 'info';
  discount?: number;
  points?: number;
  id?: string;
}

// Creates a URL for the QR code image
export const createBusinessQrCodeUrl = async (
  businessId: string,
  type: 'discount' | 'loyalty' | 'info',
  data: {
    discount?: number;
    points?: number;
  }
): Promise<string> => {
  try {
    // Create unique ID for this QR code if not provided
    const qrId = uuidv4();
    
    // Build data object for QR code
    const qrData: QRCodeData = {
      id: qrId,
      businessId,
      type,
      ...data
    };
    
    // Convert to string for encoding in QR
    const dataString = JSON.stringify(qrData);
    
    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(dataString, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 300,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });
    
    return qrCodeDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
};

// Parse QR code data from scan
export const parseQrCodeData = (qrData: string): QRCodeData | null => {
  try {
    return JSON.parse(qrData) as QRCodeData;
  } catch (error) {
    console.error('Error parsing QR code data:', error);
    return null;
  }
};

// Generate a demo QR code for testing without backend
export const generateDemoQRCode = async (
  type: 'loyalty' | 'discount' | 'info' = 'loyalty',
  businessName: string = 'Demo Business'
): Promise<string> => {
  const demoData = {
    businessId: uuidv4(),
    type,
    businessName,
    discount: type === 'discount' ? 10 : undefined,
    points: type === 'loyalty' ? 15 : undefined,
    id: uuidv4()
  };
  
  try {
    const dataString = JSON.stringify(demoData);
    const qrCodeDataUrl = await QRCode.toDataURL(dataString, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 300
    });
    
    return qrCodeDataUrl;
  } catch (error) {
    console.error('Error generating demo QR code:', error);
    throw error;
  }
};
