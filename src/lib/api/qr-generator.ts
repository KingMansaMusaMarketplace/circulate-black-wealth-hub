
import { v4 as uuidv4 } from 'uuid';

/**
 * Generate a QR code data URL for development/preview purposes
 * In production this would be replaced with a real QR code generator service
 */
export const generateQrDataUrl = async (
  data: string,
  options: {
    size?: number;
    color?: string;
    backgroundColor?: string;
  } = {}
): Promise<string> => {
  const {
    size = 200,
    color = '#000000',
    backgroundColor = '#ffffff',
  } = options;

  // For development, we'll create a simple mock QR code
  // In production, you'd use a library like qrcode.js or call an API service
  
  // Create mock QR code SVG for development
  const qrSize = size;
  const moduleSize = Math.floor(qrSize / 25); // Simple 25x25 grid
  const mockModules = createMockModules(data);
  
  let svgContent = `<svg width="${qrSize}" height="${qrSize}" viewBox="0 0 ${qrSize} ${qrSize}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${qrSize}" height="${qrSize}" fill="${backgroundColor}"/>`;
  
  // Draw the mock modules
  mockModules.forEach((row, y) => {
    row.forEach((isActive, x) => {
      if (isActive) {
        svgContent += `<rect x="${x * moduleSize}" y="${y * moduleSize}" width="${moduleSize}" height="${moduleSize}" fill="${color}"/>`;
      }
    });
  });
  
  // Add center finder patterns (the three square patterns in QR codes)
  // Top left
  svgContent += createQrFinderPattern(1, 1, moduleSize, color);
  // Top right
  svgContent += createQrFinderPattern(17, 1, moduleSize, color);
  // Bottom left
  svgContent += createQrFinderPattern(1, 17, moduleSize, color);
  
  svgContent += '</svg>';
  
  // Convert SVG to data URL
  const dataUrl = 'data:image/svg+xml;base64,' + btoa(svgContent);
  return dataUrl;
};

// Create a deterministic but random-looking pattern based on the string data
function createMockModules(data: string): boolean[][] {
  const seedValue = hashString(data);
  const modules = Array(25).fill(0).map(() => Array(25).fill(false));
  
  // Use the hash to seed a simple PRNG
  let seed = seedValue;
  
  for (let y = 0; y < 25; y++) {
    for (let x = 0; x < 25; x++) {
      // Skip areas where finder patterns will be
      if ((x < 7 && y < 7) || (x > 17 && y < 7) || (x < 7 && y > 17)) {
        continue;
      }
      
      // Simple PRNG based on the seed
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      modules[y][x] = (seed % 3 === 0); // Roughly 33% of modules will be active
    }
  }
  
  return modules;
}

// Create the finder pattern (the three square patterns in QR codes)
function createQrFinderPattern(x: number, y: number, moduleSize: number, color: string): string {
  const outerSize = 7 * moduleSize;
  const middleSize = 5 * moduleSize;
  const innerSize = 3 * moduleSize;
  
  return `
    <rect x="${x * moduleSize}" y="${y * moduleSize}" width="${outerSize}" height="${outerSize}" fill="${color}"/>
    <rect x="${(x+1) * moduleSize}" y="${(y+1) * moduleSize}" width="${middleSize}" height="${middleSize}" fill="white"/>
    <rect x="${(x+2) * moduleSize}" y="${(y+2) * moduleSize}" width="${innerSize}" height="${innerSize}" fill="${color}"/>
  `;
}

// Simple string hash function
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// In production, replace this with actual QR code generation for business
export const createBusinessQrCodeUrl = async (
  businessId: string,
  qrCodeType: 'discount' | 'loyalty' | 'info',
  data: object
): Promise<string> => {
  const qrData = JSON.stringify({
    id: businessId,
    type: qrCodeType,
    ...data,
    timestamp: Date.now()
  });
  
  try {
    // For development, generate a mock QR code data URL
    const qrCodeDataUrl = await generateQrDataUrl(qrData);
    
    // In production, this would upload the QR code to Supabase storage
    // and return the URL
    return qrCodeDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
};
