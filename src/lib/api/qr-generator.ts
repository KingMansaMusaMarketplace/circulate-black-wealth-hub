import QRCode from 'qrcode';
import mansaMusaLogo from '@/assets/mmm-qr-logo.png';

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

  try {
    // Generate base QR code with high error correction for logo overlay
    const qrCodeDataUrl = await QRCode.toDataURL(data, {
      width: size,
      margin: 2,
      errorCorrectionLevel: 'H', // High error correction allows for logo overlay
      color: {
        dark: '#1a1a1a',
        light: '#ffffff'
      }
    });

    if (!useBranding) {
      return qrCodeDataUrl;
    }

    // Create a canvas to composite the logo onto the QR code
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      console.warn('Canvas context not available, returning plain QR code');
      return qrCodeDataUrl;
    }

    canvas.width = size;
    canvas.height = size;

    // Load QR code image
    const qrImage = new Image();
    await new Promise((resolve, reject) => {
      qrImage.onload = resolve;
      qrImage.onerror = reject;
      qrImage.src = qrCodeDataUrl;
    });

    // Draw QR code
    ctx.drawImage(qrImage, 0, 0, size, size);

    // Load and draw logo
    const logo = new Image();
    await new Promise((resolve, reject) => {
      logo.onload = resolve;
      logo.onerror = reject;
      logo.src = mansaMusaLogo;
    });

    // Calculate optimal logo size (20% of QR code for best scannability)
    const logoSize = size * 0.20;
    const logoX = (size - logoSize) / 2;
    const logoY = (size - logoSize) / 2;

    // Draw white background circle with gold border for logo
    const logoCircleRadius = logoSize * 0.60;
    
    // White background
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, logoCircleRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Gold border (brand color)
    ctx.strokeStyle = '#DAA520'; // Mansa gold color
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw logo centered with slight shadow for depth
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2;
    ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);
    
    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;

    // Return the final branded QR code
    return canvas.toDataURL('image/png');

  } catch (error) {
    console.error('Error generating branded QR code:', error);
    
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
  }
};

export const downloadQRCode = (url: string, filename?: string) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `qr-code-${Date.now()}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
