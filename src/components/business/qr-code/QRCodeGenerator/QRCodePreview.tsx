
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Download, Copy, RefreshCw } from 'lucide-react';
import { QRCode } from '@/lib/api/qr-code-api';
import { toast } from 'sonner';

interface QRCodePreviewProps {
  qrCode: QRCode | null;
  onDownload?: () => void;
  onCopy?: () => void;
  onRegenerate?: () => void;
  isLoading?: boolean;
}

const QRCodePreview: React.FC<QRCodePreviewProps> = ({
  qrCode,
  onDownload,
  onCopy,
  onRegenerate,
  isLoading = false
}) => {
  const handleCopy = async () => {
    if (qrCode?.qr_image_url) {
      try {
        await navigator.clipboard.writeText(qrCode.qr_image_url);
        toast.success('QR Code URL copied to clipboard!');
      } catch (err) {
        console.error('Clipboard copy failed:', err);
        // Fallback for mobile/iOS
        try {
          const textArea = document.createElement('textarea');
          textArea.value = qrCode.qr_image_url;
          textArea.style.position = 'fixed';
          textArea.style.left = '-9999px';
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          toast.success('QR Code URL copied to clipboard!');
        } catch (fallbackErr) {
          toast.error('Failed to copy. Please copy manually.');
        }
      }
    }
    onCopy?.();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>QR Code Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          {qrCode?.qr_image_url ? (
            <div className="space-y-2">
              <div className="w-64 h-64 border rounded-lg overflow-hidden">
                <img 
                  src={qrCode.qr_image_url} 
                  alt="Generated QR Code"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">Mansa Musa Marketplace, Inc.</p>
              </div>
            </div>
          ) : (
            <div className="w-64 h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">QR Code will appear here</p>
              </div>
            </div>
          )}
        </div>

        {qrCode && (
          <div className="space-y-2 text-sm">
            <div><strong>Type:</strong> {qrCode.code_type}</div>
            {qrCode.discount_percentage && (
              <div><strong>Discount:</strong> {qrCode.discount_percentage}%</div>
            )}
            {qrCode.points_value && (
              <div><strong>Points:</strong> {qrCode.points_value}</div>
            )}
            <div><strong>Status:</strong> {qrCode.is_active ? 'Active' : 'Inactive'}</div>
            <div><strong>Scans:</strong> {qrCode.current_scans}{qrCode.scan_limit && ` / ${qrCode.scan_limit}`}</div>
          </div>
        )}

        <div className="flex gap-2">
          <Button 
            onClick={onDownload} 
            variant="outline" 
            className="flex-1"
            disabled={!qrCode || isLoading}
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button 
            onClick={handleCopy} 
            variant="outline" 
            className="flex-1"
            disabled={!qrCode || isLoading}
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy URL
          </Button>
          <Button 
            onClick={onRegenerate} 
            variant="outline" 
            size="icon"
            disabled={!qrCode || isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QRCodePreview;
