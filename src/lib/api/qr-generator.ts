
export interface QRCodeOptions {
  color?: string;
  backgroundColor?: string;
  size?: number;
}

export const generateCustomQrCode = async (
  data: string,
  options: QRCodeOptions = {}
): Promise<string> => {
  const {
    color = '#000000',
    backgroundColor = '#FFFFFF',
    size = 400
  } = options;

  // Remove # from colors for the API
  const cleanColor = color.replace('#', '');
  const cleanBgColor = backgroundColor.replace('#', '');

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
    data
  )}&size=${size}x${size}&color=${cleanColor}&bgcolor=${cleanBgColor}`;

  return qrUrl;
};
