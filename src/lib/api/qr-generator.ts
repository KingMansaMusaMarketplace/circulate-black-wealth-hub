
import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';

// Create a business QR code URL that can be stored in the database
export const createBusinessQrCodeUrl = async (
  businessId: string,
  codeType: 'discount' | 'loyalty' | 'info',
  data: { discount?: number; points?: number }
): Promise<string> => {
  try {
    // Create a unique ID for this QR code
    const qrId = uuidv4();
    
    // Create a data object that will be encoded in the QR
    const qrData = {
      id: qrId,
      businessId,
      type: codeType,
      data,
      timestamp: Date.now()
    };
    
    // Convert to JSON string
    const jsonData = JSON.stringify(qrData);
    
    // Generate QR code as data URL
    const qrImageUrl = await QRCode.toDataURL(jsonData, {
      errorCorrectionLevel: 'H',
      margin: 1,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });
    
    return qrImageUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
};

// Generate a custom QR code with specific settings
export const generateCustomQrCode = async (
  data: string,
  options: {
    color?: string;
    backgroundColor?: string;
    logo?: string;
    size?: number;
  } = {}
): Promise<string> => {
  try {
    // Set default options
    const qrOptions = {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: options.size || 300,
      color: {
        dark: options.color || '#000000',
        light: options.backgroundColor || '#ffffff'
      }
    };
    
    // Generate QR code as data URL
    const qrImageUrl = await QRCode.toDataURL(data, qrOptions);
    
    // If a logo is provided, we would add it on top of the QR code
    // This would require canvas manipulation which is more complex
    // For now, just return the basic QR code
    
    return qrImageUrl;
  } catch (error) {
    console.error('Error generating custom QR code:', error);
    throw new Error('Failed to generate custom QR code');
  }
};

// Parse a QR code data string
export const parseQrCodeData = (qrCodeData: string): any => {
  try {
    return JSON.parse(qrCodeData);
  } catch (error) {
    console.error('Error parsing QR code data:', error);
    throw new Error('Invalid QR code format');
  }
};
