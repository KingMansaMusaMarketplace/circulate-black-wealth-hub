
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { QrCode, Download, Share2, Copy, Image } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

const QRCodeGeneratorPage: React.FC = () => {
  const { user } = useAuth();
  const [qrCodeType, setQrCodeType] = useState('loyalty');
  const [pointsValue, setPointsValue] = useState('5');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [expiryDate, setExpiryDate] = useState('');
  const [generatedQR, setGeneratedQR] = useState<string | null>(null);

  const handleGenerateQR = () => {
    // In a real application, this would call an API to generate the QR code
    setGeneratedQR('https://placeholder-qr-code-url.com');
    toast.success('QR code generated successfully!');
  };

  const handleDownload = () => {
    // In a real application, this would download the QR code image
    toast.success('QR code downloaded successfully!');
  };

  const handleCopy = () => {
    // In a real application, this would copy the QR code image or URL
    toast.success('QR code copied to clipboard!');
  };

  const handleShare = () => {
    // In a real application, this would open a share dialog
    toast.success('Share dialog opened!');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>QR Code Generator | Mansa Musa Marketplace</title>
      </Helmet>

      <Navbar />

      <div className="flex-grow py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">QR Code Generator</h1>
            <p className="text-gray-500">Create QR codes for your business</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>Generate QR Code</CardTitle>
                  <CardDescription>
                    Create custom QR codes for your business needs
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="qr-type">QR Code Type</Label>
                    <Select 
                      value={qrCodeType} 
                      onValueChange={setQrCodeType}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select QR code type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="loyalty">Loyalty Points</SelectItem>
                        <SelectItem value="discount">Discount Code</SelectItem>
                        <SelectItem value="url">Website URL</SelectItem>
                        <SelectItem value="info">Business Information</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {qrCodeType === 'loyalty' && (
                    <div className="space-y-2">
                      <Label htmlFor="points-value">Points Value</Label>
                      <Input 
                        id="points-value" 
                        type="number" 
                        value={pointsValue}
                        onChange={(e) => setPointsValue(e.target.value)}
                        min="1"
                      />
                      <p className="text-xs text-gray-500">
                        Number of loyalty points customers will receive when scanning this code
                      </p>
                    </div>
                  )}

                  {qrCodeType === 'discount' && (
                    <div className="space-y-2">
                      <Label htmlFor="discount-value">Discount Value (%)</Label>
                      <Input 
                        id="discount-value" 
                        type="number" 
                        min="1" 
                        max="100"
                        defaultValue="10"
                      />
                    </div>
                  )}

                  {qrCodeType === 'url' && (
                    <div className="space-y-2">
                      <Label htmlFor="url-value">Website URL</Label>
                      <Input 
                        id="url-value" 
                        type="url" 
                        placeholder="https://yourbusiness.com"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Enter a description for this QR code"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expiry-date">Expiry Date (Optional)</Label>
                    <Input 
                      id="expiry-date" 
                      type="date" 
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="active-status" 
                      checked={isActive}
                      onCheckedChange={setIsActive}
                    />
                    <Label htmlFor="active-status">Active</Label>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleGenerateQR}>Generate QR Code</Button>
                </CardFooter>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                  <CardDescription>
                    Your generated QR code will appear here
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  {generatedQR ? (
                    <div className="text-center">
                      <div className="bg-white p-4 rounded-lg shadow-sm border mb-4">
                        <div className="w-48 h-48 mx-auto bg-gray-100 rounded flex items-center justify-center">
                          <QrCode size={128} />
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-6">{description || 'QR Code'}</p>
                      <div className="flex space-x-2 justify-center">
                        <Button size="sm" variant="outline" onClick={handleDownload}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCopy}>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleShare}>
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                      <div className="text-center p-6">
                        <QrCode size={64} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500">
                          QR code preview will appear here
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>QR Code Management</CardTitle>
                <CardDescription>
                  View and manage your existing QR codes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="active">
                  <TabsList>
                    <TabsTrigger value="active">Active QR Codes</TabsTrigger>
                    <TabsTrigger value="expired">Expired QR Codes</TabsTrigger>
                    <TabsTrigger value="drafts">Drafts</TabsTrigger>
                  </TabsList>
                  <TabsContent value="active" className="mt-6">
                    <div className="text-center p-8 border border-dashed border-gray-300 rounded-lg">
                      <Image className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-1">No Active QR Codes</h3>
                      <p className="text-gray-500 text-sm max-w-sm mx-auto mb-4">
                        Generate your first QR code to engage with your customers and track loyalty
                      </p>
                      <Button onClick={handleGenerateQR}>Generate QR Code</Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="expired">
                    <div className="text-center p-8 border border-dashed border-gray-300 rounded-lg">
                      <p className="text-gray-500">No expired QR codes</p>
                    </div>
                  </TabsContent>
                  <TabsContent value="drafts">
                    <div className="text-center p-8 border border-dashed border-gray-300 rounded-lg">
                      <p className="text-gray-500">No draft QR codes</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default QRCodeGeneratorPage;
