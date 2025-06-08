
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { QrCode, Download, Copy } from 'lucide-react';
import { toast } from 'sonner';

const QRCodeGenerator = ({ businessId }: { businessId: string }) => {
  const [qrType, setQrType] = useState<'discount' | 'loyalty' | 'checkin'>('discount');
  const [discountValue, setDiscountValue] = useState('');
  const [loyaltyPoints, setLoyaltyPoints] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [expirationDate, setExpirationDate] = useState('');
  const [scanLimit, setScanLimit] = useState('');

  const handleGenerateQR = () => {
    // In a real app, this would call your QR code generation API
    toast.success("QR Code generated successfully!");
  };

  const handleDownloadQR = () => {
    // In a real app, this would download the QR code image
    toast.success("QR Code downloaded!");
  };

  const handleCopyQR = () => {
    // In a real app, this would copy the QR code URL
    navigator.clipboard.writeText(`https://mansa-musa.vercel.app/scan?qr=${businessId}`);
    toast.success("QR Code URL copied to clipboard!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">QR Code Generator</h2>
        <p className="text-muted-foreground">
          Create custom QR codes for discounts, loyalty points, and check-ins
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* QR Code Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>QR Code Settings</CardTitle>
            <CardDescription>
              Configure your QR code parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="qr-type">QR Code Type</Label>
              <Select value={qrType} onValueChange={(value: any) => setQrType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select QR code type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="discount">Discount Code</SelectItem>
                  <SelectItem value="loyalty">Loyalty Points</SelectItem>
                  <SelectItem value="checkin">Check-in Reward</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {qrType === 'discount' && (
              <div className="space-y-2">
                <Label htmlFor="discount-value">Discount Percentage</Label>
                <Input
                  id="discount-value"
                  type="number"
                  placeholder="15"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                />
              </div>
            )}

            {qrType === 'loyalty' && (
              <div className="space-y-2">
                <Label htmlFor="loyalty-points">Loyalty Points</Label>
                <Input
                  id="loyalty-points"
                  type="number"
                  placeholder="50"
                  value={loyaltyPoints}
                  onChange={(e) => setLoyaltyPoints(e.target.value)}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="expiration-date">Expiration Date (Optional)</Label>
              <Input
                id="expiration-date"
                type="date"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="scan-limit">Scan Limit (Optional)</Label>
              <Input
                id="scan-limit"
                type="number"
                placeholder="100"
                value={scanLimit}
                onChange={(e) => setScanLimit(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is-active"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
              <Label htmlFor="is-active">Active</Label>
            </div>

            <Button onClick={handleGenerateQR} className="w-full">
              <QrCode className="mr-2 h-4 w-4" />
              Generate QR Code
            </Button>
          </CardContent>
        </Card>

        {/* QR Code Preview */}
        <Card>
          <CardHeader>
            <CardTitle>QR Code Preview</CardTitle>
            <CardDescription>
              Preview and download your QR code
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <div className="w-64 h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">QR Code will appear here</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm">
                <strong>Type:</strong> {qrType === 'discount' ? 'Discount Code' : qrType === 'loyalty' ? 'Loyalty Points' : 'Check-in Reward'}
              </div>
              {qrType === 'discount' && discountValue && (
                <div className="text-sm">
                  <strong>Discount:</strong> {discountValue}%
                </div>
              )}
              {qrType === 'loyalty' && loyaltyPoints && (
                <div className="text-sm">
                  <strong>Points:</strong> {loyaltyPoints}
                </div>
              )}
              <div className="text-sm">
                <strong>Status:</strong> {isActive ? 'Active' : 'Inactive'}
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleDownloadQR} variant="outline" className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button onClick={handleCopyQR} variant="outline" className="flex-1">
                <Copy className="mr-2 h-4 w-4" />
                Copy URL
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
