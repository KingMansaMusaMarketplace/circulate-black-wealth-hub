
import React, { useState } from 'react';
import { useQRCode } from '@/hooks/use-qr-code';
import { useBusinessProfile } from '@/hooks/use-business-profile';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { QrCode, BadgePercent, Award, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { QRCode } from '@/lib/api/qr-code-api';

const QRCodeGenerator = () => {
  const { profile: business } = useBusinessProfile();
  const { generateQRCode, qrCode, loading } = useQRCode();
  const [qrType, setQrType] = useState<'loyalty' | 'discount' | 'info'>('loyalty');
  const [pointsValue, setPointsValue] = useState(10);
  const [discountPercentage, setDiscountPercentage] = useState(10);
  const [scanLimit, setScanLimit] = useState(100);
  const [expirationDays, setExpirationDays] = useState(30);
  const [generatedQRCode, setGeneratedQRCode] = useState<QRCode | null>(null);

  // Handle QR code generation
  const handleGenerateQRCode = async () => {
    if (!business?.id) {
      toast.error('Business profile not loaded');
      return;
    }

    try {
      let options: any = {};
      
      if (qrType === 'loyalty') {
        options.pointsValue = pointsValue;
      } else if (qrType === 'discount') {
        options.discountPercentage = discountPercentage;
      }

      const result = await generateQRCode(business.id, qrType, options);
      
      if (result) {
        // If we have scan limits or expiration, update the QR code
        if (scanLimit > 0 || expirationDays > 0) {
          const updates: Partial<QRCode> = {};
          
          if (scanLimit > 0) {
            updates.scan_limit = scanLimit;
          }
          
          if (expirationDays > 0) {
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + expirationDays);
            updates.expiration_date = expirationDate.toISOString();
          }
          
          await updateQRCode(result.id, updates);
        }
        
        setGeneratedQRCode(result);
        toast.success('QR code generated successfully');
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error('Failed to generate QR code');
    }
  };

  // Update QR code properties
  const updateQRCode = async (qrCodeId: string, updates: Partial<QRCode>) => {
    try {
      return await updateQRCode(qrCodeId, updates);
    } catch (error) {
      console.error('Error updating QR code:', error);
      toast.error('Failed to update QR code properties');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5 text-mansablue" />
          QR Code Generator
        </CardTitle>
        <CardDescription>
          Create QR codes for your business to distribute to customers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={qrType} onValueChange={(value: 'loyalty' | 'discount' | 'info') => setQrType(value)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="loyalty" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Loyalty
            </TabsTrigger>
            <TabsTrigger value="discount" className="flex items-center gap-2">
              <BadgePercent className="h-4 w-4" />
              Discount
            </TabsTrigger>
            <TabsTrigger value="info" className="flex items-center gap-2">
              <QrCode className="h-4 w-4" />
              Info
            </TabsTrigger>
          </TabsList>

          <div className="mt-6 space-y-4">
            <TabsContent value="loyalty">
              <div className="space-y-2">
                <Label htmlFor="pointsValue">Points Value</Label>
                <Input
                  id="pointsValue"
                  type="number"
                  value={pointsValue}
                  onChange={(e) => setPointsValue(parseInt(e.target.value) || 0)}
                  min={1}
                />
                <p className="text-xs text-gray-500">
                  Number of points awarded when customer scans this QR code
                </p>
              </div>
            </TabsContent>

            <TabsContent value="discount">
              <div className="space-y-2">
                <Label htmlFor="discountPercentage">Discount Percentage</Label>
                <Input
                  id="discountPercentage"
                  type="number"
                  value={discountPercentage}
                  onChange={(e) => setDiscountPercentage(parseInt(e.target.value) || 0)}
                  min={1}
                  max={100}
                />
                <p className="text-xs text-gray-500">
                  Percentage discount offered when customer scans this QR code
                </p>
              </div>
            </TabsContent>

            <TabsContent value="info">
              <p className="text-sm text-gray-500">
                Info QR codes provide business information when scanned
              </p>
            </TabsContent>

            {/* Common options for all QR types */}
            <div className="pt-4 border-t border-gray-100 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="scanLimit">Scan Limit (Optional)</Label>
                <Input
                  id="scanLimit"
                  type="number"
                  value={scanLimit}
                  onChange={(e) => setScanLimit(parseInt(e.target.value) || 0)}
                  min={0}
                />
                <p className="text-xs text-gray-500">
                  Maximum number of times this QR code can be scanned (0 for unlimited)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expirationDays">Expiration (Days)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="expirationDays"
                    type="number"
                    value={expirationDays}
                    onChange={(e) => setExpirationDays(parseInt(e.target.value) || 0)}
                    min={0}
                  />
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500">
                  Number of days until this QR code expires (0 for no expiration)
                </p>
              </div>
            </div>

            <Button 
              onClick={handleGenerateQRCode} 
              className="w-full bg-mansablue hover:bg-mansablue-dark mt-4"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                <>Generate QR Code</>
              )}
            </Button>
          </div>
        </Tabs>

        {/* QR code preview */}
        {generatedQRCode && generatedQRCode.qr_image_url && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h3 className="font-medium mb-3">QR Code Preview</h3>
            <div className="flex flex-col items-center">
              <div className="border border-gray-200 rounded-md p-4 bg-white">
                <img
                  src={generatedQRCode.qr_image_url}
                  alt="QR Code"
                  className="w-48 h-48"
                />
              </div>
              <div className="mt-4 text-sm text-center space-y-1">
                <p>
                  <span className="font-medium">Type:</span>{' '}
                  {generatedQRCode.code_type.charAt(0).toUpperCase() + generatedQRCode.code_type.slice(1)}
                </p>
                {generatedQRCode.points_value && (
                  <p>
                    <span className="font-medium">Points:</span> {generatedQRCode.points_value}
                  </p>
                )}
                {generatedQRCode.discount_percentage && (
                  <p>
                    <span className="font-medium">Discount:</span> {generatedQRCode.discount_percentage}%
                  </p>
                )}
                {generatedQRCode.scan_limit && (
                  <p>
                    <span className="font-medium">Scan Limit:</span> {generatedQRCode.scan_limit}
                  </p>
                )}
                {generatedQRCode.expiration_date && (
                  <p>
                    <span className="font-medium">Expires:</span>{' '}
                    {new Date(generatedQRCode.expiration_date).toLocaleDateString()}
                  </p>
                )}
              </div>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  // Create a temporary link to download the QR code
                  const link = document.createElement('a');
                  link.href = generatedQRCode.qr_image_url!;
                  link.download = `qr-code-${generatedQRCode.code_type}-${new Date().toISOString().split('T')[0]}.png`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                Download QR Code
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QRCodeGenerator;
