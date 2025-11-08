import { QRCodeScan, QRCodeAnalytics } from './qr-analytics-api';

/**
 * Export QR code scan history to CSV
 */
export const exportScansToCSV = (scans: QRCodeScan[], filename?: string): void => {
  if (scans.length === 0) {
    alert('No scans to export');
    return;
  }

  const headers = [
    'Date & Time',
    'Referral Code',
    'IP Address',
    'Device/Browser',
    'Converted',
    'Conversion Date'
  ];

  const rows = scans.map(scan => {
    const scanDate = new Date(scan.scanned_at).toLocaleString();
    const deviceInfo = scan.user_agent ? extractDeviceInfo(scan.user_agent) : 'Unknown';
    const converted = scan.converted ? 'Yes' : 'No';
    const conversionDate = scan.converted_at ? new Date(scan.converted_at).toLocaleString() : 'N/A';

    return [
      scanDate,
      scan.referral_code,
      scan.ip_address || 'N/A',
      deviceInfo,
      converted,
      conversionDate
    ];
  });

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  downloadCSV(csvContent, filename || `qr-scans-${Date.now()}.csv`);
};

/**
 * Export QR code analytics to CSV
 */
export const exportAnalyticsToCSV = (analytics: QRCodeAnalytics, referralCode: string, filename?: string): void => {
  const data = [
    ['Metric', 'Value'],
    ['Referral Code', referralCode],
    ['Total Scans', analytics.total_scans.toString()],
    ['Unique Scans', analytics.unique_scans.toString()],
    ['Total Conversions', analytics.total_conversions.toString()],
    ['Conversion Rate', `${analytics.conversion_rate}%`],
    ['Scans (Last 7 Days)', analytics.scans_last_7_days.toString()],
    ['Scans (Last 30 Days)', analytics.scans_last_30_days.toString()],
    ['Conversions (Last 7 Days)', analytics.conversions_last_7_days.toString()],
    ['Conversions (Last 30 Days)', analytics.conversions_last_30_days.toString()],
    ['', ''],
    ['Export Date', new Date().toLocaleString()]
  ];

  const csvContent = data.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  downloadCSV(csvContent, filename || `qr-analytics-${Date.now()}.csv`);
};

/**
 * Helper function to trigger CSV download
 */
const downloadCSV = (content: string, filename: string): void => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

/**
 * Extract readable device info from user agent
 */
const extractDeviceInfo = (userAgent: string): string => {
  const ua = userAgent.toLowerCase();
  
  let device = 'Desktop';
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
    device = 'Mobile';
  } else if (ua.includes('tablet') || ua.includes('ipad')) {
    device = 'Tablet';
  }

  let browser = 'Unknown';
  if (ua.includes('chrome') && !ua.includes('edg')) browser = 'Chrome';
  else if (ua.includes('safari') && !ua.includes('chrome')) browser = 'Safari';
  else if (ua.includes('firefox')) browser = 'Firefox';
  else if (ua.includes('edg')) browser = 'Edge';

  return `${device} - ${browser}`;
};
