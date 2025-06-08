
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { QrCode } from 'lucide-react';

const formSchema = z.object({
  codeType: z.enum(['loyalty', 'discount', 'info']),
  pointsValue: z.number().min(1).optional(),
  discountPercentage: z.number().min(1).max(100).optional(),
  scanLimit: z.number().min(1).optional(),
  expirationDate: z.string().optional(),
  isActive: z.boolean().default(true)
});

interface QRCodeFormProps {
  onSubmit: (values: any) => Promise<void>;
  isLoading: boolean;
  initialValues?: {
    codeType: 'loyalty' | 'discount' | 'info';
    discountPercentage?: number;
    pointsValue?: number;
    scanLimit?: number;
    expirationDate?: string;
    isActive: boolean;
  };
}

const QRCodeForm: React.FC<QRCodeFormProps> = ({ onSubmit, isLoading, initialValues }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || {
      codeType: 'loyalty',
      isActive: true
    }
  });

  const codeType = form.watch('codeType');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="codeType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>QR Code Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select QR code type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="loyalty">Loyalty Points</SelectItem>
                  <SelectItem value="discount">Discount</SelectItem>
                  <SelectItem value="info">Information</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {codeType === 'loyalty' && (
          <FormField
            control={form.control}
            name="pointsValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Points Value</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter points value"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {codeType === 'discount' && (
          <FormField
            control={form.control}
            name="discountPercentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount Percentage</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter discount percentage"
                    min="1"
                    max="100"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="scanLimit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Scan Limit (Optional)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter scan limit"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value) || undefined)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="expirationDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expiration Date (Optional)</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between">
              <FormLabel>Active</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>Generating...</>
          ) : (
            <>
              <QrCode className="h-4 w-4 mr-2" />
              Generate QR Code
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default QRCodeForm;
