
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useQRCode } from '@/hooks/qr-code';
import { Loader2, Plus, Trash } from 'lucide-react';

interface QRCodeBatchItem {
  id: string;
  codeType: 'loyalty' | 'discount' | 'info';
  pointsValue?: number;
  discountPercentage?: number;
  scanLimit?: number;
  expirationDate?: string;
}

const BatchQRCodeGenerator: React.FC = () => {
  const [batchItems, setBatchItems] = useState<QRCodeBatchItem[]>([
    { id: '1', codeType: 'loyalty', pointsValue: 10 }
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { generateQRCode } = useQRCode();

  const addBatchItem = () => {
    const newId = (batchItems.length + 1).toString();
    setBatchItems([
      ...batchItems,
      { id: newId, codeType: 'loyalty', pointsValue: 10 }
    ]);
  };

  const removeBatchItem = (id: string) => {
    if (batchItems.length <= 1) {
      toast.error("You must have at least one QR code in the batch");
      return;
    }
    setBatchItems(batchItems.filter(item => item.id !== id));
  };

  const updateBatchItem = (id: string, updates: Partial<QRCodeBatchItem>) => {
    setBatchItems(batchItems.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const handleGenerateBatch = async () => {
    setIsGenerating(true);
    let successCount = 0;
    let errorCount = 0;
    
    try {
      for (const item of batchItems) {
        try {
          const options: any = {
            scanLimit: item.scanLimit,
            isActive: true
          };
          
          if (item.expirationDate) {
            options.expirationDate = item.expirationDate;
          }
          
          if (item.codeType === 'loyalty') {
            options.pointsValue = item.pointsValue;
          } else if (item.codeType === 'discount') {
            options.discountPercentage = item.discountPercentage;
          }
          
          const result = await generateQRCode(undefined, item.codeType, options);
          if (result) {
            successCount++;
          } else {
            errorCount++;
          }
        } catch (err) {
          console.error('Error generating QR code:', err);
          errorCount++;
        }
      }
      
      if (successCount > 0) {
        toast.success(`Successfully generated ${successCount} QR codes`);
      }
      
      if (errorCount > 0) {
        toast.error(`Failed to generate ${errorCount} QR codes`);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Batch QR Code Generator</CardTitle>
        <CardDescription>Create multiple QR codes at once</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {batchItems.map((item, index) => (
            <div key={item.id} className="flex flex-col space-y-2 p-4 border rounded-md">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">QR Code #{index + 1}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeBatchItem(item.id)}
                  disabled={batchItems.length <= 1}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`type-${item.id}`}>Code Type</Label>
                  <Select
                    value={item.codeType}
                    onValueChange={(value: any) => updateBatchItem(item.id, { codeType: value })}
                  >
                    <SelectTrigger id={`type-${item.id}`}>
                      <SelectValue placeholder="Select code type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="loyalty">Loyalty Points</SelectItem>
                      <SelectItem value="discount">Discount</SelectItem>
                      <SelectItem value="info">Information</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {item.codeType === 'loyalty' && (
                  <div>
                    <Label htmlFor={`points-${item.id}`}>Points Value</Label>
                    <Input
                      id={`points-${item.id}`}
                      type="number"
                      value={item.pointsValue || ''}
                      onChange={(e) => updateBatchItem(item.id, { pointsValue: parseInt(e.target.value) || 0 })}
                      min="1"
                      placeholder="10"
                    />
                  </div>
                )}
                
                {item.codeType === 'discount' && (
                  <div>
                    <Label htmlFor={`discount-${item.id}`}>Discount Percentage</Label>
                    <Input
                      id={`discount-${item.id}`}
                      type="number"
                      value={item.discountPercentage || ''}
                      onChange={(e) => updateBatchItem(item.id, { discountPercentage: parseInt(e.target.value) || 0 })}
                      min="1"
                      max="100"
                      placeholder="10"
                    />
                  </div>
                )}
                
                <div>
                  <Label htmlFor={`scanLimit-${item.id}`}>Scan Limit (Optional)</Label>
                  <Input
                    id={`scanLimit-${item.id}`}
                    type="number"
                    value={item.scanLimit || ''}
                    onChange={(e) => updateBatchItem(item.id, { scanLimit: parseInt(e.target.value) || undefined })}
                    min="0"
                    placeholder="No limit"
                  />
                </div>
                
                <div>
                  <Label htmlFor={`expiration-${item.id}`}>Expiration Date (Optional)</Label>
                  <Input
                    id={`expiration-${item.id}`}
                    type="date"
                    value={item.expirationDate || ''}
                    onChange={(e) => updateBatchItem(item.id, { expirationDate: e.target.value || undefined })}
                  />
                </div>
              </div>
            </div>
          ))}
          
          <div className="flex justify-between items-center pt-4">
            <Button
              variant="outline"
              onClick={addBatchItem}
            >
              <Plus className="h-4 w-4 mr-2" /> Add Another
            </Button>
            
            <Button
              onClick={handleGenerateBatch}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating...
                </>
              ) : (
                'Generate Batch'
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BatchQRCodeGenerator;
