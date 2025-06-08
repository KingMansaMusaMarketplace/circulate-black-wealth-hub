
interface QRCodeOptions {
  color?: string;
  backgroundColor?: string;
  size?: number;
}

export const generateCustomQrCode = async (data: string, options?: QRCodeOptions): Promise<string> => {
  const {
    color = '#000000',
    backgroundColor = '#FFFFFF',
    size = 400
  } = options || {};

  // For now, we'll use the QR Server API as a fallback
  // In a production app, you might want to use a more robust QR code library
  const baseUrl = 'https://api.qrserver.com/v1/create-qr-code/';
  const params = new URLSearchParams({
    data: data,
    size: `${size}x${size}`,
    color: color.replace('#', ''),
    bgcolor: backgroundColor.replace('#', ''),
    format: 'png',
    ecc: 'M'
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
